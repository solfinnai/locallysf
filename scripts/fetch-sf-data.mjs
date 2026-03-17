import fs from 'fs';
import path from 'path';

const GOOGLE_API_KEY = 'AIzaSyB5sJXrPLOATQrQBLUJ1HfEOn5E3jigeuw';
const BASE_URL = 'https://places.googleapis.com/v1';

// Search queries organized by category
const SEARCH_QUERIES = {
  restaurants: [
    "best restaurants San Francisco",
    "chinese restaurants San Francisco chinatown",
    "mexican restaurants San Francisco mission",
    "italian restaurants San Francisco north beach",
    "japanese restaurants San Francisco",
    "brunch spots San Francisco"
  ],
  cafes: [
    "coffee shops San Francisco",
    "best cafes San Francisco"
  ],
  bars: [
    "best bars San Francisco",
    "cocktail bars San Francisco"
  ],
  shopping: [
    "shopping San Francisco union square",
    "vintage shops San Francisco"
  ],
  attractions: [
    "tourist attractions San Francisco",
    "museums San Francisco",
    "parks San Francisco"
  ],
  services: [
    "gyms fitness San Francisco",
    "spas San Francisco",
    "hair salons San Francisco"
  ]
};

// Rate limiting function
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Search for places using text search
async function searchPlaces(query, maxResults = 20) {
  console.log(`Searching for: ${query}`);
  
  const response = await fetch(`${BASE_URL}/places:searchText`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': GOOGLE_API_KEY,
      'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.photos,places.nationalPhoneNumber,places.websiteUri,places.googleMapsUri,places.currentOpeningHours,places.priceLevel,places.types,places.reviews,places.editorialSummary'
    },
    body: JSON.stringify({
      textQuery: query,
      maxResultCount: maxResults
    })
  });

  if (!response.ok) {
    console.error(`Error searching for "${query}": ${response.status} ${response.statusText}`);
    return [];
  }

  const data = await response.json();
  return data.places || [];
}

// Fetch photo URLs for a place
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
          attribution: photo.authorAttributions?.[0]?.displayName || 'Google'
        });
      }
      
      await delay(200); // Rate limit
    } catch (error) {
      console.error(`Error fetching photo: ${error.message}`);
    }
  }
  
  return photoUrls;
}

// Process places and add photo URLs
async function processPlaces(places) {
  const processedPlaces = [];
  
  for (const place of places) {
    const photoUrls = await fetchPhotoUrls(place.photos);
    
    const processedPlace = {
      id: place.id,
      name: place.displayName?.text || '',
      address: place.formattedAddress || '',
      rating: place.rating || 0,
      userRatingCount: place.userRatingCount || 0,
      photos: photoUrls,
      phone: place.nationalPhoneNumber || null,
      website: place.websiteUri || null,
      googleMapsUrl: place.googleMapsUri || null,
      priceLevel: place.priceLevel || null,
      types: place.types || [],
      reviews: (place.reviews || []).slice(0, 5).map(review => ({
        author: review.authorAttribution?.displayName || 'Anonymous',
        rating: review.rating || 0,
        text: review.text?.text || ''
      })),
      description: place.editorialSummary?.text || null,
      hours: place.currentOpeningHours?.weekdayDescriptions || null
    };
    
    processedPlaces.push(processedPlace);
    await delay(200); // Rate limit between photo requests
  }
  
  return processedPlaces;
}

// Main function to fetch all data
async function fetchAllData() {
  const allPlaces = {};
  
  for (const [category, queries] of Object.entries(SEARCH_QUERIES)) {
    console.log(`\nFetching ${category.toUpperCase()} data...`);
    allPlaces[category] = [];
    
    for (const query of queries) {
      try {
        const places = await searchPlaces(query);
        const processedPlaces = await processPlaces(places);
        allPlaces[category].push(...processedPlaces);
        
        console.log(`Found ${processedPlaces.length} places for "${query}"`);
        await delay(500); // Rate limit between searches
      } catch (error) {
        console.error(`Error processing "${query}": ${error.message}`);
      }
    }
    
    console.log(`Total ${category}: ${allPlaces[category].length} places`);
  }
  
  return allPlaces;
}

// Main execution
async function main() {
  console.log('Starting San Francisco places data fetch...');
  console.log('This may take a while due to rate limiting.\n');
  
  try {
    const data = await fetchAllData();
    
    // Save to JSON file
    const outputPath = path.join(process.cwd(), 'scripts', 'sf-places.json');
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
    
    console.log(`\nData fetch complete! Saved to: ${outputPath}`);
    
    // Print summary
    console.log('\n=== SUMMARY ===');
    let totalPlaces = 0;
    for (const [category, places] of Object.entries(data)) {
      console.log(`${category}: ${places.length} places`);
      totalPlaces += places.length;
    }
    console.log(`Total places: ${totalPlaces}`);
    
  } catch (error) {
    console.error('Error during data fetch:', error);
    process.exit(1);
  }
}

main();