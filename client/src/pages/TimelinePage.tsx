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

  // Filter and sort emperors based on selected era
  const filteredEmperors = selectedEra
    ? emperors.filter(emperor => 
        emperor.era && 
        emperor.era.trim().toLowerCase() === selectedEra.trim().toLowerCase()
      ).sort((a, b) => (a.startYear || 0) - (b.startYear || 0))
    : [];

  return (
    <div className="container mx-auto px-4 space-y-10 py-8">
      <EraOverview 
        onEraSelect={setSelectedEra}
        selectedEra={selectedEra}
      />

      {selectedEra && (
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">
              {selectedEra} Historical Figures
            </h2>
            <p className="text-muted-foreground">
              Explore the rulers and influential figures of the {selectedEra} era
            </p>
          </div>
          <EmperorTimeline 
            emperors={filteredEmperors} 
            selectedEra={selectedEra}
          />
        </div>
      )}
    </div>
  );
}