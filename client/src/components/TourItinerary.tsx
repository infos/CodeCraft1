import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Itinerary } from "@shared/schema";

interface TourItineraryProps {
  tourId: number;
}

export default function TourItinerary({ tourId }: TourItineraryProps) {
  const { data: itineraries, isLoading } = useQuery<Itinerary[]>({
    queryKey: [`/api/tours/${tourId}/itineraries`],
    enabled: !!tourId
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="h-[500px] animate-pulse bg-muted rounded-lg" />
        </CardContent>
      </Card>
    );
  }

  if (!itineraries || itineraries.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">No itinerary found for this tour</p>
        </CardContent>
      </Card>
    );
  }

  // Sort itineraries by day number
  const sortedItineraries = [...itineraries].sort((a, b) => a.day - b.day);

  return (
    <Card>
      <CardContent className="p-6">
        <ScrollArea className="h-[500px] pr-4">
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
            <div className="space-y-8">
              {sortedItineraries.map((day) => (
                <div key={day.id} className="relative pl-8">
                  <div className="absolute left-0 w-8 flex items-center justify-center">
                    <div className="w-3 h-3 bg-primary rounded-full" />
                  </div>
                  <div className="p-4 rounded-lg border bg-card">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold">Day {day.day}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {day.title}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      {day.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}