import { drizzle } from 'drizzle-orm/neon-serverless';
import { eras, emperors, tours, itineraries, hotelRecommendations } from '../shared/schema';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Pool } from '@neondatabase/serverless';

// Get the directory name from the current module's URL
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to the database
const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL 
});
const db = drizzle(pool, { schema: { eras, emperors, tours, itineraries, hotelRecommendations } });

async function exportTable(tableName: string, query: any) {
  console.log(`Exporting ${tableName}...`);
  const data = await query;
  
  // Create the export directory if it doesn't exist
  const exportDir = path.join(__dirname, '../data/exported');
  if (!fs.existsSync(exportDir)) {
    fs.mkdirSync(exportDir, { recursive: true });
  }
  
  const filePath = path.join(exportDir, `${tableName}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`Exported ${data.length} records to ${filePath}`);
}

async function exportDatabase() {
  try {
    console.log('Starting database export...');
    
    await exportTable('eras', db.select().from(eras));
    await exportTable('emperors', db.select().from(emperors));
    await exportTable('tours', db.select().from(tours));
    await exportTable('itineraries', db.select().from(itineraries));
    await exportTable('hotelRecommendations', db.select().from(hotelRecommendations));
    
    console.log('Database export complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error exporting database:', error);
    process.exit(1);
  }
}

exportDatabase();