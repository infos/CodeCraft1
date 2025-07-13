import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useRoute } from "wouter";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { MapPin, Calendar, Clock, Users, Star, Play, Sparkles, Camera, Building } from "lucide-react";
import type { Tour, Itinerary, HotelRecommendation } from "@shared/schema";

export default function TourDetailPage() {
  const [, params] = useRoute("/tours/:id");
  const tourId = Number(params?.id);
  const [selectedDuration, setSelectedDuration] = useState<string>("7 days");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [tourImages, setTourImages] = useState<string[]>([]);

  // Use details endpoint for generated tours (ID >= 1000), regular endpoint for database tours
  const isGeneratedTour = tourId >= 1000;
  const tourEndpoint = isGeneratedTour ? `/api/tours/${tourId}/details` : `/api/tours/${tourId}`;
  
  const { data: tour, isLoading: tourLoading } = useQuery<Tour>({
    queryKey: [tourEndpoint],
    enabled: !!tourId
  });

  // For generated tours, itineraries are included in the tour object
  // For database tours, we need separate queries
  const { data: itineraries, isLoading: itinerariesLoading } = useQuery<Itinerary[]>({
    queryKey: [`/api/tours/${tourId}/itineraries`],
    enabled: !!tourId && !isGeneratedTour
  });

  const { data: hotels, isLoading: hotelsLoading } = useQuery<HotelRecommendation[]>({
    queryKey: [`/api/tours/${tourId}/hotels`],
    enabled: !!tourId && !isGeneratedTour
  });

  // Extract itineraries from tour object for generated tours
  const finalItineraries = isGeneratedTour ? (tour as any)?.itinerary || [] : itineraries || [];
  const finalHotels = isGeneratedTour ? [] : hotels || []; // Generated tours don't have separate hotel data
  
  // Loading states
  const isLoading = tourLoading || (!isGeneratedTour && (itinerariesLoading || hotelsLoading));

  // Generate era video for the tour
  const generateVideoMutation = useMutation({
    mutationFn: async () => {
      if (!tour) throw new Error("Tour not found");
      
      const response = await fetch('/api/generate-tour-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          tourTitle: tour.title,
          tourDescription: tour.description,
          era: tour.era || "Ancient Times",
          tourId: tour.id
        }),
      });
      
      if (!response.ok) throw new Error('Failed to generate video');
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        setVideoUrl(data.videoUrl);
        setIsGeneratingVideo(false);
      }
    },
    onError: (error) => {
      console.error('Error generating video:', error);
      setIsGeneratingVideo(false);
    }
  });

  const handleGenerateVideo = () => {
    setIsGeneratingVideo(true);
    generateVideoMutation.mutate();
  };

  // Fetch existing tour images for carousel
  const { data: existingTourImages } = useQuery({
    queryKey: [`/api/tour-images/${tourId}`],
    enabled: !!tourId,
    queryFn: async () => {
      const response = await fetch(`/api/tour-images/${tourId}`);
      if (!response.ok) throw new Error('Failed to load tour images');
      return response.json();
    },
  });

  // Fetch existing tour videos
  const { data: existingTourVideos } = useQuery({
    queryKey: [`/api/tour-videos/${tourId}`],
    enabled: !!tourId,
    queryFn: async () => {
      const response = await fetch(`/api/tour-videos/${tourId}`);
      if (!response.ok) throw new Error('Failed to load tour videos');
      return response.json();
    },
  });

  // Load existing tour images automatically when tour loads
  useEffect(() => {
    if (existingTourImages && existingTourImages.length > 0 && tourImages.length === 0) {
      const imageObjects = existingTourImages.map((img: any) => ({
        url: img.imageUrl,
        description: img.imageDescription || '',
        source: img.source || 'Database',
        attribution: img.attribution || 'Previously generated'
      }));
      setTourImages(imageObjects);
    }
  }, [existingTourImages, tourImages.length]);

  // Load existing tour video automatically when tour loads
  useEffect(() => {
    if (existingTourVideos && existingTourVideos.length > 0 && !videoUrl) {
      setVideoUrl(existingTourVideos[0].videoUrl);
    }
  }, [existingTourVideos, videoUrl]);

  // Generate multiple tour images for carousel using real sources
  const generateImagesForCarousel = async () => {
    if (!tour) return;
    
    // First check if we already have images in the database
    if (existingTourImages && existingTourImages.length >= 3) {
      const imageObjects = existingTourImages.slice(0, 6).map((img: any) => ({
        url: img.imageUrl,
        description: img.imageDescription || '',
        source: img.source || 'Database',
        attribution: img.attribution || 'Previously generated'
      }));
      setTourImages(imageObjects);
      return;
    }
    
    try {
      // Generate real images using the new system
      const response = await fetch('/api/generate-tour-images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          tours: [{
            id: tour.id,
            title: tour.title,
            description: tour.description,
            era: tour.era || 'ancient',
            location: tour.location || 'historical site'
          }]
        }),
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.results && result.results[0] && result.results[0].images) {
          setTourImages(result.results[0].images);
          // Invalidate the cache and refetch existing images
          queryClient.invalidateQueries({ queryKey: [`/api/tour-images/${tourId}`] });
        }
      }
    } catch (error) {
      console.error('Error generating carousel images:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="animate-pulse">
          <div className="h-96 bg-gray-100 mb-8"></div>
          <div className="max-w-6xl mx-auto px-4 space-y-8">
            <div className="h-12 bg-gray-100 rounded w-1/2"></div>
            <div className="h-6 bg-gray-100 rounded w-3/4"></div>
            <div className="grid grid-cols-3 gap-4">
              <div className="h-32 bg-gray-100 rounded"></div>
              <div className="h-32 bg-gray-100 rounded"></div>
              <div className="h-32 bg-gray-100 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Tour not found</h1>
          <p className="text-gray-600">The tour you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  // Duration options matching Apple's storage options pattern
  // Default price for generated tours if not provided
  const basePrice = tour.price || 2499;
  const durationOptions = [
    { label: "3 days", value: "3 days", price: Math.round(basePrice * 0.6) },
    { label: "5 days", value: "5 days", price: Math.round(basePrice * 0.8) },
    { label: "7 days", value: "7 days", price: basePrice },
    { label: "10 days", value: "10 days", price: Math.round(basePrice * 1.3) }
  ];

  // Sort itineraries by day number
  const sortedItineraries = finalItineraries ? [...finalItineraries].sort((a, b) => a.day - b.day) : [];
  
  // Filter itineraries based on selected duration
  const selectedDays = parseInt(selectedDuration);
  const filteredItineraries = sortedItineraries.slice(0, selectedDays);

  const selectedPrice = durationOptions.find(d => d.value === selectedDuration)?.price || basePrice;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Apple iPhone 16 Pro Style */}
      <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-6xl mx-auto px-4 py-24">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6 tracking-tight">
              {tour.title}
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              {tour.description}
            </p>
            <div className="flex items-center justify-center gap-8 text-sm mb-8">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-blue-400" />
                <span>{tour.location || "Historic Sites"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-400" />
                <span>{selectedDuration}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-400" />
                <span>Small Groups</span>
              </div>
            </div>
            
            {/* Video Generation and Carousel Controls */}
            <div className="flex items-center justify-center gap-4">
              <Button 
                onClick={handleGenerateVideo}
                disabled={isGeneratingVideo}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-medium transition-all duration-200"
              >
                {isGeneratingVideo ? (
                  <>
                    <Sparkles className="h-5 w-5 mr-2 animate-spin" />
                    Generating Video...
                  </>
                ) : (
                  <>
                    <Play className="h-5 w-5 mr-2" />
                    Generate Era Video
                  </>
                )}
              </Button>
              
              <Button 
                onClick={generateImagesForCarousel}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-medium transition-all duration-200"
              >
                <Camera className="h-5 w-5 mr-2" />
                Generate Images
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Video Player Section */}
      {videoUrl && (
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="bg-black rounded-2xl overflow-hidden mb-8">
            <div className="aspect-video">
              <img 
                src={videoUrl} 
                alt={`${tour.title} Era Video`}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      )}

      {/* Image Carousel Section */}
      {tourImages.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 py-12">
          <h2 className="text-3xl font-bold text-center mb-8">Tour Gallery</h2>
          <Carousel className="w-full max-w-4xl mx-auto">
            <CarouselContent>
              {tourImages.map((image, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <Card>
                      <CardContent className="flex flex-col p-0">
                        <div className="aspect-square relative overflow-hidden rounded-t-lg">
                          <img 
                            src={typeof image === 'string' ? image : image.url} 
                            alt={`${tour.title} - Gallery ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {typeof image === 'object' && (image.source || image.attribution) && (
                          <div className="p-3 bg-gray-50 rounded-b-lg">
                            <p className="text-xs text-gray-600 mb-1">
                              {image.description || `Historical site from ${tour.title}`}
                            </p>
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span className="font-medium">{image.source}</span>
                              {image.attribution && (
                                <span className="truncate ml-2" title={image.attribution}>
                                  {image.attribution.length > 20 
                                    ? image.attribution.substring(0, 20) + '...' 
                                    : image.attribution}
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        
        {/* Product Header - Apple Style */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Badge variant="secondary" className="px-3 py-1">
              {tour.era || 'Heritage Tour'}
            </Badge>
          </div>
          <h1 className="text-5xl font-light text-gray-900 mb-4">
            {tour.title}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {tour.description}
          </p>
          <div className="mt-6">
            <span className="text-3xl font-light text-gray-900">
              From ${selectedPrice} 
            </span>
            <span className="text-lg text-gray-600 ml-2">
              or ${Math.round(selectedPrice / 12)}/mo. for 12 months
            </span>
          </div>
        </div>

        {/* Duration Selection - Apple Storage Style */}
        <div className="mb-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
              Duration. How long would you like to explore?
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {durationOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSelectedDuration(option.value)}
                  className={`relative p-6 rounded-2xl border-2 transition-all duration-200 text-left ${
                    selectedDuration === option.value
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-semibold text-lg text-gray-900 mb-1">
                    {option.label}
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    From ${option.price}
                  </div>
                  <div className="text-xs text-gray-500">
                    or ${Math.round(option.price / 12)}/mo.
                  </div>
                  {selectedDuration === option.value && (
                    <div className="absolute top-4 right-4">
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Itinerary Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
            Your {selectedDuration} journey
          </h2>
          <div className="max-w-4xl mx-auto">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-32 bg-gray-100 rounded-2xl animate-pulse"></div>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {filteredItineraries.map((day, index) => (
                  <Card key={`day-${day.id}-${index}`} className="border-0 shadow-sm bg-gray-50">
                    <CardContent className="p-8">
                      <div className="flex items-start gap-6">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {day.day}
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            Day {day.day}: {day.title}
                          </h3>
                          <p className="text-gray-600 leading-relaxed mb-4">
                            {day.description}
                          </p>
                          
                          {/* Sites to visit */}
                          {(day as any).sites && (day as any).sites.length > 0 && (
                            <div className="mt-4">
                              <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-blue-600" />
                                Sites to Visit
                              </h4>
                              <div className="grid gap-3">
                                {(day as any).sites.map((site: any, siteIndex: number) => (
                                  <div key={siteIndex} className="bg-white rounded-lg p-4 border border-gray-100">
                                    <div className="flex justify-between items-start mb-2">
                                      <h5 className="font-medium text-gray-900">{site.name}</h5>
                                      <div className="flex gap-2 text-xs">
                                        {site.duration && (
                                          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                            {site.duration}
                                          </span>
                                        )}
                                        {site.admission && (
                                          <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                            {site.admission}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                    <p className="text-sm text-gray-600">{site.description}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {/* Hotel information */}
                          {(day as any).hotel && (
                            <div className="mt-4">
                              <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <Building className="w-4 h-4 text-blue-600" />
                                Accommodation
                              </h4>
                              <div className="bg-white rounded-lg overflow-hidden border border-gray-100">
                                {(day as any).hotel.imageUrl && (
                                  <div className="aspect-video bg-gray-100">
                                    <img
                                      src={(day as any).hotel.imageUrl}
                                      alt={(day as any).hotel.name}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                )}
                                <div className="p-4">
                                  <div className="flex items-start justify-between mb-2">
                                    <div>
                                      <h5 className="font-medium text-gray-900 mb-1">{(day as any).hotel.name}</h5>
                                      <p className="text-sm text-gray-600 mb-2">{(day as any).hotel.location}</p>
                                    </div>
                                    <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-full">
                                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                      <span className="text-xs font-medium">4.5</span>
                                    </div>
                                  </div>
                                  <p className="text-sm text-gray-600 mb-3">{(day as any).hotel.description}</p>
                                  {(day as any).hotel.amenities && (day as any).hotel.amenities.length > 0 && (
                                    <div className="flex flex-wrap gap-1">
                                      {(day as any).hotel.amenities.slice(0, 3).map((amenity: string, amenityIndex: number) => (
                                        <span key={amenityIndex} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                          {amenity}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Hotels Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
            Where you'll stay
          </h2>
          <div className="max-w-4xl mx-auto">
            {isLoading ? (
              <div className="grid md:grid-cols-2 gap-6">
                {[1, 2].map((i) => (
                  <div key={i} className="h-48 bg-gray-100 rounded-2xl animate-pulse"></div>
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {finalHotels?.slice(0, 4).map((hotel) => (
                  <Card key={hotel.id} className="border-0 shadow-sm overflow-hidden">
                    <CardContent className="p-0">
                      <div className="aspect-video bg-gray-100 relative">
                        <img
                          src={hotel.imageUrl || 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Hotel_building_architecture.jpg/640px-Hotel_building_architecture.jpg'}
                          alt={hotel.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-4 left-4">
                          <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-full shadow-sm">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">{hotel.rating || 4.5}</span>
                          </div>
                        </div>
                        {hotel.pricePerNight && (
                          <div className="absolute top-4 right-4">
                            <div className="bg-white px-3 py-1 rounded-full shadow-sm">
                              <span className="text-sm font-medium">${hotel.pricePerNight}/night</span>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="p-6">
                        <h3 className="font-semibold text-gray-900 mb-2">
                          {hotel.name}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                          <MapPin className="w-4 h-4" />
                          {hotel.location}
                        </div>
                        <p className="text-sm text-gray-600 mb-4">
                          {hotel.description}
                        </p>
                        {hotel.amenities && hotel.amenities.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {hotel.amenities.slice(0, 4).map((amenity, amenityIndex) => (
                              <span key={amenityIndex} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                {amenity}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* CTA Section - Apple Style */}
        <div className="text-center py-16 border-t border-gray-100">
          <h2 className="text-3xl font-light text-gray-900 mb-6">
            Ready to begin your heritage journey?
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
            <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 rounded-full px-8 py-3">
              Book ${selectedPrice} tour
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto rounded-full px-8 py-3">
              Contact specialist
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Free cancellation up to 24 hours before departure
          </p>
        </div>
      </div>
    </div>
  );
}