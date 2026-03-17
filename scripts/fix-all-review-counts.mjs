#!/usr/bin/env node
/**
 * Fix review counts for ALL places that have rating > 0 but reviewCount <= 5
 * Uses Google Places API Text Search (Basic) = $0.032/request
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const API_KEY = JSON.parse(fs.readFileSync(path.join(process.env.HOME, '.config/google/places-api-key.json'), 'utf8')).api_key;
const PLACES_FILE = path.join(__dirname, '..', 'src', 'data', 'placesData.json');
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function getReviewCount(name, address) {
  const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': API_KEY,
      'X-Goog-FieldMask': 'places.userRatingCount',
    },
    body: JSON.stringify({ textQuery: `${name} ${address}`, maxResultCount: 1 }),
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  const data = await res.json();
  return data.places?.[0]?.userRatingCount || 0;
}

async function main() {
  const places = JSON.parse(fs.readFileSync(PLACES_FILE, 'utf8'));
  const needsFix = places.filter(p => p.rating > 0 && p.reviewCount <= 5);
  
  console.log(`Fixing ${needsFix.length} places with reviewCount <= 5`);
  console.log(`Cost: ~$${(needsFix.length * 0.032).toFixed(2)}`);
  
  let fixed = 0;
  for (let i = 0; i < needsFix.length; i++) {
    const place = needsFix[i];
    try {
      process.stdout.write(`[${i+1}/${needsFix.length}] ${place.name}... `);
      const count = await getReviewCount(place.name, place.address);
      if (count > 0) {
        const idx = places.findIndex(p => p.id === place.id);
        places[idx].reviewCount = count;
        console.log(`✅ ${count} reviews`);
        fixed++;
      } else {
        console.log(`⚠️ 0`);
      }
      await sleep(200);
      
      // Save every 50
      if ((i + 1) % 50 === 0) {
        fs.writeFileSync(PLACES_FILE, JSON.stringify(places));
        console.log(`  [saved ${i+1}/${needsFix.length}]`);
      }
    } catch (e) {
      console.log(`❌ ${e.message}`);
      if (e.message.includes('429')) await sleep(30000);
      await sleep(200);
    }
  }
  
  fs.writeFileSync(PLACES_FILE, JSON.stringify(places));
  console.log(`\n✅ Done! Fixed ${fixed} of ${needsFix.length}`);
  
  // Verify
  const botanical = places.find(p => p.name.includes('Botanical Garden'));
  if (botanical) console.log(`Botanical Garden: ${botanical.reviewCount} reviews`);
}

main().catch(console.error);
