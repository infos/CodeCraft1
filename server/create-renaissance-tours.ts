// Create Renaissance tours for the historical period
import { storage } from './storage';

const renaissanceTours = [
  {
    title: "Florence Renaissance Masterpieces",
    description: "Explore the birthplace of the Renaissance with masterworks by Michelangelo, Leonardo da Vinci, and Brunelleschi. Visit the Uffizi Gallery, see Michelangelo's David, and discover the architectural revolution of the Duomo.",
    duration: 5,
    price: 1800,
    locations: "Florence, Italy",
    era: "Renaissance",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Italian_Renaissance",
    imageUrl: "/tour-images/florence-renaissance-masterpieces.jpg",
    imageAttribution: "AI Generated"
  },
  {
    title: "Italian Renaissance Cities Tour",
    description: "Journey through the heart of the Renaissance across Florence, Rome, and Venice. Experience the artistic revolution that changed the world through masterpieces by Leonardo, Michelangelo, and Raphael.",
    duration: 7,
    price: 2800,
    locations: "Florence, Rome, Venice, Italy",
    era: "Renaissance",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Italian_Renaissance",
    imageUrl: "/tour-images/italian-renaissance-cities-tour.jpg",
    imageAttribution: "AI Generated"
  },
  {
    title: "Venetian Renaissance Art & Architecture",
    description: "Discover Venice's unique Renaissance heritage with works by Titian, Tintoretto, and Veronese. Explore the Doge's Palace, St. Mark's Basilica, and the architectural marvels of the floating city.",
    duration: 4,
    price: 1600,
    locations: "Venice, Italy",
    era: "Renaissance",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Venetian_Renaissance",
    imageUrl: "/tour-images/venetian-renaissance-art-architecture.jpg",
    imageAttribution: "AI Generated"
  },
  {
    title: "Rome: High Renaissance & Vatican Treasures",
    description: "Experience the pinnacle of Renaissance art in Rome with Michelangelo's Sistine Chapel, Raphael's Vatican Rooms, and Bernini's architectural masterpieces. Includes private Vatican access.",
    duration: 6,
    price: 2400,
    locations: "Rome, Vatican City",
    era: "Renaissance",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Renaissance_in_Rome",
    imageUrl: "/tour-images/rome-high-renaissance-vatican-treasures.jpg",
    imageAttribution: "AI Generated"
  },
  {
    title: "French Renaissance Châteaux & Culture",
    description: "Explore the French Renaissance through magnificent châteaux of the Loire Valley. Visit Chambord, Fontainebleau, and discover how Italian Renaissance ideas transformed French art and architecture.",
    duration: 5,
    price: 2100,
    locations: "Loire Valley, Paris, France",
    era: "Renaissance",
    wikipediaUrl: "https://en.wikipedia.org/wiki/French_Renaissance",
    imageUrl: "/tour-images/french-renaissance-chateaux-culture.jpg",
    imageAttribution: "AI Generated"
  },
  {
    title: "Northern Renaissance: Bruges & Amsterdam",
    description: "Discover the Northern Renaissance through the masterworks of Jan van Eyck, Hieronymus Bosch, and Rembrandt. Explore medieval Bruges and Golden Age Amsterdam with their revolutionary art traditions.",
    duration: 6,
    price: 2200,
    locations: "Bruges, Belgium; Amsterdam, Netherlands",
    era: "Renaissance",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Northern_Renaissance",
    imageUrl: "/tour-images/northern-renaissance-bruges-amsterdam.jpg",
    imageAttribution: "AI Generated"
  }
];

const renaissanceItineraries = {
  "Florence Renaissance Masterpieces": [
    {
      day: 1,
      title: "Arrival in Florence - Renaissance Beginnings",
      description: "Welcome to the birthplace of the Renaissance. Start with the world's greatest collection of Renaissance art at the Uffizi Gallery, featuring Botticelli's Birth of Venus and works by Leonardo da Vinci. Evening stroll across the medieval Ponte Vecchio bridge."
    },
    {
      day: 2,
      title: "Michelangelo's Florence",
      description: "Visit the Accademia Gallery to see Michelangelo's David and his unfinished Prisoners. Explore Palazzo Vecchio with Michelangelo's courtyard and climb the bell tower for panoramic views of Renaissance Florence."
    },
    {
      day: 3,
      title: "Brunelleschi's Architectural Revolution",
      description: "Marvel at Brunelleschi's revolutionary dome at the Duomo and learn about Renaissance engineering. Visit Santo Spirito Church, a perfect example of Renaissance architecture, and explore the Oltrarno artisan quarter."
    },
    {
      day: 4,
      title: "Medici Legacy",
      description: "Discover the powerful Medici family's role in the Renaissance at Pitti Palace and the magnificent Boboli Gardens. Visit the Medici Chapels with Michelangelo's sculptures and New Sacristy."
    },
    {
      day: 5,
      title: "Renaissance Workshops and Departure",
      description: "Experience living Renaissance traditions in the Oltrarno workshops where artisans still practice traditional crafts. Final visit to San Lorenzo Market for authentic Renaissance-style goods before departure."
    }
  ],
  "Italian Renaissance Cities Tour": [
    {
      day: 1,
      title: "Florence - Cradle of the Renaissance",
      description: "Arrive in Florence and visit the Uffizi Gallery with the world's most important Renaissance art collection. Evening welcome dinner in a Renaissance palace."
    },
    {
      day: 2,
      title: "Florence - Michelangelo & Medici",
      description: "See Michelangelo's David at the Accademia Gallery and explore the Medici legacy at Pitti Palace. Climb Brunelleschi's revolutionary dome at the Duomo."
    },
    {
      day: 3,
      title: "Travel to Rome - Eternal City Renaissance",
      description: "High-speed train to Rome. Visit the Capitoline Museums to see ancient sculptures that inspired Renaissance artists. Evening in Trastevere district."
    },
    {
      day: 4,
      title: "Vatican Renaissance Masterpieces",
      description: "Private early access to the Vatican Museums, Sistine Chapel with Michelangelo's ceiling frescoes, and Raphael's Vatican Rooms. Afternoon at St. Peter's Basilica."
    },
    {
      day: 5,
      title: "Roman Renaissance Churches & Palaces",
      description: "Visit Santa Maria del Popolo with Caravaggio paintings, explore Renaissance palaces, and see Bernini's fountains and sculptures throughout the city."
    },
    {
      day: 6,
      title: "Venice - La Serenissima Renaissance",
      description: "Morning flight to Venice. Explore Doge's Palace with Tintoretto's massive paintings and St. Mark's Basilica. Evening gondola ride through Renaissance palazzi."
    },
    {
      day: 7,
      title: "Venetian Masters & Departure",
      description: "Visit the Peggy Guggenheim Collection and Ca' Rezzonico for Venetian Renaissance and Baroque art. Final canal tour before departure."
    }
  ]
};

const renaissanceHotels = {
  "Florence Renaissance Masterpieces": [
    {
      name: "Hotel Davanzati",
      location: "Historic Center, Florence",
      description: "A beautifully restored Renaissance palace in the heart of Florence, featuring period furnishings and frescoed ceilings. Walking distance to all major Renaissance sites.",
      rating: 4,
      pricePerNight: 280,
      amenities: ["WiFi", "Air Conditioning", "Concierge", "Historic Building", "Central Location"],
      website: "https://hoteldavanzati.it",
      imageUrl: "/hotel-images/hotel-davanzati-florence.jpg"
    }
  ],
  "Italian Renaissance Cities Tour": [
    {
      name: "Hotel Brunelleschi",
      location: "Historic Center, Florence",
      description: "Built around a 6th-century Byzantine tower and medieval church, this unique hotel combines history with luxury in the heart of Renaissance Florence.",
      rating: 5,
      pricePerNight: 350,
      amenities: ["WiFi", "Spa", "Restaurant", "Historic Building", "Luxury"],
      website: "https://hotelbrunelleschi.it",
      imageUrl: "/hotel-images/hotel-brunelleschi-florence.jpg"
    },
    {
      name: "Hotel de' Ricci",
      location: "Near Vatican, Rome",
      description: "An elegant boutique hotel in a Renaissance palazzo, perfectly located for exploring Vatican treasures and Roman Renaissance sites.",
      rating: 4,
      pricePerNight: 320,
      amenities: ["WiFi", "Concierge", "Historic Building", "Central Location"],
      website: "https://hotelricci.com",
      imageUrl: "/hotel-images/hotel-ricci-rome.jpg"
    },
    {
      name: "Aman Venice",
      location: "Grand Canal, Venice",
      description: "A magnificent 16th-century palazzo on the Grand Canal, offering unparalleled luxury and views of Renaissance Venice.",
      rating: 5,
      pricePerNight: 800,
      amenities: ["WiFi", "Spa", "Canal Views", "Luxury", "Historic Palazzo"],
      website: "https://aman.com/resorts/aman-venice",
      imageUrl: "/hotel-images/aman-venice.jpg"
    }
  ]
};

async function createRenaissanceTours() {
  console.log('Creating Renaissance tours...');
  
  try {
    for (const tourData of renaissanceTours) {
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
      const tourItineraries = renaissanceItineraries[tourData.title as keyof typeof renaissanceItineraries];
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
      const tourHotels = renaissanceHotels[tourData.title as keyof typeof renaissanceHotels];
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
    
    console.log('\n✅ Renaissance tours creation completed!');
    
    // Display summary
    const allTours = await storage.getAllTours();
    const renaissanceToursCount = allTours.filter(tour => tour.era === 'Renaissance').length;
    console.log(`📊 Total Renaissance tours: ${renaissanceToursCount}`);
    
  } catch (error) {
    console.error('❌ Error creating Renaissance tours:', error);
    throw error;
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  createRenaissanceTours()
    .then(() => {
      console.log('✅ Renaissance tours creation completed successfully!');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Renaissance tours creation failed:', error);
      process.exit(1);
    });
}

export { createRenaissanceTours };