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
      {/* Hero Section - Apple Store Style */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-semibold text-gray-900 mb-6 tracking-tight">
              Tour Builder.
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto font-light">
              The best way to explore the world's greatest civilizations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                onClick={handleGenerateEraImages}
                disabled={isGeneratingImages}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full text-lg font-medium"
              >
                {isGeneratingImages ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Generating Images...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate Era Images
                  </>
                )}
              </Button>
              <div className="flex items-center gap-2 text-gray-600">
                <Play className="w-4 h-4" />
                <span className="text-sm">Watch how it works</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Pills - Apple Style */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center py-4">
            <div className="flex space-x-1 bg-gray-100 rounded-full p-1">
              {historyData.map((period, index) => {
                const Icon = period.icon;
                return (
                  <button
                    key={period.period}
                    onClick={() => handlePeriodSelect(index)}
                    className={`flex items-center px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      currentIndex === index
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {period.title}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Period Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
            {currentPeriod.title}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover the wonders of {currentPeriod.title.toLowerCase()} through immersive heritage tours.
          </p>
        </div>

        {/* Era Cards Grid - Apple Product Grid Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {currentPeriod.eraDetails.map((era, index) => {
            const imageUrl = eraImages[era.name];
            return (
              <div
                key={era.name}
                className="group cursor-pointer"
                onClick={() => handleGenerateTours([currentPeriod.period], [era.name], [])}
              >
                <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1">
                  {/* Era Image */}
                  <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={era.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Globe className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  
                  {/* Era Info */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{era.name}</h3>
                      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors duration-200" />
                    </div>
                    <p className="text-sm text-gray-500 mb-3">{era.year}</p>
                    <h4 className="text-lg font-medium text-gray-800 mb-2">{era.title}</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">{era.description}</p>
                    
                    {/* Rating Stars */}
                    <div className="flex items-center mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-gray-500">4.9 (128 reviews)</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions - Apple Store Style */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 text-center">
            <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Custom Dates</h3>
            <p className="text-gray-600 text-sm">Choose your perfect travel dates</p>
          </div>
          
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 text-center">
            <MapPin className="w-8 h-8 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Expert Guides</h3>
            <p className="text-gray-600 text-sm">Local historians and archaeologists</p>
          </div>
          
          <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-2xl p-6 text-center">
            <Clock className="w-8 h-8 text-purple-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Flexible Duration</h3>
            <p className="text-gray-600 text-sm">3 to 12 days, perfectly curated</p>
          </div>
        </div>

        {/* Generated Tours Section */}
        {showGeneratedTours && generatedTours.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-semibold text-gray-900">Available Tours</h2>
              <Button
                variant="outline"
                onClick={() => setShowGeneratedTours(false)}
                className="flex items-center gap-2"
              >
                <XIcon className="w-4 h-4" />
                Close
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {generatedTours.map((tour) => (
                <Card key={tour.id} className="group hover:shadow-lg transition-all duration-300 border-gray-200 hover:border-gray-300">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {tour.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600 line-clamp-2">
                      {tour.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between mb-4">
                      <Select
                        value={selectedDurations[tour.id] || tour.defaultDuration}
                        onValueChange={(value) => setSelectedDurations(prev => ({ ...prev, [tour.id]: value }))}
                      >
                        <SelectTrigger className="w-32">
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
                    <Link href={`/tours/${tour.id}?duration=${selectedDurations[tour.id] || tour.defaultDuration}`}>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                        View Details
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer CTA - Apple Style */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-semibold text-gray-900 mb-4">
            Need help choosing your tour?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Chat with a heritage specialist online or visit our experience center.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" className="px-6 py-3 rounded-full">
              Chat with a specialist
            </Button>
            <Button variant="outline" className="px-6 py-3 rounded-full">
              Find a location near you
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}