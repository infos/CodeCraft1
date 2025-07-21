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
              <select className="bg-white border border-gray-300 rounded-lg px-3 py-1 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500">
                <option>24.04.2024 - 04.05.2024</option>
                <option>15.05.2024 - 25.05.2024</option>
                <option>01.06.2024 - 11.06.2024</option>
                <option>20.06.2024 - 30.06.2024</option>
                <option>15.07.2024 - 25.07.2024</option>
                <option>01.08.2024 - 11.08.2024</option>
                <option>15.09.2024 - 25.09.2024</option>
              </select>
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Tour Package and Hotels */}
          <div className="lg:col-span-2 space-y-8">
            {/* Tour Package */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {/* Title and Rating */}
              <div className="p-8 pb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  Holiday Package: {tour.title}
                </h1>
                <div className="flex items-center gap-2 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="text-gray-600 ml-2">(89 Reviews)</span>
                </div>
              </div>
              
              {/* Tour Image and Details - Reference Layout */}
              <div className="px-8 pb-8 flex gap-8">
                {/* Tour Image - Square format like reference */}
                <div className="w-80 flex-shrink-0">
                  <div className="aspect-square bg-gradient-to-br from-orange-400 to-orange-600 relative overflow-hidden rounded-2xl">
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
                </div>

                {/* Tour Details - Right side like reference */}
                <div className="flex-1 space-y-6">
                  <div className="text-orange-500 font-medium">Bus • Europe</div>
                  
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-gray-900">
                      $ {typeof tour.price === 'number' ? tour.price.toLocaleString() : tour.price}.00
                    </span>
                    <span className="text-gray-600 text-lg">/ person</span>
                  </div>
                  
                  <div className="text-gray-600">
                    Multiple local tour guides/drivers available throughout your tour/activity
                  </div>

                  {/* Tour Features - 2 column grid like reference */}
                  <div className="grid grid-cols-2 gap-4 py-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-blue-500" />
                      <span className="text-gray-700">24 april - 3 may</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Coffee className="h-5 w-5 text-gray-500" />
                      <span className="text-gray-700">Breakfast at the hotel</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Globe className="h-5 w-5 text-gray-500" />
                      <span className="text-gray-700">English only</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Car className="h-5 w-5 text-gray-500" />
                      <span className="text-gray-700">Comfortable bus</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <BookOpen className="h-5 w-5 text-gray-500" />
                      <span className="text-gray-700">Photo report</span>
                    </div>
                  </div>

                  <Button 
                    onClick={() => setIsBookingModalOpen(true)}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-12 py-4 text-lg font-semibold rounded-full w-64"
                  >
                    Book Now
                  </Button>
                </div>
              </div>
            </div>

            {/* Hotels Section - Matching reference layout */}
            {hotels && hotels.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Hotels</h2>
                <div className="grid grid-cols-2 gap-6">
                  {hotels.slice(0, 4).map((hotel, index) => {
                    // Hotel image URLs based on luxury European hotels
                    const hotelImages = [
                      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=250&fit=crop", // Luxury hotel exterior
                      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=250&fit=crop", // Boutique hotel
                      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=250&fit=crop", // Historic hotel
                      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=250&fit=crop"  // Grand hotel
                    ];
                    const ratings = [4.2, 5.0, 4.8, 4.0];
                    return (
                    <div key={hotel.id} className="flex gap-4 items-center">
                      <div className="w-20 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                        <img 
                          src={hotelImages[index] || hotelImages[0]}
                          alt={hotel.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const nextSibling = e.currentTarget.nextElementSibling as HTMLElement;
                            if (nextSibling) {
                              nextSibling.style.display = 'flex';
                            }
                          }}
                        />
                        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center" style={{display: 'none'}}>
                          <Hotel className="h-6 w-6 text-gray-400" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">{hotel.name}</h4>
                        <p className="text-sm text-gray-600 mb-2">{hotel.location || cities[index % cities.length]}</p>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-orange-400 text-orange-400" />
                            <span className="font-semibold text-gray-900">{ratings[index]}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar - Cities and Day Itinerary */}
          <div className="lg:col-span-1 space-y-4">
            {/* Cities we will visit - Compact */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-base font-semibold text-gray-900 mb-3">Cities we will visit</h3>
              <div className="flex justify-between items-center mb-3 relative">
                {cities.slice(0, 4).map((city, index) => (
                  <div key={index} className="flex flex-col items-center z-10">
                    <div className="w-3 h-3 bg-blue-600 rounded-full mb-1 border-2 border-white shadow-sm"></div>
                    <span className="text-xs font-medium text-gray-700">{city}</span>
                  </div>
                ))}
                {/* Connection lines */}
                <div className="absolute top-1 left-0 right-0 h-0.5 bg-blue-300 opacity-60" style={{zIndex: 1}}></div>
              </div>
              
              {/* Interactive Map showing tour cities */}
              <div className="aspect-[3/2] bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                {/* Create dynamic map URL based on actual tour cities */}
                <iframe
                  src={`https://www.google.com/maps/embed/v1/directions?key=AIzaSyCO_fake_key&origin=${encodeURIComponent(cities[0] || 'Rome, Italy')}&destination=${encodeURIComponent(cities[cities.length - 1] || 'Florence, Italy')}&waypoints=${cities.slice(1, -1).map(city => encodeURIComponent(city)).join('|')}&mode=transit&avoid=tolls`}
                  className="w-full h-full"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Tour Route Map"
                  onError={() => {
                    // Fallback to static map if embed fails
                    const fallbackElement = document.createElement('div');
                    fallbackElement.className = 'w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center';
                    fallbackElement.innerHTML = '<div class="text-center"><div class="text-blue-600 mb-2">🗺️</div><div class="text-sm text-gray-600">Tour Route Map</div></div>';
                  }}
                />
              </div>
            </div>

            {/* Daily Itinerary */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-base font-semibold text-gray-900 mb-3">
                Daily Itinerary
              </h3>
              <div className="max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
                {itineraries && itineraries.length > 0 ? (
                  <div className="space-y-4">
                    {itineraries.map((day: any, index: number) => {
                      // Day-specific images for historical tours
                      const dayImages = [
                        "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=300&h=200&fit=crop", // Rome Colosseum
                        "https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=300&h=200&fit=crop", // Roman Forum
                        "https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=300&h=200&fit=crop", // Pantheon
                        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop", // Vatican
                        "https://images.unsplash.com/photo-1555992336-fb0c7b299ef8?w=300&h=200&fit=crop", // Trevi Fountain
                        "https://images.unsplash.com/photo-1529260830199-42c24126f198?w=300&h=200&fit=crop", // Ancient ruins
                        "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=300&h=200&fit=crop"  // Default fallback
                      ];
                      
                      return (
                      <div key={day.id} className="flex gap-4 pb-4 border-b border-gray-100 last:border-b-0">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-md">
                            {day.day}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 mb-1">Day {day.day}: {day.title}</h4>
                              <p className="text-gray-600 text-sm mb-3">{day.description}</p>
                            </div>
                            <div className="ml-4 flex-shrink-0">
                              <img 
                                src={dayImages[index] || dayImages[0]}
                                alt={`Day ${day.day} - ${day.title}`}
                                className="w-20 h-16 rounded-lg object-cover shadow-sm"
                                onError={(e) => {
                                  e.currentTarget.src = "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=300&h=200&fit=crop";
                                }}
                              />
                            </div>
                          </div>
                          {Array.isArray(day.activities) && day.activities.length > 0 && (
                            <div className="space-y-2">
                              <h5 className="text-sm font-medium text-gray-800">Activities:</h5>
                              <ul className="text-sm text-gray-600 space-y-1">
                                {day.activities.map((activity: string, actIndex: number) => (
                                  <li key={actIndex} className="flex items-start gap-2">
                                    <span className="text-orange-500 mt-1.5">•</span>
                                    <span>{activity}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No itinerary available for this tour.</p>
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