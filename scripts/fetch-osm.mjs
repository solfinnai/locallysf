#!/usr/bin/env node

import fs from 'fs';

// Query ALL amenities in San Francisco
const queries = [
  // Restaurants
  `[out:json][timeout:180];area["name"="San Francisco"]["admin_level"="6"]->.sf;(node["amenity"="restaurant"](area.sf);way["amenity"="restaurant"](area.sf););out body;`,
  // Cafes
  `[out:json][timeout:180];area["name"="San Francisco"]["admin_level"="6"]->.sf;(node["amenity"="cafe"](area.sf);way["amenity"="cafe"](area.sf););out body;`,
  // Bars
  `[out:json][timeout:180];area["name"="San Francisco"]["admin_level"="6"]->.sf;(node["amenity"="bar"](area.sf);way["amenity"="bar"](area.sf);node["amenity"="pub"](area.sf);way["amenity"="pub"](area.sf););out body;`,
  // Shopping
  `[out:json][timeout:180];area["name"="San Francisco"]["admin_level"="6"]->.sf;(node["shop"](area.sf);way["shop"](area.sf););out body;`,
  // Healthcare
  `[out:json][timeout:180];area["name"="San Francisco"]["admin_level"="6"]->.sf;(node["amenity"="doctors"](area.sf);node["amenity"="dentist"](area.sf);node["amenity"="pharmacy"](area.sf);node["amenity"="hospital"](area.sf);node["amenity"="clinic"](area.sf);way["amenity"="hospital"](area.sf););out body;`,
  // Education
  `[out:json][timeout:180];area["name"="San Francisco"]["admin_level"="6"]->.sf;(node["amenity"="school"](area.sf);node["amenity"="university"](area.sf);node["amenity"="college"](area.sf);node["amenity"="kindergarten"](area.sf);way["amenity"="school"](area.sf);way["amenity"="university"](area.sf););out body;`,
  // Government
  `[out:json][timeout:180];area["name"="San Francisco"]["admin_level"="6"]->.sf;(node["amenity"="post_office"](area.sf);node["amenity"="library"](area.sf);node["amenity"="fire_station"](area.sf);node["amenity"="police"](area.sf);node["amenity"="townhall"](area.sf);node["office"="government"](area.sf););out body;`,
  // Parks & Recreation
  `[out:json][timeout:180];area["name"="San Francisco"]["admin_level"="6"]->.sf;(node["leisure"="park"](area.sf);way["leisure"="park"](area.sf);node["leisure"="fitness_centre"](area.sf);node["leisure"="sports_centre"](area.sf););out body;`,
  // Banks
  `[out:json][timeout:180];area["name"="San Francisco"]["admin_level"="6"]->.sf;(node["amenity"="bank"](area.sf);node["amenity"="atm"](area.sf);way["amenity"="bank"](area.sf););out body;`,
  // Religious
  `[out:json][timeout:180];area["name"="San Francisco"]["admin_level"="6"]->.sf;(node["amenity"="place_of_worship"](area.sf);way["amenity"="place_of_worship"](area.sf););out body;`,
];

const OVERPASS_API_URL = 'https://overpass-api.de/api/interpreter';

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchOverpassData(query) {
  console.log('Querying Overpass API...');
  
  try {
    const response = await fetch(OVERPASS_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'LocallySF-DataFetcher/1.0'
      },
      body: `data=${encodeURIComponent(query)}`
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(`Got ${data.elements?.length || 0} results`);
    
    return data.elements || [];
  } catch (error) {
    console.error('Error fetching from Overpass API:', error);
    return [];
  }
}

function extractOSMData(element) {
  const tags = element.tags || {};
  
  // Extract coordinates
  let lat, lon;
  if (element.lat && element.lon) {
    lat = element.lat;
    lon = element.lon;
  } else if (element.center) {
    lat = element.center.lat;
    lon = element.center.lon;
  }

  // Build address from OSM tags
  const addressParts = [];
  if (tags['addr:housenumber']) addressParts.push(tags['addr:housenumber']);
  if (tags['addr:street']) addressParts.push(tags['addr:street']);
  if (tags['addr:city'] || tags['addr:suburb']) addressParts.push(tags['addr:city'] || tags['addr:suburb']);
  if (tags['addr:postcode']) addressParts.push(tags['addr:postcode']);
  
  const address = addressParts.length > 0 ? addressParts.join(' ') : null;

  return {
    id: `osm_${element.type}_${element.id}`,
    name: tags.name || 'Unknown',
    lat,
    lon,
    address,
    phone: tags.phone || tags['contact:phone'] || null,
    website: tags.website || tags['contact:website'] || null,
    opening_hours: tags.opening_hours || null,
    cuisine: tags.cuisine || null,
    shop: tags.shop || null,
    amenity: tags.amenity || null,
    leisure: tags.leisure || null,
    office: tags.office || null,
    description: tags.description || null,
    tags: tags
  };
}

async function main() {
  console.log('Starting OpenStreetMap data fetch...');
  
  const allResults = [];
  
  for (let i = 0; i < queries.length; i++) {
    const query = queries[i];
    console.log(`\nProcessing query ${i + 1}/${queries.length}...`);
    
    const results = await fetchOverpassData(query);
    
    // Process and extract data from results
    const processedResults = results.map(extractOSMData).filter(result => 
      result.name !== 'Unknown' && result.lat && result.lon
    );
    
    console.log(`Processed ${processedResults.length} valid results`);
    allResults.push(...processedResults);
    
    // Rate limit: wait 10 seconds between queries (Overpass is strict)
    if (i < queries.length - 1) {
      console.log('Waiting 10 seconds for rate limiting...');
      await sleep(10000);
    }
  }
  
  console.log(`\nTotal results: ${allResults.length}`);
  
  // Save raw results to osm-data.json
  fs.writeFileSync('scripts/osm-data.json', JSON.stringify(allResults, null, 2));
  console.log('Saved OSM data to scripts/osm-data.json');
  
  console.log('OpenStreetMap data fetch complete!');
}

main().catch(console.error);