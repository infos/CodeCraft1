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
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```