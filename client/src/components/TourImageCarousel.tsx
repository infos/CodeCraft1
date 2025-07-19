import { useState } from "react";
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

  // Real images with proper attribution
  const realImages = [
    {
      id: 101,
      tourId,
      tourTitle,
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Colosseum_in_Rome%2C_Italy_-_April_2007.jpg/1200px-Colosseum_in_Rome%2C_Italy_-_April_2007.jpg",
      imageDescription: "The Colosseum, Rome's iconic ancient amphitheater",
      source: "Wikimedia Commons",
      attribution: "Diliff / CC BY-SA 3.0"
    },
    {
      id: 102,
      tourId,
      tourTitle,
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Pantheon_Front.jpg/1200px-Pantheon_Front.jpg",
      imageDescription: "The Pantheon, a remarkably preserved Roman temple",
      source: "Wikimedia Commons",
      attribution: "Roberta Dragan / CC BY-SA 2.0"
    },
    {
      id: 103,
      tourId,
      tourTitle,
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Roman_Forum_from_Palatine_Hill_2019.jpg/1200px-Roman_Forum_from_Palatine_Hill_2019.jpg",
      imageDescription: "Roman Forum viewed from Palatine Hill",
      source: "Wikimedia Commons",
      attribution: "Livioandronico2013 / CC BY-SA 4.0"
    }
  ];

  // AI generated images
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
      imageDescription: `AI-generated landscape from ${tourTitle}`,
      source: "Gemini AI",
      attribution: "Google Gemini AI"
    }
  ];

  // Combine all images (real + AI + any database images)
  const allImages = [...(images || []), ...realImages, ...aiImages];
  const displayImages = allImages.length > 0 ? allImages : [];

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
      if (!response.ok) throw new Error('Failed to save images');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/tour-images/${tourId}`] });
    }
  });

  const handleSaveImages = () => {
    const imagesToSave = allImages.filter(img => !images?.some(existing => existing.imageUrl === img.imageUrl));
    saveImagesMutation.mutate(imagesToSave);
  };

  if (displayImages.length === 0) {
    return null;
  }

  return (
    <Card className="overflow-hidden">
      <div className="relative">
        {/* Main Image Display */}
        <div className="relative aspect-[16/10] overflow-hidden">
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
          
          {/* Image Attribution Overlay */}
          {displayImages[currentIndex]?.source && (
            <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
              {displayImages[currentIndex]?.attribution || displayImages[currentIndex]?.source}
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
                onClick={handleSaveImages}
                disabled={saveImagesMutation.isPending}
                className="text-xs"
              >
                <Plus className="w-3 h-3 mr-1" />
                Save All
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
                    className="w-20 h-12 object-cover"
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