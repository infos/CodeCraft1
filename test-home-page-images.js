// Test script to verify all tours on home page have images
import fetch from 'node-fetch';

async function testHomePageTourImages() {
  try {
    console.log('Testing all home page tours for image display...\n');
    
    // Get all tours
    const toursResponse = await fetch('http://localhost:5000/api/tours');
    const tours = await toursResponse.json();
    
    // Get all tour images
    const tourImagesResponse = await fetch('http://localhost:5000/api/tour-images');
    const tourImages = await tourImagesResponse.json();
    
    // Get all era images (AI-generated)
    const eraImagesResponse = await fetch('http://localhost:5000/api/era-images');
    const eraImageData = await eraImagesResponse.json();
    const eraImages = eraImageData.imageUrls || {};
    
    console.log(`Found ${tours.length} tours total`);
    console.log(`Found ${tourImages.length} stored tour images`);
    console.log(`Found ${Object.keys(eraImages).length} era images`);
    console.log('');
    
    const toursWithoutImages = [];
    const toursWithImages = [];
    
    for (const tour of tours) {
      // Check image priority order as implemented in BuildTourCopy.tsx:
      // 1. Era images (AI-generated) matching tour.era
      // 2. Era images matching selected eras
      // 3. Tour images from database
      // 4. Direct imageUrl from tour
      // 5. Default fallback
      
      const hasEraImage = eraImages[tour.era] || false;
      const hasStoredImage = tourImages.some(img => img.tourId === tour.id);
      const hasDirectImage = tour.imageUrl && tour.imageUrl.trim() !== '';
      
      let imageSource = 'None';
      let imagePath = '/era-images/default.jpg';
      
      if (hasEraImage) {
        imageSource = `Era AI Image (${tour.era})`;
        imagePath = eraImages[tour.era];
      } else if (hasStoredImage) {
        const storedImg = tourImages.find(img => img.tourId === tour.id);
        imageSource = 'Stored Tour Image';
        imagePath = storedImg.imageUrl;
      } else if (hasDirectImage) {
        imageSource = 'Direct URL';
        imagePath = tour.imageUrl;
      } else {
        imageSource = 'Default Fallback';
      }
      
      if (imageSource !== 'None' && imageSource !== 'Default Fallback') {
        toursWithImages.push({
          id: tour.id,
          title: tour.title,
          era: tour.era,
          imageSource: imageSource,
          imagePath: imagePath
        });
      } else {
        toursWithoutImages.push({
          id: tour.id,
          title: tour.title,
          era: tour.era,
          imageSource: imageSource
        });
      }
    }
    
    console.log(`✅ Tours with images: ${toursWithImages.length}/${tours.length}`);
    toursWithImages.forEach(tour => {
      console.log(`   ${tour.id}: ${tour.title} [${tour.era}] - ${tour.imageSource}`);
    });
    
    if (toursWithoutImages.length > 0) {
      console.log(`\n❌ Tours without proper images: ${toursWithoutImages.length}`);
      toursWithoutImages.forEach(tour => {
        console.log(`   ${tour.id}: ${tour.title} [${tour.era}] - ${tour.imageSource}`);
      });
    }
    
    console.log(`\n📊 Image Coverage Summary:`);
    console.log(`   Total tours: ${tours.length}`);
    console.log(`   Tours with images: ${toursWithImages.length}`);
    console.log(`   Tours without images: ${toursWithoutImages.length}`);
    console.log(`   Coverage: ${((toursWithImages.length / tours.length) * 100).toFixed(1)}%`);
    
    // Test era coverage specifically
    const uniqueEras = [...new Set(tours.map(t => t.era).filter(Boolean))];
    console.log(`\n🎨 Era Image Coverage:`);
    uniqueEras.forEach(era => {
      const hasImage = eraImages[era] ? '✅' : '❌';
      console.log(`   ${hasImage} ${era}: ${eraImages[era] || 'No AI image'}`);
    });
    
  } catch (error) {
    console.error('Error testing home page tour images:', error);
  }
}

testHomePageTourImages();