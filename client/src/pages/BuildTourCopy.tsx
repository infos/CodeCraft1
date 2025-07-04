import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Loader2, Sparkles, XIcon } from 'lucide-react';
import { Link } from 'wouter';

export default function BuildTourCopy() {
  const [currentIndex, setCurrentIndex] = useState(1); // Start with Classical
  const [showGeneratedTours, setShowGeneratedTours] = useState(false);
  const [generatedTours, setGeneratedTours] = useState<any[]>([]);
  const [selectedDurations, setSelectedDurations] = useState<Record<string, string>>({});

  const queryClient = useQueryClient();

  // Historical periods data matching the provided structure
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
      ],
      eraDetails: [
        {
          name: 'Ancient Near Eastern',
          year: '3500 BCE',
          title: 'Mesopotamian Civilizations',
          description: 'Discover the cradle of civilization where writing, cities, and complex societies first emerged in the fertile lands between the Tigris and Euphrates rivers.'
        },
        {
          name: 'Ancient Egypt',
          year: '3100 BCE',
          title: 'Pharaonic Egypt',
          description: 'Experience the grandeur of ancient Egypt with its magnificent pyramids, temples, and the mysteries of pharaohs along the life-giving Nile River.'
        },
        {
          name: 'Middle Kingdom of Egypt',
          year: '2055 BCE',
          title: 'Egypt\'s Classical Age',
          description: 'Explore Egypt\'s golden age of literature, art, and architecture when the kingdom reunited and flourished under strong pharaonic rule.'
        },
        {
          name: 'New Kingdom of Egypt',
          year: '1550 BCE',
          title: 'Empire of the Pharaohs',
          description: 'Witness Egypt at its imperial peak with famous pharaohs like Tutankhamun, Ramesses II, and the magnificent temples of Luxor and Abu Simbel.'
        }
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
      ],
      eraDetails: [
        {
          name: 'Ancient Greece',
          year: '800 BCE',
          title: 'Birthplace of Democracy',
          description: 'Explore the origins of Western civilization through Athens, Sparta, and the philosophical foundations that shaped our modern world.'
        },
        {
          name: 'Ancient Rome',
          year: '753 BCE',
          title: 'The Eternal City',
          description: 'Walk through the empire that dominated the Mediterranean for centuries, from the Roman Forum to the Colosseum and Pantheon.'
        },
        {
          name: 'Hellenistic Period',
          year: '323 BCE',
          title: 'Alexander\'s Legacy',
          description: 'Discover the cultural fusion that followed Alexander the Great\'s conquests, blending Greek, Persian, and Egyptian civilizations.'
        },
        {
          name: 'Ancient India (Mauryan and Gupta Periods)',
          year: '321 BCE',
          title: 'Golden Age of India',
          description: 'Experience the flourishing of Buddhism, art, and science during India\'s most prosperous ancient periods.'
        }
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
      ],
      eraDetails: [
        {
          name: 'Byzantine',
          year: '330 CE',
          title: 'Eastern Roman Empire',
          description: 'Explore the magnificent continuation of Roman civilization in Constantinople, with stunning mosaics, architecture, and Orthodox Christianity.'
        },
        {
          name: 'Medieval Europe',
          year: '476 CE',
          title: 'Age of Knights and Castles',
          description: 'Journey through feudal Europe with its magnificent cathedrals, fortified castles, and the rise of medieval towns and universities.'
        },
        {
          name: 'Sasanian Empire',
          year: '224 CE',
          title: 'Persian Renaissance',
          description: 'Discover the last great Persian empire before Islam, known for its art, architecture, and cultural achievements in ancient Iran.'
        },
        {
          name: 'Silk Road Trade Era',
          year: '130 BCE',
          title: 'Bridge Between Worlds',
          description: 'Follow the ancient trade routes that connected East and West, facilitating cultural exchange and commerce across continents.'
        }
      ]
    },
    {
      period: "Renaissance",
      title: "Renaissance",
      description: "The Renaissance brought revolutionary changes in art, science, and culture. Witness the rebirth of classical learning and artistic achievement that transformed European civilization.",
      eras: [
        'Renaissance'
      ],
      eraDetails: [
        {
          name: 'Renaissance',
          year: '1400 CE',
          title: 'Rebirth of Classical Learning',
          description: 'Experience the cultural revolution that transformed Europe through art, science, and humanism in Florence, Rome, and beyond.'
        }
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
      ],
      eraDetails: [
        {
          name: 'Age of Exploration',
          year: '1400 CE',
          title: 'Discovery of New Worlds',
          description: 'Join the great voyages of discovery that connected continents and changed world history through maritime exploration.'
        },
        {
          name: 'Enlightenment',
          year: '1685 CE',
          title: 'Age of Reason',
          description: 'Explore the intellectual revolution that emphasized reason, science, and individual rights, shaping modern democratic societies.'
        },
        {
          name: 'Georgian Era',
          year: '1714 CE',
          title: 'British Golden Age',
          description: 'Discover the elegant architecture, literature, and social changes of Georgian Britain during its rise as a global power.'
        }
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

  const scrollEraGallery = (direction: 'left' | 'right') => {
    const gallery = document.querySelector('.era-tiles') as HTMLElement;
    if (gallery) {
      const scrollAmount = 420; // Width of tile plus gap
      const newScrollLeft = direction === 'left' 
        ? gallery.scrollLeft - scrollAmount 
        : gallery.scrollLeft + scrollAmount;
      gallery.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
    }
  };

  const currentPeriod = historyData[currentIndex];

  return (
    <div>
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
          --heading-font-size: 2.5rem;
          --year-font-size: 1.2rem;
          --text-font-size: 1rem;
          --spacing: 1.5rem;
        }

        /*────────────────────────────────────────────────────────────────────────────
           Global
        ────────────────────────────────────────────────────────────────────────────*/
        body {
          margin: 0;
          padding: 0;
          background: var(--bg-color);
          color: var(--text-color);
          font-family: var(--font-sans);
        }
        img {
          max-width: 100%;
          display: block;
        }

        /*────────────────────────────────────────────────────────────────────────────
           Section Wrapper
        ────────────────────────────────────────────────────────────────────────────*/
        .history-section {
          padding: var(--spacing) 2rem;
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          background: var(--bg-color);
          min-height: 100vh;
        }

        /*────────────────────────────────────────────────────────────────────────────
           Title
        ────────────────────────────────────────────────────────────────────────────*/
        .history-section .section-title {
          text-align: center;
          font-size: var(--heading-font-size);
          text-transform: uppercase;
          letter-spacing: 2px;
          margin-bottom: var(--spacing);
          color: var(--accent-color);
          font-weight: normal;
        }

        /*────────────────────────────────────────────────────────────────────────────
           Timeline Nav - Badge Style
        ────────────────────────────────────────────────────────────────────────────*/
        .history-section .timeline-nav {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 1rem;
          margin-bottom: var(--spacing);
          flex-wrap: wrap;
        }

        .history-section .timeline-nav .year {
          display: inline-flex;
          align-items: center;
          border-radius: 9999px;
          border: 1px solid rgba(212,169,113,0.5);
          background: transparent;
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          color: var(--text-color);
        }

        .history-section .timeline-nav .year:hover {
          background: rgba(255,255,255,0.1);
          border-color: var(--accent-color);
        }

        .history-section .timeline-nav .year.active {
          background: var(--accent-color);
          color: var(--bg-color);
          border-color: var(--accent-color);
        }

        /*────────────────────────────────────────────────────────────────────────────
           Controls (Prev/Next)
        ────────────────────────────────────────────────────────────────────────────*/
        .history-section .nav-arrow {
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

        .history-section .nav-arrow:hover {
          background: rgba(255,255,255,0.2);
        }

        .history-section .nav-arrow.prev {
          left: 1rem;
        }

        .history-section .nav-arrow.next {
          right: 1rem;
        }

        /*────────────────────────────────────────────────────────────────────────────
           Content Area
        ────────────────────────────────────────────────────────────────────────────*/
        .history-section .content-wrapper {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--spacing);
          align-items: start;
          margin-top: var(--spacing);
        }

        /* Main Image */
        .history-section .main-image {
          position: relative;
          overflow: hidden;
          border-radius: 4px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.5);
          background: rgba(255,255,255,0.05);
          aspect-ratio: 4/3;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--subtext-color);
        }

        /* Text & Small Gallery */
        .history-section .text-gallery {
          display: flex;
          flex-direction: column;
          gap: var(--spacing);
        }

        .history-section .text-gallery .year-heading {
          font-size: var(--year-font-size);
          font-weight: bold;
          margin: 0;
          color: var(--accent-color);
        }

        .history-section .text-gallery .description {
          font-size: var(--text-font-size);
          line-height: 1.6;
          color: var(--subtext-color);
        }

        /* Small gallery grid */
        .history-section .text-gallery .thumbs {
          display: flex;
          gap: 0.5rem;
        }

        .history-section .text-gallery .thumbs .thumb-placeholder {
          flex: 1;
          border-radius: 4px;
          height: 100px;
          background: rgba(255,255,255,0.05);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--subtext-color);
          font-size: 0.8rem;
        }

        /* Era Tile Gallery - Top Section */
        .era-gallery-top {
          margin-bottom: 3rem;
          padding-bottom: 2rem;
          border-bottom: 1px solid rgba(212,169,113,0.3);
          transition: all 0.3s ease;
        }

        .era-gallery {
          margin-top: 3rem;
          padding-top: 2rem;
          border-top: 1px solid rgba(212,169,113,0.3);
          transition: all 0.3s ease;
        }

        .era-gallery-title {
          font-size: 1.5rem;
          font-weight: normal;
          color: var(--accent-color);
          margin-bottom: 1.5rem;
          text-align: center;
        }

        .era-tiles-container {
          position: relative;
          overflow: hidden;
        }

        .era-tiles {
          display: flex;
          gap: 2rem;
          overflow-x: auto;
          padding: 1rem 0;
          scroll-behavior: smooth;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .era-tiles::-webkit-scrollbar {
          display: none;
        }

        .era-tile {
          flex: 0 0 auto;
          width: 400px;
          background: rgba(255,255,255,0.02);
          border-radius: 8px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.3s ease;
          border: 1px solid rgba(212,169,113,0.2);
        }

        .era-tile:hover {
          transform: translateY(-5px);
          border-color: var(--accent-color);
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }

        .era-tile-image {
          width: 100%;
          height: 200px;
          background: rgba(255,255,255,0.05);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--subtext-color);
          font-size: 0.9rem;
          position: relative;
          overflow: hidden;
        }

        .era-tile-content {
          padding: 1.5rem;
        }

        .era-tile-year {
          font-size: 2rem;
          font-weight: bold;
          color: var(--accent-color);
          margin-bottom: 1rem;
        }

        .era-tile-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text-color);
          margin-bottom: 0.5rem;
        }

        .era-tile-description {
          font-size: 0.9rem;
          color: var(--subtext-color);
          line-height: 1.5;
        }

        .era-scroll-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 3rem;
          height: 3rem;
          background: rgba(212,169,113,0.8);
          border: none;
          border-radius: 50%;
          color: var(--bg-color);
          font-size: 1.2rem;
          cursor: pointer;
          transition: all 0.2s ease;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .era-scroll-arrow:hover {
          background: var(--accent-color);
          transform: translateY(-50%) scale(1.1);
        }

        .era-scroll-arrow.left {
          left: 1rem;
        }

        .era-scroll-arrow.right {
          right: 1rem;
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
          border-radius: 4px;
        }

        .generate-button:hover {
          background: #c19958;
        }

        .generate-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /*────────────────────────────────────────────────────────────────────────────
           Responsive
        ────────────────────────────────────────────────────────────────────────────*/
        @media (max-width: 900px) {
          .history-section .content-wrapper {
            grid-template-columns: 1fr;
          }
          .history-section .text-gallery {
            order: 2;
          }
          .history-section .main-image {
            order: 1;
          }
          .history-section .nav-arrow {
            display: none;
          }
          .history-section .timeline-nav {
            gap: 0.75rem;
            justify-content: center;
          }
          .history-section .timeline-nav .year {
            padding: 0.375rem 0.75rem;
            font-size: 0.75rem;
          }
          .era-selector {
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

      {/* Era Gallery Section - Moved to Top */}
      <section className="era-gallery-top">
        <h2 className="section-title">Explore {currentPeriod.title} Eras</h2>
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
      </section>

      <section className="history-section">
        <h2 className="section-title">Historical Periods</h2>
        
        <div className="timeline-nav">
          {historyData.map((periodData, index) => (
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
              {periodData.period}
            </div>
          ))}
        </div>
        
        <button className="nav-arrow prev" onClick={prevPeriod}>
          ←
        </button>
        <button className="nav-arrow next" onClick={nextPeriod}>
          →
        </button>
        
        <div className="content-wrapper">
          <div className="main-image">
            Historical Image Placeholder
          </div>
          
          <div className="text-gallery">
            <h3 className="year-heading">{currentPeriod.title}</h3>
            <p className="description">
              {currentPeriod.description}
            </p>
            
            <div className="thumbs">
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
        </div>



        {/* Generated Tours Section */}
        {showGeneratedTours && generatedTours.length > 0 && (
          <div style={{ 
            marginTop: '3rem', 
            paddingTop: '2rem', 
            borderTop: '1px solid rgba(212,169,113,0.3)' 
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
                                  {option.duration}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      {currentItinerary && currentItinerary.length > 0 && (
                        <div style={{ marginBottom: '1.5rem' }}>
                          <h4 style={{ 
                            fontSize: '0.9rem', 
                            color: 'var(--accent-color)', 
                            marginBottom: '1rem', 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '0.5rem' 
                          }}>
                            <Calendar className="w-4 h-4" />
                            HIGHLIGHTS
                          </h4>
                          {currentItinerary.slice(0, 2).map((day: any, dayIndex: number) => (
                            <div 
                              key={dayIndex} 
                              style={{ 
                                borderLeft: '2px solid var(--accent-color)', 
                                paddingLeft: '1rem', 
                                marginBottom: '1rem' 
                              }}
                            >
                              <div style={{ 
                                fontWeight: '500', 
                                fontSize: '0.9rem', 
                                color: 'var(--text-color)' 
                              }}>
                                Day {day.day}: {day.title}
                              </div>
                              {day.sites && day.sites.length > 0 && (
                                <div style={{ 
                                  marginTop: '0.25rem', 
                                  fontSize: '0.8rem', 
                                  color: 'var(--subtext-color)' 
                                }}>
                                  {day.sites.map((site: any, siteIndex: number) => (
                                    <div key={siteIndex}>• {site.name}</div>
                                  ))}
                                </div>
                              )}
                              {day.hotel && (
                                <div style={{ 
                                  marginTop: '0.25rem', 
                                  fontSize: '0.8rem', 
                                  color: 'var(--accent-color)' 
                                }}>
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