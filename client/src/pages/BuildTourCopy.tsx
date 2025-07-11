import React, { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Sparkles, XIcon, MapPin, Star } from 'lucide-react';
import { Link } from 'wouter';
import type { Era } from "@shared/schema";

export default function BuildTourCopy() {
  const [selectedEra, setSelectedEra] = useState<string | null>(null);
  const [showGeneratedTours, setShowGeneratedTours] = useState(false);
  const [generatedTours, setGeneratedTours] = useState<any[]>([]);
  const [selectedDurations, setSelectedDurations] = useState<Record<string, string>>({});
  const [eraImages, setEraImages] = useState<Record<string, string>>({});
  const [isGeneratingImages, setIsGeneratingImages] = useState(false);

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

  useEffect(() => {
    if (existingImagesData?.imageUrls) {
      setEraImages(existingImagesData.imageUrls);
    }
  }, [existingImagesData]);

  const handleGenerateEraImages = () => {
    setIsGeneratingImages(true);
    generateEraImagesMutation.mutate();
  };

  const handleEraSelect = (eraName: string | null) => {
    setSelectedEra(eraName);
    setShowGeneratedTours(false);
    
    if (eraName) {
      // Generate tours for the selected era
      const filterData = {
        selectedPeriods: [],
        selectedEras: [eraName],
        selectedLocations: []
      };
      generateToursMutation.mutate(filterData);
    }
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

  // Display tours from either generated tours or database tours
  const toursToDisplay = showGeneratedTours && generatedTours.length > 0
    ? generatedTours.map(tour => ({
        ...tour,
        image: eraImages[selectedEra || ''] || '/era-images/default.jpg'
      }))
    : (toursData || []).filter(tour => 
        selectedEra ? tour.era && tour.era.toLowerCase() === selectedEra.toLowerCase() : true
      );

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <h1 className="text-2xl font-semibold text-gray-900">Tour Builder</h1>
            
            <Button 
              onClick={handleGenerateEraImages}
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
                  Generate Images
                </>
              )}
            </Button>
          </div>
          
          {/* Historical Eras Filter Chips - matching historical tours page */}
          <div className="pb-4">
            <div className="flex flex-wrap gap-2">
              {sortedEras.map((era) => (
                <button
                  key={era.id}
                  onClick={() => handleEraSelect(era.name)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${
                    selectedEra === era.name
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                  }`}
                >
                  {era.name} ({formatYear(era.startYear)}-{formatYear(era.endYear)})
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Apple Store Style Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-6xl font-light text-gray-900 mb-4">
            {selectedEra ? `${selectedEra} Tours` : 'Heritage Tours'}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {selectedEra 
              ? `Discover the wonders of ${selectedEra} through our expertly curated heritage experiences`
              : 'Experience history first-hand with our curated historical tours'
            }
          </p>
        </div>

        {/* Tours Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Available Tours</h3>
            {selectedEra && (
              <Button
                variant="outline"
                onClick={() => handleEraSelect(null)}
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
                      src={tour.image || eraImages[selectedEra || ''] || '/era-images/default.jpg'}
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
                          <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <span className="ml-2 text-xs text-gray-500">4.9 (128)</span>
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
                {selectedEra 
                  ? `No tours found for ${selectedEra}. Try selecting a different era.`
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