import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import VirtualHistorian from "@/components/virtual-historian";
import type { Emperor } from "@shared/schema";

export default function EmperorProfile() {
  const { id } = useParams();
  
  const { data: emperor, isLoading, error } = useQuery<Emperor>({
    queryKey: [`/api/emperors/${id}`]
  });

  if (isLoading) {
    return <Skeleton className="w-full h-[600px]" />;
  }

  if (error || !emperor) {
    return <div>Failed to load emperor profile</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">{emperor.name}</CardTitle>
          <p className="text-muted-foreground">
            {emperor.startYear} - {emperor.endYear} CE
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <img
                src={emperor.imageUrl}
                alt={emperor.name}
                className="w-full rounded-lg shadow-lg"
              />
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-4">{emperor.title}</h2>
              <p className="mb-4">{emperor.description}</p>
              <h3 className="text-xl font-semibold mb-2">Key Achievements</h3>
              <p>{emperor.achievements}</p>
              
              <div className="mt-8">
                <VirtualHistorian emperor={emperor} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
