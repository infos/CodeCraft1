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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Column - Tour Package and Hotels */}
          <div className="lg:col-span-3 space-y-8">
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
              
              {/* Tour Image and Details - Horizontal Layout */}
              <div className="p-6 flex gap-6">
                {/* Tour Image - Increased size */}
                <div className="w-2/5 flex-shrink-0">
                  <div className="aspect-[4/3] bg-gradient-to-br from-orange-400 to-orange-600 relative overflow-hidden rounded-lg">
                    {tourImages && tourImages.length > 0 ? (
                      <img 
                        src={tourImages[0].imageUrl} 
                        alt={tour.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <MapPin className="h-12 w-12 text-white" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Tour Details - 2/3 size */}
                <div className="flex-1 space-y-4">
                  <div className="flex items-baseline gap-2">
                    <div className="text-sm text-gray-500">Bus • Europe</div>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-gray-900">
                      $ {typeof tour.price === 'number' ? tour.price.toLocaleString() : tour.price}.00
                    </span>
                    <span className="text-gray-600">/person</span>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    Duration: {tour.duration} • Multiple local tour guides available
                  </div>
                  <div className="text-sm text-gray-600">
                    Professional guided tours throughout your historical journey
                  </div>

                  {/* Tour Features */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
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
                    className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 text-base font-semibold rounded-lg mt-6"
                  >
                    Book Now
                  </Button>
                </div>
              </div>
            </div>

            {/* Hotels Section */}
            {hotels && hotels.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Hotels</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {hotels.slice(0, 4).map((hotel, index) => {
                    // Hotel image URLs based on luxury European hotels
                    const hotelImages = [
                      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=250&fit=crop", // Luxury hotel exterior
                      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=250&fit=crop", // Boutique hotel
                      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=250&fit=crop", // Historic hotel
                      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=250&fit=crop"  // Grand hotel
                    ];
                    return (
                    <div key={hotel.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
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
                          <Hotel className="h-8 w-8 text-gray-400" />
                        </div>
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
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Cities and Day Itinerary */}
          <div className="lg:col-span-2 space-y-4">
            {/* Cities we will visit - Compact */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-base font-semibold text-gray-900 mb-3">Cities we will visit</h3>
              <div className="flex justify-between items-center mb-3">
                {cities.slice(0, 4).map((city, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mb-1"></div>
                    <span className="text-xs font-medium text-gray-700">{city}</span>
                  </div>
                ))}
              </div>
              
              {/* Real Interactive Map */}
              <div className="aspect-[3/2] bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d2970556.404734698!2d6.8810815!3d45.4408474!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x47e66e2964e34e2d%3A0x8ddca9ee380ef7e0!2sParis%2C%20France!3m2!1d48.856614!2d2.3522219!4m5!1s0x12d43d476a3ad6a1%3A0x537c5c0de7683bd2!2sRome%2C%20Metropolitan%20City%20of%20Rome%2C%20Italy!3m2!1d41.9027835!2d12.4963655!5e0!3m2!1sen!2sus!4v1641234567890!5m2!1sen!2sus"
                  className="w-full h-full"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Tour Route Map"
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