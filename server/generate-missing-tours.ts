import { storage } from './storage';
import { generateTourContent } from './gemini';

async function generateMissingTours() {
  try {
    console.log('Finding eras without tours...');
    
    // Get all eras
    const eras = await storage.getAllEras();
    console.log(`Found ${eras.length} eras`);
    
    // Get all existing tours
    const tours = await storage.getAllTours();
    const tourEras = new Set(tours.map(t => t.era).filter(Boolean));
    console.log(`Found tours for ${tourEras.size} eras`);
    
    // Find eras without tours
    const erasWithoutTours = eras.filter(era => !tourEras.has(era.name));
    console.log(`Found ${erasWithoutTours.length} eras without tours:`);
    erasWithoutTours.forEach(era => console.log(`  - ${era.name} (${era.startYear} - ${era.endYear})`));
    
    if (erasWithoutTours.length === 0) {
      console.log('All eras already have tours!');
      return;
    }
    
    // Generate tours for missing eras
    for (const era of erasWithoutTours) {
      console.log(`\nGenerating tour for ${era.name}...`);
      
      try {
        const tourData = await generateTourContent(era);
        
        // Create the tour
        const newTour = await storage.createTour({
          title: tourData.title,
          description: tourData.description,
          duration: tourData.duration || 7,
          price: tourData.price || 2500,
          locations: tourData.locations || era.modernRegions || 'Historical Sites',
          era: era.name,
          wikipediaUrl: tourData.wikipediaUrl,
          imageUrl: tourData.imageUrl,
          imageAttribution: tourData.imageAttribution
        });
        
        console.log(`✅ Created tour: ${newTour.title} (ID: ${newTour.id})`);
        
        // Generate itineraries for the tour
        if (tourData.itineraries && tourData.itineraries.length > 0) {
          for (const itinerary of tourData.itineraries) {
            await storage.createItinerary({
              tourId: newTour.id,
              day: itinerary.day,
              title: itinerary.title,
              description: itinerary.description,
              activities: itinerary.activities,
              meals: itinerary.meals,
              accommodation: itinerary.accommodation
            });
          }
          console.log(`  Added ${tourData.itineraries.length} itinerary days`);
        }
        
        // Generate hotel recommendations
        if (tourData.hotels && tourData.hotels.length > 0) {
          for (const hotel of tourData.hotels) {
            await storage.createHotelRecommendation({
              tourId: newTour.id,
              name: hotel.name,
              description: hotel.description,
              rating: hotel.rating || 4.5,
              pricePerNight: hotel.pricePerNight || 200,
              amenities: hotel.amenities || [],
              location: hotel.location || era.modernRegions || 'Historical Area',
              imageUrl: hotel.imageUrl,
              bookingUrl: hotel.bookingUrl
            });
          }
          console.log(`  Added ${tourData.hotels.length} hotel recommendations`);
        }
        
      } catch (error) {
        console.error(`Failed to generate tour for ${era.name}:`, error);
      }
    }
    
    console.log('\n✅ Tour generation complete!');
    
  } catch (error) {
    console.error('Error generating missing tours:', error);
  }
}

generateMissingTours();