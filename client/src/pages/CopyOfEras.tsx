import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import EraChipSelector from '@/components/EraChipSelector';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tour } from '@shared/schema';
import { XIcon } from 'lucide-react';

export default function CopyOfEras() {
  // Fetch all eras from the database
  const { data: eras } = useQuery({
    queryKey: ['/api/eras'],
    select: (data) => data as { id: number; name: string }[]
  });
  
  // Extract era names for the selector
  const eraOptions = eras?.map(era => era.name) || [];
  
  // For multiple selection of eras
  const [selectedEras, setSelectedEras] = useState<string[]>([]);
  
  // Fetch all tours
  const { data: tours, isLoading } = useQuery({
    queryKey: ['/api/tours'],
    select: (data) => data as Tour[]
  });
  
  // Helper function to safely check if a tour's era is in the selected eras
  const isEraSelected = (tourEra: string | null, selectedEras: string[]): boolean => {
    return !!tourEra && selectedEras.includes(tourEra);
  };
  
  // Filter tours based on selected eras
  const filteredTours = tours?.filter(tour => 
    selectedEras.length === 0 || isEraSelected(tour.era, selectedEras)
  );

  return (
    <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-4">Copy of Eras - What are your favorite eras?</h1>
          <p className="text-muted-foreground mb-8">
            Select the historical periods you're most interested in exploring
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="space-y-6">
                <h3 className="text-lg font-medium">Choose your preferred historical eras</h3>
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
        
        {/* Related Tours Section */}
        {selectedEras.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Related Tours</h2>
            
            {isLoading ? (
              <div className="flex justify-center p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : filteredTours && filteredTours.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTours.map(tour => (
                  <Card key={tour.id} className="overflow-hidden flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
                    {tour.imageUrl && (
                      <div className="relative aspect-video overflow-hidden">
                        <img 
                          src={tour.imageUrl} 
                          alt={tour.title} 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-0 left-0 bg-primary bg-opacity-90 text-white px-3 py-1 text-sm">
                          {tour.era}
                        </div>
                      </div>
                    )}
                    <CardContent className="flex-grow pt-6">
                      <h3 className="text-xl font-semibold mb-2">{tour.title}</h3>
                      <p className="text-muted-foreground mb-4 line-clamp-2">{tour.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{tour.duration} days</span>
                        <span className="font-bold">${tour.price}</span>
                      </div>
                      <Link href={`/tour/${tour.id}`} className="mt-4 block text-center bg-primary hover:bg-primary/90 text-white py-2 px-4 rounded-md transition-colors">
                        View Details
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">No tours found for the selected eras.</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
    </div>
  );
}