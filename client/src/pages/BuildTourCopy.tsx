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

export default function BuildTourCopy() {
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
      const stored = sessionStorage.getItem('generatedToursCopy');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  
  const [showGeneratedTours, setShowGeneratedTours] = useState<boolean>(() => {
    try {
      const stored = sessionStorage.getItem('showGeneratedToursCopy');
      return stored ? JSON.parse(stored) : false;
    } catch {
      return false;
    }
  });

  const queryClient = useQueryClient();

  const generateToursMutation = useMutation({
    mutationFn: async (filters: any) => {
      const response = await apiRequest('POST', '/api/generate-tours', filters);
      const data = await response.json();
      return data.tours;
    },
    onSuccess: (tours) => {
      setGeneratedTours(tours);
      setShowGeneratedTours(true);
      
      // Persist to session storage
      try {
        sessionStorage.setItem('generatedToursCopy', JSON.stringify(tours));
        sessionStorage.setItem('showGeneratedToursCopy', JSON.stringify(true));
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

    const filteredEras = selectedPeriods.flatMap(period => erasByPeriod[period] || []);
    return eraOptions.filter(era => filteredEras.includes(era));
  };

  // Update filtered eras when advanced filters change
  const filteredEraOptions = advancedFilters?.selectedPeriods?.length > 0 
    ? getFilteredEras(advancedFilters.selectedPeriods) 
    : eraOptions;

  // Clear selected eras that are no longer available after period filtering
  useEffect(() => {
    if (filteredEraOptions.length > 0) {
      setSelectedEras(prev => prev.filter(era => filteredEraOptions.includes(era)));
    }
  }, [filteredEraOptions]);

  const handleAdvancedFiltersChange = (filters: any) => {
    setAdvancedFilters(filters);
  };

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
          <h1 className="text-3xl font-bold mb-4">Build your history tour (Copy)</h1>
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
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
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
                        <Link href={tour.id ? `/tours/${tour.id}?duration=${encodeURIComponent(currentDuration)}` : '#'} className="block">
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