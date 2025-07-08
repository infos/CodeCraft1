import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Loader2, Sparkles, XIcon, Mountain, Crown, Castle, Palette, Globe, Clock } from 'lucide-react';
import { Link } from 'wouter';

export default function BuildTourCopy() {
  const [currentIndex, setCurrentIndex] = useState(0); // Start with Ancient
  const [showGeneratedTours, setShowGeneratedTours] = useState(false);
  const [generatedTours, setGeneratedTours] = useState<any[]>([]);
  const [selectedDurations, setSelectedDurations] = useState<Record<string, string>>({});

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
      // Initialize duration state for new tours
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

  // Historical data with detailed era information and icons
  const historyData = [
    {
      period: "Ancient",
      title: "Ancient Civilizations",
      icon: Crown,
      eras: ["Egypt", "Mesopotamia", "Greece", "Rome"],
      eraDetails: [
        { name: "Egypt", year: "3100 - 30 BCE", title: "Land of Pharaohs", description: "Pyramids, mummies, and Nile civilization" },
        { name: "Mesopotamia", year: "3500 - 539 BCE", title: "Cradle of Civilization", description: "Sumerians, Babylonians, and Assyrians" },
        { name: "Greece", year: "800 - 146 BCE", title: "Birthplace of Democracy", description: "Philosophy, art, and Olympic Games" },
        { name: "Rome", year: "753 BCE - 476 CE", title: "The Eternal Empire", description: "Gladiators, aqueducts, and conquest" }
      ]
    },
    {
      period: "Classical",
      title: "Classical Antiquity",
      icon: Crown,
      eras: ["Roman Empire", "Byzantine Empire", "Ancient China", "Ancient India"],
      eraDetails: [
        { name: "Roman Empire", year: "27 BCE - 476 CE", title: "Imperial Rome", description: "Peak of Roman power and engineering" },
        { name: "Byzantine Empire", year: "330 - 1453 CE", title: "Eastern Rome", description: "Orthodox Christianity and Constantinople" },
        { name: "Ancient China", year: "221 BCE - 220 CE", title: "Imperial Unity", description: "Great Wall and Silk Road" },
        { name: "Ancient India", year: "600 BCE - 600 CE", title: "Golden Age", description: "Buddhism, Hinduism, and the Gupta Empire" }
      ]
    },
    {
      period: "Medieval",
      title: "Medieval Period",
      icon: Castle,
      eras: ["Early Middle Ages", "High Middle Ages", "Late Middle Ages"],
      eraDetails: [
        { name: "Early Middle Ages", year: "476 - 1000 CE", title: "Dark Ages", description: "Fall of Rome and rise of kingdoms" },
        { name: "High Middle Ages", year: "1000 - 1300 CE", title: "Age of Faith", description: "Crusades, cathedrals, and chivalry" },
        { name: "Late Middle Ages", year: "1300 - 1500 CE", title: "Time of Change", description: "Black Death, Renaissance dawn" }
      ]
    },
    {
      period: "Renaissance",
      title: "Renaissance Era",
      icon: Palette,
      eras: ["Italian Renaissance", "Northern Renaissance", "Age of Exploration"],
      eraDetails: [
        { name: "Italian Renaissance", year: "1400 - 1600 CE", title: "Rebirth of Art", description: "Da Vinci, Michelangelo, and humanism" },
        { name: "Northern Renaissance", year: "1450 - 1600 CE", title: "Cultural Flowering", description: "Printing press and Protestant Reformation" },
        { name: "Age of Exploration", year: "1400 - 1600 CE", title: "New Worlds", description: "Columbus, Magellan, and discovery" }
      ]
    },
    {
      period: "Modern",
      title: "Modern Era",
      icon: Globe,
      eras: ["Industrial Revolution", "World Wars", "Space Age"],
      eraDetails: [
        { name: "Industrial Revolution", year: "1760 - 1840 CE", title: "Machine Age", description: "Steam power and factory systems" },
        { name: "World Wars", year: "1914 - 1945 CE", title: "Global Conflict", description: "Two world wars reshape the globe" },
        { name: "Space Age", year: "1957 - Present", title: "Beyond Earth", description: "Moon landing and space exploration" }
      ]
    }
  ];

  const handleDurationChange = (tourId: string, newDuration: string) => {
    setSelectedDurations(prev => ({
      ...prev,
      [tourId]: newDuration
    }));
  };

  const getCurrentItinerary = (tour: any) => {
    const currentDuration = selectedDurations[tour.id] || tour.defaultDuration || tour.duration;
    const durationOption = tour.durationOptions?.find((opt: any) => opt.duration === currentDuration);
    return durationOption?.itinerary || tour.itinerary || [];
  };

  const getCurrentDuration = (tour: any) => {
    return selectedDurations[tour.id] || tour.defaultDuration || tour.duration;
  };

  const prevPeriod = () => {
    setCurrentIndex((prev) => (prev - 1 + historyData.length) % historyData.length);
    // Reset era gallery scroll position
    setTimeout(() => {
      const gallery = document.querySelector('.era-tiles') as HTMLElement;
      if (gallery) gallery.scrollTo({ left: 0, behavior: 'smooth' });
    }, 100);
  };

  const nextPeriod = () => {
    setCurrentIndex((prev) => (prev + 1) % historyData.length);
    // Reset era gallery scroll position
    setTimeout(() => {
      const gallery = document.querySelector('.era-tiles') as HTMLElement;
      if (gallery) gallery.scrollTo({ left: 0, behavior: 'smooth' });
    }, 100);
  };

  const handleGenerateTours = () => {
    const filterData = {
      selectedPeriods: [currentPeriod.title.toLowerCase().replace(/\s+/g, '_')],
      selectedEras: currentPeriod.eras,
      selectedLocations: []
    };
    generateToursMutation.mutate(filterData);
  };

  const scrollEraGallery = (direction: 'left' | 'right') => {
    const gallery = document.querySelector('.era-tiles') as HTMLElement;
    if (gallery) {
      const scrollAmount = 320; // Width of one tile plus gap
      const newScrollLeft = direction === 'left' 
        ? gallery.scrollLeft - scrollAmount 
        : gallery.scrollLeft + scrollAmount;
      gallery.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
    }
  };

  const currentPeriod = historyData[currentIndex];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-color)', color: 'var(--text-color)' }}>
      <style>{`
        /*────────────────────────────────────────────────────────────────────────────
           Variables
        ────────────────────────────────────────────────────────────────────────────*/
        :root {
          --bg-color: #121212;
          --accent-color: #d4a971;
          --text-color: #fff;
          --subtext-color: #ccc;
          --font-sans: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          --nav-font-size: 0.9rem;
        }

        body {
          margin: 0;
          padding: 0;
          background: var(--bg-color);
          color: var(--text-color);
          font-family: var(--font-sans);
          line-height: 1.6;
        }

        /*────────────────────────────────────────────────────────────────────────────
           Layout Styles
        ────────────────────────────────────────────────────────────────────────────*/
        .history-section {
          padding: 2rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        .section-title {
          font-size: 1.8rem;
          font-weight: 300;
          text-align: center;
          margin-bottom: 2rem;
          color: var(--accent-color);
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        /*────────────────────────────────────────────────────────────────────────────
           Timeline Navigation
        ────────────────────────────────────────────────────────────────────────────*/
        .timeline-nav {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .year {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(212,169,113,0.3);
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.8rem;
          font-weight: 300;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        .year:hover {
          background: rgba(212,169,113,0.2);
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        }

        .year.active {
          background: var(--accent-color);
          color: var(--bg-color);
          border-color: var(--accent-color);
          font-weight: 400;
        }

        /*────────────────────────────────────────────────────────────────────────────
           Content Section
        ────────────────────────────────────────────────────────────────────────────*/
        .content-section {
          position: relative;
          background: rgba(255,255,255,0.02);
          border-radius: 8px;
          border: 1px solid rgba(212,169,113,0.2);
          padding: 2rem;
          margin: 2rem 0;
        }

        .content-title {
          font-size: 2.5rem;
          font-weight: 200;
          color: var(--accent-color);
          margin-bottom: 1rem;
          text-align: center;
        }

        .content-subtitle {
          font-size: 1.2rem;
          color: var(--subtext-color);
          text-align: center;
          margin-bottom: 2rem;
          font-weight: 300;
        }

        /*────────────────────────────────────────────────────────────────────────────
           Thumbnail Gallery
        ────────────────────────────────────────────────────────────────────────────*/
        .thumb-gallery {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
          margin: 2rem 0;
        }

        .thumb-placeholder {
          aspect-ratio: 16/9;
          background: rgba(212,169,113,0.1);
          border: 1px solid rgba(212,169,113,0.3);
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--subtext-color);
          font-size: 0.8rem;
        }

        /*────────────────────────────────────────────────────────────────────────────
           Era Selection
        ────────────────────────────────────────────────────────────────────────────*/
        .era-selector {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          justify-content: center;
          margin: 2rem 0;
        }

        .era-badge {
          padding: 0.5rem 1rem;
          background: rgba(212,169,113,0.1);
          border: 1px solid rgba(212,169,113,0.4);
          border-radius: 20px;
          color: var(--accent-color);
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 300;
        }

        .era-badge:hover {
          background: rgba(212,169,113,0.2);
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        /*────────────────────────────────────────────────────────────────────────────
           Generate Button
        ────────────────────────────────────────────────────────────────────────────*/
        .generate-button {
          display: block;
          width: 300px;
          margin: 2rem auto;
          padding: 1rem 2rem;
          background: var(--accent-color);
          color: var(--bg-color);
          border: none;
          border-radius: 25px;
          font-size: 1rem;
          font-weight: 400;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .generate-button:hover:not(:disabled) {
          background: #e6bb8a;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        }

        .generate-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /*────────────────────────────────────────────────────────────────────────────
           Navigation Arrows
        ────────────────────────────────────────────────────────────────────────────*/
        .nav-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(212,169,113,0.8);
          color: white;
          border: 2px solid var(--accent-color);
          border-radius: 50%;
          width: 3.5rem;
          height: 3.5rem;
          font-size: 1.4rem;
          cursor: pointer;
          transition: all 0.3s ease;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }

        .nav-arrow:hover {
          background: var(--accent-color);
          transform: translateY(-50%) scale(1.15);
          box-shadow: 0 6px 20px rgba(0,0,0,0.4);
        }

        .nav-arrow.prev {
          left: -1.5rem;
        }

        .nav-arrow.next {
          right: -1.5rem;
        }

        /* Era Gallery Below Historical Periods */
        .era-gallery-below-periods {
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid rgba(212,169,113,0.2);
          transition: all 0.3s ease;
        }

        .era-gallery {
          margin-top: 3rem;
          padding-top: 2rem;
          border-top: 1px solid rgba(212,169,113,0.3);
          transition: all 0.3s ease;
        }

        .era-gallery-title {
          font-size: 2rem;
          font-weight: 200;
          color: var(--accent-color);
          text-align: center;
          margin-bottom: 2rem;
          letter-spacing: 1px;
        }

        .era-tiles-container {
          position: relative;
          overflow: hidden;
        }

        .era-tiles {
          display: flex;
          gap: 1.5rem;
          overflow-x: auto;
          scroll-behavior: smooth;
          padding: 1rem 0;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .era-tiles::-webkit-scrollbar {
          display: none;
        }

        .era-tile {
          flex: 0 0 280px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(212,169,113,0.3);
          border-radius: 8px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .era-tile:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 16px rgba(0,0,0,0.3);
          border-color: var(--accent-color);
        }

        .era-tile-image {
          height: 120px;
          background: rgba(212,169,113,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--subtext-color);
          font-size: 0.9rem;
        }

        .era-tile-content {
          padding: 1rem;
        }

        .era-tile-year {
          font-size: 2rem;
          font-weight: 300;
          color: var(--accent-color);
          margin-bottom: 0.5rem;
        }

        .era-tile-title {
          font-size: 1.2rem;
          font-weight: 400;
          color: var(--text-color);
          margin-bottom: 0.75rem;
        }

        .era-tile-description {
          color: var(--subtext-color);
          font-size: 0.8rem;
        }

        .era-scroll-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(212,169,113,0.3);
          color: var(--accent-color);
          border: 1px solid rgba(212,169,113,0.5);
          border-radius: 50%;
          width: 3rem;
          height: 3rem;
          font-size: 1.2rem;
          cursor: pointer;
          transition: all 0.3s ease;
          z-index: 10;
        }

        .era-scroll-arrow:hover {
          background: rgba(212,169,113,0.5);
          transform: translateY(-50%) scale(1.1);
        }

        .era-scroll-arrow.left {
          left: -1.5rem;
        }

        .era-scroll-arrow.right {
          right: -1.5rem;
        }

        /*────────────────────────────────────────────────────────────────────────────
           Responsive Design
        ────────────────────────────────────────────────────────────────────────────*/
        @media (max-width: 768px) {
          .section-title {
            font-size: 2rem;
          }
          .content-title {
            font-size: 2rem;
          }
          .nav-arrow {
            display: none;
          }
          .timeline-nav {
            gap: 0.5rem;
            justify-content: center;
          }
          .era-badge {
            padding: 0.375rem 0.75rem !important;
            font-size: 0.75rem !important;
          }
          .era-tile {
            width: 300px !important;
          }
          .era-tile-content {
            padding: 1rem !important;
          }
          .era-tile-year {
            font-size: 1.5rem !important;
          }
          .era-scroll-arrow {
            width: 2.5rem !important;
            height: 2.5rem !important;
            font-size: 1rem !important;
          }
        }
      `}</style>

      <section className="history-section">
        <h2 className="section-title">Historical Periods</h2>
        
        <div className="timeline-nav">
          {historyData.map((periodData, index) => {
            const IconComponent = periodData.icon;
            return (
              <div
                key={periodData.period}
                className={`year ${index === currentIndex ? 'active' : ''}`}
                onClick={() => {
                  setCurrentIndex(index);
                  // Reset era gallery scroll position when period changes
                  setTimeout(() => {
                    const gallery = document.querySelector('.era-tiles') as HTMLElement;
                    if (gallery) gallery.scrollTo({ left: 0, behavior: 'smooth' });
                  }, 100);
                }}
              >
                <IconComponent size={16} />
                {periodData.period}
              </div>
            );
          })}
        </div>

        {/* Era Gallery Section - Below Historical Periods */}
        <div className="era-gallery-below-periods">
          <h3 className="era-gallery-title">Explore {currentPeriod.title} Eras</h3>
          <div className="era-tiles-container">
            <button 
              className="era-scroll-arrow left" 
              onClick={() => scrollEraGallery('left')}
            >
              ←
            </button>
            <button 
              className="era-scroll-arrow right" 
              onClick={() => scrollEraGallery('right')}
            >
              →
            </button>
            <div className="era-tiles">
              {currentPeriod.eraDetails.map((era, index) => (
                <div 
                  key={`${currentPeriod.period}-${era.name}`} 
                  className="era-tile"
                  onClick={() => {
                    // Generate tours specifically for this era
                    const filterData = {
                      selectedPeriods: [currentPeriod.title.toLowerCase().replace(/\s+/g, '_')],
                      selectedEras: [era.name],
                      selectedLocations: []
                    };
                    generateToursMutation.mutate(filterData);
                  }}
                >
                  <div className="era-tile-image">
                    Historical Image - {era.name}
                  </div>
                  <div className="era-tile-content">
                    <div className="era-tile-year">{era.year}</div>
                    <div className="era-tile-title">{era.title}</div>
                    <div className="era-tile-description">{era.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <button className="nav-arrow prev" onClick={prevPeriod}>
          ←
        </button>
        <button className="nav-arrow next" onClick={nextPeriod}>
          →
        </button>

        <div className="content-section">
          <h1 className="content-title">{currentPeriod.title}</h1>
          <p className="content-subtitle">
            Discover the fascinating world of {currentPeriod.title.toLowerCase()}
          </p>

          <div className="thumb-gallery">
            <div className="thumb-placeholder">Image</div>
            <div className="thumb-placeholder">Image</div>
            <div className="thumb-placeholder">Image</div>
            <div className="thumb-placeholder">Image</div>
          </div>

          <div className="era-selector">
            {currentPeriod.eras.map((era) => (
              <div
                key={era}
                className="era-badge"
                onClick={handleGenerateTours}
              >
                {era}
              </div>
            ))}
          </div>

          <button
            className="generate-button"
            onClick={handleGenerateTours}
            disabled={generateToursMutation.isPending}
          >
            {generateToursMutation.isPending ? (
              'Generating Tours...'
            ) : (
              `Generate Tours for ${currentPeriod.title}`
            )}
          </button>
        </div>

        {/* Generated Tours Section */}
        {showGeneratedTours && generatedTours.length > 0 && (
          <div style={{ 
            marginTop: '3rem',
            padding: '2rem',
            background: 'rgba(255,255,255,0.02)',
            borderRadius: '4px',
            border: '1px solid rgba(212,169,113,0.2)'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginBottom: '2rem' 
            }}>
              <h2 style={{ 
                fontSize: '2rem', 
                fontWeight: 'normal', 
                color: 'var(--accent-color)',
                margin: 0
              }}>
                Generated Tours
              </h2>
              <Button
                variant="outline"
                onClick={() => setShowGeneratedTours(false)}
                style={{ 
                  background: 'transparent', 
                  border: '1px solid var(--accent-color)', 
                  color: 'var(--accent-color)' 
                }}
              >
                <XIcon className="w-4 h-4 mr-2" />
                Hide Tours
              </Button>
            </div>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: '2rem' 
            }}>
              {generatedTours.map((tour, index) => {
                const currentItinerary = getCurrentItinerary(tour);
                const currentDuration = getCurrentDuration(tour);
                
                return (
                  <Card 
                    key={tour.id || index} 
                    style={{ 
                      background: 'rgba(255,255,255,0.05)', 
                      border: '1px solid rgba(212,169,113,0.3)',
                      borderRadius: '4px'
                    }}
                  >
                    <CardHeader style={{ background: 'var(--accent-color)', color: 'var(--bg-color)' }}>
                      <CardTitle style={{ fontSize: '1.2rem', fontWeight: 'normal' }}>
                        {tour.title}
                      </CardTitle>
                      <CardDescription style={{ color: 'rgba(18,18,18,0.8)' }}>
                        {tour.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent style={{ padding: '1.5rem' }}>
                      {/* Duration Selector */}
                      {tour.durationOptions && tour.durationOptions.length > 0 && (
                        <div style={{ marginBottom: '1.5rem' }}>
                          <label style={{ 
                            fontSize: '0.9rem', 
                            color: 'var(--subtext-color)', 
                            marginBottom: '0.5rem', 
                            display: 'block' 
                          }}>
                            Select Duration
                          </label>
                          <Select 
                            value={currentDuration} 
                            onValueChange={(value) => handleDurationChange(tour.id, value)}
                          >
                            <SelectTrigger style={{ 
                              background: 'rgba(255,255,255,0.1)', 
                              border: '1px solid rgba(212,169,113,0.3)', 
                              color: 'var(--text-color)' 
                            }}>
                              <SelectValue placeholder="Select duration" />
                            </SelectTrigger>
                            <SelectContent style={{ 
                              background: 'var(--bg-color)', 
                              border: '1px solid rgba(212,169,113,0.3)' 
                            }}>
                              {tour.durationOptions.map((option: any) => (
                                <SelectItem 
                                  key={option.duration} 
                                  value={option.duration} 
                                  style={{ color: 'var(--text-color)' }}
                                >
                                  {option.duration} - {option.description}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      {/* Itinerary Preview */}
                      {currentItinerary && currentItinerary.length > 0 && (
                        <div style={{ marginBottom: '1.5rem' }}>
                          <h4 style={{ 
                            fontSize: '1rem', 
                            fontWeight: 'normal', 
                            color: 'var(--accent-color)', 
                            marginBottom: '1rem' 
                          }}>
                            Sample Itinerary ({currentDuration})
                          </h4>
                          {currentItinerary.slice(0, 2).map((day: any, dayIndex: number) => (
                            <div key={dayIndex} style={{ 
                              padding: '0.75rem', 
                              background: 'rgba(255,255,255,0.03)', 
                              borderRadius: '4px', 
                              marginBottom: '0.75rem',
                              border: '1px solid rgba(212,169,113,0.1)'
                            }}>
                              <div style={{ 
                                fontWeight: 'bold', 
                                color: 'var(--accent-color)', 
                                fontSize: '0.9rem' 
                              }}>
                                Day {day.day}: {day.title}
                              </div>
                              <div style={{ 
                                fontSize: '0.8rem', 
                                color: 'var(--subtext-color)', 
                                marginTop: '0.25rem' 
                              }}>
                                {day.description}
                              </div>
                            </div>
                          ))}
                          {currentItinerary.length > 2 && (
                            <div style={{ fontSize: '0.8rem', color: 'var(--subtext-color)' }}>
                              ... and {currentItinerary.length - 2} more days
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div style={{ 
                        paddingTop: '1rem', 
                        borderTop: '1px solid rgba(212,169,113,0.3)' 
                      }}>
                        <Link href={tour.id ? `/tours/${tour.id}?duration=${encodeURIComponent(currentDuration)}` : '#'}>
                          <Button style={{ 
                            width: '100%', 
                            background: 'var(--accent-color)', 
                            color: 'var(--bg-color)', 
                            fontWeight: 'normal' 
                          }}>
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
      </section>
    </div>
  );
}