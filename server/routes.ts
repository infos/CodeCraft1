import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Emperor routes
  app.get("/api/emperors", async (req, res) => {
    try {
      const emperors = await storage.getAllEmperors();
      res.json(emperors);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch emperors" });
    }
  });

  app.get("/api/emperors/:id", async (req, res) => {
    try {
      const emperor = await storage.getEmperor(parseInt(req.params.id));
      if (!emperor) {
        return res.status(404).json({ message: "Emperor not found" });
      }
      res.json(emperor);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch emperor" });
    }
  });

  // Tour routes
  app.get("/api/tours", async (req, res) => {
    try {
      const tours = await storage.getAllTours();
      res.json(tours);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tours" });
    }
  });

  app.get("/api/tours/:id", async (req, res) => {
    try {
      const tour = await storage.getTour(parseInt(req.params.id));
      if (!tour) {
        return res.status(404).json({ message: "Tour not found" });
      }
      res.json(tour);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tour" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
