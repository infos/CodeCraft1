import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Calendar, Hotel } from "lucide-react";
import TourItinerary from "@/components/TourItinerary";
import type { Tour, HotelRecommendation } from "@shared/schema";

export default function TourDetailsPage() {
  const params = useParams();
  const tourId = params.id;

  const { data: tour, isLoading: tourLoading } = useQuery<Tour>({
    queryKey: [`/api/tours/${tourId}`],
    enabled: !!tourId
  });

  const { data: hotels, isLoading: hotelsLoading } = useQuery<HotelRecommendation[]>({
    queryKey: [`/api/tours/${tourId}/hotels`],
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

      {tour.imageUrl && (
        <div className="w-full max-w-3xl mx-auto rounded-lg overflow-hidden">
          <img 
            src={tour.imageUrl}
            alt={tour.title}
            className="w-full h-auto"
          />
        </div>
      )}

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
            <div className="flex items-center justify-between text-lg border-t pt-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span>{tour.duration || '7 days'}</span>
              </div>
              <div className="font-bold">
                ${typeof tour.price === 'number' ? tour.price.toLocaleString() : tour.price || '2,500'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hotel Recommendations Section */}
      {hotels && hotels.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hotel className="h-5 w-5" />
              Hotel Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {(hotels || []).map((hotel, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-2">
                  <h4 className="font-semibold">{hotel.name}</h4>
                  <p className="text-sm text-muted-foreground">{hotel.location}</p>
                  <p className="text-sm">{hotel.description}</p>
                  {hotel.amenities && Array.isArray(hotel.amenities) && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {hotel.amenities.slice(0, 3).map((amenity, idx) => (
                        <span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {amenity}
                        </span>
                      ))}
                    </div>
                  )}
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
    </div>
  );
}