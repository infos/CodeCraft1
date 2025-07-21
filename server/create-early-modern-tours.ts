// Create Early Modern tours for the historical period (1650-1800 CE)
import { storage } from './storage';

const earlyModernTours = [
  {
    title: "Age of Enlightenment: Paris & Versailles",
    description: "Experience the intellectual revolution of the Enlightenment in Paris and the opulent court of Versailles. Visit the salons where Voltaire and Rousseau debated, explore the Palace of Versailles, and walk in the footsteps of Louis XIV.",
    duration: 5,
    price: 2200,
    locations: "Paris, Versailles, France",
    era: "Early Modern",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Age_of_Enlightenment",
    imageUrl: "/tour-images/age-of-enlightenment-paris-versailles.jpg",
    imageAttribution: "AI Generated"
  },
  {
    title: "Colonial America & Revolutionary Philadelphia",
    description: "Discover the birthplace of American independence in Philadelphia. Visit Independence Hall, see the Liberty Bell, and explore the colonial architecture where the Founding Fathers debated freedom and democracy.",
    duration: 4,
    price: 1800,
    locations: "Philadelphia, Boston, Williamsburg, USA",
    era: "Early Modern",
    wikipediaUrl: "https://en.wikipedia.org/wiki/American_Revolution",
    imageUrl: "/tour-images/colonial-america-revolutionary-philadelphia.jpg",
    imageAttribution: "AI Generated"
  },
  {
    title: "Dutch Golden Age: Amsterdam & The Hague",
    description: "Explore the zenith of Dutch power and prosperity in the 17th-18th centuries. Visit Rembrandt's house, explore the canals of Amsterdam, and discover the maritime empire that spanned the globe from the Dutch East India Company headquarters.",
    duration: 5,
    price: 2000,
    locations: "Amsterdam, The Hague, Delft, Netherlands",
    era: "Early Modern",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Dutch_Golden_Age",
    imageUrl: "/tour-images/dutch-golden-age-amsterdam-the-hague.jpg",
    imageAttribution: "AI Generated"
  },
  {
    title: "Imperial Russia: St. Petersburg & Moscow",
    description: "Experience the grandeur of Imperial Russia under Peter the Great and Catherine the Great. Marvel at the Winter Palace, explore the Hermitage, and discover how Russia transformed from medieval kingdom to European empire.",
    duration: 6,
    price: 2400,
    locations: "St. Petersburg, Moscow, Russia",
    era: "Early Modern",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Russian_Empire",
    imageUrl: "/tour-images/imperial-russia-st-petersburg-moscow.jpg",
    imageAttribution: "AI Generated"
  },
  {
    title: "Baroque Vienna & Imperial Austria",
    description: "Discover the Habsburg Empire at its height in magnificent Vienna. Experience Baroque architecture, attend concerts in Mozart's Vienna, and explore the imperial palaces where European politics were shaped for centuries.",
    duration: 5,
    price: 2100,
    locations: "Vienna, Salzburg, Austria",
    era: "Early Modern",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Austrian_Empire",
    imageUrl: "/tour-images/baroque-vienna-imperial-austria.jpg",
    imageAttribution: "AI Generated"
  },
  {
    title: "Scientific Revolution: London & Cambridge",
    description: "Follow the path of scientific revolution in England. Visit the Royal Society where Newton presented his theories, explore Cambridge University, and discover how empirical thinking transformed human understanding of the universe.",
    duration: 4,
    price: 1900,
    locations: "London, Cambridge, Oxford, England",
    era: "Early Modern",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Scientific_Revolution",
    imageUrl: "/tour-images/scientific-revolution-london-cambridge.jpg",
    imageAttribution: "AI Generated"
  }
];

const earlyModernItineraries = {
  "Age of Enlightenment: Paris & Versailles": [
    {
      day: 1,
      title: "Arrival in Paris - City of Light and Reason",
      description: "Explore the intellectual heart of the Enlightenment in Paris. Visit the Panthéon where Voltaire and Rousseau are entombed, walk through the Latin Quarter where philosophes gathered, and see the Bibliothèque Nationale where revolutionary ideas were published."
    },
    {
      day: 2,
      title: "Enlightenment Salons and Philosophy",
      description: "Discover the salons where Enlightenment thinkers met. Visit Madame Geoffrin's former salon location, explore the Musée Carnavalet for 18th-century Paris history, and walk the streets where Diderot compiled his Encyclopedia."
    },
    {
      day: 3,
      title: "Versailles - The Sun King's Legacy",
      description: "Journey to the magnificent Palace of Versailles. Explore the Hall of Mirrors, the royal apartments, and the gardens designed by Le Nôtre. Learn about Louis XIV's absolute monarchy and its role in sparking Enlightenment criticism."
    },
    {
      day: 4,
      title: "Pre-Revolutionary Paris",
      description: "Understand the social tensions that led to revolution. Visit the Conciergerie prison, explore the working-class districts, and see the contrast between aristocratic luxury and common hardship that Enlightenment thinkers criticized."
    },
    {
      day: 5,
      title: "Revolutionary Sites and Departure",
      description: "Visit key sites of the French Revolution including Place de la Révolution (now Place de la Concorde), the Bastille area, and learn how Enlightenment ideas directly influenced revolutionary change before departure."
    }
  ],
  "Colonial America & Revolutionary Philadelphia": [
    {
      day: 1,
      title: "Colonial Philadelphia - Cradle of Liberty",
      description: "Explore Independence Hall where the Declaration of Independence and Constitution were signed. See the Liberty Bell and walk through Old City Philadelphia's cobblestone streets lined with colonial architecture."
    },
    {
      day: 2,
      title: "Founding Fathers and Revolutionary Ideas",
      description: "Visit Carpenter's Hall where the First Continental Congress met, explore the homes of founding fathers, and discover how Enlightenment philosophy shaped American revolutionary thinking."
    },
    {
      day: 3,
      title: "Colonial Williamsburg Living History",
      description: "Experience 18th-century colonial life in restored Williamsburg. Meet historical interpreters, watch colonial crafts demonstrations, and understand daily life in pre-revolutionary America."
    },
    {
      day: 4,
      title: "Boston Tea Party and Revolutionary Boston",
      description: "Travel to Boston to walk the Freedom Trail. Visit the site of the Boston Tea Party, see Paul Revere's house, and explore the colonial taverns where revolution was planned."
    }
  ]
};

const earlyModernHotels = {
  "Age of Enlightenment: Paris & Versailles": [
    {
      name: "Hotel Malte Opera",
      location: "9th Arrondissement, Paris",
      description: "A charming boutique hotel in a 17th-century mansion, perfectly located for exploring Enlightenment Paris. Features period furnishings and is walking distance to opera houses and philosophical sites.",
      rating: 4,
      pricePerNight: 280,
      amenities: ["WiFi", "Historic Building", "Central Location", "Concierge"],
      website: "https://hotelmalte-paris.com",
      imageUrl: "/hotel-images/hotel-malte-opera-paris.jpg"
    },
    {
      name: "Trianon Palace Versailles",
      location: "Versailles",
      description: "A luxury hotel on the edge of Versailles Palace grounds. Historic property where world leaders have stayed, offering direct access to the palace and gardens.",
      rating: 5,
      pricePerNight: 450,
      amenities: ["WiFi", "Spa", "Palace Views", "Luxury", "Historic"],
      website: "https://trianonpalace.com",
      imageUrl: "/hotel-images/trianon-palace-versailles.jpg"
    }
  ],
  "Dutch Golden Age: Amsterdam & The Hague": [
    {
      name: "The Hoxton Amsterdam",
      location: "Herengracht Canal, Amsterdam",
      description: "A stylish hotel in five 17th-century canal houses, perfectly capturing the Dutch Golden Age atmosphere. Located on the famous Herengracht with views of the historic canals.",
      rating: 4,
      pricePerNight: 320,
      amenities: ["WiFi", "Canal Views", "Historic Building", "Central Location"],
      website: "https://thehoxton.com/amsterdam",
      imageUrl: "/hotel-images/hoxton-amsterdam.jpg"
    }
  ]
};

async function createEarlyModernTours() {
  console.log('Creating Early Modern tours...');
  
  try {
    for (const tourData of earlyModernTours) {
      // Check if tour already exists
      const existingTours = await storage.getAllTours();
      const tourExists = existingTours.some(tour => tour.title === tourData.title);
      
      if (tourExists) {
        console.log(`✓ Tour "${tourData.title}" already exists`);
        continue;
      }
      
      // Create the tour
      const newTour = await storage.createTour(tourData);
      console.log(`✓ Created tour: ${newTour.title} (ID: ${newTour.id})`);
      
      // Create itineraries if they exist
      const tourItineraries = earlyModernItineraries[tourData.title as keyof typeof earlyModernItineraries];
      if (tourItineraries) {
        for (const itinerary of tourItineraries) {
          await storage.createItinerary({
            tourId: newTour.id,
            day: itinerary.day,
            title: itinerary.title,
            description: itinerary.description
          });
        }
        console.log(`  Added ${tourItineraries.length} itinerary days`);
      }
      
      // Create hotel recommendations if they exist
      const tourHotels = earlyModernHotels[tourData.title as keyof typeof earlyModernHotels];
      if (tourHotels) {
        for (const hotel of tourHotels) {
          await storage.createHotelRecommendation({
            tourId: newTour.id,
            name: hotel.name,
            location: hotel.location,
            description: hotel.description,
            rating: hotel.rating,
            pricePerNight: hotel.pricePerNight,
            amenities: hotel.amenities,
            website: hotel.website,
            imageUrl: hotel.imageUrl
          });
        }
        console.log(`  Added ${tourHotels.length} hotel recommendations`);
      }
    }
    
    console.log('\n✅ Early Modern tours creation completed!');
    
    // Display summary
    const allTours = await storage.getAllTours();
    const earlyModernToursCount = allTours.filter(tour => tour.era === 'Early Modern').length;
    console.log(`📊 Total Early Modern tours: ${earlyModernToursCount}`);
    
  } catch (error) {
    console.error('❌ Error creating Early Modern tours:', error);
    throw error;
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  createEarlyModernTours()
    .then(() => {
      console.log('✅ Early Modern tours creation completed successfully!');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Early Modern tours creation failed:', error);
      process.exit(1);
    });
}

export { createEarlyModernTours };