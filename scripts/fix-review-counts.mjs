#!/usr/bin/env node
/**
 * Fix review counts for all places that have Google data (rating > 0)
 * Re-fetches userRatingCount from Google Places API
 * Cost: ~$11 for 360 places (Basic Place Details = $0.032/request)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const API_KEY = JSON.parse(fs.readFileSync(path.join(process.env.HOME, '.config/google/places-api-key.json'), 'utf8')).api_key;
const PLACES_FILE = path.join(__dirname, '..', 'src', 'data', 'placesData.json');
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function searchPlace(name, address) {
  const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': API_KEY,
      'X-Goog-FieldMask': 'places.userRatingCount,places.rating',
    },
    body: JSON.stringify({ textQuery: `${name} ${address}`, maxResultCount: 1 }),
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  const data = await res.json();
  return data.places?.[0] || null;
}

async function main() {
  const places = JSON.parse(fs.readFileSync(PLACES_FILE, 'utf8'));
  
  // Only fix places that already have Google data but wrong review counts
  const needsFix = places.filter(p => 
    p.rating > 0 && p.reviews && p.reviews.length > 0 && 
    (p.reviewCount === p.reviews.length || p.reviewCount <= 5)
  );
  
  console.log(`Fixing review counts for ${needsFix.length} places...`);
  console.log(`Estimated cost: ~$${(needsFix.length * 0.032).toFixed(2)}`);
  
  let fixed = 0;
  let failed = 0;
  
  for (let i = 0; i < needsFix.length; i++) {
    const place = needsFix[i];
    try {
      process.stdout.write(`[${i+1}/${needsFix.length}] ${place.name}... `);
      const result = await searchPlace(place.name, place.address);
      
      if (result && result.userRatingCount) {
        const idx = places.findIndex(p => p.id === place.id);
        places[idx].reviewCount = result.userRatingCount;
        console.log(`✅ ${result.userRatingCount} reviews (was ${place.reviewCount})`);
        fixed++;
      } else {
        console.log(`⚠️ No count found`);
        failed++;
      }
      await sleep(200);
    } catch (e) {
      console.log(`❌ ${e.message}`);
      failed++;
      if (e.message.includes('429')) { 
        console.log('Rate limited, waiting 30s...');
        await sleep(30000);
      }
      await sleep(200);
    }
  }
  
  fs.writeFileSync(PLACES_FILE, JSON.stringify(places));
  console.log(`\n✅ Done! Fixed: ${fixed}, Failed: ${failed}`);
  
  // Verify
  const botanical = places.find(p => p.name.includes('Botanical Garden'));
  if (botanical) console.log(`Botanical Garden: ${botanical.reviewCount} reviews`);
}

main().catch(console.error);
