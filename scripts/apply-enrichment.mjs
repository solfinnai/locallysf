#!/usr/bin/env node
/**
 * Apply enriched Google data back to placesData.json
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ENRICHED_FILE = path.join(__dirname, 'enriched-places.json');
const PLACES_FILE = path.join(__dirname, '..', 'src', 'data', 'placesData.json');

const enriched = JSON.parse(fs.readFileSync(ENRICHED_FILE, 'utf8'));
const places = JSON.parse(fs.readFileSync(PLACES_FILE, 'utf8'));

let updated = 0;
places.forEach(place => {
  const data = enriched[place.id];
  if (data) {
    place.rating = data.rating || place.rating;
    place.reviewCount = data.reviewCount || place.reviewCount;
    place.phone = data.phone || place.phone;
    place.website = data.website || place.website;
    place.googleMapsUrl = data.googleMapsUrl || place.googleMapsUrl;
    place.hours = data.hours.length > 0 ? data.hours : place.hours;
    place.photos = data.photos.length > 0 ? data.photos : place.photos;
    place.reviews = data.reviews.length > 0 ? data.reviews : place.reviews;
    place.priceLevel = data.priceLevel || place.priceLevel;
    updated++;
  }
});

fs.writeFileSync(PLACES_FILE, JSON.stringify(places));
console.log(`✅ Updated ${updated} places in placesData.json`);
console.log(`Total places: ${places.length}`);
console.log(`With rating: ${places.filter(p => p.rating > 0).length}`);
console.log(`With photos: ${places.filter(p => p.photos?.length > 0).length}`);
