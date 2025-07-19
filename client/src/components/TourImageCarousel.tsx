import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

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

  // Generate 4 AI images for the carousel if none provided
  const defaultImages = [
    {
      id: 1,
      tourId,
      tourTitle,
      imageUrl: `/tour-images/${tourTitle.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')}.jpg`,
      imageDescription: `Main view of ${tourTitle}`,
      source: "Gemini AI",
      attribution: "Google Gemini AI"
    },
    {
      id: 2,
      tourId,
      tourTitle,
      imageUrl: `/tour-images/${tourTitle.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')}-2.jpg`,
      imageDescription: `Historical architecture from ${tourTitle}`,
      source: "Gemini AI", 
      attribution: "Google Gemini AI"
    },
    {
      id: 3,
      tourId,
      tourTitle,
      imageUrl: `/tour-images/${tourTitle.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')}-3.jpg`,
      imageDescription: `Cultural heritage site featured in ${tourTitle}`,
      source: "Gemini AI",
      attribution: "Google Gemini AI"
    },
    {
      id: 4,
      tourId,
      tourTitle,
      imageUrl: `/tour-images/${tourTitle.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')}-4.jpg`,
      imageDescription: `Scenic landscape from ${tourTitle}`,
      source: "Gemini AI",
      attribution: "Google Gemini AI"
    }
  ];

  const displayImages = images.length > 0 ? images.slice(0, 4) : defaultImages;

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % displayImages.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  };

  const goToImage = (index: number) => {
    setCurrentIndex(index);
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

      {/* Thumbnail Navigation */}
      {displayImages.length > 1 && (
        <div className="p-4">
          <div className="flex gap-2 justify-center">
            {displayImages.map((image, index) => (
              <button
                key={image.id}
                onClick={() => goToImage(index)}
                className={`relative overflow-hidden rounded-lg transition-all duration-200 ${
                  index === currentIndex
                    ? "ring-2 ring-primary ring-offset-2 opacity-100"
                    : "opacity-60 hover:opacity-80"
                }`}
              >
                <img
                  src={image.imageUrl}
                  alt={`${tourTitle} thumbnail ${index + 1}`}
                  className="w-16 h-10 object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `/tour-images/default-tour.jpg`;
                  }}
                />
              </button>
            ))}
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