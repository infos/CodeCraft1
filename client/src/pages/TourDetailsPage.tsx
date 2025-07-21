import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Calendar, Hotel, Check, X, Star, Wifi, Car, Utensils, Shield, MessageCircle, BookOpen, Users, Globe, Coffee } from "lucide-react";
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
                <span className="text-gray-600 hover:text-gray-900 cursor-pointer">Home</span>
                <span className="text-gray-600 hover:text-gray-900 cursor-pointer">Reserved</span>
                <span className="text-gray-900 font-medium cursor-pointer border-b-2 border-blue-600 pb-4">Tours</span>
                <span className="text-gray-600 hover:text-gray-900 cursor-pointer">Favourites</span>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <button className="text-gray-600 hover:text-gray-900">Register</button>
              <button className="bg-orange-500 text-white px-4 py-2 rounded-full hover:bg-orange-600">Sign in</button>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="h-4 w-4" />
              <span>{tour.locations}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 px-4 py-2 bg-gray-100 rounded">
              <Calendar className="h-4 w-4" />
              <span>24.04.2020 - 04.05.2020</span>
            </div>
            <div className="ml-auto">
              <button className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700">
                <MapPin className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Tour Package */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Package Header */}
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Holiday Package: {tour.title}</h1>
                <div className="flex items-center gap-2 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-orange-400 text-orange-400" />
                  ))}
                  <span className="text-sm text-gray-600">(89 Reviews)</span>
                </div>
              </div>

              {/* Tour Image */}
              <div className="relative">
                <TourImageCarousel 
                  tourId={Number(tourId)} 
                  tourTitle={tour.title}
                  images={tourImages?.map(img => ({
                    ...img,
                    source: img.source || undefined,
                    imageDescription: img.imageDescription || undefined,
                    prompt: img.prompt || undefined,
                    attribution: img.attribution || undefined,
                    generatedAt: img.generatedAt || undefined
                  }))}
                />
              </div>

              {/* Price and Details */}
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-600">{tour.era} • Europe</div>
                    <div className="text-3xl font-bold text-gray-900">
                      $ {typeof tour.price === 'number' ? tour.price.toLocaleString() : tour.price || '1,400'}.00
                      <span className="text-lg font-normal text-gray-600"> /person</span>
                    </div>
                    <div className="text-sm text-gray-600">Multiple local tour guides/drivers available throughout your tour activity</div>
                  </div>

                  {/* Inclusions */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{tour.duration || '7'} days • 3 may</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">English only</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Car className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">Comfortable bus</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Coffee className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">Breakfast at the hotel</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <BookOpen className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">Photo report</span>
                    </div>
                  </div>

                  <Button 
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-medium"
                    onClick={() => setIsBookingModalOpen(true)}
                  >
                    Book Now
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Column - Cities We Visit + Map */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 border border-gray-200 h-fit">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Cities we will visit</h3>
              
              {/* City List */}
              <div className="flex flex-wrap gap-2 mb-6">
                {cities.map((city, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-sm text-gray-600">{city}</span>
                  </div>
                ))}
              </div>

              {/* Mock Map */}
              <div className="relative h-64 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg mb-6 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-green-100 via-blue-100 to-blue-200"></div>
                
                {/* Mock route line */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 200">
                  <path 
                    d="M50,150 Q100,100 150,120 T250,80" 
                    stroke="#1d4ed8" 
                    strokeWidth="3" 
                    fill="none"
                    strokeDasharray="5,5"
                  />
                  {/* Mock city markers */}
                  <circle cx="80" cy="140" r="6" fill="#1d4ed8" stroke="white" strokeWidth="2"/>
                  <circle cx="180" cy="100" r="6" fill="#1d4ed8" stroke="white" strokeWidth="2"/>
                  <circle cx="220" cy="90" r="6" fill="#1d4ed8" stroke="white" strokeWidth="2"/>
                </svg>
                
                {/* Italy label */}
                <div className="absolute bottom-4 right-4 text-xs text-gray-600 font-medium">
                  {tour.locations?.includes('Italy') ? 'Italy' : 
                   tour.locations?.includes('Egypt') ? 'Egypt' :
                   tour.locations?.includes('Greece') ? 'Greece' : 'Map'}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Day Itinerary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Day 9 - Rome</h3>
              
              <div className="space-y-4">
                <p className="text-sm text-gray-600 leading-relaxed">
                  After breakfast, we'll take you through this fascinating city of ornate palaces, lyrical waterways, captivating churches and impressive architecture.
                </p>
                
                {/* Sample images for the day */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="aspect-square bg-gradient-to-br from-amber-100 to-orange-200 rounded-lg flex items-center justify-center">
                    <span className="text-xs text-gray-600">Colosseum</span>
                  </div>
                  <div className="aspect-square bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                    <span className="text-xs text-gray-600">Vatican</span>
                  </div>
                  <div className="aspect-square bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">
                    <span className="text-xs text-gray-600">Forum</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Hotels Section */}
        {hotels && hotels.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Hotels</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {hotels.slice(0, 4).map((hotel) => (
                <div key={hotel.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <Hotel className="h-8 w-8 text-gray-400" />
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold text-gray-900 mb-1">{hotel.name}</h4>
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-3 w-3 ${i < 4 ? 'fill-orange-400 text-orange-400' : 'text-gray-300'}`} />
                      ))}
                      <span className="text-sm text-gray-600 ml-1">4.2</span>
                    </div>
                    <p className="text-xs text-gray-600">{hotel.location || tour.locations}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
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