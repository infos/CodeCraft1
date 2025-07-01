import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
// Local tour generation without external AI dependencies

// Historical tour templates based on different eras and locations
const tourTemplates = {
  "Ancient Egypt": {
    locations: ["egypt", "cairo", "luxor", "giza"],
    tours: [
      {
        title: "Pharaohs and Pyramids Discovery",
        duration: "6 days",
        description: "Journey through the land of pharaohs, exploring the magnificent pyramids of Giza, the treasures of the Egyptian Museum, and the ancient temples of Luxor.",
        itinerary: [
          {
            day: 1,
            title: "Arrival in Cairo - Ancient Wonders",
            sites: [
              { name: "Egyptian Museum", description: "World's largest collection of ancient Egyptian artifacts" },
              { name: "Khan el-Khalili Bazaar", description: "Historic marketplace dating back to the 14th century" }
            ],
            hotel: { name: "Steigenberger Hotel El Tahrir", location: "Downtown Cairo", description: "Historic hotel overlooking the Nile River" }
          },
          {
            day: 2,
            title: "Giza Plateau - Pyramid Complex",
            sites: [
              { name: "Great Pyramid of Giza", description: "The only surviving Wonder of the Ancient World" },
              { name: "Great Sphinx", description: "Mysterious limestone statue with the body of a lion" }
            ],
            hotel: { name: "Mena House Hotel", location: "Giza", description: "Luxury hotel with pyramid views since 1869" }
          }
        ]
      },
      {
        title: "Valley of the Kings Expedition",
        duration: "5 days",
        description: "Discover the royal tombs and temples of ancient Thebes, including the tomb of Tutankhamun and the magnificent Temple of Karnak.",
        itinerary: [
          {
            day: 1,
            title: "Luxor East Bank - Temple Complex",
            sites: [
              { name: "Karnak Temple", description: "Vast temple complex dedicated to Amun-Ra" },
              { name: "Luxor Temple", description: "Ancient temple in the heart of modern Luxor" }
            ],
            hotel: { name: "Winter Palace Hotel", location: "Luxor", description: "Historic Victorian hotel on the Nile" }
          }
        ]
      }
    ]
  },
  "Ancient Rome": {
    locations: ["rome", "italy", "pompeii"],
    tours: [
      {
        title: "Imperial Rome and Gladiators",
        duration: "7 days",
        description: "Walk in the footsteps of emperors through the Colosseum, Roman Forum, and Palatine Hill, then explore the preserved city of Pompeii.",
        itinerary: [
          {
            day: 1,
            title: "Ancient Rome - Imperial Center",
            sites: [
              { name: "Colosseum", description: "Iconic amphitheater where gladiators fought" },
              { name: "Roman Forum", description: "Heart of ancient Roman political and commercial life" }
            ],
            hotel: { name: "Hotel Artemide", location: "Via Nazionale", description: "Elegant hotel near Termini Station" }
          },
          {
            day: 2,
            title: "Vatican and Classical Rome",
            sites: [
              { name: "Vatican Museums", description: "Papal collection including the Sistine Chapel" },
              { name: "Pantheon", description: "Best-preserved Roman building from antiquity" }
            ],
            hotel: { name: "Hotel de Russie", location: "Piazza del Popolo", description: "Luxury hotel with beautiful gardens" }
          }
        ]
      }
    ]
  },
  "Ancient Greece": {
    locations: ["greece", "athens", "delphi"],
    tours: [
      {
        title: "Classical Athens and Oracle of Delphi",
        duration: "6 days",
        description: "Experience the birthplace of democracy, philosophy, and theater through the Acropolis, Ancient Agora, and the mystical Oracle at Delphi.",
        itinerary: [
          {
            day: 1,
            title: "Acropolis and Ancient Athens",
            sites: [
              { name: "Parthenon", description: "Temple dedicated to Athena on the Acropolis" },
              { name: "Ancient Agora", description: "Center of political and commercial life" }
            ],
            hotel: { name: "Hotel Grande Bretagne", location: "Syntagma Square", description: "Historic luxury hotel since 1874" }
          }
        ]
      }
    ]
  },
  "Mesopotamia": {
    locations: ["iraq", "babylon", "mesopotamia"],
    tours: [
      {
        title: "Cradle of Civilization Tour",
        duration: "5 days",
        description: "Explore the birthplace of writing, law, and urban civilization through the ruins of Babylon, Ur, and other Mesopotamian sites.",
        itinerary: [
          {
            day: 1,
            title: "Baghdad and Ancient Babylon",
            sites: [
              { name: "National Museum of Iraq", description: "Mesopotamian artifacts and cuneiform tablets" },
              { name: "Babylon Archaeological Site", description: "Ruins of the ancient city and Hanging Gardens" }
            ],
            hotel: { name: "Baghdad Hotel", location: "Central Baghdad", description: "Historic hotel in the heart of the city" }
          }
        ]
      }
    ]
  }
};

function generateTours(selectedPeriods: string[], selectedEras: string[], selectedLocations: string[]): any {
  console.log("Generating tours for:", { selectedPeriods, selectedEras, selectedLocations });
  
  let availableTours: any[] = [];
  
  // Match tours based on selected eras
  for (const era of selectedEras) {
    if (tourTemplates[era as keyof typeof tourTemplates]) {
      const template = tourTemplates[era as keyof typeof tourTemplates];
      
      // Filter tours by location if specified
      if (selectedLocations.length > 0) {
        const matchingTours = template.tours.filter(tour => 
          selectedLocations.some(loc => 
            template.locations.some(tLoc => 
              tLoc.toLowerCase().includes(loc.toLowerCase()) || 
              loc.toLowerCase().includes(tLoc.toLowerCase())
            )
          )
        );
        availableTours.push(...matchingTours);
      } else {
        availableTours.push(...template.tours);
      }
    }
  }
  
  // If no era-specific tours found, generate based on periods and locations
  if (availableTours.length === 0) {
    for (const period of selectedPeriods) {
      if (period === "ancient") {
        // Add some tours from ancient civilizations
        if (selectedLocations.includes("egypt")) {
          availableTours.push(...tourTemplates["Ancient Egypt"].tours);
        }
        if (selectedLocations.includes("rome") || selectedLocations.includes("italy")) {
          availableTours.push(...tourTemplates["Ancient Rome"].tours);
        }
        if (selectedLocations.includes("greece")) {
          availableTours.push(...tourTemplates["Ancient Greece"].tours);
        }
      }
    }
  }
  
  // Ensure we have at least some tours
  if (availableTours.length === 0) {
    availableTours = [
      {
        title: "Ancient Civilizations Explorer",
        duration: "5 days",
        description: "A comprehensive journey through the most significant archaeological sites and museums of the ancient world.",
        itinerary: [
          {
            day: 1,
            title: "Archaeological Wonders",
            sites: [
              { name: "Ancient Ruins", description: "Explore well-preserved archaeological remains" },
              { name: "Heritage Museum", description: "Comprehensive collection of historical artifacts" }
            ],
            hotel: { name: "Heritage Grand Hotel", location: "Historic District", description: "Luxury accommodation in culturally rich area" }
          }
        ]
      }
    ];
  }
  
  // Return up to 5 tours
  return { tours: availableTours.slice(0, 5) };
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Local Tour Generation endpoint
  app.post("/api/generate-tours", async (req, res) => {
    try {
      console.log("Generating tours locally...");
      console.log("Request body:", req.body);
      
      const { selectedPeriods, selectedEras, selectedLocations } = req.body;
      
      if (!selectedPeriods?.length && !selectedEras?.length) {
        return res.status(400).json({ message: "Please select at least one historical period or era" });
      }

      const tours = generateTours(selectedPeriods || [], selectedEras || [], selectedLocations || []);
      
      console.log("Generated tours:", tours);
      res.json(tours);
      
    } catch (error: any) {
      console.error("Tour generation error:", error);
      console.error("Error details:", error?.message, error?.stack);
      res.status(500).json({ 
        message: "Failed to generate tours. Please try again.",
        error: error?.message || "Unknown error"
      });
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