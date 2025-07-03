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
      const response = await fetch('/api/generate-tours', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(filters),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate tours');
      }
      
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
  
  // We don't need the advanced filtering logic for this new UI design

  const handleAdvancedFiltersChange = (filters: any) => {
    setAdvancedFilters(filters);
  };

  const handleGenerateTours = () => {
    const filterData = {
      selectedPeriods: [selectedPeriod],
      selectedEras: selectedEras.length > 0 ? selectedEras : currentEras,
      selectedLocations: []
    };
    
    // Check if any filters are selected
    if (filterData.selectedPeriods.length === 0 && 
        filterData.selectedEras.length === 0) {
      alert("Please select at least one historical period or era to generate tours.");
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

  // Historical periods for the timeline
  const historicalPeriods = [
    { id: 'ancient', name: 'Ancient', color: 'from-amber-600 to-orange-600' },
    { id: 'classical', name: 'Classical', color: 'from-blue-600 to-indigo-600' },
    { id: 'medieval', name: 'Medieval', color: 'from-green-600 to-emerald-600' },
    { id: 'renaissance', name: 'Renaissance', color: 'from-purple-600 to-pink-600' },
    { id: 'modern', name: 'Modern', color: 'from-red-600 to-rose-600' },
  ];

  const [selectedPeriod, setSelectedPeriod] = useState<string>('classical');
  
  // Get eras for the selected period
  const getErasForPeriod = (period: string) => {
    const erasByPeriod: Record<string, string[]> = {
      'ancient': [
        'Ancient Near Eastern',
        'Ancient Egypt',
        'Middle Kingdom of Egypt',
        'New Kingdom of Egypt',
      ],
      'classical': [
        'Ancient Greece',
        'Ancient Rome',
        'Hellenistic Period',
        'Ancient India (Mauryan and Gupta Periods)',
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
    return erasByPeriod[period] || [];
  };

  const currentEras = getErasForPeriod(selectedPeriod);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="text-center py-12">
        <p className="text-sm tracking-widest text-gray-400 mb-4">HISTORICAL EXPLORATION</p>
        <h1 className="text-4xl font-light mb-12">Notre histoire</h1>
        
        {/* Timeline Navigation */}
        <div className="flex justify-center items-center space-x-8 mb-16">
          {historicalPeriods.map((period, index) => (
            <button
              key={period.id}
              onClick={() => setSelectedPeriod(period.id)}
              className={`relative transition-all duration-300 ${
                selectedPeriod === period.id 
                  ? 'scale-110' 
                  : 'opacity-60 hover:opacity-80'
              }`}
            >
              <div className={`
                w-16 h-16 rounded-full border-2 border-gray-600 
                flex items-center justify-center text-sm font-medium
                ${selectedPeriod === period.id 
                  ? `bg-gradient-to-r ${period.color} border-white shadow-lg` 
                  : 'bg-gray-800 hover:bg-gray-700'
                }
              `}>
                {period.name.slice(0, 4)}
              </div>
              {index < historicalPeriods.length - 1 && (
                <div className="absolute top-8 left-16 w-8 h-0.5 bg-gray-600"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Side - Image placeholder */}
          <div className="space-y-6">
            <div className="aspect-video bg-gray-800 rounded-lg border border-gray-700 flex items-center justify-center">
              <span className="text-gray-500">Historical Image</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-square bg-gray-800 rounded-lg border border-gray-700 flex items-center justify-center">
                <span className="text-gray-500 text-sm">Image</span>
              </div>
              <div className="aspect-square bg-gray-800 rounded-lg border border-gray-700 flex items-center justify-center">
                <span className="text-gray-500 text-sm">Image</span>
              </div>
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="space-y-8">
            <div>
              <h2 className="text-5xl font-light mb-6 capitalize">{selectedPeriod}</h2>
              <p className="text-gray-300 leading-relaxed mb-8">
                Explore the rich heritage and cultural treasures of the {selectedPeriod} period. 
                Discover ancient civilizations, architectural marvels, and historical sites that 
                shaped our world. Each era offers unique insights into human achievement and cultural evolution.
              </p>
            </div>

            {/* Historical Eras */}
            <div className="space-y-6">
              <h3 className="text-xl font-medium text-gray-200">Historical Eras</h3>
              <div className="grid gap-4">
                {currentEras.map((era, index) => (
                  <div 
                    key={era}
                    className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:bg-gray-750 transition-colors cursor-pointer"
                    onClick={() => {
                      setSelectedEras([era]);
                      handleGenerateTours();
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-white">{era}</h4>
                      <span className="text-sm text-gray-400">#{String(index + 1).padStart(2, '0')}</span>
                    </div>
                    <p className="text-sm text-gray-400 mt-2">
                      Discover tours and experiences from this fascinating historical period.
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Generate Tours Button */}
            <div className="pt-6">
              <Button 
                onClick={handleGenerateTours}
                disabled={generateToursMutation.isPending || selectedEras.length === 0}
                className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white py-4 text-lg font-medium"
              >
                {generateToursMutation.isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Generating Tours...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate Tours for {selectedPeriod}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Generated Tours Section */}
        {showGeneratedTours && generatedTours.length > 0 && (
          <div className="mt-16 pt-16 border-t border-gray-800">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-light">Generated Tours</h2>
              <Button
                variant="outline"
                onClick={() => setShowGeneratedTours(false)}
                className="text-gray-400 border-gray-600 hover:bg-gray-800"
              >
                <XIcon className="w-4 h-4 mr-2" />
                Hide Tours
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {generatedTours.map((tour, index) => {
                const currentItinerary = getCurrentItinerary(tour);
                const currentDuration = getCurrentDuration(tour);
                
                return (
                  <Card key={tour.id || index} className="bg-gray-800 border-gray-700 overflow-hidden hover:bg-gray-750 transition-all duration-300">
                    <CardHeader className="bg-gradient-to-r from-amber-600 to-orange-600 text-white">
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
                          <label className="text-sm font-medium text-gray-300">Select Duration</label>
                          <Select 
                            value={currentDuration} 
                            onValueChange={(value) => handleDurationChange(tour.id, value)}
                          >
                            <SelectTrigger className="w-full bg-gray-700 border-gray-600 text-white">
                              <SelectValue placeholder="Select duration" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-600">
                              {tour.durationOptions.map((option: any) => (
                                <SelectItem key={option.duration} value={option.duration} className="text-white hover:bg-gray-700">
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
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-900 text-amber-200">
                            <Calendar className="w-3 h-3 mr-1" />
                            {tour.duration}
                          </span>
                        </div>
                      )}

                      {currentItinerary && currentItinerary.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="font-semibold text-sm text-gray-400 flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            HIGHLIGHTS
                          </h4>
                          {currentItinerary.slice(0, 2).map((day: any, dayIndex: number) => (
                          <div key={dayIndex} className="border-l-2 border-amber-600 pl-4">
                            <div className="font-medium text-sm text-white">Day {day.day}: {day.title}</div>
                            {day.sites && day.sites.length > 0 && (
                              <div className="mt-1 text-xs text-gray-400">
                                {day.sites.map((site: any, siteIndex: number) => (
                                  <div key={siteIndex}>• {site.name}</div>
                                ))}
                              </div>
                            )}
                            {day.hotel && (
                              <div className="mt-1 text-xs text-blue-400">
                                🏨 {day.hotel.name}
                              </div>
                            )}
                          </div>
                        ))}
                        {currentItinerary.length > 2 && (
                          <div className="text-xs text-gray-500">
                            ... and {currentItinerary.length - 2} more days
                          </div>
                        )}
                        </div>
                      )}
                      <div className="mt-4 pt-3 border-t border-gray-700">
                        <Link href={tour.id ? `/tours/${tour.id}?duration=${encodeURIComponent(currentDuration)}` : '#'} className="block">
                          <Button className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white">
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
    </div>
  );
}