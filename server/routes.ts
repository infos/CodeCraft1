import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import OpenAI from "openai";

export async function registerRoutes(app: Express): Promise<Server> {
  // AI Tour Generation endpoint
  app.post("/api/generate-tours", async (req, res) => {
    try {
      // Initialize OpenAI only when needed
      if (!process.env.OPENAI_API_KEY) {
        return res.status(500).json({ message: "OpenAI API key not configured" });
      }
      
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
      const { selectedPeriods, selectedEras, selectedLocations } = req.body;
      
      if (!selectedPeriods?.length && !selectedEras?.length) {
        return res.status(400).json({ message: "Please select at least one historical period or era" });
      }

      // Build context for the AI prompt
      let context = "Generate 5 unique multi-day heritage tours based on the following selections:\n";
      
      if (selectedPeriods?.length > 0) {
        context += `Historical Periods: ${selectedPeriods.join(', ')}\n`;
      }
      
      if (selectedEras?.length > 0) {
        context += `Specific Eras: ${selectedEras.join(', ')}\n`;
      }
      
      if (selectedLocations?.length > 0) {
        context += `Preferred Locations: ${selectedLocations.join(', ')}\n`;
      }

      const prompt = `${context}

For each tour, provide:
- A compelling title that reflects the historical theme
- Duration (4-7 days)
- Brief description highlighting unique aspects
- Daily itinerary with 2-3 authentic historical sites, museums, or ruins
- One recommended hotel per day with name and brief description
- Focus on historically accurate locations and experiences

Format the response as a JSON array of tour objects. Each tour should have:
{
  "title": "string",
  "duration": "X days", 
  "description": "string",
  "itinerary": [
    {
      "day": 1,
      "title": "string",
      "sites": [{"name": "string", "description": "string"}],
      "hotel": {"name": "string", "location": "string", "description": "string"}
    }
  ]
}`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          { role: "system", content: "You are an expert historical travel guide specializing in authentic heritage tourism. Provide only accurate historical information and real locations." },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
      });

      const responseContent = completion.choices[0].message.content;
      if (!responseContent) {
        throw new Error("No response from OpenAI");
      }

      const tours = JSON.parse(responseContent);
      res.json(tours);
      
    } catch (error) {
      console.error("Tour generation error:", error);
      res.status(500).json({ message: "Failed to generate tours. Please try again." });
    }
  });

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

  // Tour itineraries route
  app.get("/api/tours/:id/itineraries", async (req, res) => {
    try {
      const tourId = parseInt(req.params.id);
      if (isNaN(tourId)) {
        return res.status(400).json({ message: "Invalid tour ID" });
      }
      const itineraries = await storage.getItinerariesForTour(tourId);
      res.json(itineraries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tour itineraries" });
    }
  });

  // Tour hotels route
  app.get("/api/tours/:id/hotels", async (req, res) => {
    try {
      const hotels = await storage.getHotelsForTour(parseInt(req.params.id));
      res.json(hotels);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tour hotels" });
    }
  });

  // Add new era route
  app.get("/api/eras", async (req, res) => {
    try {
      const eras = await storage.getAllEras();
      res.json(eras);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch eras" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}