// Test script to ensure all tours have images
const fetch = require('node-fetch');

async function testAllToursHaveImages() {
  try {
    // Get all tours
    const toursResponse = await fetch('http://localhost:5000/api/tours');
    const tours = await toursResponse.json();
    
    // Get all tour images
    const tourImagesResponse = await fetch('http://localhost:5000/api/tour-images');
    const tourImages = await tourImagesResponse.json();
    
    console.log(`\nTesting ${tours.length} tours for images...`);
    
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
          title: tour.title
        });
      }
    }
    
    console.log(`\n✅ Tours with images: ${toursWithImages.length}`);
    toursWithImages.forEach(tour => {
      console.log(`   ${tour.id}: ${tour.title} (${tour.imageSource})`);
    });
    
    console.log(`\n❌ Tours without images: ${toursWithoutImages.length}`);
    toursWithoutImages.forEach(tour => {
      console.log(`   ${tour.id}: ${tour.title}`);
    });
    
    // If there are tours without images, generate them
    if (toursWithoutImages.length > 0) {
      console.log(`\nGenerating images for ${toursWithoutImages.length} tours...`);
      
      const generateResponse = await fetch('http://localhost:5000/api/generate-tour-images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          tours: toursWithoutImages.map(tour => ({
            id: tour.id,
            title: tour.title,
            description: tours.find(t => t.id === tour.id)?.description || '',
            era: tours.find(t => t.id === tour.id)?.era || 'historical',
            location: tours.find(t => t.id === tour.id)?.location || 'historical site'
          }))
        })
      });
      
      const result = await generateResponse.json();
      console.log('Image generation result:', result);
    }
    
    console.log(`\n📊 Summary:`);
    console.log(`   Total tours: ${tours.length}`);
    console.log(`   Tours with images: ${toursWithImages.length}`);
    console.log(`   Tours without images: ${toursWithoutImages.length}`);
    console.log(`   Coverage: ${((toursWithImages.length / tours.length) * 100).toFixed(1)}%`);
    
  } catch (error) {
    console.error('Error testing tour images:', error);
  }
}

testAllToursHaveImages();