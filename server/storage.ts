import { type Emperor, type InsertEmperor, type Tour, type InsertTour } from "@shared/schema";

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

export class MemStorage implements IStorage {
  private emperors: Map<number, Emperor>;
  private tours: Map<number, Tour>;
  private emperorId: number;
  private tourId: number;

  constructor() {
    this.emperors = new Map();
    this.tours = new Map();
    this.emperorId = 1;
    this.tourId = 1;
    
    // Add some initial data
    this.initializeData();
  }

  private initializeData() {
    // Add sample emperors
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

    sampleEmperors.forEach(emperor => this.createEmperor(emperor));

    // Add sample tours
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

    sampleTours.forEach(tour => this.createTour(tour));
  }

  async getAllEmperors(): Promise<Emperor[]> {
    return Array.from(this.emperors.values());
  }

  async getEmperor(id: number): Promise<Emperor | undefined> {
    return this.emperors.get(id);
  }

  async createEmperor(insertEmperor: InsertEmperor): Promise<Emperor> {
    const id = this.emperorId++;
    const emperor: Emperor = { id, ...insertEmperor };
    this.emperors.set(id, emperor);
    return emperor;
  }

  async getAllTours(): Promise<Tour[]> {
    return Array.from(this.tours.values());
  }

  async getTour(id: number): Promise<Tour | undefined> {
    return this.tours.get(id);
  }

  async createTour(insertTour: InsertTour): Promise<Tour> {
    const id = this.tourId++;
    const tour: Tour = { id, ...insertTour };
    this.tours.set(id, tour);
    return tour;
  }
}

export const storage = new MemStorage();
