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

  async initializeData() {
    const sampleEmperors: InsertEmperor[] = [
      {
        name: "Augustus",
        startYear: -27,
        endYear: 14,
        description: "First Roman Emperor who established the Principate. Augustus transformed Rome from a republic into an empire during his 40-year reign, ushering in an era of unprecedented peace and prosperity known as the Pax Romana.",
        achievements: "Established Pax Romana, reformed Roman administration and military, initiated major building projects, secured Roman borders, created efficient postal service, and developed road networks.",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/e/eb/Augustus_of_Prima_Porta_%28inv._2290%29.jpg"
      },
      {
        name: "Marcus Aurelius",
        startYear: 161,
        endYear: 180,
        description: "Known as the Philosopher Emperor and the last of the Five Good Emperors. Marcus Aurelius was a practitioner of Stoicism and wrote 'Meditations', a series of personal writings reflecting on his life, leadership, and philosophical ideals.",
        achievements: "Wrote Meditations, successfully defended empire's borders against Parthians and Germanic tribes, handled the Antonine Plague crisis, promoted philosophy and education.",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/4/41/Marcus_Aurelius_Metropolitan_Museum.png"
      }
    ];

    const sampleTours: InsertTour[] = [
      {
        title: "Imperial Rome Experience",
        description: "Walk in the footsteps of emperors through ancient Rome. Visit the magnificent Colosseum, Roman Forum, and Palatine Hill where emperors once ruled. Experience the grandeur of Imperial Rome through its most iconic monuments.",
        duration: 5,
        price: 1299,
        locations: "Rome (41.8902, 12.4922), Ostia Antica (41.7556, 12.2883), Tivoli (41.9633, 12.7955)",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d8/Colosseum_in_Rome-April_2007-1-_copie_2B.jpg"
      },
      {
        title: "Augustus Path",
        description: "Explore the legacy of Rome's first emperor through the monuments and cities he transformed. Visit his mausoleum, the remains of his Forum, and his villa at Prima Porta. Experience the architectural revolution Augustus initiated.",
        duration: 3,
        price: 899,
        locations: "Rome (41.8902, 12.4922), Naples (40.8518, 14.2681), Capri (40.5532, 14.2222)",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/6/66/Forum_of_Augustus_4.jpg"
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