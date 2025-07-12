import { pgTable, text, serial, timestamp, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const eras = pgTable("eras", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  keyFigures: text("key_figures").array(),
  associatedTours: text("associated_tours").notNull(),
  startYear: integer("start_year"),
  endYear: integer("end_year"),
  description: text("description"),
  period: text("period")
});

export const emperors = pgTable("emperors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  era: text("era"),  
  startYear: integer("start_year").notNull(),
  endYear: integer("end_year").notNull(),
  description: text("description").notNull(),
  achievements: text("achievements").notNull(),
  imageUrl: text("image_url"),
  locations: text("locations").array(),
  region: text("region"),               // Geographic region (e.g., Mesopotamia, Egypt)
  dynasty: text("dynasty"),             // e.g., Old Babylonian, Neo-Babylonian
  modernCountry: text("modern_country"), // Present-day country where they ruled
  wikipediaUrl: text("wikipedia_url")    // Link to their Wikipedia page
});

export const tours = pgTable("tours", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  duration: integer("duration").notNull(),
  price: integer("price").notNull(),
  locations: text("locations").notNull(),
  imageUrl: text("image_url"),
  era: text("era"),
  wikipediaUrl: text("wikipedia_url"),
  imageAttribution: text("image_attribution")
});

export const itineraries = pgTable("itineraries", {
  id: serial("id").primaryKey(),
  tourId: integer("tour_id").notNull(),
  day: integer("day").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull()
});

export const hotelRecommendations = pgTable("hotel_recommendations", {
  id: serial("id").primaryKey(),
  tourId: integer("tour_id").notNull(),
  name: text("name").notNull()
});

export const eraImages = pgTable("era_images", {
  id: serial("id").primaryKey(),
  eraName: text("era_name").notNull().unique(),
  imageUrl: text("image_url").notNull(),
  imageDescription: text("image_description"),
  generatedAt: timestamp("generated_at").defaultNow(),
});

export const tourImages = pgTable("tour_images", {
  id: serial("id").primaryKey(),
  tourId: integer("tour_id").notNull(),
  tourTitle: text("tour_title").notNull(),
  imageUrl: text("image_url").notNull(),
  imageDescription: text("image_description"),
  prompt: text("prompt"),
  generatedAt: timestamp("generated_at").defaultNow(),
});

export const insertEraSchema = createInsertSchema(eras).omit({ id: true });
export const insertEmperorSchema = createInsertSchema(emperors).omit({ id: true });
export const insertTourSchema = createInsertSchema(tours).omit({ id: true });
export const insertItinerarySchema = createInsertSchema(itineraries).omit({ id: true });
export const insertHotelSchema = createInsertSchema(hotelRecommendations).omit({ id: true });
export const insertEraImageSchema = createInsertSchema(eraImages).omit({ id: true, generatedAt: true });
export const insertTourImageSchema = createInsertSchema(tourImages).omit({ id: true, generatedAt: true });

export type Era = typeof eras.$inferSelect;
export type InsertEra = z.infer<typeof insertEraSchema>;
export type Emperor = typeof emperors.$inferSelect;
export type InsertEmperor = z.infer<typeof insertEmperorSchema>;
export type Tour = typeof tours.$inferSelect;
export type InsertTour = z.infer<typeof insertTourSchema>;
export type Itinerary = typeof itineraries.$inferSelect;
export type InsertItinerary = z.infer<typeof insertItinerarySchema>;
export type HotelRecommendation = typeof hotelRecommendations.$inferSelect;
export type InsertHotelRecommendation = z.infer<typeof insertHotelSchema>;
export type EraImage = typeof eraImages.$inferSelect;
export type InsertEraImage = z.infer<typeof insertEraImageSchema>;
export type TourImage = typeof tourImages.$inferSelect;
export type InsertTourImage = z.infer<typeof insertTourImageSchema>;