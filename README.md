# LocallySF.com

A comprehensive local directory for San Francisco and the Bay Area. "The Yellow Pages of Humanity" - discover the best restaurants, cafes, bars, shopping, attractions, and services with real photos, reviews, and local insights.

## 🌟 Features

- **Real Data**: 300+ places sourced from Google Places API
- **6 Categories**: Restaurants, Cafes, Bars, Shopping, Attractions, Services
- **Neighborhood-Based**: Browse by SF neighborhoods
- **Rich Content**: Real photos, reviews, and business details
- **Mobile-First**: Responsive design optimized for mobile
- **SEO Optimized**: AI-ready with llms.txt and comprehensive metadata

## 🏗️ Tech Stack

- **Framework**: Next.js 16 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Data**: Google Places API integration
- **Fonts**: Inter + Playfair Display
- **Deployment**: Static site generation (SSG)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Navigate to the project
cd locallysf

# Install dependencies
npm install

# Start development server
npm run dev
```

The site will be available at `http://localhost:3000`.

### Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Type check
npm run type-check

# Fetch new data from Google Places
npm run fetch-data

# Convert raw data to TypeScript format
npm run convert-data

# Update both data and convert (full refresh)
npm run update-data
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── [category]/        # Category pages (restaurants, cafes, etc.)
│   ├── place/[slug]/      # Individual place detail pages  
│   ├── about/             # About page
│   ├── layout.tsx         # Root layout with fonts and metadata
│   ├── page.tsx           # Homepage
│   ├── globals.css        # Global styles and design tokens
│   └── sitemap.ts         # Dynamic sitemap generation
├── components/            # Reusable React components
│   ├── Navigation.tsx     # Header navigation
│   ├── Footer.tsx         # Footer component
│   ├── PlaceCard.tsx      # Place listing cards
│   └── LoadingCard.tsx    # Loading state components
├── data/                  # Data types and generated data
│   ├── places.ts          # TypeScript interfaces
│   └── placesData.ts      # Generated places data (328 places)
scripts/                   # Data management scripts
├── fetch-sf-data.mjs     # Fetch from Google Places API
└── convert-data.mjs      # Convert to TypeScript format
public/                    # Static assets
├── robots.txt            # Search engine directives
└── llms.txt              # AI/LLM indexing information
```

## 🎨 Design System

### Colors
- **Primary**: Deep blue (#0A1628) - hero backgrounds, dark sections
- **Accent**: Golden orange (#E8A838) - highlights, stars, CTAs  
- **White**: #FFFFFF - card backgrounds
- **Cream**: #FAF7F2 - alternate section backgrounds
- **Text**: #1a1a2e (dark) / #6b7280 (muted)

### Typography
- **Display**: Playfair Display for editorial headings
- **Body**: Inter for body text and UI elements

### Components
- **Card radius**: 16px for cards, 12px for buttons
- **Section spacing**: 80-100px between major sections
- **Responsive**: Mobile-first design with fluid typography

## 📊 Data Overview

### Places by Category
- **Restaurants**: 118 places (Chinese, Mexican, Italian, Japanese, Brunch)
- **Cafes**: 24 places (Coffee shops, specialty cafes)  
- **Bars**: 35 places (Cocktail bars, breweries)
- **Shopping**: 40 places (Union Square, vintage shops)
- **Attractions**: 51 places (Museums, parks, tourist attractions)
- **Services**: 60 places (Gyms, spas, salons)

### Data Sources
All business data is sourced from Google Places API including:
- Business details (name, address, phone, website)
- Photos and image galleries
- Customer reviews and ratings
- Hours of operation
- Price levels

## 🔄 Data Management

### Updating Place Data

1. **Fetch new data** (takes 5-10 minutes due to rate limiting):
   ```bash
   npm run fetch-data
   ```

2. **Convert to TypeScript format**:
   ```bash
   npm run convert-data
   ```

3. **Rebuild site with new data**:
   ```bash
   npm run build
   ```

### Google Places API Setup

The project uses Google Places API with the following endpoints:
- **Text Search**: Find places by query and location
- **Place Photos**: Retrieve high-quality place images  
- **Place Details**: Get comprehensive business information

API key is configured in `scripts/fetch-sf-data.mjs`.

## 🔍 SEO & AI Optimization

- **Metadata**: Complete Open Graph and Twitter Card support
- **JSON-LD**: Structured data for local businesses
- **Sitemap**: Dynamic sitemap with 300+ pages
- **AI-Ready**: `/robots.txt` and `/llms.txt` for AI crawling
- **Performance**: Static generation for optimal loading

## 📱 Pages

### Homepage (`/`)
- Hero section with San Francisco skyline
- Featured places showcase  
- Category browsing grid
- Top-rated places list
- Neighborhood exploration
- Newsletter signup

### Category Pages (`/[category]`)
- Category-specific hero images
- Filter and sorting options
- Place grid with cards
- Breadcrumb navigation

### Place Detail Pages (`/place/[slug]`)
- Photo gallery with lightbox
- Complete business information
- Customer reviews showcase
- Nearby places recommendations
- Contact actions (call, website, maps)

### About Page (`/about`)
- Mission and vision
- Coverage areas and categories
- How the platform works
- Contact information

## 🚀 Deployment

The site is optimized for static hosting platforms:

- **Vercel**: Deploy directly from Git repository
- **Netlify**: Drag and drop the `out/` folder after `npm run build`
- **AWS S3 + CloudFront**: Upload static files
- **GitHub Pages**: Enable Pages in repository settings

## 📝 License

This project is private and confidential. All rights reserved.

---

Built with ❤️ in San Francisco. LocallySF - Discover San Francisco's Best.