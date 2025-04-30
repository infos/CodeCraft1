import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "wouter";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import VirtualHistorian from "@/components/virtual-historian";
import { ExternalLink, MapPin, Calendar, Scroll } from "lucide-react";
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

  // Format years to show BCE/CE correctly
  const formatYear = (year: number) => {
    if (year < 0) {
      return `${Math.abs(year)} BCE`;
    }
    return `${year} CE`;
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
          <div className="flex items-baseline gap-4">
            <CardTitle className="text-3xl">{emperor.name}</CardTitle>
            {emperor.dynasty && (
              <Badge variant="outline" className="text-sm">
                {emperor.dynasty}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>
              {formatYear(emperor.startYear)} - {formatYear(emperor.endYear)}
            </span>
          </div>
          {emperor.era && (
            <Link href={`/timeline?era=${emperor.era}`}>
              <Badge className="cursor-pointer hover:bg-primary/90" variant="secondary">
                {emperor.era}
              </Badge>
            </Link>
          )}
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              {emperor.imageUrl ? (
                <img
                  src={emperor.imageUrl}
                  alt={emperor.name}
                  className="w-full rounded-lg shadow-lg"
                />
              ) : (
                <div className="w-full aspect-square rounded-lg bg-muted flex items-center justify-center">
                  <Scroll className="h-16 w-16 text-muted-foreground/40" />
                </div>
              )}
              
              <div className="mt-4 space-y-3">
                {emperor.region && (
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Region</Badge>
                    <span>{emperor.region}</span>
                  </div>
                )}
                
                {emperor.modernCountry && (
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Modern Location</Badge>
                    <span>{emperor.modernCountry}</span>
                  </div>
                )}
                
                {emperor.locations && emperor.locations.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Key Locations</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {emperor.locations.map((location, index) => (
                        <Badge key={index} variant="secondary">{location}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-2">Biography</h2>
                <p className="text-muted-foreground">{emperor.description}</p>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-xl font-semibold mb-2">Key Achievements</h3>
                <p className="text-muted-foreground">{emperor.achievements}</p>
              </div>
              
              <div className="mt-8">
                <VirtualHistorian emperor={emperor} />
              </div>
            </div>
          </div>
        </CardContent>
        
        {emperor.wikipediaUrl && (
          <CardFooter className="bg-muted/50 flex justify-end py-3">
            <Button variant="outline" size="sm" asChild>
              <a href={emperor.wikipediaUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                <ExternalLink className="h-3 w-3" />
                Read more on Wikipedia
              </a>
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
