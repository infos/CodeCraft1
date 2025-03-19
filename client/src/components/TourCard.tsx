import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { Tour } from "@shared/schema";

interface TourCardProps {
  tour: Tour;
}

export default function TourCard({ tour }: TourCardProps) {
  const [, setLocation] = useLocation();

  return (
    <Card 
      className="cursor-pointer transition-shadow hover:shadow-lg"
      onClick={() => setLocation(`/tour/${tour.id}`)}
    >
      <div className="aspect-video overflow-hidden">
        <img 
          src={tour.imageUrl || '/placeholder-tour.jpg'} 
          alt={tour.title}
          className="object-cover w-full h-full"
        />
      </div>
      <CardHeader>
        <CardTitle>{tour.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-muted-foreground">{tour.description}</p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{tour.locations}</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Duration</p>
              <p className="text-2xl font-bold">{tour.duration} days</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">Price</p>
              <p className="text-2xl font-bold">${tour.price}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}