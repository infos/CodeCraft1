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
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">{tour.title}</h2>
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{tour.locations}</span>
        </div>
      </div>

      <div className="w-1/2 mx-auto rounded-lg overflow-hidden">
        <img 
          src={tour.imageUrl || '/placeholder-tour.jpg'}
          alt={tour.title}
          className="w-full h-auto"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tour Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="leading-relaxed">{tour.description}</p>
          <div className="mt-4 flex items-center justify-between text-lg">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <span>{tour.duration} days</span>
            </div>
            <div className="font-bold">${tour.price}</div>
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
              <li key={hotel.id}>{hotel.name}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}