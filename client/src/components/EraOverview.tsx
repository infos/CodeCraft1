import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Era } from "@shared/schema";

export default function EraOverview() {
  const { data: eras, isLoading } = useQuery<Era[]>({
    queryKey: ["/api/eras"]
  });
  const [, setLocation] = useLocation();

  if (isLoading) {
    return <div className="h-[200px] animate-pulse bg-muted rounded-lg" />;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Historical Eras</h2>
        <p className="text-muted-foreground">
          Explore the rich tapestry of human history across different eras
        </p>
      </div>
      
      <ScrollArea className="w-full whitespace-nowrap rounded-lg border">
        <div className="flex p-4 gap-4">
          {eras?.map((era) => (
            <Card 
              key={era.id} 
              className="w-[300px] shrink-0 cursor-pointer hover:bg-accent transition-colors"
              onClick={() => setLocation(`/era/${era.name.toLowerCase()}`)}
            >
              <CardHeader>
                <CardTitle>{era.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {era.keyFigures}
                </p>
                <p className="text-sm text-primary mt-2">
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
