// Import necessary modules
import { Pool } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name from the current module's URL
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to the database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// Export tables
async function exportDatabase() {
  try {
    console.log('Starting database export...');
    
    // Ensure the export directory exists
    const exportDir = path.join(__dirname, '../data/exported');
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir, { recursive: true });
    }
    
    // Export each table
    const tables = ['eras', 'emperors', 'tours', 'itineraries', 'hotel_recommendations'];
    
    for (const table of tables) {
      console.log(`Exporting ${table}...`);
      
      // Query all data from the table
      const result = await pool.query(`SELECT * FROM ${table}`);
      const data = result.rows;
      
      // Write data to file
      const filePath = path.join(exportDir, `${table}.json`);
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      
      console.log(`Exported ${data.length} records to ${filePath}`);
    }
    
    console.log('Database export complete!');
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('Error exporting database:', error);
    process.exit(1);
  }
}

// Run the export
exportDatabase();