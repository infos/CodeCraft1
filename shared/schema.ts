import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const emperors = pgTable("emperors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  startYear: integer("start_year").notNull(),
  endYear: integer("end_year").notNull(),
  description: text("description").notNull(),
  achievements: text("achievements").notNull(),
  imageUrl: text("image_url")
});

export const tours = pgTable("tours", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  duration: integer("duration").notNull(),
  price: integer("price").notNull(),
  locations: text("locations").notNull(),
  imageUrl: text("image_url")
});

export const insertEmperorSchema = createInsertSchema(emperors).omit({ id: true });
export const insertTourSchema = createInsertSchema(tours).omit({ id: true });

export type Emperor = typeof emperors.$inferSelect;
export type InsertEmperor = z.infer<typeof insertEmperorSchema>;
export type Tour = typeof tours.$inferSelect;
export type InsertTour = z.infer<typeof insertTourSchema>;
