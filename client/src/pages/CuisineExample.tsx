import React, { useState } from 'react';
import Layout from '@/components/Layout';
import CuisineSelector from '@/components/CuisineSelector';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function CuisineExample() {
  // Historical eras options
  const eraOptions = [
    'Ancient Rome', 'Classical Greece', 'Ancient Egypt', 'Medieval Europe', 'Renaissance Italy',
    'Ottoman Empire', 'Persian Empire', 'Imperial China', 'Byzantine Empire', 'Mesopotamia'
  ];
  
  // For multiple selection of eras
  const [selectedEras, setSelectedEras] = useState<string[]>([]);

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-4">What are your favorite eras?</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Select your preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <CuisineSelector 
              options={eraOptions} 
              selected={selectedEras}
              onChange={setSelectedEras}
            />
            
            {selectedEras.length > 0 && (
              <div className="mt-4 p-4 bg-muted rounded-md">
                <p className="font-medium">Selected eras: {selectedEras.join(', ')}</p>
                <p className="text-sm text-muted-foreground">
                  Your tour will feature {selectedEras.length} different historical eras.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}