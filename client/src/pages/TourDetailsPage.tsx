import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Calendar, Hotel } from "lucide-react";
import type { Tour, Itinerary, HotelRecommendation } from "@shared/schema";

export default function TourDetailsPage() {
  const params = useParams();
  const tourId = params.id;

  const { data: tour, isLoading: tourLoading } = useQuery<Tour>({
    queryKey: ['/api/tours', tourId],
    enabled: !!tourId
  });

  const { data: itineraries, isLoading: itinerariesLoading } = useQuery<Itinerary[]>({
    queryKey: ['/api/tours', tourId, 'itineraries'],
    enabled: !!tourId
  });

  const { data: hotels, isLoading: hotelsLoading } = useQuery<HotelRecommendation[]>({
    queryKey: ['/api/tours', tourId, 'hotels'],
    enabled: !!tourId
  });

  if (tourLoading || itinerariesLoading || hotelsLoading) {
    return <Skeleton className="h-[600px] w-full" />;
  }

  if (!tour || !itineraries || !hotels) {
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
          <div className="space-y-6">
            {itineraries.map((day) => (
              <div key={day.id} className="relative pl-6 pb-6 border-l border-border last:pb-0">
                <div className="absolute left-0 -translate-x-1/2 w-3 h-3 rounded-full bg-primary" />
                <h3 className="font-semibold mb-2">Day {day.day}: {day.title}</h3>
                <p className="text-muted-foreground">{day.description}</p>
              </div>
            ))}
          </div>
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