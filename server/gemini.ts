import * as fs from "fs";
import { GoogleGenAI, Modality } from "@google/genai";

// DON'T DELETE THIS COMMENT
// Follow these instructions when using this blueprint:
// - Note that the newest Gemini model series is "gemini-2.5-flash" or gemini-2.5-pro"
//   - do not change this unless explicitly requested by the user

// This API key is from Gemini Developer API Key, not vertex AI API Key
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateEraImage(
    eraName: string,
    eraDescription: string,
    imagePath: string,
): Promise<{ imageUrl: string; description?: string }> {
    try {
        // Create a detailed prompt for historical accuracy
        const prompt = `Create a historically accurate and visually stunning image representing ${eraName}. ${eraDescription}. 
        
        The image should be:
        - Photorealistic and detailed
        - Historically accurate with authentic architecture, clothing, and artifacts
        - Rich in color and atmosphere
        - Suitable for a tourism website showcasing historical heritage
        - Professional quality with good composition and lighting
        
        Focus on iconic elements that would immediately identify this historical period, such as famous monuments, typical architecture, cultural artifacts, or landscapes that define this era.`;

        // IMPORTANT: only this gemini model supports image generation
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash-preview-image-generation",
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            config: {
                responseModalities: [Modality.TEXT, Modality.IMAGE],
            },
        });

        const candidates = response.candidates;
        if (!candidates || candidates.length === 0) {
            throw new Error("No image generated");
        }

        const content = candidates[0].content;
        if (!content || !content.parts) {
            throw new Error("No content parts in response");
        }

        let generatedDescription = "";
        for (const part of content.parts) {
            if (part.text) {
                generatedDescription = part.text;
                console.log(`Generated image description: ${part.text}`);
            } else if (part.inlineData && part.inlineData.data) {
                const imageData = Buffer.from(part.inlineData.data, "base64");

                fs.writeFileSync(imagePath, imageData);
                console.log(`Era image saved as ${imagePath}`);
                const imageUrl = imagePath.replace('client/public', '');
                return { imageUrl, description: generatedDescription };
            }
        }
        
        throw new Error("No image data found in response");
    } catch (error) {
        console.error(`Failed to generate image for ${eraName}:`, error);
        throw new Error(`Failed to generate image for ${eraName}: ${error}`);
    }
}

export async function generateAllEraImages(): Promise<Record<string, string>> {
    const eras = [
        { name: "Egypt", description: "Ancient Egypt with pyramids, pharaohs, and Nile River civilization", year: "3100 - 30 BCE" },
        { name: "Mesopotamia", description: "Cradle of civilization with ziggurats, cuneiform writing, and ancient cities like Babylon", year: "3500 - 539 BCE" },
        { name: "Greece", description: "Ancient Greece with Parthenon, democracy, philosophy, and Olympic Games", year: "800 - 146 BCE" },
        { name: "Rome", description: "Roman Empire with Colosseum, gladiators, aqueducts, and imperial conquest", year: "753 BCE - 476 CE" },
        { name: "Roman Empire", description: "Peak of Roman power with grand architecture, legions, and vast territorial control", year: "27 BCE - 476 CE" },
        { name: "Byzantine Empire", description: "Eastern Roman Empire with Orthodox Christianity, Constantinople, and Byzantine art", year: "330 - 1453 CE" },
        { name: "Ancient China", description: "Imperial China with Great Wall, Silk Road, terracotta warriors, and ancient dynasties", year: "221 BCE - 220 CE" },
        { name: "Ancient India", description: "Golden Age of India with Buddhism, Hinduism, elaborate temples, and Gupta Empire", year: "600 BCE - 600 CE" },
        { name: "Early Middle Ages", description: "Medieval Europe with castles, knights, monasteries, and feudal kingdoms", year: "476 - 1000 CE" },
        { name: "High Middle Ages", description: "Age of Faith with Gothic cathedrals, Crusades, and chivalric culture", year: "1000 - 1300 CE" },
        { name: "Late Middle Ages", description: "Medieval period with late Gothic architecture, universities, and cultural transformation", year: "1300 - 1500 CE" },
        { name: "Italian Renaissance", description: "Renaissance Italy with artistic masterpieces, Florence, Venice, and cultural rebirth", year: "1400 - 1600 CE" },
        { name: "Northern Renaissance", description: "Northern European Renaissance with printing press, detailed paintings, and cultural flowering", year: "1450 - 1600 CE" },
        { name: "Age of Exploration", description: "Age of Discovery with sailing ships, new world exploration, and maritime adventures", year: "1400 - 1600 CE" },
        { name: "Industrial Revolution", description: "Industrial age with steam engines, factories, railways, and technological advancement", year: "1760 - 1840 CE" },
        { name: "World Wars", description: "20th century global conflicts with historical significance and remembrance sites", year: "1914 - 1945 CE" },
        { name: "Space Age", description: "Modern space exploration with rockets, satellites, and technological achievement", year: "1957 - Present" }
    ];

    const imageUrls: Record<string, string> = {};
    
    for (const era of eras) {
        try {
            const imagePath = `client/public/era-images/${era.name.toLowerCase().replace(/\s+/g, '-')}.jpg`;
            
            // Create directory if it doesn't exist
            const dir = 'client/public/era-images';
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            
            await generateEraImage(era.name, era.description, imagePath);
            imageUrls[era.name] = `/era-images/${era.name.toLowerCase().replace(/\s+/g, '-')}.jpg`;
            
            // Add a small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
            console.error(`Failed to generate image for ${era.name}:`, error);
            // Continue with other eras even if one fails
        }
    }
    
    return imageUrls;
}

export async function generateTourVideo(
    tourTitle: string,
    tourDescription: string,
    era: string,
    videoPath: string,
): Promise<{ videoUrl: string; description?: string }> {
    try {
        // Create a detailed prompt for the tour's historical era
        const prompt = `Create a cinematic and historically accurate image representing ${tourTitle} in the ${era} era. ${tourDescription}
        
        The image should show:
        - Authentic historical architecture and landmarks from ${era}
        - Dramatic cinematic lighting with rich, warm colors
        - Historical figures in period-appropriate clothing
        - Atmospheric perspective that captures the essence of the era
        - Documentary-quality composition suitable for tourism
        - Golden hour or dramatic sunset lighting
        - Sense of grandeur and historical significance
        
        Style: Cinematic, epic, historically accurate, with the quality of a historical documentary or period film. The image should transport viewers to ${era} and make them want to visit these historical sites.`;

        // Generate the tour era image/video
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash-preview-image-generation",
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            config: {
                responseModalities: [Modality.TEXT, Modality.IMAGE],
            },
        });

        const candidates = response.candidates;
        if (!candidates || candidates.length === 0) {
            throw new Error(`No image generated for ${tourTitle}`);
        }

        const content = candidates[0].content;
        if (!content || !content.parts) {
            throw new Error("No content parts in response");
        }

        let generatedDescription = "";
        for (const part of content.parts) {
            if (part.text) {
                generatedDescription = part.text;
                console.log(`Generated ${tourTitle} description: ${part.text}`);
            } else if (part.inlineData && part.inlineData.data) {
                const imageData = Buffer.from(part.inlineData.data, "base64");
                fs.writeFileSync(videoPath, imageData);
                console.log(`${tourTitle} era image saved as ${videoPath}`);
                const videoUrl = videoPath.replace('client/public', '');
                return { videoUrl, description: generatedDescription };
            }
        }
        
        throw new Error(`No image data found in ${tourTitle} response`);
    } catch (error) {
        console.error(`Failed to generate ${tourTitle} era image:`, error);
        throw new Error(`Failed to generate ${tourTitle} era image: ${error}`);
    }
}

export async function generateTourImages(
    tourId: number,
    tourTitle: string,
    tourEra: string,
    tourLocation: string
): Promise<{ images: Array<{ url: string; description: string; source: string; attribution: string }> }> {
    try {
        // Import the wikimedia functions
        const { searchWikimediaImages, searchTourismImages, getHistoricalSiteImages } = await import('./wikimedia');
        
        console.log(`Searching for real images for tour: ${tourTitle} in ${tourLocation}, era: ${tourEra}`);
        
        // Search for real images from multiple sources with specific historical terms
        const searchTerms = [
            `${tourLocation} ruins ancient`,
            `${tourLocation} archaeological site`,
            `Mesopotamia ancient architecture`,
            `Ancient Near East historical`,
            `Babylon historical photograph`
        ];
        
        const wikimediaResults = [];
        for (const term of searchTerms.slice(0, 3)) {
            try {
                const results = await searchWikimediaImages(term, 2);
                wikimediaResults.push(...results);
            } catch (error) {
                console.log(`Search failed for term: ${term}`);
                continue;
            }
        }
        
        const wikimediaImages = wikimediaResults.slice(0, 4);
        const tourismImages: any[] = []; // Simplified for now
        const siteImages: any[] = [];
        
        // Combine all images and format them
        const allImages = [
            ...wikimediaImages.map(img => ({
                url: img.url,
                description: img.description || `Historical site in ${tourLocation}`,
                source: img.source,
                attribution: img.attribution
            })),
            ...tourismImages.map(img => ({
                url: img.url,
                description: img.description || `Historical site in ${tourLocation}`,
                source: img.source,
                attribution: img.attribution
            })),
            ...siteImages.map(img => ({
                url: img.url,
                description: img.description || `Archaeological site in ${tourLocation}`,
                source: img.source,
                attribution: img.attribution
            }))
        ];
        
        // Remove duplicates and limit to 6 images
        const uniqueImages = allImages.filter((img, index, self) => 
            index === self.findIndex(i => i.url === img.url)
        ).slice(0, 6);
        
        console.log(`Found ${uniqueImages.length} real images for ${tourTitle}`);
        
        // If we have fewer than 3 real images, supplement with AI-generated ones
        if (uniqueImages.length < 3) {
            console.log(`Only found ${uniqueImages.length} real images, generating additional AI images...`);
            
            const aiImages = await generateAITourImages(tourId, tourTitle, tourEra, tourLocation, 3 - uniqueImages.length);
            uniqueImages.push(...aiImages);
        }
        
        return { images: uniqueImages };
    } catch (error) {
        console.error(`Failed to generate tour images for ${tourTitle}:`, error);
        // Fallback to AI-generated images
        const aiImages = await generateAITourImages(tourId, tourTitle, tourEra, tourLocation, 4);
        return { images: aiImages };
    }
}

async function generateAITourImages(
    tourId: number,
    tourTitle: string,
    tourEra: string,
    tourLocation: string,
    count: number = 4
): Promise<Array<{ url: string; description: string; source: string; attribution: string }>> {
    const aiImages = [];
    
    for (let i = 0; i < count; i++) {
        try {
            const prompt = `Create a historically accurate and visually stunning image representing "${tourTitle}" in ${tourLocation} during the ${tourEra} era.
            
            The image should capture:
            - Authentic ${tourEra} architecture and monuments
            - Historical accuracy with period-appropriate details
            - Rich colors and atmospheric lighting
            - Professional tourism photography quality
            - Inspiring composition that showcases the heritage site
            
            Style: Professional travel photography, historically accurate, inspiring.`;

            const response = await ai.models.generateContent({
                model: "gemini-2.0-flash-preview-image-generation",
                contents: [{ role: "user", parts: [{ text: prompt }] }],
                config: {
                    responseModalities: [Modality.TEXT, Modality.IMAGE],
                },
            });

            const candidates = response.candidates;
            if (!candidates || candidates.length === 0) continue;

            const content = candidates[0].content;
            if (!content || !content.parts) continue;

            let generatedDescription = "";
            const imagePath = `client/public/tour-images/tour-${tourId}-ai-${i}-${Date.now()}.jpg`;
            
            // Ensure directory exists
            const dir = 'client/public/tour-images';
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }

            for (const part of content.parts) {
                if (part.text) {
                    generatedDescription = part.text;
                } else if (part.inlineData && part.inlineData.data) {
                    const imageData = Buffer.from(part.inlineData.data, "base64");
                    fs.writeFileSync(imagePath, imageData);
                    
                    const imageUrl = imagePath.replace('client/public', '');
                    aiImages.push({
                        url: imageUrl,
                        description: generatedDescription || `AI-generated image of ${tourTitle}`,
                        source: 'AI Generated (Gemini)',
                        attribution: 'Generated by Google Gemini AI'
                    });
                    break;
                }
            }
        } catch (error) {
            console.error(`Failed to generate AI image ${i} for ${tourTitle}:`, error);
            continue;
        }
    }
    
    return aiImages;
}

export async function generateTourContent(era: any): Promise<any> {
  try {
    console.log(`Generating comprehensive tour content for ${era.name}...`);
    
    const prompt = `Create a comprehensive historical tour for the era "${era.name}" (${era.startYear} - ${era.endYear}).
    
    Era details:
    - Name: ${era.name}
    - Period: ${era.startYear} - ${era.endYear}
    - Key Figures: ${era.keyFigures || 'Historical figures of the era'}
    - Description: ${era.description || 'A significant historical period'}
    - Modern Regions: ${era.modernRegions || 'Historical territories'}
    
    Generate a detailed JSON response with the following structure:
    {
      "title": "Engaging tour title (50-80 characters)",
      "description": "Compelling tour description highlighting unique aspects (150-200 words)",
      "duration": 7,
      "price": 2500,
      "locations": "Main destinations and regions",
      "wikipediaUrl": "Relevant Wikipedia URL for the era",
      "imageUrl": "Museum or cultural institution image URL",
      "imageAttribution": "Proper attribution for the image",
      "itineraries": [
        {
          "day": 1,
          "title": "Day title",
          "description": "Day description",
          "activities": ["Activity 1", "Activity 2", "Activity 3"],
          "meals": ["Breakfast: Description", "Lunch: Description", "Dinner: Description"],
          "accommodation": "Hotel description"
        }
      ],
      "hotels": [
        {
          "name": "Hotel name",
          "description": "Hotel description with historical relevance",
          "rating": 4.5,
          "pricePerNight": 200,
          "amenities": ["Amenity 1", "Amenity 2", "Amenity 3"],
          "location": "Hotel location",
          "imageUrl": "Hotel image URL",
          "bookingUrl": "Booking.com or hotel website URL"
        }
      ]
    }
    
    Requirements:
    - Create historically accurate content
    - Include 7 days of detailed itineraries
    - Include 3-5 authentic hotel recommendations
    - Use real museum/cultural institution image URLs
    - Include proper attributions
    - Focus on authentic historical sites and experiences
    - Price tours realistically for historical/cultural travel
    
    Respond only with valid JSON.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            title: { type: "string" },
            description: { type: "string" },
            duration: { type: "number" },
            price: { type: "number" },
            locations: { type: "string" },
            wikipediaUrl: { type: "string" },
            imageUrl: { type: "string" },
            imageAttribution: { type: "string" },
            itineraries: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  day: { type: "number" },
                  title: { type: "string" },
                  description: { type: "string" },
                  activities: { type: "array", items: { type: "string" } },
                  meals: { type: "array", items: { type: "string" } },
                  accommodation: { type: "string" }
                }
              }
            },
            hotels: {
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
                }
              }
            }
          },
          required: ["title", "description", "duration", "price", "locations"]
        }
      },
      contents: prompt,
    });

    const rawJson = response.text;
    if (!rawJson) {
      throw new Error("Empty response from Gemini");
    }

    console.log(`Generated tour content for ${era.name}`);
    return JSON.parse(rawJson);
    
  } catch (error) {
    console.error(`Error generating tour content for ${era.name}:`, error);
    throw error;
  }
}

export async function generateMarcusAureliusVideo(
    videoPath: string,
): Promise<{ videoUrl: string; description?: string }> {
    return generateTourVideo(
        "Marcus Aurelius Era",
        "The reign of Marcus Aurelius (161-180 CE), the philosopher emperor of Rome",
        "Ancient Rome",
        videoPath
    );
}