import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MapPin, Calendar, Clock, Users, Star } from "lucide-react";
import type { Tour, Itinerary, HotelRecommendation } from "@shared/schema";

export default function TourDetailPage() {
  const [, params] = useRoute("/tours/:id");
  const tourId = Number(params?.id);
  const [selectedDuration, setSelectedDuration] = useState<string>("7 days");

  const { data: tour, isLoading: tourLoading } = useQuery<Tour>({
    queryKey: [`/api/tours/${tourId}`],
    enabled: !!tourId
  });

  const { data: itineraries, isLoading: itinerariesLoading } = useQuery<Itinerary[]>({
    queryKey: [`/api/tours/${tourId}/itineraries`],
    enabled: !!tourId
  });

  const { data: hotels, isLoading: hotelsLoading } = useQuery<HotelRecommendation[]>({
    queryKey: [`/api/tours/${tourId}/hotels`],
    enabled: !!tourId
  });

  if (tourLoading) {
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
  const durationOptions = [
    { label: "3 days", value: "3 days", price: Math.round(tour.price * 0.6) },
    { label: "5 days", value: "5 days", price: Math.round(tour.price * 0.8) },
    { label: "7 days", value: "7 days", price: tour.price },
    { label: "10 days", value: "10 days", price: Math.round(tour.price * 1.3) }
  ];

  // Sort itineraries by day number
  const sortedItineraries = itineraries ? [...itineraries].sort((a, b) => a.day - b.day) : [];
  
  // Filter itineraries based on selected duration
  const selectedDays = parseInt(selectedDuration);
  const filteredItineraries = sortedItineraries.slice(0, selectedDays);

  const selectedPrice = durationOptions.find(d => d.value === selectedDuration)?.price || tour.price;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Image Section */}
      <div className="relative h-96 bg-gray-100 overflow-hidden">
        <img 
          src={tour.imageUrl || '/placeholder-tour.jpg'} 
          alt={tour.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      </div>

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
            {itinerariesLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-32 bg-gray-100 rounded-2xl animate-pulse"></div>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {filteredItineraries.map((day, index) => (
                  <Card key={day.id} className="border-0 shadow-sm bg-gray-50">
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
                          <p className="text-gray-600 leading-relaxed">
                            {day.description}
                          </p>
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
            {hotelsLoading ? (
              <div className="grid md:grid-cols-2 gap-6">
                {[1, 2].map((i) => (
                  <div key={i} className="h-48 bg-gray-100 rounded-2xl animate-pulse"></div>
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {hotels?.slice(0, 4).map((hotel) => (
                  <Card key={hotel.id} className="border-0 shadow-sm overflow-hidden">
                    <CardContent className="p-0">
                      <div className="aspect-video bg-gray-100 relative">
                        <img
                          src={hotel.imageUrl || '/placeholder-hotel.jpg'}
                          alt={hotel.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-4 left-4">
                          <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-full">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">4.5</span>
                          </div>
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="font-semibold text-gray-900 mb-2">
                          {hotel.name}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                          <MapPin className="w-4 h-4" />
                          {hotel.location}
                        </div>
                        <p className="text-sm text-gray-600">
                          {hotel.description}
                        </p>
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