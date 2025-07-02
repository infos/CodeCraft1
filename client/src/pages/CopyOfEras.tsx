import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import EraChipSelector from '@/components/EraChipSelector';
import AdvancedFilterPanel from '@/components/AdvancedFilterPanel';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  
  // Duration selection state for each tour
  const [selectedDurations, setSelectedDurations] = useState<{[tourId: string]: string}>({});

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

  // Handle duration selection for a specific tour
  const handleDurationChange = (tourId: string, duration: string) => {
    setSelectedDurations(prev => ({
      ...prev,
      [tourId]: duration
    }));
  };

  // Get current itinerary for a tour based on selected duration
  const getCurrentItinerary = (tour: any) => {
    const selectedDuration = selectedDurations[tour.id] || tour.defaultDuration;
    if (!tour.durationOptions) return tour.itinerary || [];
    
    const durationOption = tour.durationOptions.find((opt: any) => opt.duration === selectedDuration);
    return durationOption?.itinerary || [];
  };

  // Get current duration for display
  const getCurrentDuration = (tour: any) => {
    return selectedDurations[tour.id] || tour.defaultDuration || tour.duration;
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
        

        
        {/* Related Tours Section - Hidden per user request */}

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
              {generatedTours.map((tour, index) => {
                const currentItinerary = getCurrentItinerary(tour);
                const currentDuration = getCurrentDuration(tour);
                
                return (
                  <Card key={tour.id || index} className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                      <CardTitle className="text-lg">{tour.title}</CardTitle>
                      <CardDescription className="text-amber-100">
                        {tour.description && (
                          <p className="text-sm line-clamp-2">{tour.description}</p>
                        )}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4">
                      {/* Duration Selector */}
                      {tour.durationOptions && tour.durationOptions.length > 0 && (
                        <div className="mb-4 space-y-2">
                          <label className="text-sm font-medium text-gray-700">Select Duration</label>
                          <Select 
                            value={currentDuration} 
                            onValueChange={(value) => handleDurationChange(tour.id, value)}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select duration" />
                            </SelectTrigger>
                            <SelectContent>
                              {tour.durationOptions.map((option: any) => (
                                <SelectItem key={option.duration} value={option.duration}>
                                  {option.duration}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      {/* Current duration display for tours without duration options */}
                      {!tour.durationOptions && tour.duration && (
                        <div className="mb-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                            <Calendar className="w-3 h-3 mr-1" />
                            {tour.duration}
                          </span>
                        </div>
                      )}

                      {currentItinerary && currentItinerary.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="font-semibold text-sm text-muted-foreground flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            HIGHLIGHTS
                          </h4>
                          {currentItinerary.slice(0, 2).map((day: any, dayIndex: number) => (
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
                        {currentItinerary.length > 2 && (
                          <div className="text-xs text-muted-foreground">
                            ... and {currentItinerary.length - 2} more days
                          </div>
                        )}
                        </div>
                      )}
                      <div className="mt-4 pt-3 border-t border-gray-200">
                        <Link href={tour.id ? `/tours/${tour.id}` : '#'} className="block">
                          <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white">
                            View Full Itinerary
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
    </div>
  );
}