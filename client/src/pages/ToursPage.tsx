import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tour } from "@shared/schema";
import TourCard from "@/components/TourCard";
import EraOverview from "@/components/EraOverview";
import { Skeleton } from "@/components/ui/skeleton";

export default function ToursPage() {
  const [selectedEra, setSelectedEra] = useState<string | null>(null);

  const { data: tours, isLoading, error } = useQuery<Tour[]>({ 
    queryKey: ["/api/tours"]
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-[150px]" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-[400px]" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !tours) {
    return <div>Error loading tours</div>;
  }

  const filteredTours = selectedEra
    ? tours.filter(tour => tour.era && tour.era.toLowerCase() === selectedEra.toLowerCase())
    : tours;

  return (
    <div className="space-y-10">
      <EraOverview 
        onEraSelect={setSelectedEra}
        selectedEra={selectedEra}
      />

      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            {selectedEra ? `${selectedEra} Tours` : 'Historical Tours'}
          </h2>
          <p className="text-muted-foreground">
            {selectedEra 
              ? `Experience the wonders of ${selectedEra} through our curated tours`
              : 'Experience history first-hand with our curated historical tours'
            }
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredTours.map(tour => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </div>
      </div>
    </div>
  );
}