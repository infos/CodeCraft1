import { emperors, tours, itineraries, hotelRecommendations, 
  type Emperor, type InsertEmperor, 
  type Tour, type InsertTour,
  type Itinerary, type InsertItinerary,
  type HotelRecommendation, type InsertHotelRecommendation 
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
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
        description: "Experience the grandeur of ancient Rome through the eyes of its most powerful leaders.",
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

// Initialize storage with sample data
export const storage = new DatabaseStorage();
storage.initializeData().catch(console.error);