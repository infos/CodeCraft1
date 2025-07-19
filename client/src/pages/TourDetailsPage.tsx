import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Calendar, Hotel, Check, X, Star, Wifi, Car, Utensils, Shield, MessageCircle, BookOpen } from "lucide-react";
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

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">{tour.title}</h2>
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{tour.locations}</span>
        </div>
      </div>

      {/* Tour Image Carousel */}
      <div className="w-full max-w-4xl mx-auto">
        <TourImageCarousel 
          tourId={Number(tourId)} 
          tourTitle={tour.title}
          images={tourImages}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tour Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-lg leading-relaxed">{tour.description}</p>
            {tour.era && (
              <p className="text-muted-foreground">
                Historical Era: <span className="font-medium">{tour.era}</span>
              </p>
            )}
            <div className="space-y-4 border-t pt-4">
              <div className="flex items-center justify-between text-lg">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  <span>{tour.duration || '7'} days</span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">
                    ${typeof tour.price === 'number' ? tour.price.toLocaleString() : tour.price || '2,500'}
                  </div>
                  <div className="text-sm text-gray-500">per person</div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  size="lg" 
                  className="flex-1 bg-primary hover:bg-primary/90"
                  onClick={() => setIsBookingModalOpen(true)}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Book This Tour
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setIsBookingModalOpen(true)}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Make Inquiry
                </Button>
              </div>
              
              <div className="text-xs text-center text-gray-500">
                Free cancellation up to 48 hours before departure • Best price guarantee
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* What's Included / What's Not Included Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <Check className="h-5 w-5" />
              What's Included
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Professional licensed tour guide with historical expertise</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm">All entrance fees to museums, archaeological sites, and monuments</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Transportation between destinations in air-conditioned vehicles</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{tour.duration || 7}-day accommodation in carefully selected heritage hotels</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Daily breakfast and selected cultural dining experiences</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Small group size (maximum 16 travelers) for personalized experience</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Comprehensive travel insurance and emergency support</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <X className="h-5 w-5" />
              What's Not Included
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <X className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm">International flights to and from departure city</span>
              </div>
              <div className="flex items-start gap-3">
                <X className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Personal expenses (souvenirs, additional meals, drinks)</span>
              </div>
              <div className="flex items-start gap-3">
                <X className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Optional activities and excursions not mentioned in itinerary</span>
              </div>
              <div className="flex items-start gap-3">
                <X className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Tips and gratuities for guides and hotel staff</span>
              </div>
              <div className="flex items-start gap-3">
                <X className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Visa fees and passport processing costs</span>
              </div>
              <div className="flex items-start gap-3">
                <X className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Single room supplement (additional $450)</span>
              </div>
              <div className="flex items-start gap-3">
                <X className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Travel insurance upgrades and medical coverage extensions</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Hotel Recommendations Section */}
      {hotels && hotels.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hotel className="h-5 w-5" />
              Carefully Selected Heritage Hotels
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-2">
              Experience authentic local hospitality in thoughtfully chosen accommodations that reflect the historical character of each destination.
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              {(hotels || []).map((hotel, index) => (
                <div key={index} className={`border rounded-lg overflow-hidden transition-all duration-200 ${
                  selectedHotel === hotel.id 
                    ? 'ring-2 ring-primary border-primary shadow-lg' 
                    : 'hover:shadow-lg'
                }`}>
                  <div className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <h4 className="font-semibold text-lg">{hotel.name}</h4>
                      <div className="flex items-center gap-1">
                        {[...Array(hotel.rating || 4)].map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{hotel.location}</span>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{hotel.description}</p>
                    
                    {/* Hotel Amenities */}
                    {hotel.amenities && Array.isArray(hotel.amenities) && (
                      <div className="mt-4">
                        <h5 className="text-sm font-medium text-gray-900 mb-2">Hotel Amenities</h5>
                        <div className="grid grid-cols-2 gap-2">
                          {hotel.amenities.slice(0, 6).map((amenity, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              {getAmenityIcon(amenity)}
                              <span className="text-xs text-gray-600">{amenity}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="pt-3 border-t border-gray-100 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">From</span>
                        <span className="text-lg font-semibold text-green-600">
                          ${hotel.pricePerNight || (180 + index * 40)} <span className="text-sm font-normal text-gray-500">/night</span>
                        </span>
                      </div>
                      
                      <Button
                        onClick={() => setSelectedHotel(selectedHotel === hotel.id ? null : hotel.id)}
                        variant={selectedHotel === hotel.id ? "default" : "outline"}
                        size="sm"
                        className="w-full"
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
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Daily Itinerary</CardTitle>
        </CardHeader>
        <CardContent>
          <TourItinerary tourId={Number(tourId)} />
        </CardContent>
      </Card>

      {/* Booking Inquiry Modal */}
      <BookingInquiryModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        tourTitle={tour.title}
        tourId={Number(tourId)}
        tourPrice={typeof tour.price === 'number' ? tour.price : parseInt(tour.price || '2500')}
        selectedHotelId={selectedHotel}
      />
    </div>
  );
}

// Helper function to get appropriate icon for hotel amenities
function getAmenityIcon(amenity: string) {
  const amenityLower = amenity.toLowerCase();
  
  if (amenityLower.includes('wifi') || amenityLower.includes('internet')) {
    return <Wifi className="h-3 w-3 text-blue-500" />;
  } else if (amenityLower.includes('restaurant') || amenityLower.includes('dining') || amenityLower.includes('breakfast')) {
    return <Utensils className="h-3 w-3 text-orange-500" />;
  } else if (amenityLower.includes('parking') || amenityLower.includes('valet')) {
    return <Car className="h-3 w-3 text-gray-500" />;
  } else if (amenityLower.includes('security') || amenityLower.includes('safe')) {
    return <Shield className="h-3 w-3 text-green-500" />;
  } else if (amenityLower.includes('spa') || amenityLower.includes('fitness')) {
    return <Star className="h-3 w-3 text-purple-500" />;
  } else {
    return <Check className="h-3 w-3 text-gray-500" />;
  }
}