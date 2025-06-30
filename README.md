# Historical Tours Application

A dynamic web application for exploring historical eras, emperors, and educational tours through different time periods. Built with modern TypeScript, React, and PostgreSQL.

## Features

### 🏛️ Era Exploration
- Interactive era preference selector
- Browse historical periods from Ancient Mesopotamia to the Enlightenment
- Filter content by selected eras

### 👑 Emperor Timeline
- Comprehensive timeline of 69+ historical rulers
- Detailed emperor profiles with biographical information
- Era-based filtering for focused exploration
- Interactive emperor cards with achievements and locations

### 🗺️ Historical Tours
- 21+ curated educational tour packages
- Detailed itineraries with day-by-day schedules
- Hotel recommendations for each tour
- Pricing and duration information
- Tours spanning diverse historical periods and regions

### 🎯 User Experience
- Clean, responsive design built with shadcn/ui
- Mobile-first approach with Tailwind CSS
- Intuitive navigation between eras, emperors, and tours
- Real-time filtering and search capabilities

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Wouter** for client-side routing
- **TanStack Query** for server state management
- **shadcn/ui** component library built on Radix UI
- **Tailwind CSS** for styling
- **Vite** for development and build tooling

### Backend
- **Node.js** with Express.js REST API
- **TypeScript** throughout the stack
- **Drizzle ORM** for type-safe database operations
- **PostgreSQL** with Neon serverless configuration

### Database Schema
- **Eras**: Historical periods with key figures and timeframes
- **Emperors**: Rulers with biographical data and achievements
- **Tours**: Educational packages with pricing and descriptions
- **Itineraries**: Day-by-day tour schedules
- **Hotel Recommendations**: Accommodations for each tour

## Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL database (Neon serverless recommended)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd historical-tours-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Copy and configure your database URL
cp .env.example .env
# Add your DATABASE_URL
```

4. Initialize the database:
```bash
npm run db:push
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## API Endpoints

### Eras
- `GET /api/eras` - List all historical eras
- `GET /api/eras/:id` - Get specific era details

### Emperors
- `GET /api/emperors` - List all emperors
- `GET /api/emperors/:id` - Get emperor profile

### Tours
- `GET /api/tours` - List all tour packages
- `GET /api/tours/:id` - Get tour details
- `GET /api/tours/:id/itineraries` - Get tour itinerary
- `GET /api/tours/:id/hotels` - Get hotel recommendations

## Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Route components
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/            # Utilities and configurations
├── server/                 # Express backend
│   ├── routes.ts          # API route definitions
│   ├── storage.ts         # Database abstraction layer
│   └── db.ts              # Database connection
├── shared/                 # Shared TypeScript types
│   └── schema.ts          # Drizzle database schema
└── data/                  # Sample data and exports
```

## Development

### Available Scripts
- `npm run dev` - Start development server (frontend + backend)
- `npm run build` - Build for production
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Drizzle Studio for database management

### Adding New Content

#### New Historical Era
1. Add era data to the database via API or direct insertion
2. Update era selector component if needed

#### New Emperor
1. Use the emperor creation API endpoint
2. Ensure proper era association

#### New Tour
1. Create tour via API
2. Add associated itineraries and hotel recommendations

## Database Management

The application uses Drizzle ORM with PostgreSQL. Database schema is defined in `shared/schema.ts` with full TypeScript support.

### Schema Updates
```bash
# Push schema changes to database
npm run db:push

# Generate migrations (if needed)
npm run db:generate
```

## Deployment

### Production Build
```bash
npm run build
```

### Environment Variables
- `DATABASE_URL` - PostgreSQL connection string
- `NODE_ENV` - Environment mode (development/production)

### Replit Deployment
This application is optimized for Replit Autoscale deployment:
1. Configure database connection
2. Set environment variables
3. Deploy via Replit's deployment interface

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Data Sources

This application contains educational content about historical figures and periods. Tour information is designed for educational purposes and includes historically accurate information about:

- Ancient civilizations and empires
- Notable rulers and their achievements
- Historical sites and their significance
- Cultural and architectural landmarks

## License

This project is open source and available under the MIT License.

## Support

For questions about setup, usage, or contributing to this project, please open an issue on GitHub.

---

Built with ❤️ for history enthusiasts and educational exploration.