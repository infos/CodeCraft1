import { emperors, tours, type Emperor, type InsertEmperor, type Tour, type InsertTour } from "@shared/schema";
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

  // Add some initial data
  async initializeData() {
    const sampleEmperors: InsertEmperor[] = [
      {
        name: "Augustus",
        startYear: -27,
        endYear: 14,
        description: "First Roman Emperor who established the Principate",
        achievements: "Pax Romana, reformed administration, expanded empire",
        imageUrl: "https://example.com/augustus.jpg"
      },
      {
        name: "Marcus Aurelius",
        startYear: 161,
        endYear: 180,
        description: "Philosopher Emperor and last of the Five Good Emperors",
        achievements: "Wrote Meditations, defended empire's borders",
        imageUrl: "https://example.com/marcus.jpg"
      }
    ];

    const sampleTours: InsertTour[] = [
      {
        title: "Imperial Rome Experience",
        description: "Walk in the footsteps of emperors through ancient Rome",
        duration: 5,
        price: 1299,
        locations: "Rome, Ostia Antica, Tivoli",
        imageUrl: "https://example.com/rome-tour.jpg"
      },
      {
        title: "Augustus Path",
        description: "Explore the legacy of Rome's first emperor",
        duration: 3,
        price: 899,
        locations: "Rome, Naples, Capri",
        imageUrl: "https://example.com/augustus-tour.jpg"
      }
    ];

    // Insert sample emperors
    for (const emperor of sampleEmperors) {
      const existing = await db.select().from(emperors).where(eq(emperors.name, emperor.name));
      if (existing.length === 0) {
        await this.createEmperor(emperor);
      }
    }

    // Insert sample tours
    for (const tour of sampleTours) {
      const existing = await db.select().from(tours).where(eq(tours.title, tour.title));
      if (existing.length === 0) {
        await this.createTour(tour);
      }
    }
  }
}

// Initialize storage with sample data
export const storage = new DatabaseStorage();
storage.initializeData().catch(console.error);