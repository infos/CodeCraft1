import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Loader2, Sparkles, XIcon } from 'lucide-react';
import { Link } from 'wouter';

export default function BuildTourCopy() {
  const [currentIndex, setCurrentIndex] = useState(1); // Start with 1911 (index 1)
  const [showGeneratedTours, setShowGeneratedTours] = useState(false);
  const [generatedTours, setGeneratedTours] = useState<any[]>([]);
  const [selectedDurations, setSelectedDurations] = useState<Record<string, string>>({});

  const queryClient = useQueryClient();

  // Historical periods data matching the provided HTML structure
  const historyData = [
    {
      period: "Ancient",
      title: "Ancient Civilizations",
      description: "Explore the rich heritage and cultural treasures of ancient civilizations. Discover archaeological marvels, historical sites that shaped our world through Mesopotamian, Egyptian, and early Mediterranean cultures.",
      eras: [
        'Ancient Near Eastern',
        'Ancient Egypt',
        'Middle Kingdom of Egypt',
        'New Kingdom of Egypt',
      ]
    },
    {
      period: "Classical", 
      title: "Classical Antiquity",
      description: "Experience the grandeur of classical antiquity through Greece and Rome's greatest achievements. Witness the birth of democracy, philosophy, and architectural marvels that influence us today.",
      eras: [
        'Ancient Greece',
        'Ancient Rome', 
        'Hellenistic Period',
        'Ancient India (Mauryan and Gupta Periods)',
      ]
    },
    {
      period: "Medieval",
      title: "Medieval Period", 
      description: "Journey through the medieval world of castles, cathedrals, and cultural exchange across continents. Discover the rich traditions of Byzantine, European, and Silk Road civilizations.",
      eras: [
        'Byzantine',
        'Medieval Europe',
        'Sasanian Empire',
        'Silk Road Trade Era'
      ]
    },
    {
      period: "Renaissance",
      title: "Renaissance",
      description: "The Renaissance brought revolutionary changes in art, science, and culture. Witness the rebirth of classical learning and artistic achievement that transformed European civilization.",
      eras: [
        'Renaissance'
      ]
    },
    {
      period: "Modern",
      title: "Modern Era",
      description: "The modern era ushered in new technologies, exploration, and enlightenment thinking that continues to influence our world today through scientific revolution and global exploration.",
      eras: [
        'Age of Exploration',
        'Enlightenment', 
        'Georgian Era'
      ]
    }
  ];

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
      
      // Store in session storage
      sessionStorage.setItem('generatedTours-copy', JSON.stringify(tours));
    },
    onError: (error: any) => {
      alert(`Tour generation failed: ${error.message}`);
    },
  });

  // Load tours from session storage on mount
  useEffect(() => {
    const stored = sessionStorage.getItem('generatedTours-copy');
    if (stored) {
      const tours = JSON.parse(stored);
      setGeneratedTours(tours);
      setShowGeneratedTours(true);
    }
  }, []);

  const handleGenerateTours = () => {
    const currentPeriod = historyData[currentIndex];
    const filterData = {
      selectedPeriods: [currentPeriod.title.toLowerCase().replace(/\s+/g, '_')],
      selectedEras: currentPeriod.eras,
      selectedLocations: []
    };
    
    generateToursMutation.mutate(filterData);
  };

  const handleDurationChange = (tourId: string, duration: string) => {
    setSelectedDurations(prev => ({
      ...prev,
      [tourId]: duration
    }));
  };

  const getCurrentItinerary = (tour: any) => {
    if (!tour.durationOptions) return tour.itinerary || [];
    
    const currentDuration = selectedDurations[tour.id] || tour.defaultDuration || tour.duration;
    const option = tour.durationOptions.find((opt: any) => opt.duration === currentDuration);
    return option ? option.itinerary : [];
  };

  const getCurrentDuration = (tour: any) => {
    return selectedDurations[tour.id] || tour.defaultDuration || tour.duration;
  };

  const prevPeriod = () => {
    setCurrentIndex((prev) => (prev - 1 + historyData.length) % historyData.length);
  };

  const nextPeriod = () => {
    setCurrentIndex((prev) => (prev + 1) % historyData.length);
  };

  const currentPeriod = historyData[currentIndex];

  return (
    <div style={{
      '--bg-color': '#121212',
      '--accent-color': '#d4a971', 
      '--text-color': '#ffffff',
      '--subtext-color': '#cccccc',
      '--font-sans': '"Helvetica Neue", Helvetica, Arial, sans-serif',
      '--nav-font-size': '0.9rem',
      '--heading-font-size': '2.5rem', 
      '--year-font-size': '1.2rem',
      '--text-font-size': '1rem',
      '--spacing': '1.5rem'
    } as React.CSSProperties}>
      <style>{`
        .history-section {
          padding: var(--spacing) 2rem;
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          background: var(--bg-color);
          color: var(--text-color);
          font-family: var(--font-sans);
          min-height: 100vh;
        }

        .section-title {
          text-align: center;
          font-size: var(--heading-font-size);
          text-transform: uppercase;
          letter-spacing: 2px;
          margin-bottom: var(--spacing);
          color: var(--accent-color);
          font-weight: normal;
        }

        .timeline-nav {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 2rem;
          margin-bottom: var(--spacing);
          color: var(--subtext-color);
          font-size: var(--nav-font-size);
        }

        .timeline-nav .year {
          position: relative;
          cursor: pointer;
          padding: 0.5rem;
          transition: color 0.2s;
        }

        .timeline-nav .year:hover {
          color: var(--text-color);
        }

        .timeline-nav .year.active {
          color: var(--text-color);
          font-weight: bold;
        }

        .timeline-nav .year.active::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 1.5rem;
          height: 1.5rem;
          border: 2px solid var(--accent-color);
          border-radius: 50%;
          transform: translate(-50%, -50%);
        }

        .nav-arrow {
          position: absolute;
          top: 50%;
          width: 2rem;
          height: 2rem;
          background: rgba(255,255,255,0.1);
          border: none;
          color: var(--accent-color);
          font-size: 1.5rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transform: translateY(-50%);
          transition: background 0.2s;
        }

        .nav-arrow:hover {
          background: rgba(255,255,255,0.2);
        }

        .nav-arrow.prev { left: 1rem; }
        .nav-arrow.next { right: 1rem; }

        .content-wrapper {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--spacing);
          align-items: start;
          margin-top: var(--spacing);
          max-width: 800px;
          margin-left: auto;
          margin-right: auto;
        }

        .text-gallery {
          display: flex;
          flex-direction: column;
          gap: var(--spacing);
        }

        .year-heading {
          font-size: var(--year-font-size);
          font-weight: bold;
          margin: 0;
          color: var(--accent-color);
        }

        .description {
          font-size: var(--text-font-size);
          line-height: 1.6;
          color: var(--subtext-color);
        }

        .era-grid {
          display: grid;
          gap: 1rem;
          margin-top: 1.5rem;
        }

        .era-card {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(212,169,113,0.3);
          padding: 1rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .era-card:hover {
          background: rgba(212,169,113,0.1);
          border-color: var(--accent-color);
        }

        .era-title {
          font-weight: 600;
          color: var(--text-color);
          margin-bottom: 0.5rem;
        }

        .era-description {
          font-size: 0.9rem;
          color: var(--subtext-color);
        }

        .generate-button {
          background: var(--accent-color);
          color: var(--bg-color);
          border: none;
          padding: 1rem 2rem;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          margin-top: 1.5rem;
          width: 100%;
        }

        .generate-button:hover {
          background: #c19958;
        }

        .generate-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        @media (max-width: 900px) {
          .nav-arrow { display: none; }
          .timeline-nav { gap: 1rem; }
          .timeline-nav .year { padding: 0.25rem; }
        }
      `}</style>

      <section className="history-section">
        <h2 className="section-title">Notre histoire</h2>

        <div className="timeline-nav">
          {historyData.map((periodData, index) => (
            <div
              key={periodData.period}
              className={`year ${index === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(index)}
            >
              {periodData.period}
            </div>
          ))}
        </div>

        <button className="nav-arrow prev" onClick={prevPeriod} aria-label="Précédent">
          ←
        </button>
        <button className="nav-arrow next" onClick={nextPeriod} aria-label="Suivant">
          →
        </button>

        <div className="content-wrapper">
          <div className="text-gallery">
            <h3 className="year-heading">{currentPeriod.title}</h3>
            <p className="description">{currentPeriod.description}</p>
            
            <div className="era-grid">
              {currentPeriod.eras.map((era, index) => (
                <div
                  key={era}
                  className="era-card"
                  onClick={handleGenerateTours}
                >
                  <div className="era-title">{era}</div>
                  <div className="era-description">
                    Discover tours and experiences from this fascinating historical period.
                  </div>
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
        </div>

        {/* Generated Tours Section */}
        {showGeneratedTours && generatedTours.length > 0 && (
          <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid rgba(212,169,113,0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '2rem', fontWeight: 'normal', color: 'var(--accent-color)' }}>Generated Tours</h2>
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
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              {generatedTours.map((tour, index) => {
                const currentItinerary = getCurrentItinerary(tour);
                const currentDuration = getCurrentDuration(tour);
                
                return (
                  <Card key={tour.id || index} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,169,113,0.3)' }}>
                    <CardHeader style={{ background: 'var(--accent-color)', color: 'var(--bg-color)' }}>
                      <CardTitle style={{ fontSize: '1.2rem', fontWeight: 'normal' }}>{tour.title}</CardTitle>
                      <CardDescription style={{ color: 'rgba(18,18,18,0.8)' }}>
                        {tour.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent style={{ padding: '1.5rem' }}>
                      {/* Duration Selector */}
                      {tour.durationOptions && tour.durationOptions.length > 0 && (
                        <div style={{ marginBottom: '1.5rem' }}>
                          <label style={{ fontSize: '0.9rem', color: 'var(--subtext-color)', marginBottom: '0.5rem', display: 'block' }}>
                            Select Duration
                          </label>
                          <Select 
                            value={currentDuration} 
                            onValueChange={(value) => handleDurationChange(tour.id, value)}
                          >
                            <SelectTrigger style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(212,169,113,0.3)', color: 'var(--text-color)' }}>
                              <SelectValue placeholder="Select duration" />
                            </SelectTrigger>
                            <SelectContent style={{ background: 'var(--bg-color)', border: '1px solid rgba(212,169,113,0.3)' }}>
                              {tour.durationOptions.map((option: any) => (
                                <SelectItem key={option.duration} value={option.duration} style={{ color: 'var(--text-color)' }}>
                                  {option.duration}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      {currentItinerary && currentItinerary.length > 0 && (
                        <div style={{ marginBottom: '1.5rem' }}>
                          <h4 style={{ fontSize: '0.9rem', color: 'var(--accent-color)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Calendar className="w-4 h-4" />
                            HIGHLIGHTS
                          </h4>
                          {currentItinerary.slice(0, 2).map((day: any, dayIndex: number) => (
                            <div key={dayIndex} style={{ borderLeft: '2px solid var(--accent-color)', paddingLeft: '1rem', marginBottom: '1rem' }}>
                              <div style={{ fontWeight: '500', fontSize: '0.9rem', color: 'var(--text-color)' }}>
                                Day {day.day}: {day.title}
                              </div>
                              {day.sites && day.sites.length > 0 && (
                                <div style={{ marginTop: '0.25rem', fontSize: '0.8rem', color: 'var(--subtext-color)' }}>
                                  {day.sites.map((site: any, siteIndex: number) => (
                                    <div key={siteIndex}>• {site.name}</div>
                                  ))}
                                </div>
                              )}
                              {day.hotel && (
                                <div style={{ marginTop: '0.25rem', fontSize: '0.8rem', color: 'var(--accent-color)' }}>
                                  🏨 {day.hotel.name}
                                </div>
                              )}
                            </div>
                          ))}
                          {currentItinerary.length > 2 && (
                            <div style={{ fontSize: '0.8rem', color: 'var(--subtext-color)' }}>
                              ... and {currentItinerary.length - 2} more days
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div style={{ paddingTop: '1rem', borderTop: '1px solid rgba(212,169,113,0.3)' }}>
                        <Link href={tour.id ? `/tours/${tour.id}?duration=${encodeURIComponent(currentDuration)}` : '#'}>
                          <Button style={{ width: '100%', background: 'var(--accent-color)', color: 'var(--bg-color)', fontWeight: 'normal' }}>
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