# Historical Tourism App - Replit Guide

## Overview

This is a full-stack historical tourism application that showcases ancient rulers, civilizations, and travel tours through interactive timelines and detailed information pages. The application combines historical data about emperors, eras, and tours with a modern React frontend and Express.js backend.

## System Architecture

### Frontend Architecture
- **React 18** with TypeScript for the user interface
- **Vite** as the build tool and development server
- **Tailwind CSS** with **shadcn/ui** components for styling
- **Wouter** for client-side routing (lightweight React Router alternative)
- **TanStack Query** for server state management and caching
- **React Hook Form** with Zod validation for form handling

### Backend Architecture
- **Express.js** server with TypeScript
- **RESTful API** design with endpoints for emperors, tours, itineraries, and hotel recommendations
- **Drizzle ORM** for database operations and type-safe queries
- **PostgreSQL** database (configured for Neon serverless)
- **Modular storage layer** with interface-based design for easy testing

### Database Design
The application uses a relational database with the following main entities:
- **Eras**: Historical periods (Ancient Rome, Ancient Egypt, etc.)
- **Emperors**: Historical rulers with biographical information
- **Tours**: Travel packages themed around historical periods
- **Itineraries**: Day-by-day tour schedules
- **Hotel Recommendations**: Accommodations for each tour

## Key Components

### Data Models
- All database schemas are defined in `shared/schema.ts` using Drizzle ORM
- TypeScript interfaces ensure type safety across frontend and backend
- Historical data includes rulers from various civilizations (Mesopotamian, Egyptian, Greek, Roman)

### API Layer
- RESTful endpoints in `server/routes.ts`
- Standardized error handling and logging
- Storage abstraction layer in `server/storage.ts` for database operations

### Frontend Components
- Timeline visualization for historical rulers
- Era-based filtering and navigation
- Tour detail pages with itineraries and hotel recommendations
- Responsive design using Tailwind CSS

### Data Import/Export
- Scripts for importing historical data from various sources
- Database export functionality for backup and migration
- JSON data files for initial seeding

## Data Flow

1. **Client Request**: User navigates to emperor/tour pages
2. **API Call**: Frontend makes request to Express server
3. **Database Query**: Server uses Drizzle ORM to query PostgreSQL
4. **Data Processing**: Server transforms and validates data
5. **Response**: JSON data sent back to client
6. **UI Update**: React components re-render with new data
7. **Caching**: TanStack Query caches responses for performance

## External Dependencies

### Database
- **Neon PostgreSQL**: Serverless PostgreSQL database
- **Drizzle Kit**: Database migrations and schema management
- Connection configured for both development and production environments

### UI Libraries
- **Radix UI**: Accessible component primitives
- **Lucide React**: Icon library
- **shadcn/ui**: Pre-built component system
- **Tailwind CSS**: Utility-first CSS framework

### Development Tools
- **TypeScript**: Type safety across the stack
- **ESBuild**: Fast JavaScript bundler for production
- **tsx**: TypeScript execution for development

## Deployment Strategy

### Build Process
- Frontend: Vite builds React app to `dist/public`
- Backend: ESBuild bundles server code to `dist/index.js`
- Single deployment artifact with static files served by Express

### Environment Configuration
- Database connection via `DATABASE_URL` environment variable
- SSL configuration for production database connections
- Development vs. production mode detection

### Production Considerations
- Connection pooling with error handling
- Graceful error handling and logging
- Static file serving for the built React app

## Changelog

```
Changelog:
- June 30, 2025. Initial setup
- January 1, 2025. Implemented advanced filtering system with historical period, era, and location filtering. Era filtering takes priority over period filtering for more precise results. All three filter sections now work together with proper enable/disable states and visual feedback.
- January 1, 2025. Replaced OpenAI tour generation with comprehensive local tour templates covering 9 major civilizations: Ancient Egypt, Ancient Rome, Ancient Greece, Ancient China, Ancient India, Maya Civilization, Inca Empire, Viking Age, and Celtic Civilization. Each includes authentic historical sites, real hotels, and detailed itineraries.
- January 2, 2025. Updated tour system to eliminate duplicates and implement duration selection dropdowns. Tours now display as unique entries with 3, 5, 7, and 10-day duration options. Itineraries update dynamically based on selected duration. Hidden "Related tours" section for cleaner interface.
- January 2, 2025. Enhanced BuildTourCopy page with era gallery positioned below historical periods filter. Added scrollable era tiles with detailed information. Implemented smooth transitions and scroll position reset when switching periods.
- January 2, 2025. Improved UI design: reduced historical periods font size, added icons to period filters, simplified Ancient Civilizations era names to country format (Egypt, Mesopotamia, Greece, Rome).
- January 2, 2025. Removed Prehistoric historical period. Navigation now starts with Ancient Civilizations as the default period.
- January 2, 2025. Integrated Google Gemini AI for era image generation. Added API endpoints and UI controls to generate historically accurate images for era tiles using Gemini's image generation capabilities.
- January 2, 2025. Enhanced AI image system with database storage. Added era_images table to store generated images with metadata for improved performance and persistence. Images are now saved to PostgreSQL database and loaded automatically on page load.
- January 3, 2025. Added Heritage Hero page with date/duration selector component. Created new /hero route with responsive design featuring heritage-themed background and search controls for tour customization.
- January 3, 2025. Enhanced Heritage Hero page with filters sidebar and updated design. Added terra color theme (#A84C32), filters for Era/Region/Duration, and improved layout with Marcus Aurelius-themed messaging. Created heritage-themed SVG background with ancient columns.
- January 3, 2025. Integrated Gemini AI for Marcus Aurelius era video/image generation. Added dynamic background that generates cinematic Marcus Aurelius era scenes using Gemini's image generation API. The Hero component now automatically generates historically accurate visuals of the philosopher emperor's reign on page load.
- January 3, 2025. Removed Heritage Hero page per user request. Cleaned up /hero route and HeroPage.tsx file from the application.
- January 3, 2025. Recreated tour builder page with Apple Store-inspired design. Implemented clean minimalist layout, hero section with large typography, navigation pills, product-style era cards with hover effects, star ratings, and elegant spacing following Apple's design language.
- January 3, 2025. Restructured tour builder layout based on Apple Store design: moved historical periods to dropdown filter at top header, changed body to show historical eras as compact filter buttons, and displayed tours with images below in Apple product card style.
- January 10, 2025. Updated tour builder to match historical tours page exactly. Replaced grouped historical periods with individual era chip filters (Ancient Near Eastern, Ancient Egypt, etc.) using same format and year ranges as historical tours page.
- January 10, 2025. Removed Heritage Hero page from navigation and application per user request. Cleaned up all references to /hero route.
- January 10, 2025. Implemented multi-select functionality for historical period chips. Users can now select multiple eras simultaneously with visual feedback.
- January 10, 2025. Added Apple Store-inspired header filters with historical periods (Ancient Times, Classical Period, Medieval Period, Renaissance, Modern Era). Filters dynamically show/hide era chips based on time periods with intelligent year-range filtering.
- January 10, 2025. Moved historical eras filter chips from header to main page body for better organization. Header now contains only broad historical period filters while specific era chips appear below the hero section with dynamic section titles.
- January 10, 2025. Added tooltips to historical period buttons showing timeline ranges. Removed "Tour Builder" title for cleaner header and moved Generate Images button below Historical Eras section for better user flow.
- January 10, 2025. Removed "Modern Era" option from historical periods filter and "Clear All" button from header. Enhanced Generate Images functionality to generate AI images for tours instead of eras using Gemini API. Added /api/generate-tour-images endpoint for tour-specific image generation.
- January 10, 2025. Updated tour detail page design to match Apple iPhone 16 Pro page layout with clean white background, Apple-style duration selection cards, pricing display similar to storage options, and card-based itinerary layout. Enhanced tour cards with Apple product design patterns including rounded corners, hover effects, and Apple-style pricing with monthly payment options.
- January 10, 2025. Added timeline tooltips to historical era chips showing specific year ranges (e.g., "Ancient Egypt: 3100 BCE - 30 BCE", "Ancient Rome: 753 BCE - 476 CE"). Users can now hover over era chips to see the exact historical timeframe for each civilization.
- January 11, 2025. Implemented comprehensive tour image database storage system. Added tour_images table with full CRUD operations. Updated image generation endpoints to check database first before generating new images. Tour builder and detail pages now load existing images from database and cache new generations for improved performance and cost efficiency.
- January 12, 2025. Hid historical tours page from navigation and renamed tour builder copy page to "Heritage Tours". Updated routing to make Heritage Tours the main landing page with simplified navigation focused on the core tour building experience.
- January 15, 2025. Restricted AI image generation to home page only per user request. Removed AI video and image generation from tour detail pages. Tour content now exclusively uses real images from Wikimedia Commons and hotel websites with proper attribution. Enhanced hotel cards with authentic images, amenities, and detailed itinerary information including visit durations and admission prices.
- January 15, 2025. **CHECKPOINT SAVED**: Updated main heading to "Choose an Era to Generate Tours". Added location filter functionality under Eras section showing unique destinations like "Rome, Italy", "Cairo, Egypt" with multi-select capability. Fixed database schema by adding location and description columns to hotel_recommendations table. Started AI generation of 5 missing historical era tours (Byzantine, Neo-Babylonian, Parthian Empire, Renaissance, Age of Exploration) using Gemini API. Location filter appears when users select eras and allows filtering tours by specific destinations. All tours maintain 100% image coverage with AI-generated era images prioritized on home page.
- January 15, 2025. **NAVIGATION RESTORED**: Unhidden all pages and added comprehensive navigation bar. Restored access to Historical Tours, Eras & Emperors, Emperors, Timeline, and All Tours pages with clean header design, active page highlighting, and responsive layout.
- January 15, 2025. **HISTORICAL VALIDATION**: Validated historical periods and eras consistency between Tour Builder and Historical Tours pages. Updated period categorization: Medieval Period extended to 1500 CE, Renaissance adjusted to 1300-1650 CE, added Early Modern period (1650-1800 CE). Fixed chronological accuracy and improved era filtering logic based on historically accurate date ranges.
- January 15, 2025. **FILTERING CONSISTENCY FIX**: Fixed era filtering logic in Tour Builder to exactly match Historical Tours page categorization. Medieval period now correctly shows only Byzantine, Medieval Europe, Sasanian Empire, and Silk Road Trade Era. Renaissance and Age of Exploration moved to appropriate Renaissance and Early Modern periods respectively.
- January 17, 2025. **TIMELINE TOURS PAGE CREATED**: Built new HistoricalTimelineTours page inspired by Dribbble timeline designs. Features search bar in header, periods sidebar on right, visual timeline with historical periods (Ancient Times, Classical Period, Medieval, Renaissance, Early Modern, Modern Era), era selection cards, location filtering, and tours grid. Added comprehensive Renaissance tour templates to tour generation system. Page accessible via /timeline-tours route with full navigation integration.
- January 17, 2025. **NAVIGATION SIMPLIFIED**: Hidden Eras & Emperors, Emperors, Timeline, and All Tours pages from navigation. Navigation now shows only core pages: Tour Builder, Timeline Tours, and Historical Tours for streamlined user experience.
- January 18, 2025. **GEMINI AI TOUR GENERATION**: Implemented Google Gemini AI for authentic tour generation on Timeline Tours page. Tours are now generated with historical accuracy, detailed itineraries, and real locations based on selected civilizations. Added fallback system to local tour templates if Gemini fails. Fixed tour detail page error handling and improved hotel recommendations display.
- January 18, 2025. **COMPLETE AI IMAGE DATABASE**: Successfully saved all 21 tour images to PostgreSQL database with 100% Gemini AI coverage. Replaced all real images with AI-generated content for visual consistency. Fixed API endpoint issues and database constraints. All tour tiles now display professional, historically accurate AI-generated images with proper attribution stored permanently in the database.
- January 21, 2025. **TOUR CONTENT EXPANSION**: Created comprehensive tour collections for Renaissance (6 tours) and Early Modern periods (6 tours) to ensure minimum 5 tours per historical period. Renaissance tours cover Florence, Italian cities, Venice, Rome Vatican, French châteaux, and Northern Renaissance. Early Modern tours include Enlightenment Paris, Colonial America, Dutch Golden Age, Imperial Russia, Baroque Vienna, and Scientific Revolution. All tours include detailed itineraries and luxury hotel recommendations.
- January 21, 2025. **EARLY MODERN FILTERING FIX**: Fixed Early Modern tour display issue by updating tour era classification from "Early Modern" to "Enlightenment" and enhanced filtering logic to recognize enlightenment, colonial, scientific revolution, and baroque terms. All 7 Early Modern/Enlightenment tours now display correctly when Early Modern period is selected in Timeline Tours page.
- January 21, 2025. **TOUR THUMBNAILS COMPLETED**: Generated missing thumbnail images for all tours using Gemini AI. Created images for 11 tours (6 Renaissance + 5 Early Modern). All 33 tours now have complete thumbnail coverage for homepage display with AI-generated images stored in database.
- January 21, 2025. **CLEAR PERIOD BUTTON REMOVED**: Removed "Clear Period" button from Timeline Tours page historical periods filter. Users can now click on selected period buttons to deselect them directly, providing cleaner interface without separate clear button.
- January 21, 2025. **DESTINATION FILTERING FIX**: Fixed destination filter logic to properly work with historical period selection. Destinations now correctly filter when Classical or any other period is selected, showing only relevant locations from tours of that period.
- January 21, 2025. **UI TEXT UPDATE**: Updated destination filter title from "Filter by Destination" to "Destinations" for cleaner, more concise labeling.
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```