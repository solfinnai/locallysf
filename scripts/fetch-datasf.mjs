#!/usr/bin/env node

import fs from 'fs';

const DATASF_API_URL = "https://data.sfgov.org/resource/g8m3-pdis.json?$limit=5000&$where=city='San Francisco' AND dba_start_date > '2020-01-01'&$order=dba_start_date DESC";

async function fetchDataSF() {
  console.log('Fetching DataSF registered businesses...');
  
  try {
    const response = await fetch(DATASF_API_URL, {
      headers: {
        'User-Agent': 'LocallySF-DataFetcher/1.0'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(`Got ${data.length} business registrations`);
    
    return data;
  } catch (error) {
    console.error('Error fetching from DataSF API:', error);
    return [];
  }
}

function processDataSFEntry(entry) {
  return {
    id: `datasf_${entry.certificate_number}`,
    name: entry.dba_name || entry.ownership_name || 'Unknown Business',
    business_type: entry.business_type || null,
    naics_code: entry.naic_code || null,
    naics_code_description: entry.naic_code_description || null,
    address: formatAddress(entry),
    neighborhood: entry.neighborhoods_analysis_boundaries || null,
    zip_code: entry.business_zip || null,
    start_date: entry.dba_start_date || null,
    end_date: entry.dba_end_date || null,
    status: entry.dba_end_date ? 'closed' : 'active',
    location: entry.location || null,
    raw_data: entry
  };
}

function formatAddress(entry) {
  const parts = [];
  
  if (entry.full_business_address) parts.push(entry.full_business_address);
  if (entry.city) parts.push(entry.city);
  if (entry.state) parts.push(entry.state);
  if (entry.business_zip) parts.push(entry.business_zip);
  
  return parts.length > 0 ? parts.join(', ') : null;
}

async function main() {
  console.log('Starting DataSF business registration fetch...');
  
  const rawData = await fetchDataSF();
  
  if (rawData.length === 0) {
    console.log('No data received from DataSF');
    return;
  }
  
  // Process the data
  const processedData = rawData.map(processDataSFEntry).filter(entry => 
    entry.name !== 'Unknown Business' && entry.address
  );
  
  console.log(`Processed ${processedData.length} valid business registrations`);
  
  // Save to datasf-data.json
  fs.writeFileSync('scripts/datasf-data.json', JSON.stringify(processedData, null, 2));
  console.log('Saved DataSF data to scripts/datasf-data.json');
  
  console.log('DataSF data fetch complete!');
}

main().catch(console.error);