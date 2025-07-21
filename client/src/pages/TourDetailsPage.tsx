import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Calendar, Hotel, Check, Star, Home, Bookmark, Heart, Search, Globe, Coffee, BookOpen, Car, Users } from "lucide-react";
import TourItinerary from "@/components/TourItinerary";
import TourImageCarousel from "@/components/TourImageCarousel";
import BookingInquiryModal from "@/components/BookingInquiryModal";
import type { Tour, HotelRecommendation, TourImage } from "@shared/schema";

export default function TourDetailsPage() {
  const params = useParams();
  const tourId = params.id;
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState<number | null>(null);

  const { data: tour, isLoading: tourLoading } = useQuery<Tour>({
    queryKey: [`/api/tours/${tourId}`],
    enabled: !!tourId
  });

  const { data: hotels, isLoading: hotelsLoading } = useQuery<HotelRecommendation[]>({
    queryKey: [`/api/tours/${tourId}/hotels`],
    enabled: !!tourId,
    retry: false
  });

  const { data: tourImages } = useQuery<TourImage[]>({
    queryKey: [`/api/tour-images/${tourId}`],
    enabled: !!tourId,
    retry: false
  });

  const { data: itineraries, isLoading: itinerariesLoading } = useQuery({
    queryKey: [`/api/tours/${tourId}/itineraries`],
    enabled: !!tourId,
    retry: false
  });

  if (tourLoading) {
    return <Skeleton className="h-[600px] w-full" />;
  }

  if (!tour) {
    return <div className="container mx-auto px-4 py-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Tour Not Found</h2>
        <p className="text-gray-600">The requested tour could not be found.</p>
      </div>
    </div>;
  }

  // Extract city names from locations
  const cities = tour.locations ? tour.locations.split(',').map(city => city.trim()) : [];
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <div className="text-2xl font-bold text-blue-600">Travel</div>
              <nav className="flex gap-6">
                <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                  <Home className="h-4 w-4" />
                  Home
                </button>
                <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                  <Calendar className="h-4 w-4" />
                  Reserved
                </button>
                <button className="flex items-center gap-2 text-blue-600 font-medium border-b-2 border-blue-600 pb-4">
                  <Bookmark className="h-4 w-4" />
                  Tours
                </button>
                <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                  <Heart className="h-4 w-4" />
                  Favourites
                </button>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <button className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded">Register</button>
              <button className="bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600 font-medium">Sign in</button>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white border-b border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-400" />
              <span className="text-gray-700">{cities[0] || tour.locations}</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>24.04.2020 - 04.05.2020</span>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-8 w-8 p-0 rounded-full bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Tour Package and Hotels */}
          <div className="lg:col-span-1 space-y-8">
            {/* Tour Package */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 pb-0">
                <h1 className="text-2xl font-bold text-gray-900 mb-3">
                  Holiday Package: {tour.title}
                </h1>
                <div className="flex items-center gap-2 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="text-sm text-gray-600 ml-1">(89 Reviews)</span>
                </div>
              </div>
              
              {/* Tour Image */}
              <div className="aspect-[4/3] bg-gradient-to-br from-orange-400 to-orange-600 relative overflow-hidden mx-6 rounded-lg">
                {tourImages && tourImages.length > 0 ? (
                  <img 
                    src={tourImages[0].imageUrl} 
                    alt={tour.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <MapPin className="h-16 w-16 text-white" />
                  </div>
                )}
              </div>

              {/* Price and Details */}
              <div className="p-6 space-y-4">
                <div className="flex items-baseline gap-2">
                  <div className="text-sm text-gray-500">Bus • Europe</div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-gray-900">
                    $ {typeof tour.price === 'number' ? tour.price.toLocaleString() : tour.price}.00
                  </span>
                  <span className="text-gray-600">/person</span>
                </div>
                <div className="text-sm text-gray-600">
                  Multiple local tour guides/drivers available throughout your tour activity
                </div>

                {/* Tour Features */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-700">{tour.duration} april - 3 may</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Globe className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-700">English only</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Car className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-700">Comfortable bus</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Coffee className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-700">Breakfast at the hotel</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <BookOpen className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-700">Photo report</span>
                  </div>
                </div>

                <Button 
                  onClick={() => setIsBookingModalOpen(true)}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 text-lg font-semibold rounded-lg mt-6"
                >
                  Book Now
                </Button>
              </div>
            </div>

            {/* Hotels Section */}
            {hotels && hotels.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Hotels</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {hotels.slice(0, 4).map((hotel, index) => (
                    <div key={hotel.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <Hotel className="h-8 w-8 text-gray-400" />
                      </div>
                      <div className="p-4">
                        <h4 className="font-semibold text-gray-900 mb-1">{hotel.name}</h4>
                        <div className="flex items-center gap-1 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`h-3 w-3 ${i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                          ))}
                          <span className="text-xs text-gray-600 ml-1">
                            {index === 0 ? '4.2' : index === 1 ? '5.0' : index === 2 ? '4.8' : '4.0'}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mb-3">{hotel.location || tour.locations}</p>
                        <Button
                          variant={selectedHotel === hotel.id ? "default" : "outline"}
                          size="sm"
                          className="w-full"
                          onClick={() => setSelectedHotel(selectedHotel === hotel.id ? null : hotel.id)}
                        >
                          {selectedHotel === hotel.id ? (
                            <>
                              <Check className="w-4 h-4 mr-2" />
                              Selected
                            </>
                          ) : (
                            'Select Hotel'
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Day Itinerary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Daily Itinerary
              </h3>
              <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
                {itineraries && itineraries.length > 0 ? (
                  <div className="space-y-6">
                    {itineraries.map((day, index) => (
                      <div key={day.id} className="border-l-2 border-blue-200 pl-4 pb-4 last:pb-0">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold -ml-7 border-2 border-white">
                            {day.day}
                          </div>
                          <h4 className="font-semibold text-gray-900">{day.title}</h4>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed mb-3">
                          {day.description}
                        </p>
                        {tourImages && tourImages[index] && (
                          <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden mb-2">
                            <img 
                              src={tourImages[index].imageUrl} 
                              alt={`Day ${day.day}`} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        {day.activities && (
                          <div className="text-xs text-gray-500">
                            Activities: {day.activities}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-6">
                    {[...Array(tour.duration)].map((_, index) => (
                      <div key={index} className="border-l-2 border-blue-200 pl-4 pb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold -ml-7 border-2 border-white">
                            {index + 1}
                          </div>
                          <h4 className="font-semibold text-gray-900">Day {index + 1} • {cities[index % cities.length] || 'Destination'}</h4>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed mb-3">
                          {index === 0 ? "Arrival and orientation. Check into your hotel and begin your historical journey." :
                           index === tour.duration - 1 ? "Final day exploration and departure preparations." :
                           "Continue your fascinating journey through this historic city with guided tours of palaces, museums, and architectural wonders."}
                        </p>
                        {tourImages && tourImages[index + 1] && (
                          <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden">
                            <img 
                              src={tourImages[index + 1].imageUrl} 
                              alt={`Day ${index + 1}`} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingInquiryModal
        isOpen={isBookingModalOpen}
        onClose={() => {
          setIsBookingModalOpen(false);
          setSelectedHotel(null);
        }}
        tourTitle={tour.title}
        tourId={tour.id}
        tourPrice={typeof tour.price === 'number' ? tour.price : parseInt(tour.price || '1400')}
        selectedHotelId={selectedHotel}
      />
    </div>
  );
}