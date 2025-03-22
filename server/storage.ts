import { emperors, tours, itineraries, hotelRecommendations, type Emperor, type InsertEmperor, type Tour, type InsertTour, type Itinerary, type InsertItinerary, type HotelRecommendation, type InsertHotelRecommendation, type Era, type InsertEra, eras } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Era operations
  getAllEras(): Promise<Era[]>;
  getEra(id: number): Promise<Era | undefined>;
  createEra(era: InsertEra): Promise<Era>;

  // Emperor operations
  getAllEmperors(): Promise<Emperor[]>;
  getEmperor(id: number): Promise<Emperor | undefined>;
  createEmperor(emperor: InsertEmperor): Promise<Emperor>;

  // Tour operations
  getAllTours(): Promise<Tour[]>;
  getTour(id: number): Promise<Tour | undefined>;
  createTour(tour: InsertTour): Promise<Tour>;

  // Itinerary operations
  getItinerariesForTour(tourId: number): Promise<Itinerary[]>;
  createItinerary(itinerary: InsertItinerary): Promise<Itinerary>;

  // Hotel operations
  getHotelsForTour(tourId: number): Promise<HotelRecommendation[]>;
  createHotelRecommendation(hotel: InsertHotelRecommendation): Promise<HotelRecommendation>;
}

export class DatabaseStorage implements IStorage {
  async getAllEras(): Promise<Era[]> {
    return await db.select().from(eras);
  }

  async getEra(id: number): Promise<Era | undefined> {
    const [era] = await db.select().from(eras).where(eq(eras.id, id));
    return era;
  }

  async createEra(insertEra: InsertEra): Promise<Era> {
    const [era] = await db.insert(eras).values(insertEra).returning();
    return era;
  }

  async getAllEmperors(): Promise<Emperor[]> {
    return await db.select().from(emperors);
  }

  async getEmperor(id: number): Promise<Emperor | undefined> {
    const [emperor] = await db.select().from(emperors).where(eq(emperors.id, id));
    return emperor;
  }

  async createEmperor(insertEmperor: InsertEmperor): Promise<Emperor> {
    const [emperor] = await db.insert(emperors).values(insertEmperor).returning();
    return emperor;
  }

  async getAllTours(): Promise<Tour[]> {
    return await db.select().from(tours);
  }

  async getTour(id: number): Promise<Tour | undefined> {
    const [tour] = await db.select().from(tours).where(eq(tours.id, id));
    return tour;
  }

  async createTour(insertTour: InsertTour): Promise<Tour> {
    const [tour] = await db.insert(tours).values(insertTour).returning();
    return tour;
  }

  async getItinerariesForTour(tourId: number): Promise<Itinerary[]> {
    return await db.select().from(itineraries)
      .where(eq(itineraries.tourId, tourId))
      .orderBy(itineraries.day);
  }

  async createItinerary(insertItinerary: InsertItinerary): Promise<Itinerary> {
    const [itinerary] = await db.insert(itineraries).values(insertItinerary).returning();
    return itinerary;
  }

  async getHotelsForTour(tourId: number): Promise<HotelRecommendation[]> {
    return await db.select()
      .from(hotelRecommendations)
      .where(eq(hotelRecommendations.tourId, tourId));
  }

  async createHotelRecommendation(insertHotel: InsertHotelRecommendation): Promise<HotelRecommendation> {
    const [hotel] = await db.insert(hotelRecommendations).values(insertHotel).returning();
    return hotel;
  }

  async initializeData() {
    const historicalEras = [
      {
        name: "Ancient Near Eastern",
        keyFigures: "Sumerians (Uruk, Ur), Akkadians (Sargon), Babylonians (Hammurabi), Assyrians (Ashurbanipal)",
        associatedTours: "Mesopotamian Marvels Tour",
        startYear: -3200,
        endYear: -539,
        description: "The cradle of civilization, featuring the first cities and writing systems"
      },
      {
        name: "Ancient Egypt",
        keyFigures: "Old, Middle, and New Kingdom rulers; notable figures like Cleopatra, Ramses II, Tutankhamun",
        associatedTours: "Egyptian Pharaohs and Temples; Egypt and the Nile Tour",
        startYear: -3150,
        endYear: -30,
        description: "The mighty civilization along the Nile, known for pyramids and pharaohs"
      },
      {
        name: "Ancient Greece",
        keyFigures: "Alexander the Great, Pericles, and mythic characters",
        associatedTours: "Greek Myths and Legends Tour; The Golden Age of Athens",
        startYear: -800,
        endYear: -146,
        description: "The birthplace of democracy and Western philosophy"
      },
      {
        name: "Ancient Rome",
        keyFigures: "Julius Caesar, Emperor Augustus, Nero",
        associatedTours: "The Rise of Rome; Imperial Rome Unveiled",
        startYear: -753,
        endYear: 476,
        description: "The empire that shaped European civilization"
      },
      {
        name: "Byzantine",
        keyFigures: "Constantine the Great, Justinian I, Empress Theodora",
        associatedTours: "Byzantine Legacy Tours",
        startYear: 330,
        endYear: 1453,
        description: "The Eastern Roman Empire that preserved Classical culture"
      },
      {
        name: "Ancient India (Mauryan and Gupta Periods)",
        keyFigures: "Chandragupta Maurya, Ashoka the Great",
        associatedTours: "Ancient India Tour",
        startYear: -321,
        endYear: 550,
        description: "A period of significant empires and cultural development"
      },
      {
        name: "Imperial China",
        keyFigures: "Emperor Kangxi",
        associatedTours: "Imperial China Tour",
        startYear: 1644,
        endYear: 1912,
        description: "The Qing Dynasty and its influence"
      },
      {
        name: "Hellenistic Period",
        keyFigures: "Seleucus I Nicator, Ptolemy I Soter",
        associatedTours: "Hellenistic World Tour",
        startYear: -323,
        endYear: -30,
        description: "The era of Greek cultural influence across the Mediterranean and Near East"
      },
      {
        name: "Parthian Empire",
        keyFigures: "Mithridates I, Orodes II",
        associatedTours: "Persian Empires Tour",
        startYear: -247,
        endYear: 224,
        description: "A major Iranian political and cultural power"
      },
      {
        name: "Sasanian Empire",
        keyFigures: "Ardashir I",
        associatedTours: "Persian Heritage Tour",
        startYear: 224,
        endYear: 651,
        description: "The last Iranian empire before the rise of Islam"
      }
    ];

    // Insert eras
    for (const era of historicalEras) {
      const existing = await db.select().from(eras).where(eq(eras.name, era.name));
      if (existing.length === 0) {
        await this.createEra(era);
      }
    }

    const historicalFigures = [
      {
        name: "Julius Caesar",
        era: "Ancient Rome",
        startYear: -100,
        endYear: -44,
        description: "Gaius Julius Caesar was a Roman general, statesman, and author who transformed the Roman Republic through his military conquests and political reforms, setting the stage for the Roman Empire.",
        achievements: "Military conquests, political reforms, calendar reform, expansion of Roman citizenship",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Julius_Caesar_Coustou_Louvre_MR1798.jpg/800px-Julius_Caesar_Coustou_Louvre_MR1798.jpg",
        locations: ["Rome, Italy"]
      },
      {
        name: "Augustus",
        era: "Ancient Rome",
        startYear: -63,
        endYear: 14,
        description: "Augustus was the first Roman emperor who established a period of relative peace known as the Pax Romana. His reign ushered in a golden age of art, literature, and monumental architecture.",
        achievements: "Established Pax Romana, reformed administration, expanded empire",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Augustus_of_Prima_Porta_%28inv._2290%29.jpg/800px-Augustus_of_Prima_Porta_%28inv._2290%29.jpg",
        locations: ["Rome, Italy"]
      },
      {
        name: "Alexander the Great",
        era: "Ancient Greece",
        startYear: -356,
        endYear: -323,
        description: "Alexander the Great was king of Macedon and one of history's most successful military commanders. He created one of the largest empires of the ancient world by the age of thirty.",
        achievements: "Created vast empire spanning three continents, founded numerous cities, spread Hellenistic culture",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Alexander_the_Great_mosaic.jpg/800px-Alexander_the_Great_mosaic.jpg",
        locations: ["Pella, Greece", "Vergina, Greece"]
      },
      {
        name: "Cleopatra VII",
        era: "Ancient Egypt",
        startYear: -69,
        endYear: -30,
        description: "Cleopatra VII was the last active ruler of the Ptolemaic Kingdom of Egypt. Known for her intelligence, political acumen, and captivating charm, she remains one of history's most famous female rulers.",
        achievements: "Preserved Egyptian independence, modernized kingdom, patronage of learning",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Kleopatra-VII.-Altes-Museum-Berlin.jpg/800px-Kleopatra-VII.-Altes-Museum-Berlin.jpg",
        locations: ["Alexandria, Egypt"]
      },
      {
        name: "Hammurabi",
        era: "Ancient Near Eastern",
        startYear: -1792,
        endYear: -1750,
        description: "Hammurabi, the sixth king of Babylon, is best known for his comprehensive legal code which laid the foundation for future legal systems.",
        achievements: "Established one of the first written legal codes; expanded Babylonian power",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Hammurabi.jpg/800px-Hammurabi.jpg",
        locations: ["Babylon, Iraq"]
      },
      {
        name: "Chandragupta Maurya",
        era: "Ancient India (Mauryan and Gupta Periods)",
        startYear: -321,
        endYear: -297,
        description: "Founder of the Mauryan Empire, Chandragupta Maurya established one of the largest empires in ancient India.",
        achievements: "Unified North India, established strong central administration, built extensive trade networks",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Chandragupta_Maurya.jpg/800px-Chandragupta_Maurya.jpg",
        locations: ["Pataliputra, India", "Taxila, Pakistan"]
      },
      {
        name: "Ashoka the Great",
        era: "Ancient India (Mauryan and Gupta Periods)",
        startYear: -268,
        endYear: -232,
        description: "Ashoka was the third emperor of the Mauryan Empire and one of India's greatest rulers, known for spreading Buddhism.",
        achievements: "Spread Buddhism, established pillars of law, promoted non-violence and social welfare",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Ashoka_the_Great.jpg/800px-Ashoka_the_Great.jpg",
        locations: ["Pataliputra, India", "Sanchi, India"]
      },
      {
        name: "Justinian I",
        era: "Byzantine",
        startYear: 527,
        endYear: 565,
        description: "Justinian I, also known as Justinian the Great, was one of the most important rulers of the Byzantine Empire, known for his legal reforms and architectural achievements.",
        achievements: "Codified Roman law (Corpus Juris Civilis), built Hagia Sophia, reconquered territories",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Justinian_I.jpg/800px-Justinian_I.jpg",
        locations: ["Constantinople (Istanbul), Turkey"]
      },
      {
        name: "Emperor Kangxi",
        era: "Imperial China",
        startYear: 1661,
        endYear: 1722,
        description: "Emperor Kangxi of the Qing Dynasty was one of China's longest-reigning and most capable emperors, known for consolidating imperial power and fostering cultural achievements.",
        achievements: "Expanded and consolidated the Qing Empire, promoted cultural and scientific progress",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Kangxi_portrait.jpg/800px-Kangxi_portrait.jpg",
        locations: ["Beijing, China"]
      },
      // Adding more emperors from the file
      {
        name: "Sargon of Akkad",
        era: "Ancient Near Eastern",
        startYear: -2340,
        endYear: -2284,
        description: "Sargon of Akkad was the first ruler of the Akkadian Empire, creating one of the first empires in history.",
        achievements: "United Mesopotamian city-states, created first professional army, established first empire",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Sargon_of_Akkad.jpg/800px-Sargon_of_Akkad.jpg",
        locations: ["Akkad, Iraq"]
      }
    ];

    // Insert historical figures
    for (const figure of historicalFigures) {
      const existing = await db.select().from(emperors).where(eq(emperors.name, figure.name));
      if (existing.length === 0) {
        await this.createEmperor(figure);
      }
    }

    const tourData = [
      {
        title: "The Rise of Rome",
        description: "Experience the grandeur of ancient Rome through the eyes of its most powerful leaders. Visit the magnificent Colosseum, Roman Forum, and Palatine Hill where emperors once ruled.",
        duration: 7,
        price: 2499,
        locations: "Rome, Tivoli",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Colosseum_in_Rome%2C_Italy_-_April_2007.jpg/1280px-Colosseum_in_Rome%2C_Italy_-_April_2007.jpg",
        era: "Ancient Rome",
        itinerary: [
          {
            day: 1,
            title: "Arrival & Orientation",
            description: "Arrive in Rome by train or flight. Check into a boutique hotel housed in a historic palazzo near the city center. Evening welcome dinner in a traditional trattoria in the Monti neighborhood."
          },
          {
            day: 2,
            title: "Ancient Rome Immersion",
            description: "Morning guided walking tour of the Roman Forum and Palatine Hill. Lunch in a local osteria. Afternoon free time to explore Piazza Venezia or the nearby markets. Evening visit to a small museum focusing on early Roman history."
          },
          {
            day: 3,
            title: "The Colosseum & Hidden Ruins",
            description: "Guided tour of the Colosseum with exclusive access to lesser-known passages. Explore underground tunnels and hear stories of gladiators. Free afternoon stroll in the surrounding ancient neighborhoods."
          },
          {
            day: 4,
            title: "Art, Architecture & History",
            description: "Morning visit to the Capitoline Museums. Lunch near the Roman Forum. Free time to wander through cobblestone streets and piazzas. Evening cultural performance at a historic theatre."
          },
          {
            day: 5,
            title: "Day Trip to Tivoli",
            description: "Overland excursion to Tivoli to see Hadrian's Villa and Villa d'Este. Guided tour highlighting the blend of Roman architecture and nature. Return to Rome in the late afternoon."
          },
          {
            day: 6,
            title: "Local Life & Culinary History",
            description: "Morning guided market tour to sample local ingredients and learn about ancient Roman food traditions. Afternoon visit to a small workshop on ancient Roman cooking techniques."
          },
          {
            day: 7,
            title: "Reflection & Departure",
            description: "Optional morning stroll through a local park or a short visit to a nearby museum. Check out and transfer to the train station or airport."
          }
        ],
        hotels: [
          "Hotel de la Ville",
          "Hotel Forum",
          "Palazzo Manfredi"
        ]
      },
      {
        title: "Egyptian Pharaohs and Temples",
        description: "Discover the world of Cleopatra and ancient Egyptian civilization. From the mighty pyramids to the treasures of Tutankhamun, immerse yourself in the world of the pharaohs.",
        duration: 6,
        price: 2899,
        locations: "Cairo, Giza, Saqqara",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Great_Sphinx_of_Giza_-_20080716a.jpg/1280px-Great_Sphinx_of_Giza_-_20080716a.jpg",
        era: "Ancient Egypt",
        itinerary: [
          {
            day: 1,
            title: "Arrival in Cairo & Check-In",
            description: "Arrive in Cairo and settle into a boutique hotel in the historic downtown area. Evening dinner featuring traditional Egyptian cuisine in a restored historic building."
          },
          {
            day: 2,
            title: "The Great Pyramids & Sphinx",
            description: "Full-day guided tour of the Giza Plateau, including the Great Pyramids and Sphinx. Lunch with a view of the pyramids. Free afternoon for personal exploration or a camel ride around the site."
          },
          {
            day: 3,
            title: "Cairo's Ancient Heritage",
            description: "Visit the Egyptian Museum to see treasures of Tutankhamun and artifacts from the pharaonic era. Free time in Khan El Khalili market in the afternoon. Evening stroll along the Nile Corniche."
          },
          {
            day: 4,
            title: "Day Trip to Saqqara and Memphis",
            description: "Overland excursion to Saqqara (Step Pyramid) and the open-air museum of Memphis. Guided insights into early dynastic Egypt and monumental architecture."
          },
          {
            day: 5,
            title: "Cultural Immersion in Old Cairo",
            description: "Explore Coptic Cairo: churches, ancient bazaars, and narrow streets rich with history. Free afternoon for visiting local artisan workshops."
          },
          {
            day: 6,
            title: "Reflection & Departure",
            description: "Morning free time – relax at a boutique café or take a short walk in a historic district. Check out and transfer to the airport."
          }
        ],
        hotels: [
          "Marriott Mena House",
          "Four Seasons Cairo",
          "Le Meridien Pyramids"
        ]
      },
      {
        title: "Greek Myths and Legends",
        description: "Journey through ancient Greece, from the Acropolis to the Temple of Apollo at Delphi. Experience the birthplace of democracy and discover the stories behind Greek mythology.",
        duration: 7,
        price: 2699,
        locations: "Athens, Delphi, Epidaurus, Nafplio",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/The_Parthenon_in_Athens.jpg/1280px-The_Parthenon_in_Athens.jpg",
        era: "Ancient Greece",
        itinerary: [
          {
            day: 1,
            title: "Arrival in Athens",
            description: "Arrive in Athens and check into a restored boutique hotel near Plaka. Evening welcome dinner with local specialties in a scenic, historic neighborhood."
          },
          {
            day: 2,
            title: "The Acropolis and Ancient Agora",
            description: "Guided tour of the Acropolis, including the Parthenon and Erechtheion. Visit the Ancient Agora, hearing legends of Greek gods and everyday life in ancient Athens."
          },
          {
            day: 3,
            title: "Mythical Landscapes",
            description: "Day trip to Delphi: overland journey with scenic views, guided tour of the Temple of Apollo and the ancient theater. Lunch in Delphi with panoramic mountain views."
          },
          {
            day: 4,
            title: "Cultural Workshops & Museum Visit",
            description: "Morning visit to the National Archaeological Museum. Optional add-on: A hands-on workshop on ancient Greek pottery or sculpture."
          },
          {
            day: 5,
            title: "Explore Ancient Epidaurus and Nafplio",
            description: "Overland trip to Epidaurus to see the ancient theater renowned for its acoustics, then continue to Nafplio. Enjoy free exploration time in Nafplio's charming old town."
          },
          {
            day: 6,
            title: "Neighborhood Exploration & Leisure",
            description: "Day at leisure: choose between revisiting favorite sites or enjoying a relaxed café day with scenic views. Evening cultural performance featuring traditional Greek music."
          },
          {
            day: 7,
            title: "Reflection & Departure",
            description: "Morning farewell stroll and brunch at a café with views of the Acropolis. Check out and transfer to the airport."
          }
        ],
        hotels: [
          "Herodion Hotel",
          "AthensWas",
          "Electra Palace Athens"
        ]
      },
      {
        title: "Italy's Ancient Wonders",
        description: "Journey through Italy's rich historical heritage, from Rome's imperial splendor to Florence's Renaissance treasures.",
        duration: 8,
        price: 2999,
        locations: "Rome, Pompeii, Florence",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Colosseum_in_Rome%2C_Italy_-_April_2007.jpg/1280px-Colosseum_in_Rome%2C_Italy_-_April_2007.jpg",
        era: "Ancient Rome",
        itinerary: [
          {
            day: 1,
            title: "Arrival in Rome & Welcome",
            description: "Arrive in Rome and check into a boutique, historic hotel in the city center. Welcome dinner in a medieval quarter with local specialties."
          },
          {
            day: 2,
            title: "Ancient Rome Exploration",
            description: "Guided tour of the Roman Forum, Palatine Hill, and Capitoline Hill. Lunch near the Forum in a traditional Roman trattoria."
          },
          {
            day: 3,
            title: "The Colosseum & Hidden Gems",
            description: "Morning guided access tour of the Colosseum, including the underground chambers. Free time to explore nearby neighborhoods."
          },
          {
            day: 4,
            title: "Day Trip to Pompeii",
            description: "Overland travel by train to Pompeii; guided tour of the ruins to explore the preserved ancient city. Lunch in Pompeii."
          },
          {
            day: 5,
            title: "Renaissance & Ancient Contrast in Florence",
            description: "Early morning train to Florence. Check into a boutique hotel in a historic building. Guided walking tour through Florence's historic center."
          },
          {
            day: 6,
            title: "Cultural Deep Dive in Florence",
            description: "Visit the Uffizi Gallery and the ancient Roman structures in the city. Afternoon free time for exploring local markets and artisan workshops."
          },
          {
            day: 7,
            title: "Leisure Day & Countryside Excursion",
            description: "Relaxed morning exploring a local neighborhood. Optional half-day excursion into the Tuscan countryside for a wine tasting at a historic villa."
          },
          {
            day: 8,
            title: "Return & Departure",
            description: "Return to Rome via train (or fly out from Florence, if convenient) and transfer to the airport."
          }
        ],
        hotels: [
          "Hotel de Russie Rome",
          "Portrait Firenze",
          "Villa Cora Florence"
        ]
      },
      {
        title: "Egypt and the Nile",
        description: "Embark on an epic journey through ancient Egypt, from the pyramids of Giza to the temples of Luxor.",
        duration: 8,
        price: 3499,
        locations: "Cairo, Luxor, Nubian Village",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Great_Sphinx_of_Giza_-_20080716a.jpg/1280px-Great_Sphinx_of_Giza_-_20080716a.jpg",
        era: "Ancient Egypt",
        itinerary: [
          {
            day: 1,
            title: "Arrival in Cairo & Orientation",
            description: "Arrive in Cairo and check into a boutique hotel in the historic district. Evening welcome dinner in a traditional Egyptian restaurant."
          },
          {
            day: 2,
            title: "Giza Plateau Experience",
            description: "Full-day guided tour of the Great Pyramids and Sphinx. Lunch with a view of the pyramids. Free time in the afternoon for a camel ride."
          },
          {
            day: 3,
            title: "Cairo's Ancient Treasures",
            description: "Visit the Egyptian Museum and see pharaonic artifacts. Afternoon free for exploring Khan El Khalili or a local bazaar."
          },
          {
            day: 4,
            title: "Journey to Luxor",
            description: "Morning overland transfer to Luxor. Check into a historic boutique hotel along the Nile. Evening leisure time along the riverfront."
          },
          {
            day: 5,
            title: "West Bank of Luxor",
            description: "Guided tour of the Valley of the Kings, including hidden tombs and temple ruins. Lunch at a local eatery with Nile views."
          },
          {
            day: 6,
            title: "East Bank Exploration in Luxor",
            description: "Visit Karnak and Luxor Temples with a knowledgeable guide. Free time for self-guided exploration in Luxor's historic streets."
          },
          {
            day: 7,
            title: "Cultural Immersion in a Nubian Village",
            description: "Day trip to a nearby Nubian village: experience traditional life, art, and cuisine. Participate in a local artisan workshop."
          },
          {
            day: 8,
            title: "Reflection & Departure",
            description: "Morning free for leisure, a final stroll along the Nile, or last-minute shopping. Check out and transfer to the airport."
          }
        ],
        hotels: [
          "Marriott Mena House",
          "Hilton Luxor Resort & Spa",
          "Sofitel Winter Palace Luxor"
        ]
      }
    ];

    // Insert tour data
    for (const tour of tourData) {
      const { itinerary, hotels, ...tourInfo } = tour;
      const existing = await db.select().from(tours).where(eq(tours.title, tourInfo.title));

      if (existing.length === 0) {
        const createdTour = await this.createTour(tourInfo);

        // Add itinerary
        for (const day of itinerary) {
          await this.createItinerary({
            tourId: createdTour.id,
            ...day
          });
        }

        // Add hotel recommendations
        for (const hotel of hotels) {
          await this.createHotelRecommendation({
            tourId: createdTour.id,
            name: hotel
          });
        }
      }
    }
    const itineraryData = [
      {
        tourId: 7,
        day: 1,
        title: "Arrival & Orientation",
        description: "Arrive in Rome by train or flight. Check into a boutique hotel housed in a historic palazzo near the city center. Evening welcome dinner in a traditional trattoria in the Monti neighborhood."
      },
      {
        tourId: 7,
        day: 2,
        title: "Ancient Rome Immersion",
        description: "Morning guided walking tour of the Roman Forum and Palatine Hill. Lunch in a local osteria. Afternoon free time to explore Piazza Venezia or the nearby markets. Evening visit to a small museum focusing on early Roman history."
      },
      {
        tourId: 7,
        day: 3,
        title: "The Colosseum & Hidden Ruins",
        description: "Guided tour of the Colosseum with exclusive access to lesser-known passages. Explore underground tunnels and hear stories of gladiators. Free afternoon stroll in the surrounding ancient neighborhoods."
      },
      {
        tourId: 7,
        day: 4,
        title: "Art, Architecture & History",
        description: "Morning visit to the Capitoline Museums. Lunch near the Roman Forum. Free time to wander through cobblestone streets and piazzas. Evening cultural performance at a historic theatre."
      },
      {
        tourId: 7,
        day: 5,
        title: "Day Trip to Tivoli",
        description: "Overland excursion to Tivoli to see Hadrian's Villa and Villa d'Este. Guided tour highlighting the blend of Roman architecture and nature. Return to Rome in the late afternoon."
      },
      {
        tourId: 7,
        day: 6,
        title: "Local Life & Culinary History",
        description: "Morning guided market tour to sample local ingredients and learn about ancient Roman food traditions. Afternoon visit to a small workshop on ancient Roman cooking techniques."
      },
      {
        tourId: 7,
        day: 7,
        title: "Reflection & Departure",
        description: "Optional morning stroll through a local park or a short visit to a nearby museum. Check out and transfer to the train station or airport."
      }
    ];

    // Add itineraries using the storage interface
    for (const itinerary of itineraryData) {
      const existing = await db
        .select()
        .from(itineraries)
        .where(eq(itineraries.tourId, itinerary.tourId))
        .where(eq(itineraries.day, itinerary.day));

      if (existing.length === 0) {
        await this.createItinerary(itinerary);
      }
    }
  }
}

export const storage = new DatabaseStorage();
storage.initializeData().catch(console.error);