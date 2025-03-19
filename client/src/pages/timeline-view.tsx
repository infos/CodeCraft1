import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Timeline from "@/components/timeline";
import type { Emperor } from "@shared/schema";

export default function TimelineView() {
  const { data: emperors, isLoading, error } = useQuery<Emperor[]>({ 
    queryKey: ["/api/emperors"]
  });

  if (isLoading) {
    return <Skeleton className="w-full h-[400px]" />;
  }

  if (error) {
    return (
      <Card>
        <CardContent>
          Failed to load emperors timeline
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8">Roman Emperors Timeline</h1>
      <Timeline emperors={emperors} />
    </div>
  );
}
