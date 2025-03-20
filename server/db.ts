import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

// Configure WebSocket for Neon's serverless driver
neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  console.error("Database connection error: DATABASE_URL environment variable is not set");
  if (process.env.NODE_ENV === 'production') {
    throw new Error("DATABASE_URL environment variable is required for production");
  }
  // In development, we'll exit
  process.exit(1);
}

// Create connection pool with proper SSL configuration for both dev and prod
export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: true, // Required for Neon database
    maxVersion: "TLSv1.3",    // Use latest TLS version
  },
  connectionTimeoutMillis: 5000, // Add timeout
  max: process.env.NODE_ENV === 'production' ? 50 : 20 // Increase pool size for production
});

// Initialize Drizzle ORM with the pool
export const db = drizzle(pool, { schema });

// Add error handler for the pool
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Add connection status check
pool.on('connect', () => {
  console.log('Connected to database successfully');
});