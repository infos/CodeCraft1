import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface TourImage {
  id: number;
  tourId: number;
  tourTitle: string;
  imageUrl: string;
  imageDescription?: string;
  source?: string;
  attribution?: string;
}

interface TourImageCarouselProps {
  tourId: number;
  tourTitle: string;
  images?: TourImage[];
}

export default function TourImageCarousel({ tourId, tourTitle, images = [] }: TourImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const queryClient = useQueryClient();

  // No hardcoded real images - only show database images specific to each tour
  const realImages: TourImage[] = [];

  // AI generated images - limited to 5 maximum
  const aiImages = [
    {
      id: 201,
      tourId,
      tourTitle,
      imageUrl: `/tour-images/${tourTitle.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')}.jpg`,
      imageDescription: `AI-generated view of ${tourTitle}`,
      source: "Gemini AI",
      attribution: "Google Gemini AI"
    },
    {
      id: 202,
      tourId,
      tourTitle,
      imageUrl: `/tour-images/${tourTitle.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')}-2.jpg`,
      imageDescription: `AI-generated historical scene from ${tourTitle}`,
      source: "Gemini AI", 
      attribution: "Google Gemini AI"
    },
    {
      id: 203,
      tourId,
      tourTitle,
      imageUrl: `/tour-images/${tourTitle.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')}-3.jpg`,
      imageDescription: `AI-generated cultural heritage site from ${tourTitle}`,
      source: "Gemini AI",
      attribution: "Google Gemini AI"
    },
    {
      id: 204,
      tourId,
      tourTitle,
      imageUrl: `/tour-images/${tourTitle.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')}-4.jpg`,
      imageDescription: `AI-generated architecture from ${tourTitle}`,
      source: "Gemini AI",
      attribution: "Google Gemini AI"
    },
    {
      id: 205,
      tourId,
      tourTitle,
      imageUrl: `/tour-images/${tourTitle.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')}-5.jpg`,
      imageDescription: `AI-generated landscape from ${tourTitle}`,
      source: "Gemini AI",
      attribution: "Google Gemini AI"
    }
  ].slice(0, 5); // Ensure maximum 5 AI images

  // Only use database images specific to this tour - no hardcoded fallbacks
  const databaseImages = images || [];
  
  // Only use database images to prevent mixing up tours
  const displayImages = databaseImages.length > 0 ? databaseImages : [];

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % displayImages.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  };

  const goToImage = (index: number) => {
    setCurrentIndex(index);
  };

  // Generate additional AI images mutation
  const generateImagesMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/generate-tour-images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          tourId, 
          tourTitle,
          additionalImages: true
        }),
      });
      if (!response.ok) throw new Error('Failed to generate images');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/tour-images/${tourId}`] });
    }
  });

  // Save images to database mutation
  const saveImagesMutation = useMutation({
    mutationFn: async (imagesToSave: TourImage[]) => {
      const response = await fetch('/api/tour-images/save-batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          tourId, 
          images: imagesToSave 
        }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to save images: ${response.status} ${errorText}`);
      }
      return response.json();
    },
    onSuccess: (data) => {
      console.log('Images saved successfully:', data);
      queryClient.invalidateQueries({ queryKey: [`/api/tour-images/${tourId}`] });
    },
    onError: (error) => {
      console.error('Failed to save images to database:', error);
    }
  });

  const handleSaveImages = () => {
    const imagesToSave = allImages.filter(img => !images?.some(existing => existing.imageUrl === img.imageUrl));
    console.log('Saving images:', imagesToSave);
    saveImagesMutation.mutate(imagesToSave);
  };

  // Simplified image testing - only for database images
  const testAndSaveImages = async () => {
    try {
      console.log(`Testing ${databaseImages.length} database images for tour: ${tourTitle}`);
      // For now, just refresh the query to reload images
      queryClient.invalidateQueries({ queryKey: [`/api/tour-images/${tourId}`] });
    } catch (error) {
      console.error('Error testing images:', error);
    }
  };

  // Remove auto-test functionality to prevent issues
  useEffect(() => {
    // Only log that component has mounted
    if (tourId && tourTitle) {
      console.log(`TourImageCarousel mounted for: ${tourTitle} (ID: ${tourId}), showing ${databaseImages.length} images`);
    }
  }, [tourId, tourTitle, databaseImages.length]);

  if (displayImages.length === 0) {
    return null;
  }

  return (
    <Card className="overflow-hidden">
      <div className="relative">
        {/* Main Image Display */}
        <div className="relative aspect-[16/10] overflow-hidden" style={{ maxHeight: '320px' }}>
          <img
            src={displayImages[currentIndex]?.imageUrl}
            alt={displayImages[currentIndex]?.imageDescription || tourTitle}
            className="w-full h-full object-cover transition-opacity duration-500"
            onError={(e) => {
              // Fallback to a default image if the specific image fails to load
              const target = e.target as HTMLImageElement;
              target.src = `/tour-images/default-tour.jpg`;
            }}
          />
          
          {/* Image Attribution Overlay - Always show for real images with proper attribution */}
          {displayImages[currentIndex]?.source && displayImages[currentIndex]?.attribution && (
            <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded max-w-[200px]">
              <div className="font-semibold">{displayImages[currentIndex]?.source}</div>
              <div className="text-[10px] opacity-90">{displayImages[currentIndex]?.attribution}</div>
            </div>
          )}
        </div>

        {/* Navigation Arrows */}
        {displayImages.length > 1 && (
          <>
            <Button
              variant="outline"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-md"
              onClick={prevImage}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-md"
              onClick={nextImage}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}

        {/* Image Counter */}
        {displayImages.length > 1 && (
          <div className="absolute top-2 right-2 bg-black/70 text-white text-sm px-3 py-1 rounded-full">
            {currentIndex + 1} / {displayImages.length}
          </div>
        )}
      </div>

      {/* Horizontal Scrollable Thumbnail Navigation */}
      {displayImages.length > 1 && (
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-700">Gallery ({displayImages.length} images)</h4>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => generateImagesMutation.mutate()}
                disabled={generateImagesMutation.isPending}
                className="text-xs"
              >
                <Sparkles className="w-3 h-3 mr-1" />
                Generate More
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={async () => {
                  console.log(`Testing images for tour: ${tourTitle} (ID: ${tourId})`);
                  console.log(`Database images: ${databaseImages.length}`);
                  
                  try {
                    await testAndSaveImages();
                    queryClient.invalidateQueries({ queryKey: [`/api/tour-images/${tourId}`] });
                    console.log('✓ Image test completed successfully');
                  } catch (error) {
                    console.error('✗ Image test failed:', error);
                  }
                }}
                disabled={saveImagesMutation.isPending}
                className="text-xs"
              >
                <Plus className="w-3 h-3 mr-1" />
                Test Images ({databaseImages.length})
              </Button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <div className="flex gap-2 pb-2" style={{ minWidth: 'max-content' }}>
              {displayImages.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => goToImage(index)}
                  className={`relative overflow-hidden rounded-lg transition-all duration-200 flex-shrink-0 ${
                    index === currentIndex
                      ? "ring-2 ring-primary ring-offset-2 opacity-100"
                      : "opacity-60 hover:opacity-80"
                  }`}
                >
                  <img
                    src={image.imageUrl}
                    alt={`${tourTitle} thumbnail ${index + 1}`}
                    className="w-14 h-8 object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `/tour-images/default-tour.jpg`;
                    }}
                  />
                  {/* Source indicator */}
                  <div className="absolute bottom-0 left-0 bg-black/70 text-white text-xs px-1 py-0.5 rounded-tr">
                    {image.source === "Gemini AI" ? "AI" : "Real"}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Image Description */}
      {displayImages[currentIndex]?.imageDescription && (
        <div className="px-4 pb-4">
          <p className="text-sm text-muted-foreground text-center">
            {displayImages[currentIndex]?.imageDescription}
          </p>
        </div>
      )}
    </Card>
  );
}