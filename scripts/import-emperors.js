// Import emperors from the document into the database
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import * as dotenv from 'dotenv';

// Configure Neon database connection
dotenv.config();

// Configure WebSocket for Neon
neonConfig.webSocketConstructor = ws;

async function importEmperors() {
  // Connect to the database
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  try {
    console.log('Connected to database');
    
    // Add the Mesopotamian rulers from the document
    const mesopotamianEmperors = [
      {
        name: 'Sumu-Abum',
        era: 'Old Babylonian Period',
        startYear: -1894,
        endYear: -1881,
        description: 'Amorite chieftain credited with establishing the first dynasty of Babylon around 1894 BC. ' +
                    'He initiated the expansion of Babylonian territory by conquering the cities of Dilbat and Kish, ' +
                    'and began construction of a wall around Babylon.',
        achievements: 'Founded the first dynasty of Babylon; Conquered Dilbat and Kish; Began fortification of Babylon',
        locations: ['Babylon', 'Dilbat', 'Kish'],
        region: 'Mesopotamia',
        dynasty: 'First Babylonian Dynasty (Amorite)',
        modernCountry: 'Iraq',
        wikipediaUrl: 'https://en.wikipedia.org/wiki/Sumu-abum'
      },
      {
        name: 'Sumu-la-ilu',
        era: 'Old Babylonian Period',
        startYear: -1880,
        endYear: -1845,
        description: 'Successor of Sumu-Abum who continued to expand Babylonian influence in the region. ' +
                    'He completed the construction of the wall around Babylon and strengthened the city with large fortifications.',
        achievements: 'Completed the wall around Babylon; Enhanced the city\'s fortifications; Expanded Babylonian territory',
        locations: ['Babylon'],
        region: 'Mesopotamia',
        dynasty: 'First Babylonian Dynasty (Amorite)',
        modernCountry: 'Iraq',
        wikipediaUrl: 'https://en.wikipedia.org/wiki/Sumu-la-El'
      },
      {
        name: 'Hammurabi',
        era: 'Old Babylonian Period',
        startYear: -1792,
        endYear: -1750,
        description: 'The sixth king of the first Babylonian dynasty and one of the most famous rulers of antiquity. ' +
                    'He transformed Babylon from a relatively prosperous city-state into a major regional power through ' +
                    'sustained military campaigns. Known for creating one of the first written legal codes.',
        achievements: 'Created the Code of Hammurabi; United Northern and Southern Babylonia; ' +
                     'Expanded the empire to include most of Mesopotamia; Implemented sophisticated administrative systems',
        locations: ['Babylon', 'Sippar', 'Kish', 'Nippur', 'Larsa', 'Mari'],
        region: 'Mesopotamia',
        dynasty: 'First Babylonian Dynasty (Amorite)',
        modernCountry: 'Iraq',
        wikipediaUrl: 'https://en.wikipedia.org/wiki/Hammurabi'
      },
      {
        name: 'Nebuchadnezzar II',
        era: 'Neo-Babylonian Empire',
        startYear: -605,
        endYear: -562,
        description: 'The most renowned king of the Neo-Babylonian Empire. His reign was characterized by extensive ' +
                     'military campaigns that expanded Babylonian control over former Assyrian territories. ' +
                     'He is famous for his conquest of Jerusalem and the subsequent Babylonian Exile of the Jews.',
        achievements: 'Conquered Jerusalem in 597 BCE and 586 BCE; ' +
                     'Constructed the Hanging Gardens of Babylon (one of the Seven Wonders of the Ancient World); ' +
                     'Rebuilt much of Babylon including the Ishtar Gate; ' +
                     'Expanded the Neo-Babylonian Empire to its greatest extent',
        locations: ['Babylon', 'Jerusalem', 'Syria', 'Lebanon'],
        region: 'Mesopotamia',
        dynasty: 'Neo-Babylonian / Chaldean',
        modernCountry: 'Iraq',
        wikipediaUrl: 'https://en.wikipedia.org/wiki/Nebuchadnezzar_II'
      }
    ];
    
    // Add Egyptian Pharaohs
    const egyptianPharaohs = [
      {
        name: 'Mentuhotep II',
        era: 'Middle Kingdom',
        startYear: -2004,
        endYear: -1992,
        description: 'Often regarded as the founder of the Middle Kingdom, he solidified the reunification ' +
                    'of Egypt and firmly established the Eleventh Dynasty as the ruling power. ' +
                    'He made Thebes the capital of Egypt, shifting the political and religious center of the country.',
        achievements: 'Reunified Egypt after the First Intermediate Period; ' +
                     'Established Thebes as the capital; ' +
                     'Revived the cult of the pharaoh as a god; ' +
                     'Commissioned major building projects including his mortuary complex at Deir el-Bahari',
        locations: ['Thebes', 'Deir el-Bahari'],
        region: 'Egypt',
        dynasty: 'Eleventh Dynasty',
        modernCountry: 'Egypt',
        wikipediaUrl: 'https://en.wikipedia.org/wiki/Mentuhotep_II'
      },
      {
        name: 'Ramesses II',
        era: 'New Kingdom',
        startYear: -1279,
        endYear: -1213,
        description: 'Also known as Ramesses the Great, he was the third pharaoh of the Nineteenth Dynasty of Egypt. ' +
                     'He is often regarded as the most powerful and celebrated pharaoh of the New Kingdom, ' +
                     'which was the most powerful period of Ancient Egypt. His reign was marked by military campaigns ' +
                     'in the Levant and Nubia, as well as an unprecedented building program throughout Egypt.',
        achievements: 'Fought the Battle of Kadesh against the Hittites and later signed one of the first recorded peace treaties; ' +
                     'Built numerous monuments including Abu Simbel temples, the Ramesseum, and additions to Karnak and Luxor temples; ' +
                     'Fathered over 100 children with his various wives; ' +
                     'Reigned for 66 years, the second longest reign in Egyptian history',
        locations: ['Pi-Ramesses', 'Thebes', 'Abu Simbel', 'Karnak', 'Luxor'],
        region: 'Egypt',
        dynasty: 'Nineteenth Dynasty',
        modernCountry: 'Egypt',
        wikipediaUrl: 'https://en.wikipedia.org/wiki/Ramesses_II'
      }
    ];
    
    // Roman Emperors
    const romanEmperors = [
      {
        name: 'Augustus',
        era: 'Roman Empire',
        startYear: -27,
        endYear: 14,
        description: 'Born Gaius Octavius, he was the first Roman Emperor, who transformed the Roman Republic ' +
                     'into the Roman Empire. He came to power after the assassination of his great-uncle and adoptive father ' +
                     'Julius Caesar. Through a series of alliances, civil wars, and political maneuvers, he solidified his position ' +
                     'as the undisputed ruler of Rome, though he maintained the facade of republican government.',
        achievements: 'Established the Pax Romana (Roman Peace) that lasted for nearly two centuries; ' +
                     'Reformed the Roman taxation system and expanded the empire; ' +
                     'Rebuilt much of Rome and famously said he "found Rome a city of brick and left it a city of marble"; ' +
                     'Created a professional standing army and established the Praetorian Guard',
        locations: ['Rome', 'Alexandria', 'Athens'],
        region: 'Roman Empire',
        dynasty: 'Julio-Claudian',
        modernCountry: 'Italy',
        wikipediaUrl: 'https://en.wikipedia.org/wiki/Augustus'
      },
      {
        name: 'Constantine the Great',
        era: 'Late Roman Empire',
        startYear: 306,
        endYear: 337,
        description: 'Constantine I, also known as Constantine the Great, was a Roman Emperor who ruled during the early 4th century. ' +
                     'He is most famous for being the first Roman Emperor to convert to Christianity and for founding Constantinople ' +
                     '(modern-day Istanbul), which became the capital of the Eastern Roman Empire for over 1,000 years.',
        achievements: 'Issued the Edict of Milan in 313 CE, which proclaimed religious tolerance throughout the empire; ' +
                     'Founded Constantinople (now Istanbul) as a new imperial capital; ' +
                     'Convened the First Council of Nicaea in 325 CE, which established the Nicene Creed; ' +
                     'Reformed the currency system and reorganized the army and civil administration',
        locations: ['Rome', 'Constantinople', 'Nicaea'],
        region: 'Roman Empire',
        dynasty: 'Constantinian',
        modernCountry: 'Italy/Turkey',
        wikipediaUrl: 'https://en.wikipedia.org/wiki/Constantine_the_Great'
      }
    ];
    
    const allEmperors = [...mesopotamianEmperors, ...egyptianPharaohs, ...romanEmperors];
    
    // Insert emperors into the database
    for (const emperor of allEmperors) {
      console.log(`Adding emperor: ${emperor.name}`);
      
      const query = `
        INSERT INTO emperors 
        (name, era, start_year, end_year, description, achievements, locations, region, dynasty, modern_country, wikipedia_url, image_url) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        ON CONFLICT (name) DO UPDATE SET
          era = $2,
          start_year = $3,
          end_year = $4,
          description = $5,
          achievements = $6,
          locations = $7,
          region = $8,
          dynasty = $9,
          modern_country = $10,
          wikipedia_url = $11
        RETURNING id;
      `;
      
      const values = [
        emperor.name,
        emperor.era,
        emperor.startYear,
        emperor.endYear,
        emperor.description,
        emperor.achievements,
        emperor.locations,
        emperor.region,
        emperor.dynasty,
        emperor.modernCountry,
        emperor.wikipediaUrl,
        emperor.imageUrl || null  // Use provided imageUrl or null if not available
      ];
      
      try {
        const result = await pool.query(query, values);
        console.log(`Added/updated emperor ${emperor.name} with ID: ${result.rows[0].id}`);
      } catch (error) {
        console.error(`Error adding emperor ${emperor.name}:`, error);
      }
    }
    
    console.log('Emperor import complete!');
    
  } catch (error) {
    console.error('Error during import:', error);
  } finally {
    await pool.end();
  }
}

// Call the function to import emperors
importEmperors().catch(console.error);

// Export the function for potential reuse
export default importEmperors;