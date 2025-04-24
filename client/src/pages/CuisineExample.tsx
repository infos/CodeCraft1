import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/Layout';
import CuisineSelector from '@/components/CuisineSelector';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function CuisineExample() {
  // Common cuisine types for historical tours
  const cuisineOptions = [
    'Roman', 'Greek', 'Egyptian', 'Medieval', 'Renaissance',
    'Ottoman', 'Persian', 'Chinese', 'Byzantine', 'Mesopotamian'
  ];
  
  // For single selection example
  const [selectedCuisine, setSelectedCuisine] = useState<string[]>([]);
  
  // For multiple selection example
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-4">Cuisine & Dining Filters</h1>
          <p className="text-muted-foreground mb-8">
            Filter historical tours by cuisine and dining experiences
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Single Selection Mode</CardTitle>
            <CardDescription>
              Choose one cuisine type for specialized historical dining tours
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CuisineSelector 
              options={cuisineOptions} 
              selected={selectedCuisine}
              onChange={setSelectedCuisine}
              multiple={false}
            />
            
            {selectedCuisine.length > 0 && (
              <div className="mt-4 p-4 bg-muted rounded-md">
                <p className="font-medium">Selected cuisine: {selectedCuisine[0]}</p>
                <p className="text-sm text-muted-foreground">
                  Explore authentic {selectedCuisine[0]} cuisine as it would have been experienced in historical times.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Multiple Selection Mode</CardTitle>
            <CardDescription>
              Select multiple cuisine experiences for your historical journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CuisineSelector 
              options={cuisineOptions} 
              selected={selectedCuisines}
              onChange={setSelectedCuisines}
            />
            
            {selectedCuisines.length > 0 && (
              <div className="mt-4 p-4 bg-muted rounded-md">
                <p className="font-medium">Selected cuisines: {selectedCuisines.join(', ')}</p>
                <p className="text-sm text-muted-foreground">
                  Your tour will feature {selectedCuisines.length} different historical dining experiences.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}