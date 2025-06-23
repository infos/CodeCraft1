import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { useState } from "react";
import { Emperor } from "@shared/schema";
import VirtualHistorian from "@/components/VirtualHistorian";
import EmperorTimeline from "@/components/EmperorTimeline";
import EraChipSelector from "@/components/EraChipSelector";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";

export default function EmperorPage() {
  const { id } = useParams();
  
  // If no ID, show the emperor timeline
  if (!id) {
    const [selectedEras, setSelectedEras] = useState<string[]>([]);
    
    const { data: emperors, isLoading: emperorsLoading } = useQuery<Emperor[]>({ 
      queryKey: ['/api/emperors']
    });

    const { data: eras, isLoading: erasLoading } = useQuery({
      queryKey: ['/api/eras'],
      select: (data) => data as { id: number; name: string }[]
    });

    const eraOptions = eras?.map(era => era.name) || [];

    // Filter emperors based on selected eras
    const filteredEmperors = emperors?.filter(emperor => 
      selectedEras.length === 0 || (emperor.era !== null && selectedEras.includes(emperor.era))
    ) || [];

    if (emperorsLoading || erasLoading) {
      return <Skeleton className="h-[800px] w-full" />;
    }

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-4">Historical Emperors Timeline</h1>
          <p className="text-muted-foreground mb-8">
            Explore the lives and reigns of history's most influential emperors
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="space-y-6">
                <h3 className="text-lg font-medium">Filter by Historical Era</h3>
                <EraChipSelector 
                  options={eraOptions} 
                  selected={selectedEras}
                  onChange={setSelectedEras}
                />
              </div>
              
              {selectedEras.length > 0 && (
                <div className="flex justify-end mt-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setSelectedEras([])}
                    className="text-sm flex items-center gap-1.5"
                  >
                    <XIcon className="h-4 w-4" />
                    Clear selection
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <EmperorTimeline emperors={filteredEmperors} selectedEra={selectedEras.length > 0 ? selectedEras[0] : null} />
      </div>
    );
  }

  // If ID provided, show individual emperor details
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

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="media">Media & Maps</TabsTrigger>
          <TabsTrigger value="chat">Virtual Historian</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="aspect-video overflow-hidden rounded-lg">
                  <img 
                    src={emperor.imageUrl || '/placeholder-emperor.jpg'} 
                    alt={emperor.name}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">Description</h3>
                  <p className="leading-relaxed">{emperor.description}</p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">Key Achievements</h3>
                  <p className="leading-relaxed">{emperor.achievements}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="media">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Historical Sites Map</h3>
                  <div className="aspect-video rounded-lg overflow-hidden">
                    <iframe
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      loading="lazy"
                      allowFullScreen
                      referrerPolicy="no-referrer-when-downgrade"
                      src={`https://www.openstreetmap.org/export/embed.html?bbox=12.4521,41.8902,12.5322,41.9102&layer=mapnik&marker=41.8902,12.4922`}
                    />
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    View significant locations from {emperor.name}'s reign
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">Historical Documentary</h3>
                  <div className="aspect-video rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                    {emperor.name === "Augustus" ? (
                      <iframe
                        width="100%"
                        height="100%"
                        src="https://www.youtube.com/embed/4FrwRjqOuVU"
                        title="Augustus: First Emperor of Rome"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <iframe
                        width="100%"
                        height="100%"
                        src="https://www.youtube.com/embed/nBL7GgxL3KE"
                        title="Marcus Aurelius: The Philosopher Emperor"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    )}
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Learn more about {emperor.name}'s life and legacy
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chat">
          <VirtualHistorian emperor={emperor} />
        </TabsContent>
      </Tabs>
    </div>
  );
}