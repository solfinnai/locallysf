#!/usr/bin/env node
/**
 * Batch enrich LocallySF places with Google Places data
 * Phase 1: Restaurants + Cafes (~2,500 places)
 * 
 * Adds: rating, reviewCount, photos, phone, hours, website, googleMapsUrl, reviews
 * Cost estimate: ~$196 of $200/mo free credit
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const API_KEY = 'AIzaSyB5sJXrPLOATQrQBLUJ1HfEOn5E3jigeuw';

// Rate limiting
const DELAY_MS = 200; // 5 req/sec to stay safe
const sleep = ms => new Promise(r => setTimeout(r, ms));

// Progress file to resume if interrupted
const PROGRESS_FILE = path.join(__dirname, 'enrich-progress.json');
const OUTPUT_FILE = path.join(__dirname, 'enriched-places.json');

function loadProgress() {
  try { return JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8')); }
  catch { return { completed: [], failed: [] }; }
}

function saveProgress(progress) {
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress));
}

async function searchPlace(name, address) {
  const query = `${name} ${address}`;
  const url = 'https://places.googleapis.com/v1/places:searchText';
  
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': API_KEY,
      'X-Goog-FieldMask': 'places.id,places.displayName,places.rating,places.userRatingCount,places.photos,places.nationalPhoneNumber,places.regularOpeningHours,places.websiteUri,places.googleMapsUri,places.reviews,places.formattedAddress,places.priceLevel',
    },
    body: JSON.stringify({ textQuery: query, maxResultCount: 1 }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Search failed (${res.status}): ${err}`);
  }

  const data = await res.json();
  return data.places?.[0] || null;
}

async function getPhotoUrl(photoName) {
  const url = `https://places.googleapis.com/v1/${photoName}/media?maxWidthPx=800&maxHeightPx=600&key=${API_KEY}`;
  const res = await fetch(url, { redirect: 'follow' });
  return res.url;
}

async function enrichPlace(place) {
  const result = await searchPlace(place.name, place.address);
  if (!result) return null;

  // Get up to 3 photo URLs
  const photos = [];
  const photoRefs = (result.photos || []).slice(0, 3);
  for (const photo of photoRefs) {
    try {
      const url = await getPhotoUrl(photo.name);
      photos.push({
        url,
        attribution: photo.authorAttributions?.[0]?.displayName || 'Google',
      });
      await sleep(100);
    } catch (e) {
      console.error(`  Photo error: ${e.message}`);
    }
  }

  // Extract top 3 reviews
  const reviews = (result.reviews || []).slice(0, 3).map(r => ({
    author: r.authorAttribution?.displayName || 'Anonymous',
    rating: r.rating || 5,
    text: (r.text?.text || '').slice(0, 200),
  }));

  // Parse hours
  const hours = result.regularOpeningHours?.weekdayDescriptions || [];

  // Price level mapping
  const priceLevelMap = {
    'PRICE_LEVEL_FREE': 0,
    'PRICE_LEVEL_INEXPENSIVE': 1,
    'PRICE_LEVEL_MODERATE': 2,
    'PRICE_LEVEL_EXPENSIVE': 3,
    'PRICE_LEVEL_VERY_EXPENSIVE': 4,
  };

  return {
    googlePlaceId: result.id,
    rating: result.rating || 0,
    reviewCount: result.userRatingCount || 0,
    phone: result.nationalPhoneNumber || '',
    website: result.websiteUri || place.website || '',
    googleMapsUrl: result.googleMapsUri || '',
    hours,
    photos,
    reviews,
    priceLevel: priceLevelMap[result.priceLevel] || place.priceLevel || 0,
  };
}

async function main() {
  // Load places data
  const placesData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'src', 'data', 'placesData.json'), 'utf8'));
  
  // Filter: restaurants + cafes that need enrichment (no rating)
  const needsEnrichment = placesData.filter(p => 
    (p.category === 'restaurants' || p.category === 'cafes') && 
    (!p.rating || p.rating === 0)
  );

  console.log(`\n🔍 LocallySF Enrichment — Phase 1`);
  console.log(`Total places: ${placesData.length}`);
  console.log(`Need enrichment (restaurants + cafes): ${needsEnrichment.length}`);
  
  const progress = loadProgress();
  const completedIds = new Set(progress.completed);
  const remaining = needsEnrichment.filter(p => !completedIds.has(p.id));
  
  console.log(`Already completed: ${progress.completed.length}`);
  console.log(`Remaining: ${remaining.length}`);
  console.log(`Estimated cost: ~$${(remaining.length * 0.078).toFixed(0)} of $200 free credit\n`);

  let enriched = 0;
  let failed = 0;
  let enrichedData = {};

  // Load existing enriched data
  try { enrichedData = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf8')); }
  catch { enrichedData = {}; }

  for (let i = 0; i < remaining.length; i++) {
    const place = remaining[i];
    const pct = ((i + 1) / remaining.length * 100).toFixed(1);
    
    try {
      process.stdout.write(`[${pct}%] ${place.name}... `);
      const data = await enrichPlace(place);
      
      if (data) {
        enrichedData[place.id] = data;
        progress.completed.push(place.id);
        enriched++;
        console.log(`✅ ${data.rating}★ (${data.reviewCount} reviews, ${data.photos.length} photos)`);
      } else {
        progress.failed.push(place.id);
        failed++;
        console.log(`⚠️ Not found on Google`);
      }

      // Save progress every 10 places
      if ((i + 1) % 10 === 0) {
        saveProgress(progress);
        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(enrichedData, null, 2));
      }

      await sleep(DELAY_MS);
    } catch (e) {
      console.log(`❌ Error: ${e.message}`);
      progress.failed.push(place.id);
      failed++;
      
      // If rate limited, wait longer
      if (e.message.includes('429') || e.message.includes('RESOURCE_EXHAUSTED')) {
        console.log('⏳ Rate limited, waiting 30s...');
        await sleep(30000);
      }
      
      await sleep(DELAY_MS);
    }
  }

  // Final save
  saveProgress(progress);
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(enrichedData, null, 2));

  console.log(`\n✅ DONE!`);
  console.log(`Enriched: ${enriched}`);
  console.log(`Not found: ${failed}`);
  console.log(`Total completed: ${progress.completed.length}`);
  console.log(`\nData saved to: ${OUTPUT_FILE}`);
  console.log(`Run 'node scripts/apply-enrichment.mjs' to merge into placesData.json`);
}

main().catch(console.error);
