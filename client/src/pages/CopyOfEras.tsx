import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import EraChipSelector from '@/components/EraChipSelector';
import AdvancedFilterPanel from '@/components/AdvancedFilterPanel';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tour } from '@shared/schema';
import { XIcon, Sparkles, Loader2, Calendar } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

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
  
  // Advanced filter state
  const [advancedFilters, setAdvancedFilters] = useState<any>(null);
  
  // Tour generation state with session persistence
  const [generatedTours, setGeneratedTours] = useState<any[]>(() => {
    try {
      const stored = sessionStorage.getItem('generatedTours');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [showGeneratedTours, setShowGeneratedTours] = useState(() => {
    try {
      const stored = sessionStorage.getItem('showGeneratedTours');
      return stored ? JSON.parse(stored) : false;
    } catch {
      return false;
    }
  });
  const queryClient = useQueryClient();
  
  // Tour generation mutation
  const generateToursMutation = useMutation({
    mutationFn: async (filterData: any) => {
      const response = await fetch("/api/generate-tours", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(filterData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Tour generation failed');
      }
      
      return response.json();
    },
    onSuccess: (data: any) => {
      const tours = Array.isArray(data) ? data : data.tours || [];
      setGeneratedTours(tours);
      setShowGeneratedTours(true);
      
      // Persist to session storage
      try {
        sessionStorage.setItem('generatedTours', JSON.stringify(tours));
        sessionStorage.setItem('showGeneratedTours', JSON.stringify(true));
      } catch (error) {
        console.warn('Failed to save tours to session storage:', error);
      }
    },
    onError: (error) => {
      console.error("Tour generation failed:", error);
      alert(`Tour generation failed: ${error.message}`);
    },
  });
  
  // Filter eras based on selected time periods
  const getFilteredEras = (selectedPeriods: string[]) => {
    if (!selectedPeriods || selectedPeriods.length === 0) return eraOptions;
    
    const erasByPeriod: Record<string, string[]> = {
      'ancient': [
        'Ancient Near Eastern',
        'Ancient Egypt',
        'Middle Kingdom of Egypt',
        'New Kingdom of Egypt',
        'Israel\'s Patriarchal Period',
        'Neo-Babylonian',
        'Achaemenid Empire'
      ],
      'classical': [
        'Ancient Greece',
        'Ancient Rome',
        'Hellenistic Period',
        'Parthian Empire',
        'Ancient India (Mauryan and Gupta Periods)',
        'Imperial China'
      ],
      'medieval': [
        'Byzantine',
        'Medieval Europe',
        'Sasanian Empire',
        'Silk Road Trade Era'
      ],
      'renaissance': [
        'Renaissance'
      ],
      'modern': [
        'Age of Exploration',
        'Enlightenment',
        'Georgian Era'
      ]
    };
    
    // Collect all eras from selected periods
    const allSelectedEras = selectedPeriods.reduce((acc, period) => {
      const periodEras = erasByPeriod[period] || [];
      return [...acc, ...periodEras];
    }, [] as string[]);
    
    // Remove duplicates and only return eras that exist in our database  
    const uniqueEras = allSelectedEras.filter((era, index) => allSelectedEras.indexOf(era) === index);
    return uniqueEras.filter(era => eraOptions.includes(era));
  };
  
  // Get filtered eras based on current advanced filters
  const filteredEraOptions = getFilteredEras(advancedFilters?.selectedPeriods || []);
  
  // Fetch all tours
  const { data: tours, isLoading } = useQuery({
    queryKey: ['/api/tours'],
    select: (data) => data as Tour[]
  });
  
  // Helper function to safely check if a tour's era is in the selected eras
  const isEraSelected = (tourEra: string | null, selectedEras: string[]): boolean => {
    return !!tourEra && selectedEras.includes(tourEra);
  };
  
  // Filter tours based on selected eras or advanced filters
  const filteredTours = tours?.filter(tour => {
    // If advanced filters are active, use them
    if (advancedFilters && advancedFilters.selectedEras.length > 0) {
      return isEraSelected(tour.era, advancedFilters.selectedEras);
    }
    // Otherwise use simple era selection
    return selectedEras.length === 0 || isEraSelected(tour.era, selectedEras);
  });
  
  // Handle advanced filter changes
  const handleAdvancedFiltersChange = (filters: any) => {
    // If period selection changed, clear selected eras that are no longer valid
    const prevPeriods = advancedFilters?.selectedPeriods || [];
    const currentPeriods = filters.selectedPeriods || [];
    
    if (JSON.stringify(prevPeriods) !== JSON.stringify(currentPeriods)) {
      const validEras = getFilteredEras(currentPeriods);
      const filteredSelectedEras = (filters.selectedEras || []).filter((era: string) => 
        validEras.includes(era)
      );
      filters.selectedEras = filteredSelectedEras;
    }
    
    setAdvancedFilters(filters);
    // Update selected eras to maintain compatibility with existing logic
    setSelectedEras(filters.selectedEras || []);
  };

  // Handle tour generation
  const handleGenerateTours = () => {
    const filterData = {
      selectedPeriods: advancedFilters?.selectedPeriods || [],
      selectedEras: advancedFilters?.selectedEras || selectedEras,
      selectedLocations: advancedFilters?.selectedLocations || []
    };
    
    // Check if any filters are selected
    if (filterData.selectedPeriods.length === 0 && 
        filterData.selectedEras.length === 0 && 
        filterData.selectedLocations.length === 0) {
      alert("Please select at least one historical period, era, or location to generate tours.");
      return;
    }
    
    generateToursMutation.mutate(filterData);
  };

  return (
    <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-4">Build your history tour</h1>
          <p className="text-muted-foreground mb-8">
            Select the historical periods you're most interested in exploring
          </p>
        </div>

        {/* Advanced Filter Panel */}
        <AdvancedFilterPanel 
          eras={filteredEraOptions}
          allEras={eraOptions}
          onFiltersChange={handleAdvancedFiltersChange}
        />

        {/* Generate Tours Button */}
        <div className="flex justify-center">
          <Button
            onClick={handleGenerateTours}
            disabled={generateToursMutation.isPending}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            {generateToursMutation.isPending ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Generating Tours...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Generate AI Tours
              </>
            )}
          </Button>
        </div>
        

        
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

        {/* Generated Tours Section */}
        {showGeneratedTours && generatedTours.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">AI Generated Tours</h2>
              <Button
                variant="outline"
                onClick={() => setShowGeneratedTours(false)}
                className="text-sm"
              >
                <XIcon className="w-4 h-4 mr-2" />
                Hide Generated Tours
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {generatedTours.map((tour, index) => (
                <Card key={tour.id || index} className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group">
                  <Link href={tour.id ? `/tours/${tour.id}` : '#'} className="block">
                    <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                      <CardTitle className="text-lg group-hover:text-amber-100 transition-colors">{tour.title}</CardTitle>
                      <CardDescription className="text-amber-100">
                        <span className="font-medium">{tour.duration}</span>
                        {tour.description && (
                          <p className="mt-2 text-sm line-clamp-2">{tour.description}</p>
                        )}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4">
                      {tour.itinerary && tour.itinerary.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="font-semibold text-sm text-muted-foreground flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            HIGHLIGHTS
                          </h4>
                          {tour.itinerary.slice(0, 2).map((day: any, dayIndex: number) => (
                          <div key={dayIndex} className="border-l-2 border-purple-200 pl-4">
                            <div className="font-medium text-sm">Day {day.day}: {day.title}</div>
                            {day.sites && day.sites.length > 0 && (
                              <div className="mt-1 text-xs text-muted-foreground">
                                {day.sites.map((site: any, siteIndex: number) => (
                                  <div key={siteIndex}>• {site.name}</div>
                                ))}
                              </div>
                            )}
                            {day.hotel && (
                              <div className="mt-1 text-xs text-blue-600">
                                🏨 {day.hotel.name}
                              </div>
                            )}
                          </div>
                        ))}
                        {tour.itinerary.length > 3 && (
                          <div className="text-xs text-muted-foreground">
                            ... and {tour.itinerary.length - 3} more days
                          </div>
                        )}
                        </div>
                      )}
                      <div className="mt-4 pt-3 border-t border-gray-200">
                        <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white">
                          View Full Itinerary
                        </Button>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        )}
    </div>
  );
}