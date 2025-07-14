import { storage } from './storage';
import { generateTourContent } from './gemini';

async function addHotelsToAllTours() {
  try {
    console.log('Adding hotels to tours that don\'t have them...');
    
    // Get all tours
    const tours = await storage.getAllTours();
    console.log(`Found ${tours.length} tours`);
    
    for (const tour of tours) {
      try {
        // Check if tour already has hotels
        const existingHotels = await storage.getHotelsForTour(tour.id);
        
        if (existingHotels.length > 0) {
          console.log(`✓ Tour ${tour.id} (${tour.title}) already has ${existingHotels.length} hotels`);
          continue;
        }
        
        console.log(`\nGenerating hotels for ${tour.title}...`);
        
        // Generate hotel recommendations using AI
        const hotelData = await generateHotelRecommendations(tour);
        
        // Add hotels to database
        for (const hotel of hotelData) {
          await storage.createHotelRecommendation({
            tourId: tour.id,
            name: hotel.name,
            description: hotel.description,
            rating: hotel.rating || 4.5,
            pricePerNight: hotel.pricePerNight || 200,
            amenities: hotel.amenities || [],
            location: hotel.location || tour.locations || 'Historical Area',
            imageUrl: hotel.imageUrl,
            bookingUrl: hotel.bookingUrl
          });
        }
        
        console.log(`✅ Added ${hotelData.length} hotels to ${tour.title}`);
        
      } catch (error) {
        console.error(`Failed to add hotels to ${tour.title}:`, error);
      }
    }
    
    console.log('\n✅ Hotel generation complete!');
    
  } catch (error) {
    console.error('Error adding hotels to tours:', error);
  }
}

async function generateHotelRecommendations(tour: any): Promise<any[]> {
  try {
    const { GoogleGenAI } = await import('@google/genai');
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
    
    const prompt = `Generate 3-5 authentic hotel recommendations for the tour "${tour.title}" in ${tour.locations || 'historical destinations'}.
    
    Tour details:
    - Title: ${tour.title}
    - Description: ${tour.description}
    - Era: ${tour.era}
    - Locations: ${tour.locations}
    - Duration: ${tour.duration} days
    
    Requirements:
    - Use real hotels that exist in these locations
    - Include hotels of different price ranges (luxury, mid-range, budget)
    - Focus on hotels with historical significance or cultural relevance
    - Include proper amenities for heritage tourists
    - Use authentic booking URLs (booking.com, hotel websites)
    - Include realistic pricing per night
    
    Generate a JSON array with this structure:
    [
      {
        "name": "Hotel name",
        "description": "Hotel description emphasizing historical/cultural relevance",
        "rating": 4.5,
        "pricePerNight": 200,
        "amenities": ["WiFi", "Restaurant", "Historical Tours", "Cultural Center"],
        "location": "Specific area/district",
        "imageUrl": "https://example.com/hotel-image.jpg",
        "bookingUrl": "https://booking.com/hotel-link"
      }
    ]
    
    Respond only with valid JSON.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              description: { type: "string" },
              rating: { type: "number" },
              pricePerNight: { type: "number" },
              amenities: { type: "array", items: { type: "string" } },
              location: { type: "string" },
              imageUrl: { type: "string" },
              bookingUrl: { type: "string" }
            },
            required: ["name", "description", "rating", "pricePerNight", "location"]
          }
        }
      },
      contents: prompt,
    });

    const rawJson = response.text;
    if (!rawJson) {
      throw new Error("Empty response from Gemini");
    }

    return JSON.parse(rawJson);
    
  } catch (error) {
    console.error(`Error generating hotels for ${tour.title}:`, error);
    // Return fallback hotels
    return [
      {
        name: `Heritage Hotel ${tour.locations}`,
        description: `Comfortable accommodation near historical sites in ${tour.locations}`,
        rating: 4.0,
        pricePerNight: 180,
        amenities: ["WiFi", "Restaurant", "Tour Desk", "Cultural Center"],
        location: tour.locations || 'Historical Area',
        imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945",
        bookingUrl: "https://booking.com"
      }
    ];
  }
}

addHotelsToAllTours();