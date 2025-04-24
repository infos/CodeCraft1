import React, { useState } from 'react';
import Layout from '@/components/Layout';
import CuisineSelector from '@/components/CuisineSelector';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function CuisineExample() {
  // Common cuisine types for historical tours
  const cuisineOptions = [
    'Roman', 'Greek', 'Egyptian', 'Medieval', 'Renaissance',
    'Ottoman', 'Persian', 'Chinese', 'Byzantine', 'Mesopotamian'
  ];
  
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
            <CardTitle>Historical Cuisine Selection</CardTitle>
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