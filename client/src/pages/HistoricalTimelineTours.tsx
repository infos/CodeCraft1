import React, { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Loader2, 
  Sparkles, 
  XIcon, 
  MapPin, 
  Star, 
  Search,
  Calendar,
  Clock,
  Users,
  Filter,
  ArrowRight,
  Globe
} from 'lucide-react';
import { Link } from 'wouter';
import type { Era } from "@shared/schema";

// Historical periods data
const historicalPeriods = [
  { id: 'ancient', name: 'Ancient Times', range: '3500 BCE - 500 CE', color: 'bg-amber-100 text-amber-800 border-amber-200' },
  { id: 'classical', name: 'Classical Period', range: '800 BCE - 500 CE', color: 'bg-purple-100 text-purple-800 border-purple-200' },
  { id: 'medieval', name: 'Medieval Period', range: '500 CE - 1500 CE', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  { id: 'renaissance', name: 'Renaissance', range: '1300 CE - 1650 CE', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  { id: 'early_modern', name: 'Early Modern', range: '1650 CE - 1800 CE', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
  { id: 'modern', name: 'Modern Era', range: '1800 CE - Present', color: 'bg-slate-100 text-slate-800 border-slate-200' }
];

// Era timeline data with enhanced information
const eraTimelines: Record<string, { range: string; description: string; color: string }> = {
  "Ancient Near Eastern": { range: "3500 BCE - 539 BCE", description: "Mesopotamian civilizations", color: "bg-yellow-50 border-yellow-200" },
  "Ancient Egypt": { range: "3100 BCE - 30 BCE", description: "Pharaohs and pyramids", color: "bg-amber-50 border-amber-200" },
  "Ancient Greece": { range: "800 BCE - 146 BCE", description: "Philosophy and democracy", color: "bg-blue-50 border-blue-200" },
  "Ancient Rome": { range: "753 BCE - 476 CE", description: "Empire and engineering", color: "bg-red-50 border-red-200" },
  "Byzantine Empire": { range: "330 CE - 1453 CE", description: "Eastern Roman Empire", color: "bg-purple-50 border-purple-200" },
  "Medieval Europe": { range: "500 CE - 1500 CE", description: "Knights and castles", color: "bg-emerald-50 border-emerald-200" },
  "Renaissance": { range: "1300 CE - 1650 CE", description: "Art and innovation", color: "bg-pink-50 border-pink-200" },
  "Age of Exploration": { range: "1400 CE - 1700 CE", description: "Discovery and trade", color: "bg-cyan-50 border-cyan-200" },
  "Enlightenment": { range: "1650 CE - 1800 CE", description: "Reason and science", color: "bg-indigo-50 border-indigo-200" }
};

export default function HistoricalTimelineTours() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('');
  const [selectedEras, setSelectedEras] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [showGeneratedTours, setShowGeneratedTours] = useState(false);
  const [generatedTours, setGeneratedTours] = useState<any[]>([]);
  const [selectedDurations, setSelectedDurations] = useState<Record<string, string>>({});
  const [eraImages, setEraImages] = useState<Record<string, string>>({});
  const [isGeneratingImages, setIsGeneratingImages] = useState(false);

  const queryClient = useQueryClient();

  // Fetch eras data
  const { data: erasData, isLoading: isLoadingEras } = useQuery({
    queryKey: ['/api/eras'],
    staleTime: 1000 * 60 * 5,
  });

  // Fetch tours data
  const { data: toursData, isLoading: isLoadingTours } = useQuery({
    queryKey: ['/api/tours'],
    staleTime: 1000 * 60 * 5,
  });

  // Filter eras based on selected period
  const filteredEras = React.useMemo(() => {
    if (!erasData || !selectedPeriod) return erasData || [];
    
    return (erasData || []).filter((era: Era) => {
      const eraName = era.name;
      
      switch (selectedPeriod) {
        case 'ancient':
          return ['Ancient Near Eastern', 'Ancient Egypt', 'Ancient Greece', 'Ancient Rome', 'Ancient China', 'Ancient India'].includes(eraName);
        case 'classical':
          return ['Ancient Greece', 'Ancient Rome', 'Hellenistic Period', 'Roman Republic'].includes(eraName);
        case 'medieval':
          return ['Byzantine Empire', 'Medieval Europe', 'Sasanian Empire', 'Silk Road Trade Era'].includes(eraName);
        case 'renaissance':
          return ['Renaissance'].includes(eraName);
        case 'early_modern':
          return ['Age of Exploration', 'Enlightenment', 'Georgian Era'].includes(eraName);
        case 'modern':
          return ['Industrial Revolution', 'Modern Era'].includes(eraName);
        default:
          return true;
      }
    });
  }, [erasData, selectedPeriod]);

  // Generate tours mutation
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

  // Handle era selection
  const handleEraSelect = (eraName: string) => {
    setSelectedEras(prev => 
      prev.includes(eraName) 
        ? prev.filter(e => e !== eraName)
        : [...prev, eraName]
    );
  };

  // Generate tours when eras are selected
  useEffect(() => {
    if (selectedEras.length > 0) {
      const filterData = {
        selectedPeriods: selectedPeriod ? [selectedPeriod] : [],
        selectedEras,
        selectedLocations
      };
      generateToursMutation.mutate(filterData);
    } else {
      setShowGeneratedTours(false);
      setGeneratedTours([]);
    }
  }, [selectedEras, selectedLocations, selectedPeriod]);

  // Combine generated tours with database tours
  const toursToDisplay = React.useMemo(() => {
    const tours = showGeneratedTours ? generatedTours : (toursData || []);
    
    if (searchQuery.trim()) {
      return tours.filter((tour: any) => 
        tour.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tour.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tour.era?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tour.locations?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return tours;
  }, [showGeneratedTours, generatedTours, toursData, searchQuery]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Header with Search */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo/Title */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Globe className="h-8 w-8 text-blue-600" />
                <h1 className="text-xl font-bold text-gray-900">Heritage Timeline</h1>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search historical tours, eras, or destinations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="w-full">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h2 className="text-5xl font-light text-gray-900 mb-4">
              Journey Through Time
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore humanity's greatest civilizations through immersive historical tours. 
              Select a period to discover authentic heritage experiences.
            </p>
          </div>

          {/* Horizontal Historical Timeline */}
          <div className="mb-12">
            <h3 className="text-2xl font-semibold text-gray-900 mb-8 text-center">Historical Timeline</h3>
            <div className="relative overflow-x-auto pb-4">
                {/* Horizontal Timeline Container */}
                <div className="flex items-center justify-between min-w-[1200px] relative">
                  {/* Timeline Line */}
                  <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-purple-500 via-emerald-500 via-blue-500 via-indigo-500 to-slate-600 transform -translate-y-1/2"></div>
                  
                  {/* Timeline Periods */}
                  {historicalPeriods.map((period, index) => (
                    <div key={period.id} className="flex flex-col items-center relative z-10">
                      {/* Timeline Dot */}
                      <div className={`w-6 h-6 rounded-full border-4 border-white shadow-lg mb-4 ${
                        selectedPeriod === period.id ? 'bg-blue-600 scale-125' : 'bg-gray-400'
                      } transition-all duration-300`}></div>
                      
                      {/* Period Card */}
                      <button
                        onClick={() => setSelectedPeriod(selectedPeriod === period.id ? '' : period.id)}
                        className={`w-48 p-4 rounded-lg border-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                          selectedPeriod === period.id 
                            ? period.color + ' ring-2 ring-blue-500 scale-105' 
                            : 'bg-white border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <h4 className="font-semibold text-lg mb-1">{period.name}</h4>
                        <p className="text-sm opacity-75">{period.range}</p>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          {/* Selected Period Eras */}
          {selectedPeriod && (
            <div className="mb-12">
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-semibold text-gray-900 mb-2">
                    {historicalPeriods.find(p => p.id === selectedPeriod)?.name} Civilizations
                  </h3>
                  <p className="text-lg text-gray-600">
                    Select civilizations to explore available tours
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredEras.map((era: Era) => {
                    const eraInfo = eraTimelines[era.name];
                    return (
                      <button
                        key={era.id}
                        onClick={() => handleEraSelect(era.name)}
                        className={`p-6 rounded-xl border-2 text-left transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                          selectedEras.includes(era.name)
                            ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200 scale-105'
                            : eraInfo?.color || 'bg-white border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <h4 className="font-bold text-xl mb-3">{era.name}</h4>
                        {eraInfo && (
                          <>
                            <p className="text-sm text-gray-600 mb-2 font-medium">{eraInfo.range}</p>
                            <p className="text-sm text-gray-500 mb-3">{eraInfo.description}</p>
                          </>
                        )}
                        {era.keyFigures && (
                          <p className="text-xs text-gray-400 border-t border-gray-200 pt-2">
                            Key Figures: {era.keyFigures}
                          </p>
                        )}
                      </button>
                    );
                  })}
                </div>
                
                {/* Selected Eras Summary */}
                {selectedEras.length > 0 && (
                  <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <Users className="w-5 h-5 mr-2 text-blue-600" />
                      Selected Civilizations ({selectedEras.length})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedEras.map((era) => (
                        <div key={era} className="flex items-center bg-white px-3 py-2 rounded-full border border-blue-200">
                          <span className="text-sm font-medium text-gray-700">{era}</span>
                          <button
                            onClick={() => handleEraSelect(era)}
                            className="ml-2 text-red-500 hover:text-red-700 transition-colors"
                          >
                            <XIcon className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

          {/* Location Filter */}
          {selectedEras.length > 0 && (
            <div className="mb-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Filter by Destination</h4>
                <div className="flex flex-wrap gap-2">
                  {Array.from(new Set(
                    (toursData || [])
                      .filter(tour => selectedEras.some(era => tour.era?.toLowerCase().includes(era.toLowerCase())))
                      .map(tour => tour.locations)
                      .filter(Boolean)
                      .flatMap(location => location.split(',').map(l => l.trim()))
                  )).slice(0, 12).map((location) => (
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
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                        selectedLocations.includes(location)
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      <MapPin className="w-3 h-3 mr-1 inline" />
                      {location}
                    </button>
                  ))}
                </div>
              </div>
            )}

          {/* Tours Grid */}
          {toursToDisplay.length > 0 && (
            <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-semibold text-gray-900">
                    {searchQuery ? 'Search Results' : 'Available Tours'}
                    <span className="text-lg text-gray-500 ml-2">({toursToDisplay.length})</span>
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {toursToDisplay.map((tour: any, index: number) => (
                    <Link 
                      key={`${tour.id || index}-${tour.title}`} 
                      href={`/tour/${tour.id || 'generated'}`}
                      className="group block"
                    >
                      <Card className="h-full border-0 shadow-sm hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1 bg-white overflow-hidden">
                        {/* Tour Image */}
                        <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                          {tour.image && (
                            <img
                              src={tour.image}
                              alt={tour.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          )}
                          <div className="absolute top-3 left-3">
                            <span className="bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-1 rounded-full text-xs font-medium shadow-sm">
                              {tour.era || 'Heritage Tour'}
                            </span>
                          </div>
                          <div className="absolute top-3 right-3">
                            <div className="flex items-center space-x-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                              <Star className="w-3 h-3 text-yellow-500 fill-current" />
                              <span className="text-xs font-medium">4.8</span>
                            </div>
                          </div>
                        </div>

                        <CardContent className="p-6">
                          <div className="space-y-3">
                            <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                              {tour.title}
                            </h3>
                            <p className="text-gray-600 text-sm line-clamp-2">{tour.description}</p>
                            
                            {tour.locations && (
                              <div className="flex items-center text-gray-500 text-sm">
                                <MapPin className="w-4 h-4 mr-1" />
                                {tour.locations}
                              </div>
                            )}

                            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                              <div className="flex items-center text-gray-500 text-sm">
                                <Clock className="w-4 h-4 mr-1" />
                                {selectedDurations[tour.id] || tour.defaultDuration || tour.duration || '7 days'}
                              </div>
                              <ArrowRight className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}

          {/* Empty State */}
          {toursToDisplay.length === 0 && !isLoadingTours && (
            <div className="text-center py-12">
                <div className="max-w-md mx-auto">
                  <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {searchQuery ? 'No tours found' : 'Select a period to explore tours'}
                  </h3>
                  <p className="text-gray-600">
                    {searchQuery 
                      ? 'Try adjusting your search terms or filters' 
                      : 'Choose a historical period from the timeline above to discover amazing heritage tours'
                    }
                  </p>
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}