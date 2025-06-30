import React, { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';

interface Era {
  id: number;
  name: string;
  keyFigures: string;
  startYear?: number;
  endYear?: number;
}

interface EraTimelineProps {
  onEraSelect?: (era: string | null) => void;
  selectedEra?: string | null;
}

export default function EraTimeline({ onEraSelect, selectedEra }: EraTimelineProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const datesRef = useRef<HTMLUListElement>(null);
  const issuesRef = useRef<HTMLUListElement>(null);
  
  const { data: eras } = useQuery({
    queryKey: ['/api/eras'],
    select: (data) => data as Era[]
  });

  // Sort eras chronologically with approximate years
  const eraYears = {
    'Ancient Near Eastern': '3500-539 BCE',
    'Ancient Egyptian': '3100-30 BCE', 
    'Classical Antiquity': '800-600 CE',
    'Hellenistic': '323-146 BCE',
    'Roman Republic': '509-27 BCE',
    'Roman Empire': '27 BCE-476 CE',
    'Byzantine': '330-1453 CE',
    'Medieval': '476-1453 CE',
    'Renaissance': '1400-1600 CE',
    'Early Modern': '1450-1800 CE',
    'Enlightenment': '1685-1815 CE'
  };

  const sortedEras = eras?.sort((a, b) => {
    const eraOrder = {
      'Ancient Near Eastern': 1,
      'Ancient Egyptian': 2,
      'Classical Antiquity': 3,
      'Hellenistic': 4,
      'Roman Republic': 5,
      'Roman Empire': 6,
      'Byzantine': 7,
      'Medieval': 8,
      'Renaissance': 9,
      'Early Modern': 10,
      'Enlightenment': 11
    };
    
    return (eraOrder[a.name as keyof typeof eraOrder] || 999) - 
           (eraOrder[b.name as keyof typeof eraOrder] || 999);
  }) || [];

  // Animation logic based on jQuery timeline
  const animateToIndex = (index: number) => {
    if (!datesRef.current || !issuesRef.current || !sortedEras[index]) return;
    
    const widthDate = 100; // Fixed width per date item
    const widthIssue = 800; // Full width per issue
    const containerWidth = 800;
    const defaultPositionDates = containerWidth / 2 - widthDate / 2;
    
    // Animate dates position
    const newDatePosition = defaultPositionDates - (widthDate * index);
    datesRef.current.style.marginLeft = `${newDatePosition}px`;
    datesRef.current.style.transition = 'margin-left 0.5s ease';
    
    // Animate issues position
    const newIssuePosition = -(widthIssue * index);
    issuesRef.current.style.marginLeft = `${newIssuePosition}px`;
    issuesRef.current.style.transition = 'margin-left 0.5s ease';
    
    setCurrentIndex(index);
  };

  const selectEra = (index: number, eraName: string) => {
    animateToIndex(index);
    onEraSelect?.(eraName);
  };

  const nextEra = () => {
    if (currentIndex < sortedEras.length - 1) {
      animateToIndex(currentIndex + 1);
    }
  };

  const prevEra = () => {
    if (currentIndex > 0) {
      animateToIndex(currentIndex - 1);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.keyCode === 39) { // Right arrow
        nextEra();
      }
      if (event.keyCode === 37) { // Left arrow
        prevEra();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, sortedEras.length]);

  if (!sortedEras || sortedEras.length === 0) {
    return null;
  }

  const timelineStyles = {
    container: {
      background: '#222',
      fontFamily: 'Georgia, serif',
      color: '#fff',
      fontSize: '14px',
      position: 'relative' as const,
      backgroundImage: `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='4' height='4'><circle cx='2' cy='2' r='1' fill='%23666'/></svg>")`,
      backgroundRepeat: 'repeat-x',
      backgroundPosition: 'left 45px'
    },
    datesList: {
      width: '800px',
      height: '60px',
      overflow: 'hidden' as const,
      marginLeft: '350px',
      listStyle: 'none',
      padding: 0,
      margin: '0 0 0 350px'
    },
    dateItem: {
      listStyle: 'none',
      float: 'left' as const,
      width: '100px',
      height: '50px',
      fontSize: '24px',
      textAlign: 'center' as const,
      backgroundImage: `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12'><circle cx='6' cy='6' r='4' fill='%23ffcc00'/></svg>")`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center bottom'
    },
    issuesList: {
      width: `${800 * sortedEras.length}px`,
      height: '350px',
      overflow: 'hidden' as const,
      listStyle: 'none',
      padding: 0,
      margin: 0
    },
    issueItem: {
      width: '800px',
      height: '350px',
      listStyle: 'none',
      float: 'left' as const,
      opacity: 0.2,
      transition: 'opacity 0.5s ease'
    },
    issueItemSelected: {
      opacity: 1
    },
    gradLeft: {
      width: '100px',
      height: '350px',
      position: 'absolute' as const,
      top: 0,
      left: 0,
      background: 'linear-gradient(to right, rgba(34, 34, 34, 1), rgba(34, 34, 34, 0))'
    },
    gradRight: {
      width: '100px',
      height: '350px',
      position: 'absolute' as const,
      top: 0,
      right: 0,
      background: 'linear-gradient(to left, rgba(34, 34, 34, 1), rgba(34, 34, 34, 0))'
    }
  };

  return (
    <div className="w-full mx-auto my-24 relative overflow-hidden" style={{ width: '800px', height: '350px' }}>
      <div style={timelineStyles.container}>
        {/* Dates */}
        <ul ref={datesRef} style={timelineStyles.datesList}>
          {sortedEras.map((era, index) => (
            <li key={era.id} style={timelineStyles.dateItem}>
              <a
                href={`#${era.name}`}
                style={{
                  lineHeight: '20px',
                  paddingBottom: '10px',
                  color: index === currentIndex ? '#ffcc00' : '#ffffcc',
                  textDecoration: 'none',
                  transition: '0.5s',
                  fontSize: index === currentIndex ? '16px' : '12px',
                  display: 'block',
                  textAlign: 'center'
                }}
                onClick={(e) => {
                  e.preventDefault();
                  selectEra(index, era.name);
                }}
              >
                <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>
                  {eraYears[era.name as keyof typeof eraYears] || ''}
                </div>
                <div style={{ fontSize: index === currentIndex ? '14px' : '10px' }}>
                  {era.name.split(' ')[0]}
                </div>
              </a>
            </li>
          ))}
        </ul>

        {/* Issues/Content */}
        <ul ref={issuesRef} style={timelineStyles.issuesList}>
          {sortedEras.map((era, index) => (
            <li 
              key={era.id} 
              id={era.name}
              style={{
                ...timelineStyles.issueItem,
                ...(index === currentIndex ? timelineStyles.issueItemSelected : {})
              }}
            >
              <h1 style={{
                color: '#ffcc00',
                fontSize: '32px',
                margin: '15px 0',
                textShadow: '#000 1px 1px 2px',
                textAlign: 'left',
                paddingLeft: '70px'
              }}>
                {era.name}
              </h1>
              <p style={{
                fontSize: '12px',
                marginRight: '70px',
                marginLeft: '70px',
                fontWeight: 'normal',
                lineHeight: '18px',
                textShadow: '#000 1px 1px 2px'
              }}>
                {era.keyFigures ? (
                  <>
                    <strong>Key Figures & Civilizations:</strong>
                    <br />
                    {era.keyFigures}
                  </>
                ) : (
                  `Explore the fascinating world of the ${era.name} period, a time of great historical significance and cultural development.`
                )}
              </p>
            </li>
          ))}
        </ul>

        {/* Navigation */}
        <div style={timelineStyles.gradLeft} />
        <div style={timelineStyles.gradRight} />
        
        {sortedEras.length > 1 && (
          <>
            <a
              href="#"
              style={{
                position: 'absolute',
                top: '170px',
                right: '0',
                width: '22px',
                height: '38px',
                fontSize: '70px',
                background: '#ff0000',
                textIndent: '-9999px',
                overflow: 'hidden',
                cursor: currentIndex >= sortedEras.length - 1 ? 'not-allowed' : 'pointer',
                opacity: currentIndex >= sortedEras.length - 1 ? 0.2 : 1,
                transition: 'opacity 0.3s',
                textDecoration: 'none',
                color: '#fff'
              }}
              onClick={(e) => {
                e.preventDefault();
                nextEra();
              }}
            >
              +
            </a>
            
            <a
              href="#"
              style={{
                position: 'absolute',
                top: '170px',
                left: '0',
                width: '22px',
                height: '38px',
                fontSize: '70px',
                background: '#0000ff',
                textIndent: '-9999px',
                overflow: 'hidden',
                cursor: currentIndex <= 0 ? 'not-allowed' : 'pointer',
                opacity: currentIndex <= 0 ? 0.2 : 1,
                transition: 'opacity 0.3s',
                textDecoration: 'none',
                color: '#fff'
              }}
              onClick={(e) => {
                e.preventDefault();
                prevEra();
              }}
            >
              -
            </a>
          </>
        )}
      </div>
    </div>
  );
}