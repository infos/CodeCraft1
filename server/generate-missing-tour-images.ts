// Generate images for tours that don't have thumbnails
import { storage } from './storage';
import { generateImage } from './gemini';
import fs from 'fs';
import path from 'path';

const toursWithoutImages = [
  { id: 851, title: "Florence Renaissance Masterpieces", era: "Renaissance" },
  { id: 852, title: "Italian Renaissance Cities Tour", era: "Renaissance" },
  { id: 853, title: "Venetian Renaissance Art & Architecture", era: "Renaissance" },
  { id: 854, title: "Rome: High Renaissance & Vatican Treasures", era: "Renaissance" },
  { id: 855, title: "French Renaissance Châteaux & Culture", era: "Renaissance" },
  { id: 856, title: "Northern Renaissance: Bruges & Amsterdam", era: "Renaissance" },
  { id: 858, title: "Colonial America & Revolutionary Philadelphia", era: "Enlightenment" },
  { id: 859, title: "Dutch Golden Age: Amsterdam & The Hague", era: "Enlightenment" },
  { id: 860, title: "Imperial Russia: St. Petersburg & Moscow", era: "Enlightenment" },
  { id: 861, title: "Baroque Vienna & Imperial Austria", era: "Enlightenment" },
  { id: 862, title: "Scientific Revolution: London & Cambridge", era: "Enlightenment" }
];

async function generateMissingTourImages() {
  console.log('Generating images for tours without thumbnails...');
  
  const publicImagesDir = path.join(process.cwd(), 'client', 'public', 'tour-images');
  
  // Ensure tour-images directory exists
  if (!fs.existsSync(publicImagesDir)) {
    fs.mkdirSync(publicImagesDir, { recursive: true });
  }
  
  for (const tourInfo of toursWithoutImages) {
    try {
      console.log(`\n📸 Generating image for: ${tourInfo.title}`);
      
      // Create filename
      const filename = `${tourInfo.title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')}.jpg`;
      const imagePath = path.join(publicImagesDir, filename);
      
      // Skip if image already exists
      if (fs.existsSync(imagePath)) {
        console.log(`✓ Image already exists: ${filename}`);
        continue;
      }
      
      // Create AI prompt based on tour title and era
      let prompt = '';
      if (tourInfo.era === 'Renaissance') {
        if (tourInfo.title.includes('Florence')) {
          prompt = 'A stunning Renaissance scene of Florence, Italy, featuring the iconic Duomo with Brunelleschi\'s dome, the Ponte Vecchio bridge, and Renaissance architecture along the Arno River, painted in the style of Renaissance masters';
        } else if (tourInfo.title.includes('Venice')) {
          prompt = 'A magnificent view of Renaissance Venice with the Doge\'s Palace, St. Mark\'s Basilica, gondolas on the Grand Canal, and ornate Venetian Gothic architecture reflecting Renaissance grandeur';
        } else if (tourInfo.title.includes('Rome')) {
          prompt = 'A majestic Renaissance view of Rome featuring St. Peter\'s Basilica, the Vatican, and High Renaissance architecture, with Michelangelo\'s dome dominating the skyline';
        } else if (tourInfo.title.includes('French')) {
          prompt = 'An elegant French Renaissance château in the Loire Valley with ornate towers, manicured gardens, and French Renaissance architectural details';
        } else if (tourInfo.title.includes('Northern')) {
          prompt = 'A beautiful Northern Renaissance scene of medieval Bruges with Gothic architecture, canals, and Amsterdam\'s Golden Age buildings';
        } else {
          prompt = 'A comprehensive Italian Renaissance cityscape showing multiple Renaissance masterpieces including Florence, Rome, and Venice';
        }
      } else if (tourInfo.era === 'Enlightenment') {
        if (tourInfo.title.includes('Colonial America')) {
          prompt = 'A historically accurate scene of colonial Philadelphia with Independence Hall, cobblestone streets, colonial architecture, and 18th-century American buildings';
        } else if (tourInfo.title.includes('Dutch Golden Age')) {
          prompt = 'A golden age Amsterdam scene with historic canal houses, traditional Dutch architecture, and the atmospheric lighting of 17th-century Netherlands';
        } else if (tourInfo.title.includes('Imperial Russia')) {
          prompt = 'A grand imperial Russian scene featuring the Winter Palace in St. Petersburg, onion domes, and magnificent Russian imperial architecture';
        } else if (tourInfo.title.includes('Baroque Vienna')) {
          prompt = 'An elegant Baroque Vienna scene with the Schönbrunn Palace, Habsburg architecture, and Austrian imperial grandeur';
        } else if (tourInfo.title.includes('Scientific Revolution')) {
          prompt = 'A scholarly scene of Enlightenment London and Cambridge featuring historic universities, scientific instruments, and 18th-century English architecture';
        }
      }
      
      // Generate image
      await generateImage(prompt, imagePath);
      
      // Save to database
      const tourImageData = {
        tourId: tourInfo.id,
        tourTitle: tourInfo.title,
        imageUrl: `/tour-images/${filename}`,
        imageDescription: `AI-generated image of ${tourInfo.title}`,
        prompt: prompt,
        source: 'Gemini AI',
        attribution: 'Google Gemini AI'
      };
      
      await storage.createTourImage(tourImageData);
      console.log(`✅ Generated and saved image: ${filename}`);
      
    } catch (error) {
      console.error(`❌ Failed to generate image for ${tourInfo.title}:`, error);
    }
  }
  
  console.log('\n✅ Tour image generation completed!');
  
  // Display final status
  const allTours = await storage.getAllTours();
  const allTourImages = await storage.getAllTourImages();
  const toursWithImages = new Set(allTourImages.map(img => img.tourId));
  const remainingToursWithoutImages = allTours.filter(tour => !toursWithImages.has(tour.id));
  
  console.log(`📊 Final status:`);
  console.log(`   - Total tours: ${allTours.length}`);
  console.log(`   - Tours with images: ${allTours.length - remainingToursWithoutImages.length}`);
  console.log(`   - Tours without images: ${remainingToursWithoutImages.length}`);
  
  if (remainingToursWithoutImages.length > 0) {
    console.log(`   - Missing images for: ${remainingToursWithoutImages.map(t => t.title).join(', ')}`);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateMissingTourImages()
    .then(() => {
      console.log('✅ Missing tour images generation completed successfully!');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Missing tour images generation failed:', error);
      process.exit(1);
    });
}

export { generateMissingTourImages };