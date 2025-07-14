import { storage } from './storage';
import fetch from 'node-fetch';

async function testAndGenerateAllTourImages() {
  try {
    console.log('Testing all tours for images...');
    
    // Get all tours from database
    const tours = await storage.getAllTours();
    console.log(`Found ${tours.length} tours`);
    
    // Get all tour images
    const tourImages = await storage.getAllTourImages();
    console.log(`Found ${tourImages.length} stored tour images`);
    
    const toursWithoutImages = [];
    const toursWithImages = [];
    
    for (const tour of tours) {
      const hasDirectImage = tour.imageUrl && tour.imageUrl.trim() !== '';
      const hasStoredImage = tourImages.some(img => img.tourId === tour.id);
      
      if (hasDirectImage || hasStoredImage) {
        toursWithImages.push({
          id: tour.id,
          title: tour.title,
          imageSource: hasDirectImage ? 'Direct URL' : 'Stored Image'
        });
      } else {
        toursWithoutImages.push({
          id: tour.id,
          title: tour.title,
          era: tour.era || 'historical',
          description: tour.description || ''
        });
      }
    }
    
    console.log(`\n✅ Tours with images: ${toursWithImages.length}`);
    toursWithImages.slice(0, 5).forEach(tour => {
      console.log(`   ${tour.id}: ${tour.title} (${tour.imageSource})`);
    });
    
    console.log(`\n❌ Tours without images: ${toursWithoutImages.length}`);
    toursWithoutImages.forEach(tour => {
      console.log(`   ${tour.id}: ${tour.title}`);
    });
    
    // Generate images for tours that don't have them
    if (toursWithoutImages.length > 0) {
      console.log(`\nGenerating images for ${toursWithoutImages.length} tours...`);
      
      try {
        const response = await fetch('http://localhost:5000/api/generate-tour-images', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            tours: toursWithoutImages.map(tour => ({
              id: tour.id,
              title: tour.title,
              description: tour.description,
              era: tour.era,
              location: 'historical site'
            }))
          })
        });
        
        const result = await response.json();
        console.log('Image generation result:', result.success ? 'Success' : 'Failed');
        
        if (result.success && result.images) {
          console.log(`Generated ${result.images.length} images`);
        }
      } catch (error) {
        console.error('Error generating images:', error);
      }
    }
    
    console.log(`\n📊 Final Summary:`);
    console.log(`   Total tours: ${tours.length}`);
    console.log(`   Tours with images: ${toursWithImages.length}`);
    console.log(`   Tours without images: ${toursWithoutImages.length}`);
    console.log(`   Coverage: ${((toursWithImages.length / tours.length) * 100).toFixed(1)}%`);
    
  } catch (error) {
    console.error('Error testing tour images:', error);
  }
}

testAndGenerateAllTourImages();