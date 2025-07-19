import { storage } from './storage';
import { generateRulersWithGemini } from './gemini';

async function addMoreRulers() {
  console.log('Generating comprehensive rulers list with Gemini...');
  
  try {
    // Generate rulers for major historical periods
    const periods = [
      {
        name: 'Ancient Near Eastern',
        context: 'Mesopotamian rulers including Sumerian kings, Babylonian emperors, Assyrian kings, Persian shahs, and Hittite rulers'
      },
      {
        name: 'Ancient Egypt',
        context: 'Egyptian pharaohs from Old Kingdom through Ptolemaic period including famous dynasties'
      },
      {
        name: 'Ancient Greece',
        context: 'Greek rulers including Athenian leaders, Spartan kings, Macedonian kings, and Hellenistic monarchs'
      },
      {
        name: 'Ancient Rome',
        context: 'Roman emperors, consuls, and late imperial rulers from Republic through Byzantine transition'
      },
      {
        name: 'Medieval Europe',
        context: 'Medieval kings and queens including Frankish, English, French, German, and Holy Roman emperors'
      },
      {
        name: 'Byzantine Empire',
        context: 'Byzantine emperors and empresses from Constantine through fall of Constantinople'
      },
      {
        name: 'Ancient China',
        context: 'Chinese emperors from Qin Dynasty through Tang Dynasty including major imperial dynasties'
      },
      {
        name: 'Ancient India',
        context: 'Indian rulers including Mauryan emperors, Gupta kings, and major regional dynasties'
      },
      {
        name: 'Islamic Golden Age',
        context: 'Caliphs, sultans, and rulers of major Islamic empires including Abbasid, Umayyad, and Ottoman periods'
      },
      {
        name: 'Renaissance',
        context: 'Renaissance monarchs and rulers including Italian city-state leaders, European kings during Renaissance period'
      }
    ];

    let totalAdded = 0;

    for (const period of periods) {
      try {
        console.log(`Generating rulers for ${period.name}...`);
        const rulers = await generateRulersWithGemini(period.name, period.context);
        
        if (rulers && rulers.length > 0) {
          for (const ruler of rulers) {
            try {
              // Check if ruler already exists
              const existingRuler = await storage.getEmperorByName(ruler.name);
              if (!existingRuler) {
                await storage.createEmperor({
                  name: ruler.name,
                  era: period.name,
                  startYear: ruler.startYear,
                  endYear: ruler.endYear,
                  description: ruler.description,
                  achievements: ruler.achievements || []
                });
                console.log(`Added ruler: ${ruler.name} (${ruler.startYear}-${ruler.endYear})`);
                totalAdded++;
              } else {
                console.log(`Ruler already exists: ${ruler.name}`);
              }
            } catch (error) {
              console.error(`Error adding ruler ${ruler.name}:`, error);
            }
          }
        }
        
        // Add delay between requests to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000));
        
      } catch (error) {
        console.error(`Error generating rulers for ${period.name}:`, error);
      }
    }

    console.log(`\nCompleted! Added ${totalAdded} new rulers to the database.`);
    
  } catch (error) {
    console.error('Error in ruler generation process:', error);
  }
}

// Run the function
addMoreRulers().catch(console.error);