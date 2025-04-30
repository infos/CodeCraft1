import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import EraChipSelector from "./EraChipSelector";
import { XIcon } from "lucide-react";
import type { Era } from "@shared/schema";

interface EraOverviewProps {
  onEraSelect?: (era: string | null) => void;
  selectedEra?: string | null;
}

export default function EraOverview({ onEraSelect, selectedEra }: EraOverviewProps) {
  const { data: eras, isLoading } = useQuery<Era[]>({
    queryKey: ["/api/eras"]
  });

  if (isLoading) {
    return <div className="h-[150px] animate-pulse bg-muted rounded-lg" />;
  }

  // Sort eras by startYear from oldest to newest
  const sortedEras = [...(eras || [])].sort((a, b) => (a.startYear || 0) - (b.startYear || 0));
  
  // Extract era names for the selector
  const eraOptions = sortedEras.map(era => era.name);
  
  // Convert selectedEra to array format for EraChipSelector
  const selectedEraArray = selectedEra ? [selectedEra] : [];
  
  const handleEraChange = (selected: string[]) => {
    // Since we're using single selection mode, just take the first item or null
    onEraSelect?.(selected.length > 0 ? selected[0] : null);
  };

  const formatYear = (year: number | null | undefined) => {
    if (year === null || year === undefined) return "Unknown";
    const absYear = Math.abs(year);
    return year < 0 ? `${absYear} BCE` : `${year} CE`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-baseline">
        <h2 className="text-2xl font-bold tracking-tight">Historical Eras and Ages</h2>
        {selectedEra && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEraSelect?.(null)}
            className="text-sm flex items-center gap-1.5"
          >
            <XIcon className="h-4 w-4" />
            Clear Filter
          </Button>
        )}
      </div>

      <Card className="overflow-hidden">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Browse eras</h3>
            <EraChipSelector
              options={eraOptions}
              selected={selectedEraArray}
              onChange={handleEraChange}
              multiple={false}
            />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Detailed era information</h3>
        <ScrollArea className="w-full whitespace-nowrap rounded-md border">
          <div className="flex w-max space-x-4 p-4">
            {sortedEras.map((era) => (
              <Card 
                key={era.id}
                className={`w-[280px] cursor-pointer hover:bg-accent transition-colors ${
                  selectedEra === era.name ? 'bg-primary/5 border-primary' : ''
                }`}
                onClick={() => onEraSelect?.(era.name)}
              >
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-1">{era.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {formatYear(era.startYear)} - {formatYear(era.endYear)}
                  </p>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {era.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  );
}