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
): Promise<void> {
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

        for (const part of content.parts) {
            if (part.text) {
                console.log(`Generated image description: ${part.text}`);
            } else if (part.inlineData && part.inlineData.data) {
                const imageData = Buffer.from(part.inlineData.data, "base64");
                fs.writeFileSync(imagePath, imageData);
                console.log(`Era image saved as ${imagePath}`);
                return;
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