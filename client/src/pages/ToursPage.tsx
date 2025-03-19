import { useQuery } from "@tanstack/react-query";
import { Tour } from "@shared/schema";
import TourCard from "@/components/TourCard";
import { Skeleton } from "@/components/ui/skeleton";

export default function ToursPage() {
  const { data: tours, isLoading, error } = useQuery<Tour[]>({ 
    queryKey: ["/api/tours"]
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map(i => (
          <Skeleton key={i} className="h-[400px]" />
        ))}
      </div>
    );
  }

  if (error) {
    return <div>Error loading tours</div>;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Historical Tours</h2>
        <p className="text-muted-foreground">
          Experience history first-hand with our curated historical tours
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tours.map(tour => (
          <TourCard key={tour.id} tour={tour} />
        ))}
      </div>
    </div>
  );
}
