import React, { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Loader2, Sparkles, XIcon, MapPin, Star } from 'lucide-react';
import { Link } from 'wouter';
import type { Era } from "@shared/schema";

// Era timeline data
const eraTimelines: Record<string, string> = {
  "Ancient Near Eastern": "3500 BCE - 539 BCE",
  "Ancient Egypt": "3100 BCE - 30 BCE", 
  "Ancient Greece": "800 BCE - 146 BCE",
  "Ancient Rome": "753 BCE - 476 CE",
  "Ancient China": "2070 BCE - 220 CE",
  "Ancient India": "3300 BCE - 550 CE",
  "Maya Civilization": "2000 BCE - 1500 CE",
  "Inca Empire": "1438 CE - 1572 CE",
  "Viking Age": "793 CE - 1066 CE",
  "Celtic Civilization": "1200 BCE - 400 CE",
  "Medieval Europe": "500 CE - 1500 CE",
  "Islamic Golden Age": "786 CE - 1258 CE",
  "Byzantine Empire": "330 CE - 1453 CE",
  "Mongol Empire": "1206 CE - 1368 CE",
  "Renaissance Italy": "1300 CE - 1600 CE",
  "Ottoman Empire": "1299 CE - 1922 CE",
  "Aztec Empire": "1345 CE - 1521 CE"
};

export default function BuildTourCopy() {
  const [selectedEras, setSelectedEras] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [showGeneratedTours, setShowGeneratedTours] = useState(false);
  const [generatedTours, setGeneratedTours] = useState<any[]>([]);
  const [selectedDurations, setSelectedDurations] = useState<Record<string, string>>({});
  const [eraImages, setEraImages] = useState<Record<string, string>>({});
  const [isGeneratingImages, setIsGeneratingImages] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<string>('all');

  const queryClient = useQueryClient();

  const formatYear = (year: number | null | undefined) => {
    if (year === null || year === undefined) return "Unknown";
    const absYear = Math.abs(year);
    return year < 0 ? `${absYear} BCE` : `${year} CE`;
  };

  const generateToursMutation = useMutation({
    mutationFn: async (filterData: any) => {
      const response = await fetch('/api/generate-tours', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filterData),
      });
      if (!response.ok) throw new Error('Failed to generate tours');
      return response.json();
    },
    onSuccess: (data) => {
      setGeneratedTours(data.tours || []);
      setShowGeneratedTours(true);
      const initialDurations: Record<string, string> = {};
      (data.tours || []).forEach((tour: any) => {
        if (tour.id && tour.defaultDuration) {
          const durationStr = typeof tour.defaultDuration === 'string' ? tour.defaultDuration : "7 days";
          initialDurations[tour.id] = durationStr;
        }
      });
      setSelectedDurations(prev => ({ ...prev, ...initialDurations }));
    },
    onError: (error) => {
      console.error('Error generating tours:', error);
    },
  });

  const generateEraImagesMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/generate-all-era-images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to generate era images');
      return response.json();
    },
    onSuccess: (data) => {
      setEraImages(data.imageUrls || {});
      setIsGeneratingImages(false);
    },
    onError: (error) => {
      console.error('Error generating era images:', error);
      setIsGeneratingImages(false);
    },
  });

  const { data: existingImagesData } = useQuery({
    queryKey: ['/api/era-images'],
    queryFn: async () => {
      const response = await fetch('/api/era-images');
      if (!response.ok) throw new Error('Failed to load era images');
      return response.json();
    },
  });

  const { data: eras, isLoading: erasLoading } = useQuery<Era[]>({
    queryKey: ["/api/eras"]
  });

  const { data: toursData } = useQuery({
    queryKey: ['/api/tours'],
    queryFn: async () => {
      const response = await fetch('/api/tours');
      if (!response.ok) throw new Error('Failed to load tours');
      return response.json();
    },
  });

  // Fetch existing tour images from database
  const { data: tourImages } = useQuery({
    queryKey: ['/api/tour-images'],
    queryFn: async () => {
      const response = await fetch('/api/tour-images');
      if (!response.ok) throw new Error('Failed to load tour images');
      return response.json();
    },
  });

  useEffect(() => {
    if (existingImagesData?.imageUrls) {
      setEraImages(existingImagesData.imageUrls);
    }
  }, [existingImagesData]);

  // Helper function to get tour image by tour ID
  const getTourImageUrl = (tourId: number): string | null => {
    if (!tourImages) return null;
    const image = tourImages.find((img: any) => img.tourId === tourId);
    return image?.imageUrl || null;
  };

  const handleGenerateImages = () => {
    setIsGeneratingImages(true);
    
    // Always generate era images first (for home page AI images)
    generateEraImagesMutation.mutate();
  };

  const handleEraSelect = (eraName: string) => {
    const isSelected = selectedEras.includes(eraName);
    let newSelectedEras: string[];
    
    if (isSelected) {
      // Remove from selection
      newSelectedEras = selectedEras.filter(era => era !== eraName);
    } else {
      // Add to selection
      newSelectedEras = [...selectedEras, eraName];
    }
    
    setSelectedEras(newSelectedEras);
    generateToursWithFilters(newSelectedEras);
  };

  const generateToursWithFilters = (eras: string[] = selectedEras) => {
    setShowGeneratedTours(false);
    
    if (eras.length > 0) {
      // Generate tours for the selected eras
      const filterData = {
        selectedPeriods: selectedPeriod !== 'all' ? [selectedPeriod] : [],
        selectedEras: eras,
        selectedLocations: []
      };
      generateToursMutation.mutate(filterData);
    } else {
      // If no eras selected, hide generated tours
      setShowGeneratedTours(false);
    }
  };

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
    setSelectedEras([]); // Clear era selection when period changes
    setSelectedLocations([]); // Clear location selection when period changes
    setShowGeneratedTours(false);
  };

  const handleDurationChange = (tourId: string, duration: string) => {
    setSelectedDurations(prev => ({
      ...prev,
      [tourId]: duration
    }));
  };

  if (erasLoading) {
    return <div className="h-[150px] animate-pulse bg-muted rounded-lg" />;
  }

  // Sort eras by startYear from oldest to newest
  const sortedEras = [...(eras || [])].sort((a, b) => (a.startYear || 0) - (b.startYear || 0));

  // Filter eras based on selected period with proper chronological boundaries
  const filteredEras = sortedEras.filter(era => {
    if (selectedPeriod === 'all') return true;
    
    const startYear = era.startYear || 0;
    const eraName = era.name || '';
    
    switch (selectedPeriod) {
      case 'ancient':
        return startYear < -500; // Before 500 BCE
      case 'classical':
        return startYear >= -500 && startYear < 500; // 500 BCE to 500 CE
      case 'medieval':
        // Medieval: Match Historical Tours page exactly
        return eraName.includes('Byzantine') || 
               eraName.includes('Medieval Europe') || 
               eraName.includes('Sasanian Empire') ||
               eraName.includes('Silk Road Trade Era');
      case 'renaissance':
        // Renaissance: Match Historical Tours page exactly
        return eraName.includes('Renaissance') && 
               !eraName.includes('Age of Exploration');
      case 'early_modern':
        // Early Modern: Match Historical Tours page "modern" category
        return eraName.includes('Age of Exploration') ||
               eraName.includes('Enlightenment') ||
               eraName.includes('Georgian Era');
      default:
        return true;
    }
  });

  // Display tours from either generated tours or database tours
  const toursToDisplay = showGeneratedTours && generatedTours.length > 0
    ? generatedTours.map(tour => ({
        ...tour,
        image: eraImages[tour.era] || eraImages[selectedEras[0] || ''] || tour.image || getTourImageUrl(tour.id) || '/era-images/default.jpg'
      }))
    : (toursData || []).filter(tour => {
        // Filter database tours - only filter if eras or locations are selected
        if (selectedEras.length > 0) {
          // Check if tour era matches any selected era (flexible matching)
          const tourEra = tour.era?.toLowerCase() || '';
          const hasMatchingEra = selectedEras.some(era => {
            const selectedEra = era.toLowerCase();
            // Direct match or partial match for complex era names
            return tourEra === selectedEra || 
                   tourEra.includes(selectedEra) || 
                   selectedEra.includes(tourEra) ||
                   (tourEra.includes('silk') && selectedEra.includes('medieval')); // Silk Road is medieval period
          });
          if (!hasMatchingEra) {
            return false;
          }
        }
        
        // Filter by locations if any are selected
        if (selectedLocations.length > 0) {
          const tourLocations = tour.locations?.toLowerCase() || '';
          const hasMatchingLocation = selectedLocations.some(location => {
            const selectedLocation = location.toLowerCase();
            return tourLocations.includes(selectedLocation) || 
                   selectedLocation.includes(tourLocations);
          });
          if (!hasMatchingLocation) {
            return false;
          }
        }
        
        return true;
      }).map(tour => ({
        ...tour,
        image: eraImages[tour.era] || eraImages[selectedEras[0] || ''] || getTourImageUrl(tour.id) || tour.imageUrl || '/era-images/default.jpg'
      }));

  return (
    <div className="min-h-screen bg-white">
      {/* Header - Apple Style */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          
          {/* Apple-style Historical Periods Filter */}
          <div className="py-4">
            <div className="flex items-center justify-center space-x-2">
              <TooltipProvider>
                <div className="flex space-x-1">
                  {[
                    { key: 'all', label: 'All Periods', tooltip: 'All historical eras' },
                    { key: 'ancient', label: 'Ancient Times', tooltip: 'Before 500 BCE' },
                    { key: 'classical', label: 'Classical Period', tooltip: '500 BCE - 500 CE' },
                    { key: 'medieval', label: 'Medieval Period', tooltip: '500 CE - 1500 CE' },
                    { key: 'renaissance', label: 'Renaissance', tooltip: '1300 CE - 1650 CE' },
                    { key: 'early_modern', label: 'Early Modern', tooltip: '1650 CE - 1800 CE' }
                  ].map((period) => (
                    <Tooltip key={period.key}>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => handlePeriodChange(period.key)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                            selectedPeriod === period.key
                              ? 'bg-black text-white'
                              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                          }`}
                        >
                          {period.label}
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{period.tooltip}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Apple Store Style Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-6xl font-light text-gray-900 mb-4">
            {selectedEras.length > 0 ? `${selectedEras.length === 1 ? selectedEras[0] : 'Multi-Era'} Tours` : 'Choose an Era to Generate Tours'}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {selectedEras.length > 0 
              ? `Discover the wonders of ${selectedEras.length === 1 ? selectedEras[0] : 'multiple historical periods'} through our expertly curated heritage experiences`
              : 'Build your own tour by selecting historical periods and locations. Create personalized journeys through time.'
            }
          </p>
        </div>

        {/* Historical Eras Filter Chips - Moved to Body */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900">
              {selectedPeriod === 'all' ? 'All Historical Eras' : 
               selectedPeriod === 'ancient' ? 'Ancient Times' :
               selectedPeriod === 'classical' ? 'Classical Period' :
               selectedPeriod === 'medieval' ? 'Medieval Period' :
               selectedPeriod === 'renaissance' ? 'Renaissance' :
               selectedPeriod === 'early_modern' ? 'Early Modern' : 'Historical Eras'}
            </h3>
            
            {/* Generate Images Button - Moved to Right */}
            <Button 
              onClick={handleGenerateImages}
              disabled={isGeneratingImages}
              variant="outline"
              className="border-gray-200"
            >
              {isGeneratingImages ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate AI Images
                </>
              )}
            </Button>
          </div>

          {/* Location Filter Section */}
          {selectedEras.length > 0 && (
            <div className="mb-8">
              <h4 className="text-md font-medium text-gray-900 mb-3">Filter by Location</h4>
              <div className="flex flex-wrap gap-2">
                {/* Get unique locations from tours */}
                {Array.from(new Set(
                  (toursData || [])
                    .filter(tour => selectedEras.some(era => tour.era?.toLowerCase().includes(era.toLowerCase())))
                    .map(tour => tour.locations)
                    .filter(Boolean)
                    .flatMap(location => location.split(',').map(l => l.trim()))
                )).slice(0, 10).map((location) => (
                  <button
                    key={location}
                    onClick={() => {
                      const isSelected = selectedLocations.includes(location);
                      if (isSelected) {
                        setSelectedLocations(prev => prev.filter(l => l !== location));
                      } else {
                        setSelectedLocations(prev => [...prev, location]);
                      }
                    }}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                      selectedLocations.includes(location)
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
                    }`}
                  >
                    <MapPin className="w-3 h-3 mr-1 inline" />
                    {location}
                  </button>
                ))}
                {selectedLocations.length > 0 && (
                  <button
                    onClick={() => setSelectedLocations([])}
                    className="px-3 py-1.5 rounded-full text-sm font-medium bg-red-100 text-red-700 border border-red-200 hover:bg-red-200"
                  >
                    <XIcon className="w-3 h-3 mr-1 inline" />
                    Clear Locations
                  </button>
                )}
              </div>
            </div>
          )}
          
          <div className="grid flex-wrap gap-3 mb-6 columns-2 md:columns-3 lg:columns-4">
          </div>
          
          <div className="flex flex-wrap gap-3">
            <TooltipProvider>
              {filteredEras.map((era) => (
                <Tooltip key={era.id}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => handleEraSelect(era.name)}
                      className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${
                        selectedEras.includes(era.name)
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                      }`}
                    >
                      {era.name}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{eraTimelines[era.name] || 'Historical period'}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </TooltipProvider>
          </div>
        </div>

        {/* Tours Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Available Tours</h3>
            {selectedEras.length > 0 && (
              <Button
                variant="outline"
                onClick={() => setSelectedEras([])}
                className="flex items-center gap-2 text-sm"
              >
                <XIcon className="w-4 h-4" />
                Clear Filter
              </Button>
            )}
          </div>

          {/* Tours Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {toursToDisplay.map((tour: any, index: number) => (
              <div key={`${tour.id || index}-${tour.title}`} className="group">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300">
                  {/* Tour Image */}
                  <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                    <img
                      src={tour.image}
                      alt={tour.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="bg-white/90 text-gray-900 px-2 py-1 rounded-lg text-xs font-medium">
                        Heritage Tour
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    {/* Tour Title */}
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      {tour.title}
                    </h4>
                    
                    {/* Tour Description */}
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {tour.description}
                    </p>

                    {/* Duration and Price */}
                    <div className="flex items-center justify-between mb-4">
                      <Select 
                        value={selectedDurations[tour.id] || (typeof tour.defaultDuration === 'string' ? tour.defaultDuration : "7 days")}
                        onValueChange={(value) => handleDurationChange(tour.id, value)}
                      >
                        <SelectTrigger className="w-24 h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {(tour.durationOptions || ["3 days", "5 days", "7 days", "10 days"]).map((duration: any) => {
                            const durationStr = typeof duration === 'string' ? duration : duration.duration || `${duration.days || duration} days`;
                            return (
                              <SelectItem key={durationStr} value={durationStr}>
                                {durationStr}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                      
                      <div className="text-right">
                        <div className="text-sm text-gray-500">From</div>
                        <div className="text-lg font-semibold text-gray-900">$2,299</div>
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center mb-4">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 text-gray-300" />
                        ))}
                      </div>
                      <span className="ml-2 text-xs text-gray-500">0 (0 reviews)</span>
                    </div>

                    {/* Action Button */}
                    <Link href={`/tours/${tour.id}?duration=${selectedDurations[tour.id] || (typeof tour.defaultDuration === 'string' ? tour.defaultDuration : "7 days")}`}>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {toursToDisplay.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">
                {selectedEras.length > 0
                  ? `No tours found for ${selectedEras.length === 1 ? selectedEras[0] : 'the selected eras'}. Try selecting different eras.`
                  : 'No tours available. Please try again later.'
                }
              </p>
            </div>
          )}
        </div>

        {/* Help Section */}
        <div className="mt-16 bg-gray-50 rounded-2xl p-8 text-center">
          <h4 className="text-xl font-semibold text-gray-900 mb-2">
            Need help choosing your tour?
          </h4>
          <p className="text-gray-600 mb-6">
            Chat with a heritage specialist online or visit our experience center.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="outline" className="px-6 py-2 rounded-full text-sm">
              Chat with a specialist
            </Button>
            <Button variant="outline" className="px-6 py-2 rounded-full text-sm">
              Find a location near you
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}