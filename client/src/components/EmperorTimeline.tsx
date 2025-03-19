import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Emperor } from "@shared/schema";

interface EmperorTimelineProps {
  emperors: Emperor[];
}

export default function EmperorTimeline({ emperors }: EmperorTimelineProps) {
  const [, setLocation] = useLocation();

  return (
    <Card>
      <CardContent className="p-6">
        <ScrollArea className="h-[500px] pr-4">
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
            <div className="space-y-8">
              {emperors.map((emperor) => (
                <div key={emperor.id} className="relative pl-8">
                  <div className="absolute left-0 w-8 flex items-center justify-center">
                    <div className="w-3 h-3 bg-primary rounded-full" />
                  </div>
                  <div 
                    className="p-4 rounded-lg border bg-card hover:bg-accent cursor-pointer transition-colors"
                    onClick={() => setLocation(`/emperor/${emperor.id}`)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">{emperor.name}</h3>
                      <span className="text-sm text-muted-foreground">
                        {emperor.startYear} - {emperor.endYear} CE
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {emperor.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}