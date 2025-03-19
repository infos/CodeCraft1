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
    return await db.select().from(itineraries).where(eq(itineraries.tourId, tourId));
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
        era: "Ancient Roman",
        startYear: -100,
        endYear: -44,
        description: "Gaius Julius Caesar was a Roman general, statesman, and author who transformed the Roman Republic through his military conquests and political reforms, setting the stage for the Roman Empire.",
        achievements: "Military conquests, political reforms, calendar reform, expansion of Roman citizenship",
        locations: ["Rome, Italy"],
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Julius_Caesar_Coustou_Louvre_MR1798.jpg/800px-Julius_Caesar_Coustou_Louvre_MR1798.jpg"
      },
      {
        name: "Augustus",
        era: "Ancient Roman",
        startYear: -63,
        endYear: 14,
        description: "Augustus was the first Roman emperor who established a period of relative peace known as the Pax Romana. His reign ushered in a golden age of art, literature, and monumental architecture.",
        achievements: "Established Pax Romana, reformed administration, expanded empire",
        locations: ["Rome, Italy"],
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Augustus_of_Prima_Porta_%28inv._2290%29.jpg/800px-Augustus_of_Prima_Porta_%28inv._2290%29.jpg"
      },
      {
        name: "Alexander the Great",
        era: "Ancient Greek",
        startYear: -356,
        endYear: -323,
        description: "Alexander the Great was king of Macedon and one of history's most successful military commanders. He created one of the largest empires of the ancient world by the age of thirty.",
        achievements: "Created vast empire spanning three continents, founded numerous cities, spread Hellenistic culture",
        locations: ["Pella, Greece", "Vergina, Greece"],
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Alexander_the_Great_mosaic.jpg/800px-Alexander_the_Great_mosaic.jpg"
      },
      {
        name: "Cleopatra VII",
        era: "Ancient Egyptian",
        startYear: -69,
        endYear: -30,
        description: "Cleopatra VII was the last active ruler of the Ptolemaic Kingdom of Egypt. Known for her intelligence, political acumen, and captivating charm, she remains one of history's most famous female rulers.",
        achievements: "Preserved Egyptian independence, modernized kingdom, patronage of learning",
        locations: ["Alexandria, Egypt"],
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Kleopatra-VII.-Altes-Museum-Berlin.jpg/800px-Kleopatra-VII.-Altes-Museum-Berlin.jpg"
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
        locations: "Rome, Forum Romanum, Palatine Hill",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Colosseum_in_Rome%2C_Italy_-_April_2007.jpg/1280px-Colosseum_in_Rome%2C_Italy_-_April_2007.jpg",
        itinerary: [
          {
            day: 1,
            title: "Arrival & Orientation in Rome",
            description: "Arrive in Rome and settle into a boutique hotel near the historic center."
          },
          {
            day: 2,
            title: "Roman Forum Experience",
            description: "Guided tour of the Roman Forum and Palatine Hill, with insights into Caesar's era."
          },
          {
            day: 3,
            title: "Colosseum and Hidden Ruins",
            description: "Visit the Colosseum with an exclusive behind-the-scenes tour."
          }
        ],
        hotels: ["Albergo del Senato", "Hotel Forum"]
      },
      {
        title: "Greek Myths and Legends",
        description: "Follow in the footsteps of Alexander the Great and discover the rich history of ancient Greece. Visit magnificent temples, ancient theaters, and historical museums.",
        duration: 8,
        price: 2799,
        locations: "Athens, Delphi, Vergina",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/The_Parthenon_in_Athens.jpg/1280px-The_Parthenon_in_Athens.jpg",
        itinerary: [
          {
            day: 1,
            title: "Welcome to Athens",
            description: "Arrive in Athens and check into the historic Herodion Hotel. Evening welcome dinner in Plaka."
          },
          {
            day: 2,
            title: "Acropolis and Ancient Agora",
            description: "Full day exploring the Acropolis, Parthenon, and Ancient Agora with an expert guide."
          },
          {
            day: 3,
            title: "Delphi Oracle Tour",
            description: "Day trip to the ancient sanctuary of Delphi, including the Temple of Apollo."
          }
        ],
        hotels: ["Herodion Hotel", "Plaka Hotel"]
      },
      {
        title: "Egyptian Pharaohs and Temples",
        description: "Discover the world of Cleopatra and the Ptolemaic dynasty. Explore ancient temples, tombs, and the legendary city of Alexandria.",
        duration: 10,
        price: 3299,
        locations: "Cairo, Alexandria, Luxor",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Great_Sphinx_of_Giza_-_20080716a.jpg/1280px-Great_Sphinx_of_Giza_-_20080716a.jpg",
        itinerary: [
          {
            day: 1,
            title: "Cairo Arrival",
            description: "Welcome to Cairo. Check-in at the historic Marriott Mena House overlooking the pyramids."
          },
          {
            day: 2,
            title: "Pyramids and Sphinx",
            description: "Full day exploring the Giza pyramid complex and the Great Sphinx."
          },
          {
            day: 3,
            title: "Alexandria Day Trip",
            description: "Visit Cleopatra's city, including the Bibliotheca Alexandrina and Pompey's Pillar."
          }
        ],
        hotels: ["Marriott Mena House", "Four Seasons Alexandria"]
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
  }
}

export const storage = new DatabaseStorage();
storage.initializeData().catch(console.error);