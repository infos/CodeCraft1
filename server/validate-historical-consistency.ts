import { GoogleGenAI } from '@google/genai';
import { storage } from './storage';

async function validateHistoricalConsistency() {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
    
    // Get all eras from database
    const allEras = await storage.getAllEras();
    
    // Historical periods from Tour Builder page
    const tourBuilderPeriods = {
      'ancient': {
        label: 'Ancient Times',
        tooltip: 'Before 500 BCE',
        expectedEras: []
      },
      'classical': {
        label: 'Classical Period', 
        tooltip: '500 BCE - 500 CE',
        expectedEras: []
      },
      'medieval': {
        label: 'Medieval Period',
        tooltip: '500 CE - 1400 CE', 
        expectedEras: []
      },
      'renaissance': {
        label: 'Renaissance',
        tooltip: '1400 CE - 1750 CE',
        expectedEras: []
      }
    };
    
    // Current eras from database
    const currentEras = allEras.map(era => ({
      name: era.name,
      startYear: era.startYear,
      endYear: era.endYear,
      period: era.period
    }));
    
    console.log('Current eras in database:');
    currentEras.forEach(era => {
      console.log(`- ${era.name}: ${era.startYear} - ${era.endYear} (Period: ${era.period || 'Not set'})`);
    });
    
    const prompt = `As a historical expert, validate the consistency between historical periods and eras in this heritage tours application.

HISTORICAL PERIODS (Tour Builder filters):
1. Ancient Times (Before 500 BCE)
2. Classical Period (500 BCE - 500 CE)  
3. Medieval Period (500 CE - 1400 CE)
4. Renaissance (1400 CE - 1750 CE)

CURRENT ERAS IN DATABASE:
${currentEras.map(era => `- ${era.name}: ${era.startYear} - ${era.endYear}`).join('\n')}

Please validate:
1. Are the eras correctly categorized under their historical periods?
2. Are there any chronological inconsistencies?
3. Are the date ranges accurate for each era?
4. Are there missing major eras that should be included?
5. Should any eras be recategorized under different periods?

Provide specific recommendations for:
- Era categorization corrections
- Date range adjustments
- Missing eras that should be added
- Overall consistency improvements

Respond in JSON format:
{
  "periodValidation": {
    "ancient": {
      "correctEras": ["era names that belong here"],
      "incorrectEras": ["era names that don't belong"],
      "dateRangeIssues": ["eras with wrong dates"]
    },
    "classical": {
      "correctEras": ["era names that belong here"],
      "incorrectEras": ["era names that don't belong"],
      "dateRangeIssues": ["eras with wrong dates"]
    },
    "medieval": {
      "correctEras": ["era names that belong here"],
      "incorrectEras": ["era names that don't belong"],
      "dateRangeIssues": ["eras with wrong dates"]
    },
    "renaissance": {
      "correctEras": ["era names that belong here"],
      "incorrectEras": ["era names that don't belong"],
      "dateRangeIssues": ["eras with wrong dates"]
    }
  },
  "missingEras": [
    {
      "name": "era name",
      "period": "which period it belongs to",
      "dateRange": "start - end years",
      "significance": "why it's important"
    }
  ],
  "chronologyIssues": [
    {
      "era": "era name",
      "issue": "description of the problem",
      "correction": "suggested fix"
    }
  ],
  "recommendations": "overall suggestions for improvement"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            periodValidation: {
              type: "object",
              properties: {
                ancient: {
                  type: "object",
                  properties: {
                    correctEras: { type: "array", items: { type: "string" } },
                    incorrectEras: { type: "array", items: { type: "string" } },
                    dateRangeIssues: { type: "array", items: { type: "string" } }
                  }
                },
                classical: {
                  type: "object", 
                  properties: {
                    correctEras: { type: "array", items: { type: "string" } },
                    incorrectEras: { type: "array", items: { type: "string" } },
                    dateRangeIssues: { type: "array", items: { type: "string" } }
                  }
                },
                medieval: {
                  type: "object",
                  properties: {
                    correctEras: { type: "array", items: { type: "string" } },
                    incorrectEras: { type: "array", items: { type: "string" } },
                    dateRangeIssues: { type: "array", items: { type: "string" } }
                  }
                },
                renaissance: {
                  type: "object",
                  properties: {
                    correctEras: { type: "array", items: { type: "string" } },
                    incorrectEras: { type: "array", items: { type: "string" } },
                    dateRangeIssues: { type: "array", items: { type: "string" } }
                  }
                }
              }
            },
            missingEras: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  period: { type: "string" },
                  dateRange: { type: "string" },
                  significance: { type: "string" }
                }
              }
            },
            chronologyIssues: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  era: { type: "string" },
                  issue: { type: "string" },
                  correction: { type: "string" }
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
    
    console.log('\n=== HISTORICAL CONSISTENCY VALIDATION ===');
    
    // Display period validation
    Object.entries(validation.periodValidation || {}).forEach(([period, data]: [string, any]) => {
      console.log(`\n${period.toUpperCase()} PERIOD:`);
      console.log(`  ✓ Correct Eras: ${data.correctEras?.join(', ') || 'None'}`);
      console.log(`  ✗ Incorrect Eras: ${data.incorrectEras?.join(', ') || 'None'}`);
      console.log(`  ⚠ Date Issues: ${data.dateRangeIssues?.join(', ') || 'None'}`);
    });
    
    // Display missing eras
    console.log('\n=== MISSING ERAS ===');
    validation.missingEras?.forEach((era: any) => {
      console.log(`\n${era.name} (${era.dateRange}):`);
      console.log(`  Period: ${era.period}`);
      console.log(`  Significance: ${era.significance}`);
    });
    
    // Display chronology issues
    console.log('\n=== CHRONOLOGY ISSUES ===');
    validation.chronologyIssues?.forEach((issue: any) => {
      console.log(`\n${issue.era}:`);
      console.log(`  Issue: ${issue.issue}`);
      console.log(`  Correction: ${issue.correction}`);
    });
    
    console.log('\n=== RECOMMENDATIONS ===');
    console.log(validation.recommendations);
    
    return validation;
    
  } catch (error) {
    console.error('Error validating historical consistency:', error);
    throw error;
  }
}

validateHistoricalConsistency();