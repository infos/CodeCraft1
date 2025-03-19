import { useQuery } from "@tanstack/react-query";
import { Emperor } from "@shared/schema";
import EmperorTimeline from "@/components/EmperorTimeline";
import EraOverview from "@/components/EraOverview";
import { Skeleton } from "@/components/ui/skeleton";

export default function TimelinePage() {
  const { data: emperors, isLoading, error } = useQuery<Emperor[]>({ 
    queryKey: ["/api/emperors"]
  });

  if (isLoading) {
    return <Skeleton className="h-[600px] w-full" />;
  }

  if (error) {
    return <div>Error loading emperors timeline</div>;
  }

  return (
    <div className="space-y-10">
      <EraOverview />

      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Roman Emperors Timeline</h2>
          <p className="text-muted-foreground">
            Explore the rich history of Roman emperors through our interactive timeline
          </p>
        </div>
        <EmperorTimeline emperors={emperors} />
      </div>
    </div>
  );
}