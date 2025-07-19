// Test and save tour images to database
import { storage } from "./storage";

async function testAndSaveTourImages() {
  console.log("Testing and saving tour images for Rise of Rome (Tour ID: 830)...");
  
  const tourId = 830;
  const tourTitle = "The Rise of Rome";
  
  // Test images with verified URLs
  const testImages = [
    {
      tourId,
      tourTitle,
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/5/53/Colosseum_in_Rome%2C_Italy_-_April_2007.jpg",
      imageDescription: "The Colosseum, Rome's iconic ancient amphitheater",
      source: "Wikimedia Commons",
      attribution: "Diliff / CC BY-SA 3.0",
      prompt: "Real image of the Colosseum in Rome"
    },
    {
      tourId,
      tourTitle,
      imageUrl: "https://images.unsplash.com/photo-1539650116574-75c0c6d73273?w=800&h=600&fit=crop",
      imageDescription: "The Pantheon, Rome's best preserved ancient temple",
      source: "Unsplash",
      attribution: "Free to use",
      prompt: "Real image of the Pantheon in Rome"
    },
    {
      tourId,
      tourTitle,
      imageUrl: "https://images.unsplash.com/photo-1548585744-5d4a9a6e5da4?w=800&h=600&fit=crop",
      imageDescription: "Roman Forum archaeological ruins",
      source: "Unsplash",
      attribution: "Free to use",
      prompt: "Real image of the Roman Forum"
    },
    {
      tourId,
      tourTitle,
      imageUrl: `/tour-images/${tourTitle.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')}.jpg`,
      imageDescription: "AI-generated view of The Rise of Rome",
      source: "Gemini AI",
      attribution: "Google Gemini AI",
      prompt: "AI-generated image of ancient Rome"
    }
  ];
  
  let savedCount = 0;
  let errorCount = 0;
  
  for (const image of testImages) {
    try {
      // Check if image already exists
      const existing = await storage.getTourImageByUrl(tourId, image.imageUrl);
      if (existing) {
        console.log(`✓ Image already exists: ${image.imageDescription}`);
        continue;
      }
      
      // Test URL if it's external
      if (image.imageUrl.startsWith('http')) {
        try {
          const response = await fetch(image.imageUrl, { method: 'HEAD' });
          if (!response.ok) {
            console.log(`✗ Image URL failed (${response.status}): ${image.imageDescription}`);
            errorCount++;
            continue;
          }
          console.log(`✓ Image URL working: ${image.imageDescription}`);
        } catch (error) {
          console.log(`✗ Image URL error: ${image.imageDescription}`, error);
          errorCount++;
          continue;
        }
      }
      
      // Save to database
      const savedImage = await storage.createTourImage(image);
      console.log(`✓ Saved to database: ${image.imageDescription}`);
      savedCount++;
      
    } catch (error) {
      console.error(`✗ Error saving image: ${image.imageDescription}`, error);
      errorCount++;
    }
  }
  
  console.log(`\nResults: ${savedCount} saved, ${errorCount} errors`);
  return { savedCount, errorCount };
}

// Run if called directly (ES module compatible)
if (import.meta.url === `file://${process.argv[1]}`) {
  testAndSaveTourImages()
    .then(result => {
      console.log('Test completed:', result);
      process.exit(0);
    })
    .catch(error => {
      console.error('Test failed:', error);
      process.exit(1);
    });
}

export { testAndSaveTourImages };