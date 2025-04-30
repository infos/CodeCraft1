// Import tours from provided data into the database
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import * as dotenv from 'dotenv';

// Configure Neon database connection
dotenv.config();

// Configure WebSocket for Neon
neonConfig.webSocketConstructor = ws;

async function importTours() {
  // Connect to the database
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  try {
    console.log('Connected to database');
    
    const tours = [
      {
        "id": 7,
        "title": "The Rise of Rome",
        "description": "Experience the grandeur of ancient Rome. Visit iconic sites such as the Colosseum, Roman Forum, and Palatine Hill.",
        "duration": 7,
        "price": 2499,
        "locations": "Rome, Tivoli",
        "image_url": "https://www.louvre.fr/sites/default/files/styles/large/public/2021-06/rome-tour.jpg",
        "wikipedia_url": "https://en.wikipedia.org/wiki/Colosseum",
        "image_attribution": "Image courtesy of the Louvre Museum (Open Access)",
        "era": "Ancient Rome"
      },
      {
        "id": 8,
        "title": "Egyptian Pharaohs and Temples",
        "description": "Discover ancient Egyptian civilization. Explore the pyramids, Sphinx, and temples of Giza and Saqqara.",
        "duration": 6,
        "price": 2899,
        "locations": "Cairo, Giza, Saqqara",
        "image_url": "https://www.britishmuseum.org/sites/default/files/styles/scale_width/public/2021-03/egypt_tour.jpg",
        "wikipedia_url": "https://en.wikipedia.org/wiki/Great_Sphinx_of_Giza",
        "image_attribution": "Image courtesy of The British Museum (Open Access)",
        "era": "Ancient Egypt"
      },
      {
        "id": 9,
        "title": "Greek Myths and Legends",
        "description": "Journey through ancient Greece. Visit the Acropolis, Delphi, and other legendary sites that birthed Greek mythology.",
        "duration": 7,
        "price": 2699,
        "locations": "Athens, Delphi, Epidaurus, Nafplio",
        "image_url": "https://www.metmuseum.org/-/media/images/art/collection-landing/greek-myths.jpg",
        "wikipedia_url": "https://en.wikipedia.org/wiki/Parthenon",
        "image_attribution": "Image courtesy of The Metropolitan Museum of Art (Open Access)",
        "era": "Ancient Greece"
      },
      {
        "id": 10,
        "title": "Italy's Ancient Wonders",
        "description": "Journey through Italy's rich historical heritage, from Rome's imperial splendor to Florence's Renaissance treasures.",
        "duration": 8,
        "price": 2999,
        "locations": "Rome, Pompeii, Florence",
        "image_url": "https://www.louvre.fr/sites/default/files/styles/large/public/2021-06/rome-italy.jpg",
        "wikipedia_url": "https://en.wikipedia.org/wiki/Colosseum",
        "image_attribution": "Image courtesy of the Louvre Museum (Open Access)",
        "era": "Ancient Rome"
      },
      {
        "id": 11,
        "title": "Egypt and the Nile",
        "description": "Embark on an epic journey through ancient Egypt, from the pyramids of Giza to the temples of Luxor.",
        "duration": 8,
        "price": 3499,
        "locations": "Cairo, Luxor, Nubian Village",
        "image_url": "https://www.britishmuseum.org/sites/default/files/styles/scale_width/public/2021-01/nile-tour.jpg",
        "wikipedia_url": "https://en.wikipedia.org/wiki/Great_Sphinx_of_Giza",
        "image_attribution": "Image courtesy of The British Museum (Open Access)",
        "era": "Ancient Egypt"
      },
      {
        "id": 12,
        "title": "Mesopotamian Marvels Tour",
        "description": "Explore the birthplace of civilization through ancient Mesopotamian sites.",
        "duration": 7,
        "price": 2500,
        "locations": "Baghdad, Iraq",
        "image_url": "https://www.archaeology.org/images/ak/ak_meso.jpg",
        "wikipedia_url": "https://en.wikipedia.org/wiki/Babylon",
        "image_attribution": "Image courtesy of Archaeology Magazine (Open Access)",
        "era": "Ancient Near Eastern"
      },
      {
        "id": 13,
        "title": "Uruk Exploration Expedition",
        "description": "Journey through ancient temples and discover the origins of cuneiform writing.",
        "duration": 5,
        "price": 2000,
        "locations": "Erbil, Iraq",
        "image_url": "https://www.metmuseum.org/-/media/images/art/collection-landing/uruk.jpg",
        "wikipedia_url": "https://en.wikipedia.org/wiki/Uruk",
        "image_attribution": "Image courtesy of The Metropolitan Museum of Art (Open Access)",
        "era": "Ancient Near Eastern"
      },
      {
        "id": 14,
        "title": "Babylonian Legacy Journey",
        "description": "Experience the grandeur of ancient Babylon and its architectural wonders.",
        "duration": 8,
        "price": 2700,
        "locations": "Hillah, Iraq",
        "image_url": "https://www.getty.edu/conservation/publications_resources/pdf_publications/babylon.jpg",
        "wikipedia_url": "https://en.wikipedia.org/wiki/Babylon",
        "image_attribution": "Image courtesy of The Getty, Open Access",
        "era": "Ancient Near Eastern"
      },
      {
        "id": 15,
        "title": "Medieval Castles and Cathedrals Tour",
        "description": "Journey through Europe's magnificent medieval architecture.",
        "duration": 10,
        "price": 3000,
        "locations": "Paris, France",
        "image_url": "https://www.britishmuseum.org/sites/default/files/styles/scale_width/public/2021-02/castles.jpg",
        "wikipedia_url": "https://en.wikipedia.org/wiki/Ch%C3%A2teau_de_Chambord",
        "image_attribution": "Image courtesy of The British Museum (Open Access)",
        "era": "Medieval Europe"
      },
      {
        "id": 16,
        "title": "Silk Road Treasures Tour",
        "description": "Travel the ancient trade routes that connected East and West.",
        "duration": 14,
        "price": 4500,
        "locations": "Xi'an, China",
        "image_url": "https://www.metmuseum.org/-/media/images/art/collection-landing/silkroad.jpg",
        "wikipedia_url": "https://en.wikipedia.org/wiki/Silk_Road",
        "image_attribution": "Image courtesy of The Metropolitan Museum of Art (Open Access)",
        "era": "Silk Road Trade Era"
      },
      {
        "id": 17,
        "title": "Indian Empires Tour",
        "description": "Discover the golden age of Indian civilization through its monumental sites.",
        "duration": 12,
        "price": 3500,
        "locations": "Delhi, India",
        "image_url": "https://www.britishmuseum.org/sites/default/files/styles/scale_width/public/2020-09/indian_empires.jpg",
        "wikipedia_url": "https://en.wikipedia.org/wiki/Mauryan_Empire",
        "image_attribution": "Image courtesy of The British Museum (Open Access)",
        "era": "Ancient India (Mauryan and Gupta Periods)"
      },
      {
        "id": 18,
        "title": "Dynasties of China Tour",
        "description": "Experience the grandeur of Imperial China and its enduring cultural legacy.",
        "duration": 10,
        "price": 3200,
        "locations": "Beijing, China",
        "image_url": "https://www.louvre.fr/sites/default/files/styles/large/public/2021-06/china-dynasty.jpg",
        "wikipedia_url": "https://en.wikipedia.org/wiki/Great_Wall_of_China",
        "image_attribution": "Image courtesy of the Louvre Museum (Open Access)",
        "era": "Imperial China"
      },
      {
        "id": 19,
        "title": "The Great Wall Expedition",
        "description": "Journey along the Great Wall of China, one of the world's most impressive structures.",
        "duration": 8,
        "price": 2800,
        "locations": "Beijing, China",
        "image_url": "https://www.metmuseum.org/-/media/images/art/collection-landing/greatwall.jpg",
        "wikipedia_url": "https://en.wikipedia.org/wiki/Great_Wall_of_China",
        "image_attribution": "Image courtesy of The Metropolitan Museum of Art (Open Access)",
        "era": "Imperial China"
      },
      {
        "id": 20,
        "title": "Foundations of Faith Tour",
        "description": "Explore the early narratives of the Israelite people by visiting key historic sites.",
        "duration": 7,
        "price": 2300,
        "locations": "Jerusalem, Hebron",
        "image_url": "https://www.britishmuseum.org/sites/default/files/styles/scale_width/public/2020-11/jerusalem.jpg",
        "wikipedia_url": "https://en.wikipedia.org/wiki/Jerusalem",
        "image_attribution": "Image courtesy of The British Museum (Open Access)",
        "era": "Israel's Patriarchal Period"
      },
      {
        "id": 21,
        "title": "Egyptian Renaissance Tour",
        "description": "Discover the resurgence of power during Egypt's Middle Kingdom at monumental sites.",
        "duration": 6,
        "price": 2600,
        "locations": "Memphis, Egypt",
        "image_url": "https://www.metmuseum.org/-/media/images/art/collection-landing/memphis.jpg",
        "wikipedia_url": "https://en.wikipedia.org/wiki/Memphis%2C_Egypt",
        "image_attribution": "Image courtesy of The Metropolitan Museum of Art (Open Access)",
        "era": "Middle Kingdom of Egypt"
      },
      {
        "id": 22,
        "title": "Pharaohs of Power Tour",
        "description": "Experience the apex of New Kingdom Egypt with visits to iconic monuments.",
        "duration": 7,
        "price": 2800,
        "locations": "Thebes, Egypt",
        "image_url": "https://www.britishmuseum.org/sites/default/files/styles/scale_width/public/2020-08/thebes.jpg",
        "wikipedia_url": "https://en.wikipedia.org/wiki/Hatshepsut",
        "image_attribution": "Image courtesy of The British Museum (Open Access)",
        "era": "New Kingdom of Egypt"
      },
      {
        "id": 23,
        "title": "Persian Empire Expedition",
        "description": "Trace the legacy of the Achaemenid Empire from the ruins of Persepolis to ancient palaces.",
        "duration": 8,
        "price": 3100,
        "locations": "Pasargadae, Iran",
        "image_url": "https://www.getty.edu/conservation/publications_resources/pdf_publications/persepolis.jpg",
        "wikipedia_url": "https://en.wikipedia.org/wiki/Persepolis",
        "image_attribution": "Image courtesy of The Getty, Open Access",
        "era": "Achaemenid Empire"
      },
      {
        "id": 24,
        "title": "Hellenistic Heritage Tour",
        "description": "Journey into the Hellenistic world shaped by Alexander's legacy with visits to cities like Alexandria.",
        "duration": 7,
        "price": 2700,
        "locations": "Alexandria, Egypt",
        "image_url": "https://www.metmuseum.org/-/media/images/art/collection-landing/alexandria.jpg",
        "wikipedia_url": "https://en.wikipedia.org/wiki/Alexandria",
        "image_attribution": "Image courtesy of The Metropolitan Museum of Art (Open Access)",
        "era": "Hellenistic Period"
      },
      {
        "id": 25,
        "title": "Persian Splendor Tour",
        "description": "Explore the cultural legacy of the Sasanian Empire with visits to its ancient ruins and museums.",
        "duration": 7,
        "price": 3000,
        "locations": "Ctesiphon, Iraq",
        "image_url": "https://www.britishmuseum.org/sites/default/files/styles/scale_width/public/2020-05/ctesiphon.jpg",
        "wikipedia_url": "https://en.wikipedia.org/wiki/Ctesiphon",
        "image_attribution": "Image courtesy of The British Museum (Open Access)",
        "era": "Sasanian Empire"
      },
      {
        "id": 26,
        "title": "British Heritage Tour",
        "description": "Delve into Georgian Era Britain with visits to historic landmarks and museums.",
        "duration": 6,
        "price": 2400,
        "locations": "London, United Kingdom",
        "image_url": "https://www.louvre.fr/sites/default/files/styles/large/public/2021-06/london-tour.jpg",
        "wikipedia_url": "https://en.wikipedia.org/wiki/Westminster_Abbey",
        "image_attribution": "Image courtesy of the Louvre Museum (Open Access)",
        "era": "Georgian Era"
      },
      {
        "id": 27,
        "title": "Intellectual Revolution Tour",
        "description": "Explore Enlightenment Europe with guided visits to historic academies, libraries, and cultural sites in Paris.",
        "duration": 7,
        "price": 2600,
        "locations": "Paris, France",
        "image_url": "https://www.britishmuseum.org/sites/default/files/styles/scale_width/public/2021-03/paris_library.jpg",
        "wikipedia_url": "https://en.wikipedia.org/wiki/History_of_Enlightenment",
        "image_attribution": "Image courtesy of The British Museum (Open Access)",
        "era": "Enlightenment"
      }
    ];
    
    // Insert tours into the database
    for (const tour of tours) {
      console.log(`Adding tour: ${tour.title}`);
      
      // Convert the fields to align with database field names
      const dbTour = {
        title: tour.title,
        description: tour.description,
        duration: tour.duration,
        price: tour.price,
        locations: tour.locations,
        imageUrl: tour.image_url,
        era: tour.era,
        wikipediaUrl: tour.wikipedia_url,
        imageAttribution: tour.image_attribution
      };
      
      // First check if a tour with this title already exists
      const checkQuery = `
        SELECT id FROM tours WHERE title = $1
      `;
      
      const checkResult = await pool.query(checkQuery, [dbTour.title]);
      
      let query;
      let values;
      
      if (checkResult.rows.length > 0) {
        // Update existing tour
        const tourId = checkResult.rows[0].id;
        query = `
          UPDATE tours 
          SET description = $1, duration = $2, price = $3, locations = $4, 
              image_url = $5, era = $6, wikipedia_url = $7, image_attribution = $8
          WHERE id = $9
          RETURNING id;
        `;
        values = [
          dbTour.description,
          dbTour.duration,
          dbTour.price,
          dbTour.locations,
          dbTour.imageUrl,
          dbTour.era,
          dbTour.wikipediaUrl,
          dbTour.imageAttribution,
          tourId
        ];
      } else {
        // Insert new tour
        query = `
          INSERT INTO tours 
          (title, description, duration, price, locations, image_url, era, wikipedia_url, image_attribution) 
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          RETURNING id;
        `;
        
        values = [
          dbTour.title,
          dbTour.description,
          dbTour.duration,
          dbTour.price,
          dbTour.locations,
          dbTour.imageUrl,
          dbTour.era,
          dbTour.wikipediaUrl,
          dbTour.imageAttribution
        ];
      }
      
      try {
        const result = await pool.query(query, values);
        console.log(`Added/updated tour ${dbTour.title} with ID: ${result.rows[0].id}`);
      } catch (error) {
        console.error(`Error adding tour ${dbTour.title}:`, error);
      }
    }
    
    console.log('Tour import complete!');
    
  } catch (error) {
    console.error('Error during import:', error);
  } finally {
    await pool.end();
  }
}

// Call the function to import tours
importTours().catch(console.error);

// Export the function for potential reuse
export default importTours;