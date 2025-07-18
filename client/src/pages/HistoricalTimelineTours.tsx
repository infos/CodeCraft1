import React, { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
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
  Globe,
  ChevronDown
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
  const [showFilters, setShowFilters] = useState(false);

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

  // Fetch tour images data
  const { data: tourImagesData } = useQuery({
    queryKey: ['/api/tour-images'],
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

  // Handle period change and filter eras
  const handlePeriodChange = (periodKey: string) => {
    setSelectedPeriod(selectedPeriod === periodKey ? '' : periodKey);
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

  // Combine generated tours with database tours and add images
  const toursToDisplay = React.useMemo(() => {
    let tours = showGeneratedTours ? generatedTours : (toursData || []);
    
    // Add images to tours from tour images data
    if (tourImagesData && tours) {
      tours = tours.map((tour: any) => {
        const tourImage = tourImagesData.find((img: any) => 
          img.tourTitle?.toLowerCase().includes(tour.title?.toLowerCase().split(' ')[0] || '') ||
          img.tourId === tour.id
        );
        return {
          ...tour,
          image: tourImage?.imageUrl || tour.image
        };
      });
    }
    
    if (searchQuery.trim()) {
      return tours.filter((tour: any) => 
        tour.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tour.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tour.era?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tour.locations?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return tours;
  }, [showGeneratedTours, generatedTours, toursData, searchQuery, tourImagesData]);

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
              {/* Explore Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    Explore
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <div className="px-3 py-2 text-sm font-medium text-gray-900 border-b border-gray-100">
                    Historical Periods
                  </div>
                  
                  {historicalPeriods.map((period) => (
                    <DropdownMenuItem
                      key={period.id}
                      onClick={() => setSelectedPeriod(selectedPeriod === period.id ? '' : period.id)}
                      className={`flex flex-col items-start py-3 px-3 cursor-pointer ${
                        selectedPeriod === period.id 
                          ? 'bg-blue-50 text-blue-700' 
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="font-medium">{period.name}</div>
                      <div className="text-xs text-gray-500 mt-1">{period.range}</div>
                    </DropdownMenuItem>
                  ))}
                  
                  <div className="border-t border-gray-100 my-1"></div>
                  
                  <DropdownMenuItem className="py-2 px-3 cursor-pointer hover:bg-gray-50">
                    <div className="font-medium text-gray-900">Rulers</div>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem className="py-2 px-3 cursor-pointer hover:bg-gray-50">
                    <div className="font-medium text-gray-900">Locations</div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className={showFilters ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      {showFilters && (
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Historical Periods Filter */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Historical Periods</h4>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <TooltipProvider>
                  {[
                    { key: 'ancient', label: 'Ancient Times', tooltip: '3500 BCE - 500 CE' },
                    { key: 'classical', label: 'Classical Period', tooltip: '800 BCE - 500 CE' },
                    { key: 'medieval', label: 'Medieval Period', tooltip: '500 CE - 1500 CE' },
                    { key: 'renaissance', label: 'Renaissance', tooltip: '1300 CE - 1650 CE' },
                    { key: 'early_modern', label: 'Early Modern', tooltip: '1650 CE - 1800 CE' }
                  ].map((period) => (
                    <Tooltip key={period.key}>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => handlePeriodChange(period.key)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 hover:shadow-md ${
                            selectedPeriod === period.key
                              ? 'bg-blue-600 text-white shadow-lg scale-105'
                              : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-400 hover:bg-gray-50'
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
                </TooltipProvider>
              </div>
            </div>


          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="w-full">
          {/* All Civilizations - Dribbble Style */}
          <div className="mb-12">
            <div className="mb-8">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Choose Civilizations to Explore</h4>
            </div>
            {/* Horizontal Tags - Compact Dribbble Style */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
              {filteredEras?.map((era: Era) => {
                return (
                  <TooltipProvider key={era.id}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => handleEraSelect(era.name)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 hover:shadow-md ${
                            selectedEras.includes(era.name)
                              ? 'bg-blue-600 text-white shadow-lg scale-105'
                              : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                          }`}
                        >
                          {era.name}
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{eraTimelines[era.name]?.range || 'Historical period'}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                );
              })}
            </div>

            {/* Location Filter - Show under Civilizations when filters are open OR civilizations are selected */}
            {(showFilters || selectedEras.length > 0) && (
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Filter by Destination</h4>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {Array.from(new Set(
                    (toursData || [])
                      .filter(tour => selectedEras.length === 0 || selectedEras.some(era => tour.era?.toLowerCase().includes(era.toLowerCase())))
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
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 hover:shadow-md ${
                        selectedLocations.includes(location)
                          ? 'bg-blue-600 text-white shadow-lg scale-105'
                          : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                      }`}
                    >
                      <MapPin className="w-3 h-3 mr-1 inline" />
                      {location}
                    </button>
                  ))}
                  {selectedLocations.length > 0 && (
                    <button
                      onClick={() => setSelectedLocations([])}
                      className="px-3 py-1.5 rounded-full text-xs font-medium bg-red-100 text-red-700 border border-red-200 hover:bg-red-200"
                    >
                      <XIcon className="w-3 h-3 mr-1 inline" />
                      Clear Locations
                    </button>
                  )}
                </div>
              </div>
            )}
            

          </div>

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
                      href={showGeneratedTours ? `/tour/${toursData?.[0]?.id || 830}` : `/tour/${tour.id}`}
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