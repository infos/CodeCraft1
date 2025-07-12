import { emperors, tours, itineraries, hotelRecommendations, eraImages, tourImages, type Emperor, type InsertEmperor, type Tour, type InsertTour, type Itinerary, type InsertItinerary, type HotelRecommendation, type InsertHotelRecommendation, type Era, type InsertEra, eras, type EraImage, type InsertEraImage, type TourImage, type InsertTourImage } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import * as fs from 'fs';
import * as path from 'path';

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

  // Era image operations
  getAllEraImages(): Promise<EraImage[]>;
  getEraImage(eraName: string): Promise<EraImage | undefined>;
  createEraImage(eraImage: InsertEraImage): Promise<EraImage>;
  updateEraImage(eraName: string, eraImage: Partial<InsertEraImage>): Promise<EraImage>;

  // Tour image operations
  getAllTourImages(): Promise<TourImage[]>;
  getTourImage(tourId: number, tourTitle: string): Promise<TourImage | undefined>;
  getTourImagesByTourId(tourId: number): Promise<TourImage[]>;
  createTourImage(tourImage: InsertTourImage): Promise<TourImage>;
  updateTourImage(id: number, tourImage: Partial<InsertTourImage>): Promise<TourImage>;
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

  async getAllEraImages(): Promise<EraImage[]> {
    return db.select().from(eraImages);
  }

  async getEraImage(eraName: string): Promise<EraImage | undefined> {
    const [image] = await db.select().from(eraImages).where(eq(eraImages.eraName, eraName));
    return image || undefined;
  }

  async createEraImage(insertEraImage: InsertEraImage): Promise<EraImage> {
    const [image] = await db.insert(eraImages).values(insertEraImage).returning();
    return image;
  }

  async updateEraImage(eraName: string, updateData: Partial<InsertEraImage>): Promise<EraImage> {
    const [image] = await db.update(eraImages)
      .set(updateData)
      .where(eq(eraImages.eraName, eraName))
      .returning();
    return image;
  }

  // Tour image operations
  async getAllTourImages(): Promise<TourImage[]> {
    return db.select().from(tourImages);
  }

  async getTourImage(tourId: number, tourTitle: string): Promise<TourImage | undefined> {
    const [image] = await db.select().from(tourImages)
      .where(eq(tourImages.tourId, tourId));
    return image || undefined;
  }

  async getTourImagesByTourId(tourId: number): Promise<TourImage[]> {
    return db.select().from(tourImages).where(eq(tourImages.tourId, tourId));
  }

  async createTourImage(insertTourImage: InsertTourImage): Promise<TourImage> {
    const [image] = await db.insert(tourImages).values(insertTourImage).returning();
    return image;
  }

  async updateTourImage(id: number, updateData: Partial<InsertTourImage>): Promise<TourImage> {
    const [image] = await db.update(tourImages)
      .set(updateData)
      .where(eq(tourImages.id, id))
      .returning();
    return image;
  }

  async initializeData() {
    // Initialize historical eras
    const historicalEras = [
      { name: "Ancient Near Eastern", keyFigures: ["Sumerians", "Akkadians", "Babylonians"], associatedTours: "Mesopotamian Tour", startYear: -3200, endYear: -539, description: "Cradle of civilization" },
      { name: "Ancient Egypt", keyFigures: ["Pharaohs", "Cleopatra"], associatedTours: "Egyptian Tour", startYear: -3150, endYear: -30, description: "Civilization along the Nile" },
      { name: "Ancient Greece", keyFigures: ["Alexander the Great"], associatedTours: "Greek Tour", startYear: -800, endYear: -146, description: "Birthplace of democracy" },
      { name: "Ancient Rome", keyFigures: ["Caesar", "Augustus"], associatedTours: "Roman Tour", startYear: -753, endYear: 476, description: "Empire that shaped Europe" }
    ];

    for (const era of historicalEras) {
      const existing = await db.select().from(eras).where(eq(eras.name, era.name));
      if (existing.length === 0) {
        await this.createEra(era);
      }
    }

    // Initialize emperors
    const historicalFigures = [
      { name: "Julius Caesar", era: "Ancient Rome", startYear: -100, endYear: -44, description: "Roman general and statesman", achievements: "Military conquests", imageUrl: "https://example.com/caesar.jpg", locations: ["Rome"] },
      { name: "Alexander the Great", era: "Ancient Greece", startYear: -356, endYear: -323, description: "King of Macedon", achievements: "Created vast empire", imageUrl: "https://example.com/alexander.jpg", locations: ["Pella"] }
    ];

    for (const figure of historicalFigures) {
      const existing = await db.select().from(emperors).where(eq(emperors.name, figure.name));
      if (existing.length === 0) {
        await this.createEmperor(figure);
      }
    }

    // Check if tours exist and initialize only if empty
    const existingTours = await db.select().from(tours);
    if (existingTours.length === 0) {
      // For simplicity, we'll check for tours.json file
      try {
        const toursFilePath = path.join(process.cwd(), 'data', 'tours.json');
        if (fs.existsSync(toursFilePath)) {
          const toursFileContent = fs.readFileSync(toursFilePath, 'utf-8');
          const { tours: tourData } = JSON.parse(toursFileContent);
          
          for (const tour of tourData) {
            const { itinerary, hotels, ...tourInfo } = tour;
            
            // Create tour
            const createdTour = await this.createTour(tourInfo);
            
            // Add itinerary days
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
      } catch (error) {
        console.error("Error initializing tour data:", error);
      }
    }
  }
}

export const storage = new DatabaseStorage();
storage.initializeData().catch(error => console.error("Error initializing data:", error));
