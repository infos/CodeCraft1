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

export async function generateTourCarouselImages(
    tourId: number,
    tourTitle: string,
    tourEra: string,
    tourDescription: string,
    tourLocations: string
): Promise<Array<{ imageUrl: string; description: string; imagePath: string }>> {
    const imagePrompts = [
        {
            suffix: "",
            description: `Main panoramic view of ${tourTitle}`,
            focus: `Create a cinematic, wide panoramic view showcasing the main highlights of ${tourTitle}. Feature the most iconic architecture and landscapes from ${tourEra}. Show ${tourDescription}. Use dramatic lighting and composition suitable for a premium travel brochure.`
        },
        {
            suffix: "-architecture",
            description: `Historical architecture from ${tourTitle}`,
            focus: `Focus on detailed historical architecture from ${tourEra}. Show authentic period buildings, monuments, and structural details. Capture the architectural style and craftsmanship typical of ${tourEra}. Include authentic architectural elements and decorative details.`
        },
        {
            suffix: "-cultural",
            description: `Cultural heritage experience from ${tourTitle}`,
            focus: `Showcase the cultural heritage and daily life aspects of ${tourEra}. Include authentic cultural elements, traditional activities, and heritage sites. Show people in period-appropriate clothing engaging in historical activities.`
        },
        {
            suffix: "-landscape",
            description: `Scenic landscape and environment from ${tourTitle}`,
            focus: `Feature the natural landscape and environmental setting of ${tourLocations}. Show the geographical context and natural beauty that surrounds the historical sites. Include dramatic natural lighting and scenic vistas.`
        }
    ];

    const results = [];
    
    for (const [index, promptData] of imagePrompts.entries()) {
        try {
            const imageName = tourTitle.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
            const imagePath = `client/public/tour-images/${imageName}${promptData.suffix}.jpg`;
            
            const fullPrompt = `${promptData.focus}
            
            Historical Context: ${tourEra}
            Tour Description: ${tourDescription}
            Locations: ${tourLocations}
            
            Style: Historically accurate, cinematic, high-quality travel photography suitable for a premium heritage tourism brochure.`;

            // Create directory if it doesn't exist
            const dir = 'client/public/tour-images';
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }

            const response = await ai.models.generateContent({
                model: "gemini-2.0-flash-preview-image-generation",
                contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
                config: {
                    responseModalities: [Modality.TEXT, Modality.IMAGE],
                },
            });

            const candidates = response.candidates;
            if (!candidates || candidates.length === 0) {
                continue;
            }

            const content = candidates[0].content;
            if (!content || !content.parts) {
                continue;
            }

            let generatedDescription = promptData.description;
            for (const part of content.parts) {
                if (part.text) {
                    console.log(`Generated image description: ${part.text}`);
                } else if (part.inlineData && part.inlineData.data) {
                    const imageData = Buffer.from(part.inlineData.data, "base64");
                    fs.writeFileSync(imagePath, imageData);
                    console.log(`Tour carousel image ${index + 1} saved as ${imagePath}`);
                    
                    const imageUrl = imagePath.replace('client/public', '');
                    results.push({ 
                        imageUrl, 
                        description: generatedDescription,
                        imagePath: imagePath
                    });
                    break;
                }
            }
            
            // Small delay between generations
            await new Promise(resolve => setTimeout(resolve, 2000));
            
        } catch (error) {
            console.error(`Failed to generate carousel image ${index + 1} for ${tourTitle}:`, error);
        }
    }
    
    return results;
}

export async function generateImage(
    prompt: string,
    imagePath: string
): Promise<{ imageUrl: string; description?: string }> {
    try {
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
                console.log(`Tour image saved as ${imagePath}`);
                const imageUrl = imagePath.replace('client/public', '');
                return { imageUrl, description: generatedDescription };
            }
        }
        
        throw new Error("No image data found in response");
    } catch (error) {
        console.error(`Failed to generate image:`, error);
        throw new Error(`Failed to generate image: ${error}`);
    }
}

export async function generateTourItinerary(
    tourId: number,
    tourTitle: string,
    tourEra: string,
    tourDescription: string,
    tourDuration: number,
    tourLocations: string
): Promise<any[]> {
    try {
        const prompt = `Generate a detailed, historically accurate ${tourDuration}-day itinerary for "${tourTitle}" in the ${tourEra} era. 
        
        Tour Description: ${tourDescription}
        Locations: ${tourLocations}
        
        Create a comprehensive day-by-day itinerary with:
        - Historically accurate sites and activities
        - Real locations and landmarks from ${tourEra}
        - Authentic cultural experiences
        - Detailed descriptions of what visitors will see and do
        - Educational content about the historical significance
        - Practical information about each day's activities
        
        Format as a JSON array with objects containing:
        - day (number)
        - title (string): engaging title for the day
        - description (string): detailed description of activities, sites, and experiences
        
        Focus on authentic historical content, real archaeological sites, museums, and cultural experiences that accurately represent ${tourEra}. Include specific details about architecture, artifacts, and historical context.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            config: {
                systemInstruction: "You are a historical tourism expert specializing in authentic travel experiences. Generate detailed, historically accurate itineraries.",
                responseMimeType: "application/json",
                responseSchema: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            day: { type: "number" },
                            title: { type: "string" },
                            description: { type: "string" }
                        },
                        required: ["day", "title", "description"]
                    }
                }
            },
            contents: prompt,
        });

        const rawJson = response.text;
        if (rawJson) {
            const itinerary = JSON.parse(rawJson);
            console.log(`Generated ${itinerary.length}-day itinerary for ${tourTitle}`);
            return itinerary;
        } else {
            throw new Error("Empty response from Gemini");
        }
    } catch (error) {
        console.error(`Failed to generate itinerary for ${tourTitle}:`, error);
        // Fallback to basic itinerary structure
        return Array.from({ length: tourDuration }, (_, i) => ({
            day: i + 1,
            title: `Day ${i + 1} - ${tourTitle}`,
            description: `Explore the wonders of ${tourEra} with authentic historical sites and cultural experiences.`
        }));
    }
}

export async function generateCivilizationTours(
    civilizations: string[],
    selectedLocations: string[] = []
): Promise<any[]> {
    try {
        const prompt = `Create authentic historical heritage tours for these civilizations: ${civilizations.join(', ')}.

For each civilization, generate 2-4 unique tour experiences that include:
- Authentic historical sites and monuments
- Real destinations and locations
- Detailed itineraries with major sites
- Cultural experiences and activities
- Historical context and significance

${selectedLocations.length > 0 ? `Focus on these specific locations: ${selectedLocations.join(', ')}` : ''}

Return a JSON array of tours with this exact structure:
[
  {
    "id": unique_number,
    "title": "Tour Title",
    "description": "Detailed description of the tour experience",
    "civilization": "Civilization Name",
    "locations": "Primary destination city/country",
    "duration": "7 days",
    "defaultDuration": "7 days",
    "durationOptions": ["3 days", "5 days", "7 days", "10 days"],
    "price": 2500,
    "highlights": ["Key attraction 1", "Key attraction 2", "Key attraction 3"]
  }
]

Make tours historically accurate, culturally immersive, and suitable for heritage tourism. Include major archaeological sites, museums, and cultural experiences.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            id: { type: "number" },
                            title: { type: "string" },
                            description: { type: "string" },
                            civilization: { type: "string" },
                            locations: { type: "string" },
                            duration: { type: "string" },
                            defaultDuration: { type: "string" },
                            durationOptions: { 
                                type: "array", 
                                items: { type: "string" } 
                            },
                            price: { type: "number" },
                            highlights: { 
                                type: "array", 
                                items: { type: "string" } 
                            }
                        },
                        required: ["id", "title", "description", "civilization", "locations", "duration", "defaultDuration", "durationOptions", "price", "highlights"]
                    }
                }
            },
            contents: prompt,
        });

        const rawJson = response.text;
        if (rawJson) {
            const tours = JSON.parse(rawJson);
            console.log(`Generated ${tours.length} tours for civilizations: ${civilizations.join(', ')}`);
            return tours;
        } else {
            throw new Error("Empty response from Gemini");
        }
    } catch (error) {
        console.error('Failed to generate civilization tours:', error);
        // Fallback to basic tour generation
        return civilizations.map((civ, index) => ({
            id: 1000 + index,
            title: `Discover ${civ}`,
            description: `Explore the wonders and heritage of ${civ} through authentic historical sites.`,
            civilization: civ,
            locations: "Historical Sites",
            duration: "7 days",
            defaultDuration: "7 days",
            durationOptions: ["3 days", "5 days", "7 days", "10 days"],
            price: 2000,
            highlights: ["Historical Sites", "Cultural Experiences", "Archaeological Wonders"]
        }));
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
export async function generateRulersWithGemini(era: string, context: string): Promise<any[]> {
    try {
        const prompt = `Generate a comprehensive list of 8-12 famous rulers from ${era}. ${context}
        
        For each ruler, provide:
        - name: Full name or title
        - startYear: Year they began ruling (as number, BCE as negative)
        - endYear: Year they ended ruling (as number, BCE as negative)
        - description: 2-3 sentence description of their reign and significance
        - achievements: Array of 3-4 key achievements

        Focus on the most historically significant and well-documented rulers. Include both male and female rulers where applicable.
        
        Return as valid JSON array with this exact format:
        [
          {
            "name": "Ruler Name",
            "startYear": -1800,
            "endYear": -1750,
            "description": "Brief description of their reign and historical significance.",
            "achievements": ["Achievement 1", "Achievement 2", "Achievement 3"]
          }
        ]`;

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
                            startYear: { type: "number" },
                            endYear: { type: "number" },
                            description: { type: "string" },
                            achievements: {
                                type: "array",
                                items: { type: "string" }
                            }
                        },
                        required: ["name", "startYear", "endYear", "description", "achievements"]
                    }
                }
            },
            contents: prompt,
        });

        const rawJson = response.text;
        console.log(`Generated rulers JSON for ${era}:`, rawJson?.substring(0, 200) + '...');

        if (rawJson) {
            const rulers = JSON.parse(rawJson);
            return rulers || [];
        } else {
            throw new Error("Empty response from Gemini");
        }
    } catch (error) {
        console.error(`Failed to generate rulers for ${era}:`, error);
        return [];
    }
}
