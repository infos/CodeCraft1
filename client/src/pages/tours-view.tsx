import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Tour } from "@shared/schema";

export default function ToursView() {
  const { data: tours, isLoading, error } = useQuery<Tour[]>({
    queryKey: ["/api/tours"]
  });

  if (isLoading) {
    return <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[1,2,3,4].map(i => (
        <Skeleton key={i} className="h-[300px]" />
      ))}
    </div>;
  }

  if (error) {
    return <div>Failed to load tours</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8">Historical Tours</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tours.map((tour) => (
          <Card key={tour.id}>
            <CardHeader>
              <CardTitle>{tour.name}</CardTitle>
              <CardDescription>{tour.location}</CardDescription>
            </CardHeader>
            <CardContent>
              <img
                src={tour.imageUrl}
                alt={tour.name}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
              <p>{tour.description}</p>
              <div className="mt-4">
                <p className="font-semibold">Duration: {tour.duration} days</p>
                <p className="font-semibold">Price: ${tour.price}</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Book Now</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
