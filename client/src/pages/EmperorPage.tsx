import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Emperor } from "@shared/schema";
import VirtualHistorian from "@/components/VirtualHistorian";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function EmperorPage() {
  const { id } = useParams();
  const { data: emperor, isLoading, error } = useQuery<Emperor>({ 
    queryKey: [`/api/emperors/${id}`]
  });

  if (isLoading) {
    return <Skeleton className="h-[800px] w-full" />;
  }

  if (error || !emperor) {
    return <div>Error loading emperor details</div>;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">{emperor.name}</h2>
        <p className="text-muted-foreground">
          {emperor.startYear} - {emperor.endYear} CE
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="aspect-video overflow-hidden rounded-lg">
              <img 
                src={emperor.imageUrl} 
                alt={emperor.name}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Description</h3>
              <p>{emperor.description}</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Key Achievements</h3>
              <p>{emperor.achievements}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <VirtualHistorian emperor={emperor} />
    </div>
  );
}
