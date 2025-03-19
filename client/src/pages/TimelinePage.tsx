import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Emperor } from "@shared/schema";
import EmperorTimeline from "@/components/EmperorTimeline";
import EraOverview from "@/components/EraOverview";
import { Skeleton } from "@/components/ui/skeleton";

export default function TimelinePage() {
  const [selectedEra, setSelectedEra] = useState<string | null>(null);

  const { data: emperors, isLoading, error } = useQuery<Emperor[]>({ 
    queryKey: ["/api/emperors"]
  });

  if (isLoading) {
    return <Skeleton className="h-[600px] w-full" />;
  }

  if (error || !emperors) {
    return <div>Error loading emperors timeline</div>;
  }

  // Filter emperors based on selected era
  const filteredEmperors = selectedEra
    ? emperors.filter(emperor => emperor.era && emperor.era.toLowerCase() === selectedEra.toLowerCase())
    : emperors;

  return (
    <div className="space-y-10">
      <EraOverview 
        onEraSelect={setSelectedEra}
        selectedEra={selectedEra}
      />

      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            {selectedEra ? `${selectedEra} Emperors` : 'Historical Timeline'}
          </h2>
          <p className="text-muted-foreground">
            {selectedEra 
              ? `Explore the rulers of the ${selectedEra} era`
              : 'Explore the rich history of emperors through our interactive timeline'
            }
          </p>
        </div>
        <EmperorTimeline emperors={filteredEmperors} />
      </div>
    </div>
  );
}