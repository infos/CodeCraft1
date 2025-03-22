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
    queryKey: ['/api/tours', tourId],
    enabled: !!tourId
  });

  const { data: hotels, isLoading: hotelsLoading } = useQuery<HotelRecommendation[]>({
    queryKey: ['/api/tours', tourId, 'hotels'],
    enabled: !!tourId
  });

  if (tourLoading || hotelsLoading) {
    return <Skeleton className="h-[600px] w-full" />;
  }

  if (!tour || !hotels) {
    return <div>Tour not found</div>;
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
          <p className="text-lg leading-relaxed mb-4">{tour.description}</p>
          <div className="flex items-center justify-between text-lg border-t pt-4 mt-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <span>{tour.duration} days</span>
            </div>
            <div className="font-bold">${tour.price.toLocaleString()}</div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Daily Itinerary</CardTitle>
        </CardHeader>
        <CardContent>
          <TourItinerary tourId={Number(tourId)} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hotel className="h-5 w-5" />
            Recommended Hotels
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2">
            {hotels.map((hotel) => (
              <li key={hotel.id} className="text-lg">{hotel.name}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}