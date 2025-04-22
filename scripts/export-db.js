// Import necessary modules
import { Pool, neonConfig } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import ws from 'ws';

// Configure WebSocket for Neon
neonConfig.webSocketConstructor = ws;

// Get the directory name from the current module's URL
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use DATABASE_URL from environment
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('DATABASE_URL environment variable is not set');
  process.exit(1);
}

// Connect to the database
const pool = new Pool({ connectionString });

// Export tables
async function exportDatabase() {
  try {
    console.log('Starting database export...');
    console.log(`Using connection: ${connectionString.split('@')[1]}`); // Only show host part for security
    
    // Ensure the export directory exists
    const exportDir = path.join(__dirname, '../data/exported');
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir, { recursive: true });
    }
    
    // Export each table
    const tables = ['eras', 'emperors', 'tours', 'itineraries', 'hotel_recommendations'];
    
    for (const table of tables) {
      console.log(`Exporting ${table}...`);
      
      try {
        // Query all data from the table
        const result = await pool.query(`SELECT * FROM ${table}`);
        const data = result.rows;
        
        // Write data to file
        const filePath = path.join(exportDir, `${table}.json`);
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        
        console.log(`Exported ${data.length} records to ${filePath}`);
      } catch (tableError) {
        console.error(`Error exporting table ${table}:`, tableError.message);
      }
    }
    
    console.log('Database export complete!');
    await pool.end();
    
  } catch (error) {
    console.error('Error exporting database:', error);
    if (pool) {
      await pool.end();
    }
    process.exit(1);
  }
}

// Run the export
exportDatabase();