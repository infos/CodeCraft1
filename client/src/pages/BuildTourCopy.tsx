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
    <div className="min-h-screen bg-neutral-900 text-white">
      {/* Header */}
      <div className="text-center pt-16 pb-8">
        <p className="text-xs tracking-[0.3em] text-neutral-500 mb-4 font-light">LA BRASSERIE</p>
        <h1 className="text-5xl font-light mb-16 tracking-wide">Notre histoire</h1>
        
        {/* Timeline Navigation */}
        <div className="relative flex justify-center items-center mb-20">
          {/* Timeline line */}
          <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-[600px] h-px bg-neutral-600"></div>
          
          <div className="flex items-center space-x-12">
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
                  w-12 h-12 rounded-full border-2 
                  flex items-center justify-center text-sm font-light
                  ${selectedPeriod === period.id 
                    ? 'bg-orange-600 border-orange-500 shadow-lg' 
                    : 'bg-neutral-800 border-neutral-600 hover:border-neutral-500'
                  }
                `}>
                  {period.name.slice(0, 4)}
                </div>
                {/* Year label below */}
                <div className="absolute top-16 left-1/2 transform -translate-x-1/2 text-xs text-neutral-400 whitespace-nowrap">
                  {period.name}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 pb-16 relative">
        {/* Navigation Arrows */}
        <button 
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-500 hover:text-white transition-colors"
          onClick={() => {
            const currentIndex = historicalPeriods.findIndex(p => p.id === selectedPeriod);
            const prevIndex = currentIndex > 0 ? currentIndex - 1 : historicalPeriods.length - 1;
            setSelectedPeriod(historicalPeriods[prevIndex].id);
          }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <button 
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-neutral-500 hover:text-white transition-colors"
          onClick={() => {
            const currentIndex = historicalPeriods.findIndex(p => p.id === selectedPeriod);
            const nextIndex = currentIndex < historicalPeriods.length - 1 ? currentIndex + 1 : 0;
            setSelectedPeriod(historicalPeriods[nextIndex].id);
          }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left Side - Image placeholder */}
          <div className="space-y-6">
            <div className="aspect-[4/3] bg-neutral-800 rounded-none border-none flex items-center justify-center">
              <span className="text-neutral-600 text-sm">Historical Image</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-square bg-neutral-800 rounded-none border-none flex items-center justify-center">
                <span className="text-neutral-600 text-xs">Image</span>
              </div>
              <div className="aspect-square bg-neutral-800 rounded-none border-none flex items-center justify-center">
                <span className="text-neutral-600 text-xs">Image</span>
              </div>
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="space-y-8 pt-8">
            <div>
              <h2 className="text-6xl font-light mb-8 capitalize tracking-wide">{selectedPeriod}</h2>
              <p className="text-neutral-300 leading-relaxed mb-8 text-lg font-light">
                Explore the rich heritage and cultural treasures of the {selectedPeriod} period. 
                Discover ancient civilizations, architectural marvels, and historical sites that 
                shaped our world. Each era offers unique insights into human achievement and cultural evolution.
              </p>
            </div>

            {/* Historical Eras */}
            <div className="space-y-6">
              <h3 className="text-xl font-light text-neutral-200 mb-6">Historical Eras</h3>
              <div className="grid gap-3">
                {currentEras.map((era, index) => (
                  <div 
                    key={era}
                    className="bg-neutral-800 border border-neutral-700 rounded-none p-5 hover:bg-neutral-750 transition-colors cursor-pointer"
                    onClick={() => {
                      setSelectedEras([era]);
                      handleGenerateTours();
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-light text-white text-lg">{era}</h4>
                      <span className="text-sm text-neutral-500">#{String(index + 1).padStart(2, '0')}</span>
                    </div>
                    <p className="text-sm text-neutral-400 mt-2 font-light">
                      Discover tours and experiences from this fascinating historical period.
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Generate Tours Button */}
            <div className="pt-8">
              <Button 
                onClick={handleGenerateTours}
                disabled={generateToursMutation.isPending || selectedEras.length === 0}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 text-lg font-light rounded-none"
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
          <div className="mt-20 pt-16 border-t border-neutral-700">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-4xl font-light">Generated Tours</h2>
              <Button
                variant="outline"
                onClick={() => setShowGeneratedTours(false)}
                className="text-neutral-400 border-neutral-600 hover:bg-neutral-800 rounded-none"
              >
                <XIcon className="w-4 h-4 mr-2" />
                Hide Tours
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {generatedTours.map((tour, index) => {
                const currentItinerary = getCurrentItinerary(tour);
                const currentDuration = getCurrentDuration(tour);
                
                return (
                  <Card key={tour.id || index} className="bg-neutral-800 border-neutral-700 overflow-hidden hover:bg-neutral-750 transition-all duration-300 rounded-none">
                    <CardHeader className="bg-orange-600 text-white">
                      <CardTitle className="text-xl font-light">{tour.title}</CardTitle>
                      <CardDescription className="text-orange-100 text-sm font-light">
                        {tour.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      {/* Duration Selector */}
                      {tour.durationOptions && tour.durationOptions.length > 0 && (
                        <div className="mb-6 space-y-2">
                          <label className="text-sm font-light text-neutral-300">Select Duration</label>
                          <Select 
                            value={currentDuration} 
                            onValueChange={(value) => handleDurationChange(tour.id, value)}
                          >
                            <SelectTrigger className="w-full bg-neutral-700 border-neutral-600 text-white rounded-none">
                              <SelectValue placeholder="Select duration" />
                            </SelectTrigger>
                            <SelectContent className="bg-neutral-800 border-neutral-600">
                              {tour.durationOptions.map((option: any) => (
                                <SelectItem key={option.duration} value={option.duration} className="text-white hover:bg-neutral-700">
                                  {option.duration}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      {/* Current duration display for tours without duration options */}
                      {!tour.durationOptions && tour.duration && (
                        <div className="mb-6">
                          <span className="inline-flex items-center px-3 py-1 rounded-none text-xs font-light bg-orange-900 text-orange-200">
                            <Calendar className="w-3 h-3 mr-1" />
                            {tour.duration}
                          </span>
                        </div>
                      )}

                      {currentItinerary && currentItinerary.length > 0 && (
                        <div className="space-y-4">
                          <h4 className="font-light text-sm text-neutral-400 flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            HIGHLIGHTS
                          </h4>
                          {currentItinerary.slice(0, 2).map((day: any, dayIndex: number) => (
                          <div key={dayIndex} className="border-l-2 border-orange-600 pl-4">
                            <div className="font-light text-sm text-white">Day {day.day}: {day.title}</div>
                            {day.sites && day.sites.length > 0 && (
                              <div className="mt-1 text-xs text-neutral-400">
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
                          <div className="text-xs text-neutral-500">
                            ... and {currentItinerary.length - 2} more days
                          </div>
                        )}
                        </div>
                      )}
                      <div className="mt-6 pt-4 border-t border-neutral-700">
                        <Link href={tour.id ? `/tours/${tour.id}?duration=${encodeURIComponent(currentDuration)}` : '#'} className="block">
                          <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white rounded-none font-light">
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