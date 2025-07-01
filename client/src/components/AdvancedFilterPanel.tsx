import React, { useState } from 'react';
import { Calendar, Globe, BarChart3, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FilterState {
  selectedPeriods: string[];
  selectedEras: string[];
  selectedLocations: string[];
  customDateFrom?: string;
  customDateTo?: string;
}

interface AdvancedFilterPanelProps {
  eras: string[];
  allEras: string[];
  onFiltersChange: (filters: FilterState) => void;
  className?: string;
}

export default function AdvancedFilterPanel({ eras, allEras, onFiltersChange, className }: AdvancedFilterPanelProps) {
  const [filters, setFilters] = useState<FilterState>({
    selectedPeriods: [],
    selectedEras: [],
    selectedLocations: []
  });
  
  const [showCustomDate, setShowCustomDate] = useState(false);
  const [activeFilterTags, setActiveFilterTags] = useState<Array<{type: string, value: string, label: string}>>([]);

  const timeOptions = [
    { value: 'ancient', label: 'Ancient Times (3500-500 BCE)' },
    { value: 'classical', label: 'Classical Period (500 BCE-500 CE)' },
    { value: 'medieval', label: 'Medieval Era (500-1450 CE)' },
    { value: 'renaissance', label: 'Renaissance (1400-1600 CE)' },
    { value: 'modern', label: 'Modern Era (1600-1900 CE)' },
    { value: 'custom', label: 'Custom Period' }
  ];

  const locationOptions = [
    { value: 'rome', label: 'Rome' },
    { value: 'egypt', label: 'Egypt' },
    { value: 'greece', label: 'Greece' },
    { value: 'mesopotamia', label: 'Mesopotamia' },
    { value: 'constantinople', label: 'Constantinople' },
    { value: 'persia', label: 'Persia' },
    { value: 'china', label: 'China' },
    { value: 'india', label: 'India' }
  ];

  // Map locations to historical periods
  const locationsByPeriod: Record<string, string[]> = {
    'ancient': ['mesopotamia', 'egypt', 'greece', 'rome', 'persia', 'china', 'india'],
    'classical': ['greece', 'rome', 'persia', 'india', 'china'],
    'medieval': ['constantinople', 'rome', 'persia', 'china', 'india'],
    'renaissance': ['rome', 'constantinople'],
    'modern': ['rome', 'constantinople', 'persia', 'china', 'india']
  };

  // Map locations to specific eras
  const locationsByEra: Record<string, string[]> = {
    'Ancient Near Eastern': ['mesopotamia', 'persia'],
    'Ancient Egypt': ['egypt'],
    'Middle Kingdom of Egypt': ['egypt'],
    'New Kingdom of Egypt': ['egypt'],
    'Ancient Greece': ['greece'],
    'Ancient Rome': ['rome'],
    'Hellenistic Period': ['greece', 'egypt', 'persia'],
    'Byzantine': ['constantinople', 'greece'],
    'Medieval Europe': ['rome', 'constantinople'],
    'Neo-Babylonian': ['mesopotamia'],
    'Silk Road Trade Era': ['china', 'persia', 'constantinople'],
    'Ancient India (Mauryan and Gupta Periods)': ['india'],
    'Imperial China': ['china'],
    'Israel\'s Patriarchal Period': ['mesopotamia'],
    'Achaemenid Empire': ['persia'],
    'Parthian Empire': ['persia'],
    'Sasanian Empire': ['persia'],
    'Renaissance': ['rome', 'constantinople'],
    'Age of Exploration': ['rome', 'constantinople'],
    'Enlightenment': ['rome', 'constantinople'],
    'Georgian Era': ['rome', 'constantinople']
  };

  const handlePeriodToggle = (period: string) => {
    const newSelectedPeriods = filters.selectedPeriods.includes(period)
      ? filters.selectedPeriods.filter(p => p !== period)
      : [...filters.selectedPeriods, period];
    
    const newFilters = { 
      ...filters, 
      selectedPeriods: newSelectedPeriods,
      selectedEras: [] // Clear eras when periods change
    };
    setFilters(newFilters);
    setShowCustomDate(newSelectedPeriods.includes('custom'));
    
    // Immediately call onFiltersChange to update parent
    onFiltersChange(newFilters);
  };

  const handleEraToggle = (era: string) => {
    const newSelectedEras = filters.selectedEras.includes(era)
      ? filters.selectedEras.filter(e => e !== era)
      : [...filters.selectedEras, era];
    
    const newFilters = { 
      ...filters, 
      selectedEras: newSelectedEras,
      selectedLocations: [] // Clear locations when eras change
    };
    setFilters(newFilters);
    
    // Immediately call onFiltersChange to update parent
    onFiltersChange(newFilters);
  };

  // Get enabled locations based on selected periods and eras
  const getEnabledLocations = () => {
    // If no periods or eras selected, all locations are enabled
    if (filters.selectedPeriods.length === 0 && filters.selectedEras.length === 0) {
      return locationOptions.map(loc => loc.value);
    }

    let enabledLocations: string[] = [];

    // If both periods and eras are selected, prioritize the more specific eras
    if (filters.selectedEras.length > 0) {
      // Use only era-based filtering for more specific results
      filters.selectedEras.forEach(era => {
        if (locationsByEra[era]) {
          enabledLocations = [...enabledLocations, ...locationsByEra[era]];
        }
      });
    } else if (filters.selectedPeriods.length > 0) {
      // Only use period-based filtering if no specific eras are selected
      filters.selectedPeriods.forEach(period => {
        if (locationsByPeriod[period]) {
          enabledLocations = [...enabledLocations, ...locationsByPeriod[period]];
        }
      });
    }

    // Remove duplicates and return
    const uniqueLocations = enabledLocations.filter((loc, index) => enabledLocations.indexOf(loc) === index);
    return uniqueLocations;
  };

  const handleLocationToggle = (location: string) => {
    const newSelectedLocations = filters.selectedLocations.includes(location)
      ? filters.selectedLocations.filter(l => l !== location)
      : [...filters.selectedLocations, location];
    
    const newFilters = { ...filters, selectedLocations: newSelectedLocations };
    setFilters(newFilters);
    
    // Immediately call onFiltersChange to update parent
    onFiltersChange(newFilters);
  };



  const applyFilters = () => {
    if (filters.selectedPeriods.length === 0) {
      alert('Please select at least one time period');
      return;
    }
    
    if (filters.selectedEras.length === 0) {
      alert('Please select at least one era');
      return;
    }
    
    if (filters.selectedLocations.length === 0) {
      alert('Please select at least one location');
      return;
    }

    // Create filter tags
    const tags: Array<{type: string, value: string, label: string}> = [];
    
    // Period filter tags
    filters.selectedPeriods.forEach(period => {
      const periodOption = timeOptions.find(opt => opt.value === period);
      if (periodOption) {
        tags.push({ type: 'time', value: period, label: `Period: ${periodOption.label}` });
      }
    });
    
    // Era tags
    filters.selectedEras.forEach(era => {
      tags.push({ type: 'era', value: era, label: era });
    });
    
    // Location tags
    filters.selectedLocations.forEach(location => {
      const locationOption = locationOptions.find(opt => opt.value === location);
      if (locationOption) {
        tags.push({ type: 'location', value: location, label: locationOption.label });
      }
    });
    
    setActiveFilterTags(tags);
    onFiltersChange(filters);
  };

  const resetFilters = () => {
    const resetState = {
      selectedPeriods: [],
      selectedEras: [],
      selectedLocations: []
    };
    setFilters(resetState);
    setShowCustomDate(false);
    setActiveFilterTags([]);
    onFiltersChange(resetState);
  };

  const removeFilterTag = (tagToRemove: {type: string, value: string, label: string}) => {
    let newFilters = { ...filters };
    
    if (tagToRemove.type === 'time') {
      newFilters.selectedPeriods = newFilters.selectedPeriods.filter(period => period !== tagToRemove.value);
      setShowCustomDate(newFilters.selectedPeriods.includes('custom'));
    } else if (tagToRemove.type === 'era') {
      newFilters.selectedEras = newFilters.selectedEras.filter(era => era !== tagToRemove.value);
    } else if (tagToRemove.type === 'location') {
      newFilters.selectedLocations = newFilters.selectedLocations.filter(location => location !== tagToRemove.value);
    }
    
    setFilters(newFilters);
    setActiveFilterTags(activeFilterTags.filter(tag => tag !== tagToRemove));
    onFiltersChange(newFilters);
  };

  return (
    <div className={cn("bg-gray-900 rounded-lg p-6 shadow-2xl text-white relative overflow-hidden", className)}>
      {/* Animated top border */}
      <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 animate-pulse"></div>
      
      <div className="space-y-6">
        {/* Time Period Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-gray-300 text-sm font-semibold">
            <Calendar className="w-4 h-4" />
            Historical Period
          </div>
          <div className="flex flex-wrap gap-2">
            {timeOptions.map(option => (
              <button
                key={option.value}
                onClick={() => handlePeriodToggle(option.value)}
                className={cn(
                  "px-3 py-2 rounded-md text-xs font-medium transition-all duration-300 border",
                  filters.selectedPeriods.includes(option.value)
                    ? "bg-cyan-500/20 text-cyan-400 border-cyan-400 shadow-lg shadow-cyan-400/20"
                    : "bg-gray-800 text-gray-300 border-gray-600 hover:bg-gray-700 hover:border-gray-500"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
          
          {/* Custom Date Range */}
          {showCustomDate && (
            <div className="flex gap-2 mt-3 opacity-0 animate-[fadeIn_0.3s_ease-in-out_forwards]">
              <input
                type="date"
                className="bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-sm text-white flex-1"
                onChange={(e) => setFilters({...filters, customDateFrom: e.target.value})}
              />
              <input
                type="date"
                className="bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-sm text-white flex-1"
                onChange={(e) => setFilters({...filters, customDateTo: e.target.value})}
              />
            </div>
          )}
        </div>

        {/* Historical Eras Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-gray-300 text-sm font-semibold">
            <Globe className="w-4 h-4" />
            Historical Eras
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {(allEras || []).map(era => {
              // Era is enabled if no periods are selected, or if it's in the filtered eras list
              const isEnabled = filters.selectedPeriods.length === 0 || (eras || []).includes(era);
              const isSelected = filters.selectedEras.includes(era);
              

              
              return (
                <button
                  key={era}
                  onClick={() => isEnabled ? handleEraToggle(era) : null}
                  disabled={!isEnabled}
                  className={cn(
                    "flex items-center gap-2 p-2 rounded-md text-xs font-medium transition-all duration-300 border",
                    !isEnabled && "opacity-50 cursor-not-allowed bg-gray-800/50 text-gray-500 border-gray-700",
                    isEnabled && isSelected && "bg-purple-500/20 text-purple-400 border-purple-400 shadow-lg shadow-purple-400/20",
                    isEnabled && !isSelected && "bg-gray-800 text-gray-300 border-gray-600 hover:bg-gray-700 hover:border-gray-500"
                  )}
                >
                  <div className={cn(
                    "w-3 h-3 border rounded-sm flex items-center justify-center transition-all",
                    !isEnabled && "border-gray-600",
                    isEnabled && isSelected && "border-purple-400 bg-purple-400",
                    isEnabled && !isSelected && "border-gray-500"
                  )}>
                    {isSelected && (
                      <div className="w-1.5 h-1.5 bg-white rounded-sm"></div>
                    )}
                  </div>
                  <span className="truncate">{era}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Locations Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-gray-300 text-sm font-semibold">
            <BarChart3 className="w-4 h-4" />
            Locations
          </div>
          <div className="flex flex-wrap gap-2">
            {locationOptions.map(option => {
              const enabledLocations = getEnabledLocations();
              const isEnabled = enabledLocations.includes(option.value);
              const isSelected = filters.selectedLocations.includes(option.value);
              
              return (
                <button
                  key={option.value}
                  onClick={() => isEnabled ? handleLocationToggle(option.value) : null}
                  disabled={!isEnabled}
                  className={cn(
                    "px-4 py-2 rounded-md text-xs font-medium transition-all duration-300 border relative overflow-hidden",
                    !isEnabled && "opacity-50 cursor-not-allowed bg-gray-800/50 text-gray-500 border-gray-700",
                    isEnabled && isSelected && "bg-pink-500/20 text-pink-400 border-pink-400 shadow-lg shadow-pink-400/20",
                    isEnabled && !isSelected && "bg-gray-800 text-gray-300 border-gray-600 hover:bg-gray-700 hover:border-gray-500"
                  )}
                >
                  <div className={cn(
                    "absolute bottom-0 left-0 h-0.5 bg-pink-400 transition-all duration-300",
                    !isEnabled && "bg-gray-600",
                    isEnabled && isSelected ? "w-full" : "w-0"
                  )}></div>
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between pt-4">
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-transparent border border-gray-600 text-gray-300 rounded-md text-sm font-medium hover:bg-gray-800 hover:text-white transition-all duration-300"
          >
            Reset
          </button>
          <button
            onClick={applyFilters}
            className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-md text-sm font-semibold hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 transform hover:-translate-y-0.5"
          >
            Apply Filters
          </button>
        </div>

        {/* Active Filter Tags */}
        {activeFilterTags.length > 0 && (
          <div className="pt-4 border-t border-gray-700">
            <div className="text-sm font-semibold text-gray-300 mb-3">Active Filters</div>
            <div className="flex flex-wrap gap-2">
              {activeFilterTags.map((tag, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border animate-[fadeIn_0.3s_ease-in-out]",
                    tag.type === 'time' && "bg-cyan-500/20 text-cyan-400 border-cyan-400",
                    tag.type === 'era' && "bg-purple-500/20 text-purple-400 border-purple-400",
                    tag.type === 'location' && "bg-pink-500/20 text-pink-400 border-pink-400"
                  )}
                >
                  <span>{tag.label}</span>
                  <button
                    onClick={() => removeFilterTag(tag)}
                    className="w-4 h-4 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-200"
                  >
                    <X className="w-2 h-2" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}