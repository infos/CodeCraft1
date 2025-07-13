import fetch from 'node-fetch';

interface WikimediaImage {
  url: string;
  title: string;
  description: string;
  license: string;
  source: string;
  attribution: string;
}

interface TourismImage {
  url: string;
  title: string;
  description: string;
  source: string;
  attribution: string;
}

// Search for images on Wikimedia Commons
export async function searchWikimediaImages(query: string, limit: number = 5): Promise<WikimediaImage[]> {
  try {
    // Search for images on Wikimedia Commons using their API with better filtering
    const searchUrl = `https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrnamespace=6&gsrlimit=${limit * 2}&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=800`;
    
    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();
    
    if (!searchData.query?.pages) {
      return [];
    }
    
    const images: WikimediaImage[] = [];
    const pages = Object.values(searchData.query.pages) as any[];
    
    for (const page of pages) {
      if (images.length >= limit) break;
      
      try {
        // Skip obvious non-image files
        if (page.title && (
            page.title.toLowerCase().includes('.pdf') || 
            page.title.toLowerCase().includes('.doc') ||
            page.title.toLowerCase().includes('.txt'))) {
          continue;
        }
        
        const imageInfo = page.imageinfo?.[0];
        
        if (imageInfo?.url) {
          const metadata = imageInfo.extmetadata || {};
          
          // Only include actual image files, not PDFs or other documents
          const fileExtension = imageInfo.url.split('.').pop()?.toLowerCase();
          if (fileExtension && ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExtension)) {
            // Clean up HTML from description
            const cleanDescription = metadata.ImageDescription?.value
              ? metadata.ImageDescription.value.replace(/<[^>]*>/g, '').trim()
              : '';
            
            const cleanAttribution = metadata.Attribution?.value 
              ? metadata.Attribution.value.replace(/<[^>]*>/g, '').trim()
              : metadata.Artist?.value?.replace(/<[^>]*>/g, '').trim() || 'Wikimedia Commons contributors';
            
            images.push({
              url: imageInfo.url,
              title: page.title ? page.title.replace('File:', '') : 'Historical Image',
              description: cleanDescription || `Historical photograph from ${query}`,
              license: metadata.LicenseShortName?.value || 'CC BY-SA',
              source: 'Wikimedia Commons',
              attribution: cleanAttribution
            });
          }
        }
      } catch (error) {
        console.error(`Error processing image from page:`, error);
        continue;
      }
    }
    
    return images;
  } catch (error) {
    console.error('Error searching Wikimedia images:', error);
    return [];
  }
}

// Search for tourism images from various free tourism APIs and sites
export async function searchTourismImages(destination: string, landmarks: string[] = []): Promise<TourismImage[]> {
  const images: TourismImage[] = [];
  
  try {
    // Try multiple search terms
    const searchTerms = [destination, ...landmarks].filter(Boolean);
    
    for (const term of searchTerms.slice(0, 3)) { // Limit to prevent too many API calls
      try {
        // Search Wikimedia for tourism/travel related images
        const wikimediaImages = await searchWikimediaImages(`${term} tourism travel monument landmark`, 2);
        
        // Convert to TourismImage format
        for (const img of wikimediaImages) {
          images.push({
            url: img.url,
            title: img.title,
            description: img.description,
            source: img.source,
            attribution: img.attribution
          });
        }
        
        // Add a small delay to be respectful to APIs
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`Error searching images for ${term}:`, error);
        continue;
      }
    }
    
    return images.slice(0, 5); // Return max 5 images
  } catch (error) {
    console.error('Error searching tourism images:', error);
    return [];
  }
}

// Get curated images for specific historical sites
export async function getHistoricalSiteImages(siteName: string, era: string): Promise<WikimediaImage[]> {
  const searchQueries = [
    `${siteName} ${era}`,
    `${siteName} historical`,
    `${siteName} ancient`,
    `${siteName} monument`,
    `${siteName} archaeological`
  ];
  
  const allImages: WikimediaImage[] = [];
  
  for (const query of searchQueries) {
    try {
      const images = await searchWikimediaImages(query, 2);
      allImages.push(...images);
      
      // Add delay to be respectful
      await new Promise(resolve => setTimeout(resolve, 300));
    } catch (error) {
      console.error(`Error searching for ${query}:`, error);
      continue;
    }
  }
  
  // Remove duplicates based on URL
  const uniqueImages = allImages.filter((img, index, self) => 
    index === self.findIndex(i => i.url === img.url)
  );
  
  return uniqueImages.slice(0, 4); // Return max 4 unique images
}

export { WikimediaImage, TourismImage };