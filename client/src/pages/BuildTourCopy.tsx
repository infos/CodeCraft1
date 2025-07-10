import React, { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Loader2, Sparkles, XIcon, Mountain, Crown, Castle, Palette, Globe, Clock, ArrowRight, Play, MapPin, Star } from 'lucide-react';
import { Link } from 'wouter';

export default function BuildTourCopy() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showGeneratedTours, setShowGeneratedTours] = useState(false);
  const [generatedTours, setGeneratedTours] = useState<any[]>([]);
  const [selectedDurations, setSelectedDurations] = useState<Record<string, string>>({});
  const [eraImages, setEraImages] = useState<Record<string, string>>({});
  const [isGeneratingImages, setIsGeneratingImages] = useState(false);

  const queryClient = useQueryClient();

  const getFormattedYearRange = (period: any) => {
    switch (period.period) {
      case 'Ancient':
        return '3500-500 BCE';
      case 'Medieval':
        return '500-1450 CE';
      case 'Renaissance':
        return '1400-1600 CE';
      case 'Baroque':
        return '1600-1750 CE';
      default:
        return '';
    }
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
          initialDurations[tour.id] = tour.defaultDuration;
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

  const historyData = [
    {
      period: "Ancient",
      title: "Ancient Civilizations",
      icon: Crown,
      eras: ["Egypt", "Mesopotamia", "Greece", "Rome"],
      eraDetails: [
        { name: "Egypt", year: "3100 - 30 BCE", title: "Land of Pharaohs", description: "Pyramids, temples, and timeless wonders along the Nile" },
        { name: "Mesopotamia", year: "3500 - 539 BCE", title: "Cradle of Civilization", description: "Ancient Babylon, ziggurats, and humanity's first cities" },
        { name: "Greece", year: "800 - 146 BCE", title: "Birthplace of Democracy", description: "Marble temples, philosophy, and the origins of Western culture" },
        { name: "Rome", year: "753 BCE - 476 CE", title: "The Eternal Empire", description: "Colosseum, aqueducts, and the glory of imperial Rome" }
      ]
    },
    {
      period: "Medieval",
      title: "Medieval Times",
      icon: Castle,
      eras: ["Byzantine", "Islamic", "Viking", "Feudal"],
      eraDetails: [
        { name: "Byzantine", year: "330 - 1453 CE", title: "Eastern Roman Legacy", description: "Hagia Sophia, Constantinople, and Orthodox splendor" },
        { name: "Islamic", year: "622 - 1492 CE", title: "Golden Age of Islam", description: "Córdoba, Baghdad, and architectural marvels of Al-Andalus" },
        { name: "Viking", year: "793 - 1066 CE", title: "Age of Exploration", description: "Norse sagas, longships, and northern European conquests" },
        { name: "Feudal", year: "800 - 1500 CE", title: "Age of Chivalry", description: "Medieval castles, Gothic cathedrals, and knightly orders" }
      ]
    },
    {
      period: "Renaissance",
      title: "Renaissance Era",
      icon: Palette,
      eras: ["Italian", "Northern", "Exploration", "Reformation"],
      eraDetails: [
        { name: "Italian", year: "1300 - 1600 CE", title: "Cultural Rebirth", description: "Florence, Venice, and the masterpieces of Leonardo and Michelangelo" },
        { name: "Northern", year: "1400 - 1600 CE", title: "Northern Renaissance", description: "Flemish art, German innovation, and humanist scholarship" },
        { name: "Exploration", year: "1400 - 1600 CE", title: "Age of Discovery", description: "New World expeditions, maritime routes, and global trade" },
        { name: "Reformation", year: "1517 - 1648 CE", title: "Religious Revolution", description: "Protestant movement, religious wars, and theological transformation" }
      ]
    },
    {
      period: "Baroque",
      title: "Baroque Period", 
      icon: Mountain,
      eras: ["Counter-Reformation", "Absolutism", "Scientific", "Colonial"],
      eraDetails: [
        { name: "Counter-Reformation", year: "1545 - 1648 CE", title: "Catholic Revival", description: "Ornate churches, religious art, and spiritual renewal" },
        { name: "Absolutism", year: "1600 - 1750 CE", title: "Age of Kings", description: "Versailles, royal courts, and absolute monarchy" },
        { name: "Scientific", year: "1600 - 1750 CE", title: "Scientific Revolution", description: "Galileo, Newton, and the birth of modern science" },
        { name: "Colonial", year: "1600 - 1750 CE", title: "Colonial Expansion", description: "New World settlements, trade empires, and cultural exchange" }
      ]
    }
  ];

  const handlePeriodSelect = (index: number) => {
    setCurrentIndex(index);
    setShowGeneratedTours(false);
  };

  const handleGenerateTours = (selectedPeriods: string[], selectedEras: string[], selectedLocations: string[]) => {
    const filterData = {
      selectedPeriods,
      selectedEras,
      selectedLocations
    };
    generateToursMutation.mutate(filterData);
  };

  const currentPeriod = historyData[currentIndex];

  return (
    <div className="min-h-screen bg-white">
      {/* Header with Historical Periods Filter */}
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
          
          {/* Historical Periods Filter Chips */}
          <div className="pb-4">
            <div className="flex flex-wrap gap-2">
              {historyData.map((period, index) => (
                <button
                  key={period.period}
                  onClick={() => handlePeriodSelect(index)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${
                    currentIndex === index
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                  }`}
                >
                  {period.title} ({getFormattedYearRange(period)})
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section - Simplified */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-4 tracking-tight">
              {currentPeriod.title}
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto font-light">
              Discover the wonders of {currentPeriod.title.toLowerCase()} through immersive heritage tours.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Historical Eras Filter Section */}
        <div className="mb-12">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Historical Eras</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {currentPeriod.eraDetails.map((era) => (
              <button
                key={era.name}
                onClick={() => handleGenerateTours([currentPeriod.period], [era.name], [])}
                className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-3 flex items-center justify-center group-hover:from-blue-100 group-hover:to-blue-200 transition-all duration-200">
                  <Globe className="w-6 h-6 text-gray-500 group-hover:text-blue-600" />
                </div>
                <span className="text-sm font-medium text-gray-900 text-center">{era.name}</span>
                <span className="text-xs text-gray-500 text-center mt-1">{era.year}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tours Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Available Tours</h3>
            {showGeneratedTours && (
              <Button
                variant="outline"
                onClick={() => setShowGeneratedTours(false)}
                className="flex items-center gap-2 text-sm"
              >
                <XIcon className="w-4 h-4" />
                Clear Filter
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Show generated tours if available, otherwise show all tours */}
            {(showGeneratedTours && generatedTours.length > 0 ? generatedTours : toursData || []).map((tour) => (
              <div key={tour.id} className="group">
                <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-lg">
                  {/* Tour Image */}
                  <div className="aspect-[16/10] bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                    {eraImages[tour.title?.split(' ')[0]] ? (
                      <img
                        src={eraImages[tour.title?.split(' ')[0]]}
                        alt={tour.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <MapPin className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-700">
                        Best Seller
                      </span>
                    </div>
                  </div>
                  
                  {/* Tour Content */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {tour.title}
                      </h4>
                      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {tour.description}
                    </p>

                    {/* Duration Selector */}
                    <div className="flex items-center justify-between mb-4">
                      <Select
                        value={selectedDurations[tour.id] || tour.defaultDuration || "7"}
                        onValueChange={(value) => setSelectedDurations(prev => ({ ...prev, [tour.id]: value }))}
                      >
                        <SelectTrigger className="w-28 h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="3">3 days</SelectItem>
                          <SelectItem value="5">5 days</SelectItem>
                          <SelectItem value="7">7 days</SelectItem>
                          <SelectItem value="10">10 days</SelectItem>
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
                    <Link href={`/tours/${tour.id}?duration=${selectedDurations[tour.id] || tour.defaultDuration || "7"}`}>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
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