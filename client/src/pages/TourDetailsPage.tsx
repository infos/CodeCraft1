import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Calendar, Hotel, Check, Star, Home, Bookmark, Heart, Search, Globe, Coffee, BookOpen, Car, Users, ChevronDown } from "lucide-react";
import TourItinerary from "@/components/TourItinerary";
import TourImageCarousel from "@/components/TourImageCarousel";
import BookingInquiryModal from "@/components/BookingInquiryModal";
import type { Tour, HotelRecommendation, TourImage } from "@shared/schema";

export default function TourDetailsPage() {
  const params = useParams();
  const tourId = params.id;
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState<number | null>(null);
  const [isMapExpanded, setIsMapExpanded] = useState(false);

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

  // Extract city names from locations, filtering out countries
  const cities = tour.locations ? tour.locations.split(',').map(city => city.trim()).filter(location => {
    // Filter out standalone countries (common country names that shouldn't be shown as cities)
    const countries = ['Italy', 'Greece', 'Egypt', 'Iraq', 'France', 'Spain', 'Turkey', 'China', 'India', 'Germany', 'UK', 'England'];
    return !countries.includes(location);
  }) : [];
  
  // Calculate number of days from itineraries
  const numberOfDays = itineraries ? Math.max(...itineraries.map(item => item.day)) : 0;
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Home Page Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo/Title */}
            <div className="flex items-center space-x-4">
              <Link href="/">
                <div className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity">
                  <Globe className="h-8 w-8 text-blue-600" />
                  <h1 className="text-xl font-bold text-gray-900">Heritage Timeline</h1>
                </div>
              </Link>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search historical tours, eras, or destinations..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-3">
              {/* Location indicator */}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-gray-700">{cities[0] || tour.locations}</span>
              </div>
              
              <Button variant="outline" size="sm">
                Explore
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
          {/* Left Panel - Tour Package and Itinerary */}
          <div className="lg:col-span-6 space-y-8">
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
              
              {/* Tour Image and Details - Exact Reference Layout */}
              <div className="px-8 pb-8 flex gap-6">
                {/* Tour Image - Matching reference proportions */}
                <div className="w-80 flex-shrink-0">
                  <div className="aspect-[4/3] bg-gradient-to-br from-orange-400 to-orange-600 relative overflow-hidden rounded-lg">
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
                  
                  {/* Availability Months */}
                  <div className="mt-4 space-y-2">
                    <h4 className="text-sm font-semibold text-gray-900">Available Months</h4>
                    <div className="grid grid-cols-4 gap-2">
                      {['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'].map((month) => (
                        <div key={month} className="bg-green-50 border border-green-200 rounded-md py-1 px-2 text-center">
                          <span className="text-xs font-medium text-green-800">{month}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Best weather conditions for historical site visits
                    </p>
                  </div>
                </div>

                {/* Tour Details - Matching reference spacing */}
                <div className="flex-1 space-y-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold text-gray-900">
                      $ {typeof tour.price === 'number' ? tour.price.toLocaleString() : tour.price}.00
                    </span>
                    <span className="text-gray-600 text-base">/ person</span>
                  </div>
                  
                  <div className="text-gray-600 text-sm">
                    {numberOfDays > 0 ? `${numberOfDays} Days` : 'Multi-day'} • Explore ancient civilizations with expert historians<br />
                    and visit world-renowned historical sites
                  </div>

                  {/* Dynamic Tour Tags - Based on tour content */}
                  <div className="flex flex-wrap gap-2 py-2">
                    {/* Generate tags based on tour title and description */}
                    {tour.title.toLowerCase().includes('rome') && (
                      <>
                        <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">Roman Empire</span>
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">Julius Caesar</span>
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">Ancient Ruins</span>
                      </>
                    )}
                    {tour.title.toLowerCase().includes('egypt') && (
                      <>
                        <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium">Pharaohs</span>
                        <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">Pyramids</span>
                        <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">Hieroglyphics</span>
                      </>
                    )}
                    {tour.title.toLowerCase().includes('greek') && (
                      <>
                        <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium">Greek Mythology</span>
                        <span className="bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-sm font-medium">Ancient Philosophy</span>
                      </>
                    )}
                    {/* Default historical tags */}
                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">Historical Sites</span>
                    <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-medium">Cultural Heritage</span>
                    <span className="bg-rose-100 text-rose-700 px-3 py-1 rounded-full text-sm font-medium">Museums</span>
                    {cities.length > 2 && (
                      <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium">Multi-City</span>
                    )}
                  </div>

                  <Button 
                    onClick={() => setIsBookingModalOpen(true)}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg font-semibold rounded-full mt-4"
                  >
                    Book Now
                  </Button>
                </div>
              </div>
            </div>

            {/* Daily Itinerary - Extended height to fill remaining space */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex-1 min-h-[800px]">
              <h3 className="text-base font-semibold text-gray-900 mb-3">
                Daily Itinerary
              </h3>
              <div className="h-[calc(100%-3rem)] overflow-y-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
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
                  <div className="text-center py-8">
                    <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No itinerary available</h3>
                    <p className="mt-1 text-sm text-gray-500">The itinerary for this tour is being prepared.</p>
                  </div>
                )}
              </div>
            </div>


          </div>

          {/* Right Panel - Cities, Hotels, and What's Included */}
          <div className="lg:col-span-4 space-y-4 flex flex-col">
            {/* Cities we will visit - Compact */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex-shrink-0">
              <h3 className="text-base font-semibold text-gray-900 mb-3">Cities we will visit</h3>
              <div className="space-y-3 mb-4">
                {/* Display all cities in a grid format */}
                <div className="grid grid-cols-2 gap-2">
                  {cities.map((city, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                      <span className="text-sm text-gray-700 font-medium">{city}</span>
                    </div>
                  ))}
                </div>
                
                {/* Show countries only if tour spans multiple countries */}
                {(() => {
                  // Extract unique countries from the original locations string
                  const allLocations = tour.locations ? tour.locations.split(',').map(loc => loc.trim()) : [];
                  const countries = ['Italy', 'Greece', 'Egypt', 'Iraq', 'France', 'Spain', 'Turkey', 'China', 'India', 'Germany', 'UK', 'England'];
                  const tourCountries = [...new Set(allLocations.filter(location => countries.includes(location)))];
                  
                  return tourCountries.length > 1 && (
                    <div className="pt-2 border-t border-gray-100">
                      <div className="text-xs text-gray-500 mb-1">Countries:</div>
                      <div className="flex flex-wrap gap-1">
                        {tourCountries.map((country, index) => (
                          <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            {country}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>
              
              {/* Topographic Travel Map */}
              <div 
                className={`${isMapExpanded ? 'fixed inset-0 z-50 bg-white' : 'aspect-[3/2]'} bg-gray-100 relative overflow-hidden rounded-lg border border-gray-200 cursor-pointer`}
                onClick={() => setIsMapExpanded(!isMapExpanded)}
              >
                {isMapExpanded && (
                  <div className="absolute top-4 right-4 z-10">
                    <button 
                      className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsMapExpanded(false);
                      }}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
                
                {!isMapExpanded && (
                  <div className="absolute top-2 right-2 z-10 bg-white/80 backdrop-blur-sm rounded px-2 py-1">
                    <span className="text-xs text-gray-600 flex items-center gap-1">
                      <Globe className="w-3 h-3" />
                      Click to expand
                    </span>
                  </div>
                )}
                {/* Country boundary background */}
                {(() => {
                  const getCountryOutline = () => {
                    const allLocations = tour.locations ? tour.locations.toLowerCase() : '';
                    
                    // Italy outline
                    if (allLocations.includes('italy') || allLocations.includes('rome') || allLocations.includes('florence') || allLocations.includes('venice')) {
                      return (
                        <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
                          <path d="M35,25 C40,20 50,18 58,22 L62,26 C65,30 68,35 65,40 L70,45 C72,50 70,60 68,65 L65,70 C60,75 55,80 50,78 L45,75 C40,70 38,65 35,60 L32,55 C30,50 32,45 35,40 L30,35 C28,30 30,25 35,25 Z" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="0.5"/>
                        </svg>
                      );
                    }
                    
                    // Greece outline
                    if (allLocations.includes('greece') || allLocations.includes('athens') || allLocations.includes('delphi')) {
                      return (
                        <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
                          <path d="M45,35 C50,30 55,32 58,36 L60,40 C62,45 60,50 58,55 L55,60 C50,65 45,67 40,65 L35,62 C32,58 30,52 32,48 L35,44 C38,40 42,37 45,35 Z" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="0.5"/>
                          <circle cx="65" cy="45" r="3" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="0.3"/>
                          <circle cx="68" cy="52" r="2" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="0.3"/>
                        </svg>
                      );
                    }
                    
                    // Egypt outline
                    if (allLocations.includes('egypt') || allLocations.includes('cairo') || allLocations.includes('luxor')) {
                      return (
                        <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
                          <path d="M40,20 L60,20 L62,25 C65,30 68,40 70,50 L72,60 C70,70 65,75 60,78 L50,80 L40,78 C35,75 30,70 32,60 L34,50 C36,40 38,30 40,25 Z" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="0.5"/>
                        </svg>
                      );
                    }
                    
                    // France outline
                    if (allLocations.includes('france') || allLocations.includes('paris') || allLocations.includes('versailles')) {
                      return (
                        <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
                          <path d="M30,25 C40,22 50,25 58,28 L65,35 C68,40 66,50 62,55 L58,65 C50,70 40,68 35,65 L28,58 C25,50 26,40 30,35 L28,30 C26,25 28,22 30,25 Z" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="0.5"/>
                        </svg>
                      );
                    }
                    
                    // England outline
                    if (allLocations.includes('england') || allLocations.includes('london') || allLocations.includes('cambridge')) {
                      return (
                        <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
                          <path d="M35,20 C42,18 48,22 52,28 L55,35 C58,42 56,50 52,56 L48,62 C42,68 36,66 32,62 L28,56 C25,50 26,42 30,36 L32,28 C34,22 35,20 35,20 Z" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="0.5"/>
                        </svg>
                      );
                    }
                    
                    // USA outline (for Colonial America tours)
                    if (allLocations.includes('usa') || allLocations.includes('philadelphia') || allLocations.includes('boston')) {
                      return (
                        <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
                          <path d="M15,35 C25,30 40,32 55,35 L70,38 C80,42 85,48 82,55 L78,62 C70,68 60,70 50,68 L35,65 C25,62 18,55 15,48 L12,42 C10,38 12,32 15,35 Z" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="0.5"/>
                        </svg>
                      );
                    }
                    
                    // Netherlands outline
                    if (allLocations.includes('netherlands') || allLocations.includes('amsterdam')) {
                      return (
                        <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
                          <path d="M42,35 C48,32 54,35 58,40 L60,45 C62,52 58,58 54,62 L48,65 C42,68 36,66 32,62 L30,56 C28,50 30,44 34,40 L36,36 C38,32 40,32 42,35 Z" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="0.5"/>
                        </svg>
                      );
                    }
                    
                    // Russia outline
                    if (allLocations.includes('russia') || allLocations.includes('st. petersburg') || allLocations.includes('moscow')) {
                      return (
                        <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
                          <path d="M20,25 C35,20 50,22 65,25 L80,30 C85,35 88,45 85,55 L80,65 C70,70 55,72 40,70 L25,68 C15,65 10,55 12,45 L15,35 C17,30 18,25 20,25 Z" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="0.5"/>
                        </svg>
                      );
                    }
                    
                    // Austria outline
                    if (allLocations.includes('austria') || allLocations.includes('vienna')) {
                      return (
                        <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
                          <path d="M30,40 C45,38 60,42 68,48 L70,55 C68,62 62,68 55,70 L40,72 C30,70 25,62 28,55 L30,48 C32,42 30,40 30,40 Z" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="0.5"/>
                        </svg>
                      );
                    }
                    
                    // Default generic map outline
                    return (
                      <svg className="absolute inset-0 w-full h-full opacity-15" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
                        <path d="M20,30 C35,25 50,28 65,32 L75,40 C78,50 75,60 70,68 L60,75 C45,78 30,75 20,68 L15,58 C12,48 15,38 20,30 Z" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="0.5"/>
                      </svg>
                    );
                  };
                  
                  return getCountryOutline();
                })()}

                {/* Topographic base map with terrain styling */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50/80 via-gray-100/60 to-gray-200/80">
                  {/* Topographic texture overlay */}
                  <div className="absolute inset-0 opacity-30" style={{
                    backgroundImage: `
                      radial-gradient(circle at 20% 20%, rgba(139, 69, 19, 0.1) 0%, transparent 50%),
                      radial-gradient(circle at 60% 30%, rgba(34, 139, 34, 0.1) 0%, transparent 40%),
                      radial-gradient(circle at 80% 70%, rgba(70, 130, 180, 0.2) 0%, transparent 30%),
                      linear-gradient(45deg, rgba(160, 160, 160, 0.1) 25%, transparent 25%),
                      linear-gradient(-45deg, rgba(160, 160, 160, 0.1) 25%, transparent 25%)
                    `,
                    backgroundSize: '40px 40px, 60px 60px, 50px 50px, 20px 20px, 20px 20px'
                  }}></div>
                  
                  {/* Water bodies - rivers and coastlines */}
                  <div className="absolute bottom-0 left-0 w-full h-1/4 bg-gradient-to-t from-blue-100 to-transparent opacity-60"></div>
                  <div className="absolute top-1/3 right-0 w-1/3 h-2 bg-blue-200 opacity-50 rounded-full transform rotate-12"></div>
                  
                  {/* Mountain ranges - topographic style */}
                  <div className="absolute top-1/4 left-1/4 w-24 h-8 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full opacity-70 transform -rotate-12"></div>
                  <div className="absolute top-1/2 right-1/4 w-20 h-6 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full opacity-60 transform rotate-6"></div>
                  
                  {/* Forest areas */}
                  <div className="absolute bottom-1/3 left-1/3 w-16 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-lg opacity-50"></div>
                </div>

                {/* Curved dotted route path */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <defs>
                    <pattern id="dots" patternUnits="userSpaceOnUse" width="4" height="4">
                      <circle cx="2" cy="2" r="1" fill="#22c55e" />
                    </pattern>
                  </defs>
                  <path
                    d="M15,70 Q30,45 50,60 Q70,40 85,55"
                    stroke="url(#dots)"
                    strokeWidth="3"
                    fill="none"
                    strokeDasharray="4,6"
                    className="opacity-80"
                  />
                </svg>

                {/* Flight paths for longer distances */}
                {cities.length > 2 && (
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path
                      d="M15,70 Q50,20 85,55"
                      stroke="#22c55e"
                      strokeWidth="2"
                      fill="none"
                      strokeDasharray="8,4"
                      opacity="0.6"
                    />
                  </svg>
                )}

                {/* City markers with different styles */}
                {cities.slice(0, 4).map((city, index) => {
                  const positions = [
                    { top: '70%', left: '15%' }, // Starting city - green pin
                    { top: '60%', left: '50%' }, // Middle city - green circle 
                    { top: '55%', left: '85%' }, // End city - red pin
                    { top: '45%', left: '70%' }  // Optional 4th city
                  ];
                  const position = positions[index] || positions[0];
                  const isStart = index === 0;
                  const isEnd = index === cities.length - 1 && cities.length > 1;
                  const isMiddle = !isStart && !isEnd;
                  
                  return (
                    <div 
                      key={index}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
                      style={{ top: position.top, left: position.left }}
                    >
                      <div className="relative flex flex-col items-center">
                        {/* Different marker styles based on position */}
                        {isStart && (
                          <div className="w-6 h-6 bg-green-500 rounded-full border-3 border-white shadow-lg flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        )}
                        {isEnd && (
                          <div className="w-6 h-6 bg-red-500 rounded-full border-3 border-white shadow-lg flex items-center justify-center relative">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-600 rounded-full text-white text-xs flex items-center justify-center font-bold">H</div>
                          </div>
                        )}
                        {isMiddle && (
                          <div className="w-5 h-5 bg-green-400 border-2 border-white shadow-md flex items-center justify-center">
                            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                          </div>
                        )}
                        
                        {/* City label with better styling */}
                        <div className="mt-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md shadow-sm border border-gray-200">
                          <span className="text-xs font-semibold text-gray-800 whitespace-nowrap">{city}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Flight icons for air travel segments */}
                {cities.length > 2 && (
                  <>
                    <div className="absolute top-[35%] left-[32%] transform -translate-x-1/2 -translate-y-1/2 text-blue-600">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
                      </svg>
                    </div>
                    <div className="absolute top-[42%] left-[67%] transform -translate-x-1/2 -translate-y-1/2 text-blue-600">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
                      </svg>
                    </div>
                  </>
                )}

                {/* Bus/ground transport icons */}
                <div className="absolute top-[65%] left-[32%] transform -translate-x-1/2 -translate-y-1/2 text-purple-600">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M4 16c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z"/>
                  </svg>
                </div>


              </div>
            </div>

            {/* Hotels Section */}
            {hotels && hotels.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Hotels</h2>
                <div className="space-y-4">
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
                    <div key={hotel.id} className="flex gap-4 items-start border-b border-gray-100 pb-4 last:border-b-0">
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
                        <h4 className="font-semibold text-gray-900 mb-1">
                          <a 
                            href={`https://www.google.com/search?q=${encodeURIComponent(hotel.name + " " + (hotel.location || cities[index % cities.length]))}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            {hotel.name}
                          </a>
                        </h4>
                        <p className="text-sm text-gray-600 mb-2">{hotel.location || cities[index % cities.length]}</p>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-orange-400 text-orange-400" />
                            <span className="font-medium text-gray-900">{ratings[index]}</span>
                          </div>
                        </div>
                        <p className="text-gray-700 text-sm mt-2">{hotel.description}</p>
                        <div className="mt-2">
                          <Button 
                            onClick={() => {
                              setSelectedHotel(hotel.id);
                              setIsBookingModalOpen(true);
                            }}
                            className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded text-sm font-medium"
                          >
                            Select Hotel
                          </Button>
                        </div>
                      </div>
                    </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* What's Included / Not Included Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">What's Included & Not Included</h3>
              
              <div className="space-y-6">
                {/* What's Included */}
                <div>
                  <h4 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    What's Included
                  </h4>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700 text-sm">Professional tour guide</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700 text-sm">Transportation between cities</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700 text-sm">Daily breakfast</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700 text-sm">Entry tickets to historical sites</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700 text-sm">Small group experience (max 16)</span>
                    </li>
                  </ul>
                </div>

                {/* What's Not Included */}
                <div>
                  <h4 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                    What's Not Included
                  </h4>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700 text-sm">International flights</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700 text-sm">Lunch and dinner meals</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700 text-sm">Personal expenses</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700 text-sm">Tips and gratuities</span>
                    </li>
                  </ul>
                </div>
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