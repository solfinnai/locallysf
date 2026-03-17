#!/usr/bin/env node

/**
 * Enrich OSM/DataSF places with Google Places API data.
 *
 * This script takes places that were sourced from OpenStreetMap or DataSF
 * (which have no photos, reviews, or ratings) and looks them up via the
 * Google Places Text Search API to backfill rich data.
 *
 * Usage:
 *   node scripts/enrich-places.mjs                          # Enrich all unenriched places
 *   node scripts/enrich-places.mjs --category restaurants    # Enrich only restaurants
 *   node scripts/enrich-places.mjs --batch-size 100          # Process 100 places per run
 *   node scripts/enrich-places.mjs --dry-run                 # Preview what would be enriched (no API calls)
 *   node scripts/enrich-places.mjs --resume                  # Resume from where last run left off
 */

import fs from 'fs';
import path from 'path';

const GOOGLE_API_KEY = 'AIzaSyB5sJXrPLOATQrQBLUJ1HfEOn5E3jigeuw';
const BASE_URL = 'https://places.googleapis.com/v1';
const FIELD_MASK = 'places.id,places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.photos,places.nationalPhoneNumber,places.websiteUri,places.googleMapsUri,places.currentOpeningHours,places.priceLevel,places.types,places.reviews,places.editorialSummary';

// Rate limiting
const SEARCH_DELAY_MS = 300;  // Between search requests
const PHOTO_DELAY_MS = 200;   // Between photo requests

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// ─── CLI Args ───────────────────────────────────────────────────────────────

function parseArgs() {
  const args = process.argv.slice(2);
  const config = {
    category: null,
    batchSize: Infinity,
    dryRun: false,
    resume: false,
    verbose: false,
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--category':
        config.category = args[++i];
        break;
      case '--batch-size':
        config.batchSize = parseInt(args[++i], 10);
        break;
      case '--dry-run':
        config.dryRun = true;
        break;
      case '--resume':
        config.resume = true;
        break;
      case '--verbose':
        config.verbose = true;
        break;
      default:
        console.error(`Unknown argument: ${args[i]}`);
        process.exit(1);
    }
  }

  return config;
}

// ─── Google Places API ──────────────────────────────────────────────────────

async function searchPlace(name, address) {
  // Use name + city for the search query to get the best match
  const query = `${name} San Francisco`;

  const response = await fetch(`${BASE_URL}/places:searchText`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': GOOGLE_API_KEY,
      'X-Goog-FieldMask': FIELD_MASK,
    },
    body: JSON.stringify({
      textQuery: query,
      maxResultCount: 3, // Get top 3 results to find best match
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Google API error ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  return data.places || [];
}

async function fetchPhotoUrls(photos, maxPhotos = 3) {
  if (!photos || photos.length === 0) return [];

  const photoUrls = [];
  const photosToFetch = photos.slice(0, maxPhotos);

  for (const photo of photosToFetch) {
    try {
      const photoResponse = await fetch(
        `${BASE_URL}/${photo.name}/media?maxHeightPx=800&maxWidthPx=1200&key=${GOOGLE_API_KEY}&skipHttpRedirect=true`
      );

      if (photoResponse.ok) {
        const photoData = await photoResponse.json();
        photoUrls.push({
          url: photoData.photoUri,
          attribution: photo.authorAttributions?.[0]?.displayName || 'Google',
        });
      }

      await delay(PHOTO_DELAY_MS);
    } catch (error) {
      console.error(`  Photo fetch error: ${error.message}`);
    }
  }

  return photoUrls;
}

// ─── Matching Logic ─────────────────────────────────────────────────────────

function normalizeName(name) {
  return name
    .toLowerCase()
    .replace(/[''`]/g, "'")
    .replace(/[^a-z0-9' ]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function calculateNameSimilarity(name1, name2) {
  const n1 = normalizeName(name1);
  const n2 = normalizeName(name2);

  if (n1 === n2) return 1.0;

  // Check containment
  const shorter = n1.length < n2.length ? n1 : n2;
  const longer = n1.length >= n2.length ? n1 : n2;
  if (longer.includes(shorter) && shorter.length > 3) return 0.85;

  // Token-based similarity (handles word reordering)
  const tokens1 = new Set(n1.split(' '));
  const tokens2 = new Set(n2.split(' '));
  const intersection = [...tokens1].filter(t => tokens2.has(t));
  const union = new Set([...tokens1, ...tokens2]);
  const jaccard = intersection.length / union.size;

  return jaccard;
}

function addressMatchesSF(googleAddress) {
  const lower = (googleAddress || '').toLowerCase();
  return lower.includes('san francisco') || lower.includes('sf');
}

function findBestMatch(osmPlace, googleResults) {
  if (!googleResults || googleResults.length === 0) return null;

  let bestMatch = null;
  let bestScore = 0;

  for (const gPlace of googleResults) {
    const googleName = gPlace.displayName?.text || '';
    const googleAddress = gPlace.formattedAddress || '';

    // Must be in San Francisco
    if (!addressMatchesSF(googleAddress)) continue;

    const nameSimilarity = calculateNameSimilarity(osmPlace.name, googleName);

    // Require at least 60% name similarity
    if (nameSimilarity < 0.6) continue;

    // Boost score if address fragments match
    let addressBoost = 0;
    if (osmPlace.address) {
      const osmStreet = osmPlace.address.split(' ').slice(0, 3).join(' ').toLowerCase();
      if (googleAddress.toLowerCase().includes(osmStreet)) {
        addressBoost = 0.2;
      }
    }

    const totalScore = nameSimilarity + addressBoost;

    if (totalScore > bestScore) {
      bestScore = totalScore;
      bestMatch = gPlace;
    }
  }

  // Require minimum confidence
  return bestScore >= 0.6 ? { place: bestMatch, score: bestScore } : null;
}

// ─── Enrichment ─────────────────────────────────────────────────────────────

function convertGoogleToEnriched(googlePlace, originalPlace) {
  const priceLevelMap = {
    'PRICE_LEVEL_FREE': 1,
    'PRICE_LEVEL_INEXPENSIVE': 1,
    'PRICE_LEVEL_MODERATE': 2,
    'PRICE_LEVEL_EXPENSIVE': 3,
    'PRICE_LEVEL_VERY_EXPENSIVE': 4,
  };

  return {
    // Use Google Place ID (replaces OSM ID)
    id: googlePlace.id,
    slug: originalPlace.slug,
    name: googlePlace.displayName?.text || originalPlace.name,
    category: originalPlace.category,
    subcategory: originalPlace.subcategory,
    address: googlePlace.formattedAddress || originalPlace.address,
    neighborhood: originalPlace.neighborhood,
    city: 'San Francisco',
    phone: googlePlace.nationalPhoneNumber || originalPlace.phone,
    website: googlePlace.websiteUri || originalPlace.website,
    googleMapsUrl: googlePlace.googleMapsUri || originalPlace.googleMapsUrl,
    rating: googlePlace.rating || 0,
    reviewCount: googlePlace.userRatingCount || 0,
    priceLevel: priceLevelMap[googlePlace.priceLevel] || null,
    photos: [], // Will be populated separately
    hours: googlePlace.currentOpeningHours?.weekdayDescriptions || originalPlace.hours,
    reviews: (googlePlace.reviews || []).slice(0, 5).map(review => ({
      author: review.authorAttribution?.displayName || 'Anonymous',
      rating: review.rating || 0,
      text: review.text?.text || '',
    })),
    description: googlePlace.editorialSummary?.text || originalPlace.description,
  };
}

// ─── Progress Tracking ──────────────────────────────────────────────────────

const PROGRESS_FILE = 'scripts/enrich-progress.json';

function loadProgress() {
  try {
    if (fs.existsSync(PROGRESS_FILE)) {
      return JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8'));
    }
  } catch (e) {
    console.warn('Could not load progress file, starting fresh.');
  }
  return { enrichedIds: [], failedIds: [], skippedIds: [], lastRunDate: null };
}

function saveProgress(progress) {
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2));
}

// ─── Main ───────────────────────────────────────────────────────────────────

async function main() {
  const config = parseArgs();

  console.log('=== Google Places Enrichment Script ===');
  console.log(`Mode: ${config.dryRun ? 'DRY RUN (no API calls)' : 'LIVE'}`);
  if (config.category) console.log(`Category filter: ${config.category}`);
  if (config.batchSize !== Infinity) console.log(`Batch size: ${config.batchSize}`);
  console.log('');

  // Load current places data
  const placesPath = path.join(process.cwd(), 'src', 'data', 'placesData.json');
  if (!fs.existsSync(placesPath)) {
    console.error('placesData.json not found. Run the data pipeline first.');
    process.exit(1);
  }

  const places = JSON.parse(fs.readFileSync(placesPath, 'utf8'));
  console.log(`Loaded ${places.length} total places.`);

  // Load progress for resume support
  const progress = config.resume ? loadProgress() : { enrichedIds: [], failedIds: [], skippedIds: [], lastRunDate: null };
  const alreadyProcessed = new Set([...progress.enrichedIds, ...progress.failedIds, ...progress.skippedIds]);

  // Find places that need enrichment (OSM or DataSF sourced — identified by having 0 reviews AND 0 photos)
  let needsEnrichment = places.filter(p => {
    // Already processed in a previous run
    if (alreadyProcessed.has(p.id)) return false;

    // Skip places that already have Google data
    if (p.reviewCount > 0 || (p.photos && p.photos.length > 0)) return false;

    // Filter by category if specified
    if (config.category && p.category !== config.category) return false;

    // Skip places with no meaningful name
    if (!p.name || p.name === 'Unknown' || p.name.length < 2) return false;

    return true;
  });

  // Apply batch size limit
  if (config.batchSize !== Infinity) {
    needsEnrichment = needsEnrichment.slice(0, config.batchSize);
  }

  console.log(`Found ${needsEnrichment.length} places to enrich.`);
  if (config.resume && alreadyProcessed.size > 0) {
    console.log(`(Skipping ${alreadyProcessed.size} already-processed places from previous run)`);
  }

  if (config.dryRun) {
    console.log('\n--- DRY RUN: Places that would be enriched ---');
    const categoryCounts = {};
    needsEnrichment.forEach(p => {
      categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
    });
    Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]).forEach(([cat, count]) => {
      console.log(`  ${cat}: ${count}`);
    });

    const estimatedSearchCost = (needsEnrichment.length / 1000) * 32;
    const estimatedPhotoCost = (needsEnrichment.length * 3 / 1000) * 7;
    console.log(`\nEstimated API costs:`);
    console.log(`  Text Search: ${needsEnrichment.length} calls = $${estimatedSearchCost.toFixed(2)}`);
    console.log(`  Photo Media: ${needsEnrichment.length * 3} calls = $${estimatedPhotoCost.toFixed(2)}`);
    console.log(`  Total: $${(estimatedSearchCost + estimatedPhotoCost).toFixed(2)}`);
    console.log(`  After $200 free credit: $${Math.max(0, estimatedSearchCost + estimatedPhotoCost - 200).toFixed(2)}`);
    return;
  }

  // Create a map for quick lookup by ID
  const placesMap = new Map(places.map(p => [p.id, p]));

  // Track stats
  let enriched = 0;
  let noMatch = 0;
  let errors = 0;
  let apiCalls = 0;

  console.log('\nStarting enrichment...\n');

  for (let i = 0; i < needsEnrichment.length; i++) {
    const place = needsEnrichment[i];
    const progressStr = `[${i + 1}/${needsEnrichment.length}]`;

    try {
      console.log(`${progressStr} Searching: "${place.name}" (${place.neighborhood})...`);

      // Search Google Places API
      const googleResults = await searchPlace(place.name, place.address);
      apiCalls++;
      await delay(SEARCH_DELAY_MS);

      // Find best match
      const match = findBestMatch(place, googleResults);

      if (!match) {
        if (config.verbose) {
          console.log(`  ❌ No match found`);
        }
        noMatch++;
        progress.skippedIds.push(place.id);
        continue;
      }

      const googlePlace = match.place;
      console.log(`  ✅ Matched: "${googlePlace.displayName?.text}" (score: ${match.score.toFixed(2)}, ${googlePlace.userRatingCount || 0} reviews)`);

      // Fetch photos
      const photos = await fetchPhotoUrls(googlePlace.photos);
      apiCalls += Math.min((googlePlace.photos || []).length, 3);

      // Build enriched place data
      const enrichedPlace = convertGoogleToEnriched(googlePlace, place);
      enrichedPlace.photos = photos;

      // Replace in the places array
      // First remove the old OSM entry
      const oldIndex = places.findIndex(p => p.id === place.id);
      if (oldIndex !== -1) {
        // Check if a place with this Google ID already exists (avoid duplicates)
        const existingGoogleIndex = places.findIndex(p => p.id === enrichedPlace.id && p.id !== place.id);
        if (existingGoogleIndex !== -1) {
          // Google place already exists — merge: keep the richer one, remove the OSM dupe
          console.log(`  ⚠️  Google place already exists, removing OSM duplicate`);
          places.splice(oldIndex, 1);
        } else {
          places[oldIndex] = enrichedPlace;
        }
      }

      enriched++;
      progress.enrichedIds.push(place.id);

    } catch (error) {
      console.error(`  ❌ Error: ${error.message}`);
      errors++;
      progress.failedIds.push(place.id);

      // If we hit a rate limit, wait longer
      if (error.message.includes('429') || error.message.includes('RESOURCE_EXHAUSTED')) {
        console.log('  ⏳ Rate limited — waiting 60 seconds...');
        await delay(60000);
      }
    }

    // Save progress every 50 places
    if ((i + 1) % 50 === 0) {
      progress.lastRunDate = new Date().toISOString();
      saveProgress(progress);
      console.log(`\n--- Progress saved (${enriched} enriched, ${noMatch} no match, ${errors} errors) ---\n`);
    }
  }

  // Final progress save
  progress.lastRunDate = new Date().toISOString();
  saveProgress(progress);

  // Save updated places data
  fs.writeFileSync(placesPath, JSON.stringify(places, null, 2));

  // Also regenerate the TypeScript file
  const tsContent = `// Generated file - do not edit manually
// Run 'npm run fetch-data' to regenerate

import { Place } from './places';

export const places: Place[] = ${JSON.stringify(places, null, 2)};

export default places;
`;
  fs.writeFileSync(path.join(process.cwd(), 'src', 'data', 'placesData.ts'), tsContent);

  // Summary
  console.log('\n=== ENRICHMENT COMPLETE ===');
  console.log(`Total processed: ${needsEnrichment.length}`);
  console.log(`Enriched (matched): ${enriched}`);
  console.log(`No match found: ${noMatch}`);
  console.log(`Errors: ${errors}`);
  console.log(`API calls made: ${apiCalls}`);
  console.log(`\nUpdated files:`);
  console.log(`  src/data/placesData.json`);
  console.log(`  src/data/placesData.ts`);
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
