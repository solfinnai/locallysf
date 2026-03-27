#!/usr/bin/env node

import fs from 'fs';

// Helper functions
function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

function calculateNameSimilarity(name1, name2) {
  const normalize = (name) => name.toLowerCase().replace(/[^a-z0-9]/g, '');
  const n1 = normalize(name1);
  const n2 = normalize(name2);
  
  if (n1 === n2) return 100;
  
  // Simple substring matching
  const shorter = n1.length < n2.length ? n1 : n2;
  const longer = n1.length >= n2.length ? n1 : n2;
  
  if (longer.includes(shorter)) return 80;
  
  // Levenshtein distance approximation
  let matches = 0;
  const maxLen = Math.max(n1.length, n2.length);
  
  for (let i = 0; i < Math.min(n1.length, n2.length); i++) {
    if (n1[i] === n2[i]) matches++;
  }
  
  return (matches / maxLen) * 100;
}

function determineNeighborhood(lat, lon) {
  const neighborhoods = [
    { name: 'Mission District', bounds: [37.755, 37.765, -122.425, -122.410] },
    { name: 'Chinatown', bounds: [37.793, 37.798, -122.410, -122.404] },
    { name: 'North Beach', bounds: [37.798, 37.805, -122.415, -122.405] },
    { name: 'Castro', bounds: [37.760, 37.765, -122.438, -122.430] },
    { name: 'SoMa', bounds: [37.770, 37.785, -122.415, -122.390] },
    { name: 'Marina', bounds: [37.800, 37.805, -122.445, -122.430] },
    { name: 'Hayes Valley', bounds: [37.773, 37.778, -122.430, -122.418] },
    { name: 'Haight-Ashbury', bounds: [37.768, 37.773, -122.452, -122.440] },
    { name: 'Pacific Heights', bounds: [37.790, 37.795, -122.440, -122.425] },
    { name: 'Richmond', bounds: [37.775, 37.785, -122.510, -122.460] },
    { name: 'Sunset', bounds: [37.755, 37.765, -122.510, -122.460] },
    { name: 'Nob Hill', bounds: [37.790, 37.795, -122.420, -122.410] },
    { name: 'Financial District', bounds: [37.790, 37.795, -122.405, -122.395] }
  ];

  for (const neighborhood of neighborhoods) {
    const [minLat, maxLat, minLon, maxLon] = neighborhood.bounds;
    if (lat >= minLat && lat <= maxLat && lon >= minLon && lon <= maxLon) {
      return neighborhood.name;
    }
  }
  
  return 'San Francisco';
}

function categorizeFromOSM(osmData) {
  const { amenity, shop, leisure, office } = osmData;
  
  if (amenity === 'restaurant') return 'restaurants';
  if (amenity === 'cafe') return 'cafes';
  if (amenity === 'bar' || amenity === 'pub') return 'bars';
  if (shop) return 'shopping';
  if (['hospital', 'doctors', 'dentist', 'pharmacy', 'clinic'].includes(amenity)) return 'healthcare';
  if (['school', 'university', 'college', 'kindergarten'].includes(amenity)) return 'education';
  if (['post_office', 'library', 'fire_station', 'police', 'townhall'].includes(amenity) || office === 'government') return 'government';
  if (['park', 'fitness_centre', 'sports_centre'].includes(leisure)) return 'parks';
  if (amenity === 'bank' || amenity === 'atm') return 'finance';
  if (amenity === 'place_of_worship') return 'religious';
  
  return 'services';
}

function convertGooglePlace(place) {
  return {
    id: place.id,
    slug: place.slug,
    name: place.name,
    category: place.category,
    subcategory: place.subcategory,
    address: place.address,
    neighborhood: place.neighborhood,
    city: place.city || 'San Francisco',
    phone: place.phone,
    website: place.website,
    googleMapsUrl: place.googleMapsUrl,
    rating: place.rating || 0,
    reviewCount: place.reviewCount || 0,
    priceLevel: place.priceLevel,
    photos: place.photos || [],
    hours: place.hours,
    reviews: place.reviews || [],
    description: place.description,
    source: 'google'
  };
}

function convertOSMPlace(osmData) {
  const category = categorizeFromOSM(osmData);
  const neighborhood = osmData.lat && osmData.lon ? 
    determineNeighborhood(osmData.lat, osmData.lon) : 'San Francisco';
  
  return {
    id: osmData.id,
    slug: generateSlug(osmData.name),
    name: osmData.name,
    category: category,
    subcategory: osmData.cuisine || osmData.shop || osmData.amenity || 'Other',
    address: osmData.address || `${osmData.lat}, ${osmData.lon}`,
    neighborhood: neighborhood,
    city: 'San Francisco',
    phone: osmData.phone,
    website: osmData.website,
    googleMapsUrl: osmData.lat && osmData.lon ? 
      `https://maps.google.com/?q=${osmData.lat},${osmData.lon}` : null,
    rating: 0, // OSM has no ratings
    reviewCount: 0,
    priceLevel: null,
    photos: [], // OSM has no photos
    hours: osmData.opening_hours ? [osmData.opening_hours] : null,
    reviews: [], // OSM has no reviews
    description: osmData.description,
    lat: osmData.lat,
    lon: osmData.lon,
    source: 'osm'
  };
}

function convertDataSFPlace(dataSFData) {
  // Extract coordinates from location field if available
  let lat = null;
  let lon = null;
  if (dataSFData.location && dataSFData.location.coordinates) {
    lon = dataSFData.location.coordinates[0];
    lat = dataSFData.location.coordinates[1];
  }
  
  const neighborhood = dataSFData.neighborhood || 
    (lat && lon ? determineNeighborhood(lat, lon) : 'San Francisco');
  
  // Determine category from NAICS code/description
  let category = 'services';
  const naics = (dataSFData.naics_code_description || '').toLowerCase();
  if (naics.includes('restaurant') || naics.includes('food service')) category = 'restaurants';
  else if (naics.includes('coffee') || naics.includes('cafe')) category = 'cafes';
  else if (naics.includes('bar') || naics.includes('drinking')) category = 'bars';
  else if (naics.includes('retail') || naics.includes('store')) category = 'shopping';
  else if (naics.includes('health') || naics.includes('medical') || naics.includes('dental')) category = 'healthcare';
  else if (naics.includes('education') || naics.includes('school')) category = 'education';
  else if (naics.includes('bank') || naics.includes('financial')) category = 'finance';
  
  return {
    id: dataSFData.id,
    slug: generateSlug(dataSFData.name),
    name: dataSFData.name,
    category: category,
    subcategory: dataSFData.business_type || 'Business',
    address: dataSFData.address,
    neighborhood: neighborhood,
    city: 'San Francisco',
    phone: null,
    website: null,
    googleMapsUrl: lat && lon ? `https://maps.google.com/?q=${lat},${lon}` : null,
    rating: 0,
    reviewCount: 0,
    priceLevel: null,
    photos: [],
    hours: null,
    reviews: [],
    description: dataSFData.naics_code_description,
    lat: lat,
    lon: lon,
    source: 'datasf'
  };
}

function isDuplicate(place1, place2) {
  // Check if same place based on name similarity and proximity
  const nameSimilarity = calculateNameSimilarity(place1.name, place2.name);
  
  if (nameSimilarity > 80) {
    // If names are very similar, check proximity if we have coordinates
    if (place1.lat && place1.lon && place2.lat && place2.lon) {
      const distance = calculateDistance(place1.lat, place1.lon, place2.lat, place2.lon);
      return distance < 100; // Within 100 meters
    }
    // If no coordinates, rely on name similarity and address
    return true;
  }
  
  return false;
}

function mergePlace(existing, duplicate) {
  // Prefer Google data for richer information
  if (existing.source === 'google') {
    return existing; // Keep Google data
  } else if (duplicate.source === 'google') {
    return duplicate; // Use Google data over OSM/DataSF
  }
  
  // Otherwise, merge OSM and DataSF data
  return {
    ...existing,
    // Add any missing fields from duplicate
    phone: existing.phone || duplicate.phone,
    website: existing.website || duplicate.website,
    description: existing.description || duplicate.description,
    hours: existing.hours || duplicate.hours,
  };
}

async function main() {
  console.log('Starting data merge...');
  
  // Read all data sources
  let googlePlaces = [];
  let osmPlaces = [];
  let dataSFPlaces = [];
  
  // Read Google Places data
  try {
    const googleData = JSON.parse(fs.readFileSync('scripts/sf-places.json', 'utf8'));
    // The Google data is structured by category, so we need to flatten it
    for (const category in googleData) {
      if (Array.isArray(googleData[category])) {
        const categoryPlaces = googleData[category].map(place => ({
          ...place,
          category: category
        }));
        googlePlaces.push(...categoryPlaces.map(convertGooglePlace));
      }
    }
    console.log(`Loaded ${googlePlaces.length} Google Places`);
  } catch (error) {
    console.error('Error reading Google Places data:', error);
  }
  
  // Read OSM data
  try {
    const osmData = JSON.parse(fs.readFileSync('scripts/osm-data.json', 'utf8'));
    osmPlaces = osmData.map(convertOSMPlace);
    console.log(`Loaded ${osmPlaces.length} OSM places`);
  } catch (error) {
    console.error('Error reading OSM data:', error);
  }
  
  // Read DataSF data
  try {
    const dataSFData = JSON.parse(fs.readFileSync('scripts/datasf-data.json', 'utf8'));
    dataSFPlaces = dataSFData.map(convertDataSFPlace);
    console.log(`Loaded ${dataSFPlaces.length} DataSF places`);
  } catch (error) {
    console.error('Error reading DataSF data:', error);
  }
  
  // Start with Google Places as the base
  let mergedPlaces = [...googlePlaces];
  console.log(`Starting with ${mergedPlaces.length} Google Places as base`);
  
  // Add OSM places, checking for duplicates
  console.log('Merging OSM places...');
  for (const osmPlace of osmPlaces) {
    const duplicate = mergedPlaces.find(existing => isDuplicate(existing, osmPlace));
    if (duplicate) {
      // Merge the places (prefer Google data)
      const mergedIndex = mergedPlaces.indexOf(duplicate);
      mergedPlaces[mergedIndex] = mergePlace(duplicate, osmPlace);
    } else {
      // Add new place
      mergedPlaces.push(osmPlace);
    }
  }
  console.log(`After merging OSM: ${mergedPlaces.length} total places`);
  
  // Add DataSF places, checking for duplicates
  console.log('Merging DataSF places...');
  for (const dataSFPlace of dataSFPlaces) {
    const duplicate = mergedPlaces.find(existing => isDuplicate(existing, dataSFPlace));
    if (duplicate) {
      // Merge the places
      const mergedIndex = mergedPlaces.indexOf(duplicate);
      mergedPlaces[mergedIndex] = mergePlace(duplicate, dataSFPlace);
    } else {
      // Add new place
      mergedPlaces.push(dataSFPlace);
    }
  }
  
  console.log(`\nFinal total: ${mergedPlaces.length} places after deduplication`);
  
  // Generate category counts
  const categoryCounts = {};
  mergedPlaces.forEach(place => {
    categoryCounts[place.category] = (categoryCounts[place.category] || 0) + 1;
  });
  
  console.log('\nCategory breakdown:');
  Object.entries(categoryCounts).forEach(([category, count]) => {
    console.log(`  ${category}: ${count}`);
  });
  
  // Clean up places data (remove temporary fields)
  const cleanedPlaces = mergedPlaces.map(place => {
    const cleaned = { ...place };
    delete cleaned.lat;
    delete cleaned.lon;
    delete cleaned.source;
    return cleaned;
  });
  
  // Save merged data
  fs.writeFileSync('scripts/all-places.json', JSON.stringify(cleanedPlaces, null, 2));
  console.log('\nSaved merged data to scripts/all-places.json');
  
  console.log('Data merge complete!');
}

main().catch(console.error);