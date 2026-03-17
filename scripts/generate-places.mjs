#!/usr/bin/env node

import fs from 'fs';

function escapeString(str) {
  if (!str) return null;
  return str.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r');
}

function formatPlace(place) {
  // Just use JSON.stringify to avoid complex formatting issues
  // Make sure to handle null slug correctly
  const cleanPlace = {
    ...place,
    slug: place.slug || 'unknown',
    photos: place.photos || [],
    reviews: place.reviews || [],
    hours: place.hours || null,
    phone: place.phone || null,
    website: place.website || null,
    googleMapsUrl: place.googleMapsUrl || null,
    priceLevel: place.priceLevel || null,
    description: place.description || null
  };
  
  return JSON.stringify(cleanPlace, null, 2);
}

async function main() {
  console.log('Generating TypeScript data file...');
  
  // Read merged places data
  const placesData = JSON.parse(fs.readFileSync('scripts/all-places.json', 'utf8'));
  console.log(`Processing ${placesData.length} places`);
  
  // We'll generate the content in the cleaning section below

  // Clean and format all places
  const cleanedPlaces = placesData.map(place => ({
    ...place,
    slug: place.slug || 'unknown',
    photos: place.photos || [],
    reviews: place.reviews || [],
    hours: place.hours || null,
    phone: place.phone || null,
    website: place.website || null,
    googleMapsUrl: place.googleMapsUrl || null,
    priceLevel: place.priceLevel || null,
    description: place.description || null
  }));
  
  // Write cleaned places to JSON file first
  fs.writeFileSync('src/data/placesData.json', JSON.stringify(cleanedPlaces, null, 2));
  console.log('Generated src/data/placesData.json');
  
  // Create a simple TypeScript file that imports the JSON
  const simpleContent = `// Generated file - do not edit manually
// Run 'npm run fetch-data' to regenerate

import { Place } from './places';
import placesData from './placesData.json';

export const places: Place[] = placesData as Place[];

export default places;`;
  
  // Write to placesData.ts
  fs.writeFileSync('src/data/placesData.ts', simpleContent);
  console.log('Generated src/data/placesData.ts');
  
  // Generate summary stats
  const categoryCounts = {};
  placesData.forEach(place => {
    categoryCounts[place.category] = (categoryCounts[place.category] || 0) + 1;
  });
  
  console.log('\nGenerated data summary:');
  console.log(`Total places: ${placesData.length}`);
  console.log('Category breakdown:');
  Object.entries(categoryCounts).forEach(([category, count]) => {
    console.log(`  ${category}: ${count}`);
  });
  
  console.log('\nTypeScript generation complete!');
}

main().catch(console.error);