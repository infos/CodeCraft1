import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
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

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-baseline">
        <h2 className="text-2xl font-bold tracking-tight">Historical Eras</h2>
        {selectedEra && (
          <button 
            onClick={() => onEraSelect?.(null)}
            className="text-sm text-muted-foreground hover:text-primary"
          >
            Clear Filter
          </button>
        )}
      </div>

      <ScrollArea className="w-full whitespace-nowrap rounded-md border">
        <div className="flex w-max space-x-4 p-4">
          {eras?.map((era) => (
            <Card 
              key={era.id}
              className={`w-[280px] cursor-pointer hover:bg-accent transition-colors ${
                selectedEra === era.name ? 'bg-primary/5' : ''
              }`}
              onClick={() => onEraSelect?.(era.name)}
            >
              <CardContent className="p-4">
                <h3 className="font-semibold mb-1">{era.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {era.startYear} - {era.endYear} CE
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
  );
}