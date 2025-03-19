import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
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
    return <div className="h-[200px] animate-pulse bg-muted rounded-lg" />;
  }

  return (
    <div className="space-y-2">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Historical Eras</h2>
        <p className="text-muted-foreground">
          Explore the rich tapestry of human history across different eras
        </p>
      </div>

      <ScrollArea className="h-[300px] w-full rounded-lg border">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {selectedEra && (
            <Card 
              className="cursor-pointer hover:bg-accent transition-colors bg-primary/5"
              onClick={() => onEraSelect?.(null)}
            >
              <CardHeader className="p-4">
                <CardTitle className="text-sm">Clear Filter</CardTitle>
              </CardHeader>
            </Card>
          )}
          {eras?.map((era) => (
            <Card 
              key={era.id} 
              className={`cursor-pointer hover:bg-accent transition-colors ${
                selectedEra === era.name ? 'bg-primary/5' : ''
              }`}
              onClick={() => onEraSelect?.(era.name)}
            >
              <CardHeader className="p-4">
                <CardTitle className="text-base">{era.name}</CardTitle>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {era.description}
                </p>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-xs text-primary/80">
                  {era.associatedTours}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}