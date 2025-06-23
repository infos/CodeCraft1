# Replit.md

## Overview

This is a full-stack web application for historical tours and emperors, featuring a React frontend with Express backend and PostgreSQL database. The application allows users to explore historical eras, emperors, and tours with detailed information and itineraries.

## System Architecture

The application follows a modern full-stack architecture:

- **Frontend**: React with TypeScript using Vite for bundling
- **Backend**: Express.js server with TypeScript 
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Build System**: Vite for frontend, esbuild for backend bundling
- **Deployment**: Configured for Replit with autoscale deployment

## Key Components

### Frontend Architecture
- **Client Directory Structure**: `/client/src/`
- **Components**: Reusable UI components in `/client/src/components/`
- **Pages**: Route-based page components
- **Styling**: Custom theme with professional variant using Tailwind CSS
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for lightweight routing

### Backend Architecture
- **Server Directory**: `/server/`
- **Database Layer**: Drizzle ORM with connection pooling
- **API Routes**: RESTful endpoints for emperors, tours, eras, and itineraries
- **Storage Pattern**: Abstract storage interface with database implementation

### Database Schema
The application uses four main entities:
- **Eras**: Historical periods with date ranges and key figures
- **Emperors**: Historical rulers with biographical information
- **Tours**: Travel packages for historical sites
- **Itineraries**: Day-by-day tour schedules
- **Hotel Recommendations**: Accommodation suggestions for tours

## Data Flow

1. **Client requests** are routed through Express middleware
2. **API endpoints** in `/server/routes.ts` handle business logic
3. **Storage layer** (`/server/storage.ts`) abstracts database operations
4. **Database queries** executed via Drizzle ORM with type safety
5. **Responses** return structured JSON data to React components
6. **Frontend state** managed by TanStack Query with caching

## External Dependencies

### Core Technologies
- **Database**: Neon PostgreSQL serverless database
- **ORM**: Drizzle with PostgreSQL adapter
- **UI Framework**: React 18 with TypeScript
- **Component Library**: Radix UI primitives with shadcn/ui
- **Styling**: Tailwind CSS with custom theme

### Development Tools
- **Build Tools**: Vite, esbuild, TypeScript compiler
- **Development Server**: tsx for TypeScript execution
- **Database Tools**: Drizzle Kit for migrations and schema management

## Deployment Strategy

The application is configured for Replit deployment with:
- **Build Process**: Frontend built to `/dist/public`, backend bundled to `/dist`
- **Production Server**: Node.js serving bundled application
- **Database**: Neon PostgreSQL with SSL configuration
- **Static Assets**: Served from build output directory
- **Environment**: Production/development environment detection

### Development Workflow
- **Development**: `npm run dev` starts both frontend and backend with hot reload
- **Build**: `npm run build` creates production-ready bundles
- **Database**: `npm run db:push` applies schema changes

### Replit Configuration
- **Modules**: Node.js 20, PostgreSQL 16, bash, web
- **Ports**: Application runs on port 5000, exposed on port 80
- **Workflows**: Automated setup and start processes

## Changelog

Changelog:
- June 23, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.