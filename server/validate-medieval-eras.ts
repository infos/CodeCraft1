import { GoogleGenAI } from '@google/genai';
import { storage } from './storage';

async function validateMedievalEras() {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
    
    // Get current eras from database
    const allEras = await storage.getAllEras();
    console.log('Current eras in database:', allEras.map(era => era.name));
    
    // Define medieval period eras from the application
    const medievalEras = [
      "Medieval Europe",
      "Islamic Golden Age", 
      "Byzantine Empire",
      "Mongol Empire"
    ];
    
    const prompt = `As a historical expert, validate these eras listed under "Medieval Period" (500 CE - 1400 CE):

${medievalEras.map(era => `- ${era}`).join('\n')}

For each era, provide:
1. Historical accuracy - does it belong in the Medieval period?
2. Correct date range
3. Any missing major medieval civilizations/empires
4. Suggestions for improvement

Consider these criteria:
- Medieval period: 500 CE - 1400 CE
- Major civilizations, empires, or cultural movements
- Global perspective (not just European)
- Historical significance and tourist appeal

Respond in JSON format:
{
  "validation": [
    {
      "era": "era name",
      "isAccurate": boolean,
      "correctDateRange": "start - end",
      "belongsInMedieval": boolean,
      "notes": "explanation"
    }
  ],
  "missingSuggestions": [
    {
      "era": "suggested era name",
      "dateRange": "start - end", 
      "significance": "why it should be included",
      "touristAppeal": "sites and attractions"
    }
  ],
  "recommendations": "overall assessment and suggestions"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            validation: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  era: { type: "string" },
                  isAccurate: { type: "boolean" },
                  correctDateRange: { type: "string" },
                  belongsInMedieval: { type: "boolean" },
                  notes: { type: "string" }
                }
              }
            },
            missingSuggestions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  era: { type: "string" },
                  dateRange: { type: "string" },
                  significance: { type: "string" },
                  touristAppeal: { type: "string" }
                }
              }
            },
            recommendations: { type: "string" }
          }
        }
      },
      contents: prompt,
    });

    const validation = JSON.parse(response.text || '{}');
    
    console.log('\n=== MEDIEVAL ERAS VALIDATION ===');
    console.log('\nCurrent Eras Analysis:');
    validation.validation?.forEach((era: any) => {
      console.log(`\n${era.era}:`);
      console.log(`  ✓ Historically Accurate: ${era.isAccurate}`);
      console.log(`  ✓ Belongs in Medieval: ${era.belongsInMedieval}`);
      console.log(`  ✓ Date Range: ${era.correctDateRange}`);
      console.log(`  ✓ Notes: ${era.notes}`);
    });
    
    console.log('\n=== MISSING MEDIEVAL ERAS ===');
    validation.missingSuggestions?.forEach((suggestion: any) => {
      console.log(`\n${suggestion.era} (${suggestion.dateRange}):`);
      console.log(`  Significance: ${suggestion.significance}`);
      console.log(`  Tourist Appeal: ${suggestion.touristAppeal}`);
    });
    
    console.log('\n=== RECOMMENDATIONS ===');
    console.log(validation.recommendations);
    
    return validation;
    
  } catch (error) {
    console.error('Error validating medieval eras:', error);
    throw error;
  }
}

validateMedievalEras();