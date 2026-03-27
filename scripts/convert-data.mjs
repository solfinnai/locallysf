import fs from 'fs';
import path from 'path';

// Utility functions (duplicated from places.ts since we can't import TS in .mjs)
function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function extractNeighborhood(address) {
  const neighborhoodMap = {
    'mission': 'Mission District',
    'chinatown': 'Chinatown',
    'north beach': 'North Beach',
    'castro': 'Castro',
    'marina': 'Marina',
    'hayes valley': 'Hayes Valley',
    'soma': 'SoMa',
    'haight': 'Haight-Ashbury',
    'pacific heights': 'Pacific Heights',
    'richmond': 'Richmond',
    'sunset': 'Sunset',
    'financial district': 'Financial District',
    'union square': 'Union Square',
    'nob hill': 'Nob Hill',
    'russian hill': 'Russian Hill'
  };

  const lowerAddress = address.toLowerCase();
  for (const [key, value] of Object.entries(neighborhoodMap)) {
    if (lowerAddress.includes(key)) {
      return value;
    }
  }
  
  return 'San Francisco'; // Default if no neighborhood found
}

function determineSubcategory(types, originalCategory, index) {
  // Map based on original category and position in array (indicating which query it came from)
  const subcategoryMaps = {
    restaurants: [
      'Fine Dining',     // best restaurants
      'Chinese',         // chinese restaurants
      'Mexican',         // mexican restaurants  
      'Italian',         // italian restaurants
      'Japanese',        // japanese restaurants
      'Brunch'          // brunch spots
    ],
    cafes: [
      'Coffee Shop',     // coffee shops
      'Cafe'            // best cafes
    ],
    bars: [
      'Bar',            // best bars
      'Cocktails'       // cocktail bars
    ],
    shopping: [
      'Retail',         // shopping union square
      'Vintage'         // vintage shops
    ],
    attractions: [
      'Tourist Attraction', // tourist attractions
      'Museums',           // museums
      'Parks'              // parks
    ],
    services: [
      'Fitness',        // gyms fitness
      'Spa',           // spas
      'Hair & Beauty'   // hair salons
    ]
  };

  const categoryMap = subcategoryMaps[originalCategory];
  if (categoryMap && categoryMap[index]) {
    return categoryMap[index];
  }

  // Fallback based on types
  if (types.includes('restaurant')) return 'Restaurant';
  if (types.includes('cafe')) return 'Cafe';
  if (types.includes('bar')) return 'Bar';
  if (types.includes('store')) return 'Retail';
  if (types.includes('tourist_attraction')) return 'Attraction';
  
  return 'Other';
}

function convertRawDataToPlaces(rawData) {
  const allPlaces = [];
  const seenIds = new Set(); // Prevent duplicates
  
  // Track query index for subcategory determination
  const queryIndexMap = {
    restaurants: 0,
    cafes: 0,
    bars: 0,
    shopping: 0,
    attractions: 0,
    services: 0
  };

  for (const [category, places] of Object.entries(rawData)) {
    const queriesPerCategory = {
      restaurants: 6,
      cafes: 2,
      bars: 2,
      shopping: 2,
      attractions: 3,
      services: 3
    };
    
    const placesPerQuery = Math.floor(places.length / queriesPerCategory[category]);
    
    places.forEach((place, index) => {
      // Skip if we've already seen this place
      if (seenIds.has(place.id)) {
        return;
      }
      seenIds.add(place.id);
      
      // Determine which query this came from
      const queryIndex = Math.floor(index / placesPerQuery);
      
      // Convert priceLevel from string enum to number
      let priceLevel = null;
      if (place.priceLevel) {
        const priceLevelMap = {
          'PRICE_LEVEL_FREE': 1,
          'PRICE_LEVEL_INEXPENSIVE': 1,
          'PRICE_LEVEL_MODERATE': 2,
          'PRICE_LEVEL_EXPENSIVE': 3,
          'PRICE_LEVEL_VERY_EXPENSIVE': 4
        };
        priceLevel = priceLevelMap[place.priceLevel] || null;
      }

      const convertedPlace = {
        id: place.id,
        slug: generateSlug(place.name),
        name: place.name,
        category: category,
        subcategory: determineSubcategory(place.types, category, queryIndex),
        address: place.address,
        neighborhood: extractNeighborhood(place.address),
        city: 'San Francisco',
        phone: place.phone,
        website: place.website,
        googleMapsUrl: place.googleMapsUrl,
        rating: place.rating,
        reviewCount: place.userRatingCount,
        priceLevel: priceLevel,
        photos: place.photos,
        hours: place.hours,
        reviews: place.reviews,
        description: place.description
      };
      
      allPlaces.push(convertedPlace);
    });
  }
  
  return allPlaces;
}

function generatePlacesDataFile(places) {
  const content = `// Generated file - do not edit manually
// Run 'npm run fetch-data' to regenerate

import { Place } from './places';

export const places: Place[] = ${JSON.stringify(places, null, 2)};

export default places;
`;

  return content;
}

async function main() {
  try {
    console.log('Converting raw places data to TypeScript format...');
    
    // Read the raw data
    const rawDataPath = path.join(process.cwd(), 'scripts', 'sf-places.json');
    if (!fs.existsSync(rawDataPath)) {
      console.error('Raw data file not found. Please run the fetch script first.');
      process.exit(1);
    }
    
    const rawData = JSON.parse(fs.readFileSync(rawDataPath, 'utf-8'));
    
    // Convert the data
    const places = convertRawDataToPlaces(rawData);
    
    // Generate TypeScript file
    const dataContent = generatePlacesDataFile(places);
    
    // Write the TypeScript file
    const outputPath = path.join(process.cwd(), 'src', 'data', 'placesData.ts');
    fs.writeFileSync(outputPath, dataContent);
    
    console.log(`✅ Converted ${places.length} places`);
    console.log(`📁 Saved to: ${outputPath}`);
    
    // Print summary by category
    console.log('\n=== CONVERSION SUMMARY ===');
    const categoryCounts = places.reduce((acc, place) => {
      acc[place.category] = (acc[place.category] || 0) + 1;
      return acc;
    }, {});
    
    for (const [category, count] of Object.entries(categoryCounts)) {
      console.log(`${category}: ${count} places`);
    }
    
  } catch (error) {
    console.error('Error converting data:', error);
    process.exit(1);
  }
}

main();