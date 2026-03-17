# LocallySF Scripts

## ⚠️ COST WARNING
These scripts hit the Google Places API and cost real money.
DO NOT run them casually. Review counts and place data are
baked into static JSON — they persist across deploys for FREE.

| Script | What it does | Cost |
|--------|-------------|------|
| enrich-batch.mjs | Adds Google data to places | ~$0.08/place |
| fix-all-review-counts.mjs | Updates review counts | ~$0.032/place |
| apply-enrichment.mjs | Merges enriched data (FREE) | $0 |

## Refresh Schedule
- Review counts: **Monthly at most** (or never — they're close enough)
- New place enrichment: **Only when adding new data sources**
- Photos: Fetched once during enrichment, cached in JSON forever

## Current Status
- 360 places fully enriched (as of March 15, 2026)
- 2,407 restaurants+cafes being enriched (batch 1)
- ~12,000 remaining (OSM/DataSF) — future batches
