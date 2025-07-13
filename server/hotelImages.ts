import fetch from 'node-fetch';

interface HotelImage {
  url: string;
  description: string;
  source: string;
  attribution: string;
}

// Search for hotel images from various sources
export async function searchHotelImages(hotelName: string, location: string): Promise<HotelImage[]> {
  try {
    // Search Wikimedia for hotel and architecture images
    const searchQuery = `${hotelName} ${location} hotel architecture`;
    const searchUrl = `https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search&gsrsearch=${encodeURIComponent(searchQuery)}&gsrnamespace=6&gsrlimit=3&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=600`;
    
    const response = await fetch(searchUrl);
    const data = await response.json();
    
    if (!data.query?.pages) {
      return [];
    }
    
    const images: HotelImage[] = [];
    const pages = Object.values(data.query.pages) as any[];
    
    for (const page of pages) {
      const imageInfo = page.imageinfo?.[0];
      if (imageInfo?.url) {
        const metadata = imageInfo.extmetadata || {};
        
        // Only include actual image files
        const fileExtension = imageInfo.url.split('.').pop()?.toLowerCase();
        if (fileExtension && ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExtension)) {
          images.push({
            url: imageInfo.url,
            description: metadata.ImageDescription?.value?.replace(/<[^>]*>/g, '').trim() || `${hotelName} in ${location}`,
            source: 'Wikimedia Commons',
            attribution: metadata.Attribution?.value?.replace(/<[^>]*>/g, '').trim() || 'Wikimedia Commons contributors'
          });
        }
      }
    }
    
    return images;
  } catch (error) {
    console.error('Error searching hotel images:', error);
    return [];
  }
}

// Generate fallback hotel images for specific hotels
export function getHotelImageFallbacks(hotelName: string, location: string): HotelImage[] {
  const fallbacks: Record<string, HotelImage[]> = {
    "Four Seasons Hotel Cairo at Nile Plaza": [{
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Four_Seasons_Hotel_Cairo_at_Nile_Plaza.jpg/640px-Four_Seasons_Hotel_Cairo_at_Nile_Plaza.jpg",
      description: "Four Seasons Hotel Cairo at Nile Plaza, luxury accommodation overlooking the Nile River",
      source: "Wikimedia Commons",
      attribution: "Wikimedia Commons contributors"
    }],
    "Winter Palace Hotel": [{
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Winter_Palace_Hotel_Luxor.jpg/640px-Winter_Palace_Hotel_Luxor.jpg",
      description: "Historic Winter Palace Hotel in Luxor, Egypt, Victorian elegance on the Nile",
      source: "Wikimedia Commons", 
      attribution: "Wikimedia Commons contributors"
    }],
    "Hotel Artemide": [{
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Rome_hotel_exterior.jpg/640px-Rome_hotel_exterior.jpg",
      description: "Elegant hotel architecture in Rome near historical sites",
      source: "Wikimedia Commons",
      attribution: "Wikimedia Commons contributors"
    }],
    "Marriott Mena House": [{
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Mena_House_Hotel_Giza.jpg/640px-Mena_House_Hotel_Giza.jpg",
      description: "Historic Mena House Hotel with views of the Great Pyramids of Giza",
      source: "Wikimedia Commons",
      attribution: "Wikimedia Commons contributors"
    }]
  };
  
  return fallbacks[hotelName] || [{
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Hotel_building_architecture.jpg/640px-Hotel_building_architecture.jpg",
    description: `Hotel accommodation in ${location}`,
    source: "Wikimedia Commons",
    attribution: "Wikimedia Commons contributors"
  }];
}