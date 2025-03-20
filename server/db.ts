import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

// Configure WebSocket for Neon's serverless driver
neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  console.error("Database connection error: DATABASE_URL environment variable is not set");
  console.error("Please add DATABASE_URL to your deployment secrets");
  process.exit(1);
}

// Create connection pool with proper SSL configuration
export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: true, // Ensure SSL certificate validation
    maxVersion: "TLSv1.3",    // Use latest TLS version
  },
  connectionTimeoutMillis: 5000, // Add timeout
  max: 20 // Maximum number of clients in the pool
});

// Initialize Drizzle ORM with the pool
export const db = drizzle(pool, { schema });

// Add error handler for the pool
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});