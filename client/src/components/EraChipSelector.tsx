import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CheckIcon, XIcon } from 'lucide-react';

export interface EraChipSelectorProps {
  /** List of eras to display */
  options: string[];
  /** Controlled selection (optional) */
  selected?: string[];
  /** Called whenever selection changes */
  onChange?: (selected: string[]) => void;
  /** Allow multiple selections? Default `true` */
  multiple?: boolean;
  /** Optional custom CSS class */
  className?: string;
}

const EraChipSelector: React.FC<EraChipSelectorProps> = ({
  options,
  selected = [],
  onChange,
  multiple = true,
  className,
}) => {
  const [current, setCurrent] = useState<string[]>(selected);

  // Era time periods for tooltips
  const eraYears: Record<string, string> = {
    'Ancient Near Eastern': '3500-539 BCE',
    'Ancient Egypt': '3100-30 BCE',
    'Ancient Greece': '800-146 BCE',
    'Ancient Rome': '753 BCE-476 CE',
    'Byzantine': '330-1453 CE',
    'Medieval Europe': '476-1453 CE',
    'Neo-Babylonian': '626-539 BCE',
    'Silk Road Trade Era': '130 BCE-1453 CE',
    'Ancient India (Mauryan and Gupta Periods)': '321 BCE-550 CE',
    'Imperial China': '221 BCE-1912 CE',
    'Israel\'s Patriarchal Period': '2000-1600 BCE',
    'Middle Kingdom of Egypt': '2055-1650 BCE',
    'New Kingdom of Egypt': '1550-1077 BCE',
    'Achaemenid Empire': '550-330 BCE',
    'Hellenistic Period': '323-146 BCE',
    'Parthian Empire': '247 BCE-224 CE',
    'Sasanian Empire': '224-651 CE',
    'Renaissance': '1400-1600 CE',
    'Age of Exploration': '1400-1700 CE',
    'Enlightenment': '1685-1815 CE',
    'Georgian Era': '1714-1830 CE'
  };

  // keep local state in sync if `selected` prop changes
  useEffect(() => {
    setCurrent(selected);
  }, [selected]);

  const toggle = (item: string) => {
    let next: string[];
    if (multiple) {
      if (current.includes(item)) {
        next = current.filter(i => i !== item);
      } else {
        next = [...current, item];
      }
    } else {
      next = current.includes(item) ? [] : [item];
    }
    setCurrent(next);
    onChange?.(next);
  };

  return (
    <TooltipProvider delayDuration={300}>
      <div className={cn("flex flex-wrap gap-2", className)}>
        {options.map(option => {
          const isSelected = current.includes(option);
          const timePeriod = eraYears[option];
          
          return (
            <Tooltip key={option}>
              <TooltipTrigger asChild>
                <div>
                  <Badge
                    variant={isSelected ? "default" : "outline"}
                    className={cn(
                      "rounded-full px-4 py-2 text-sm font-medium cursor-pointer transition-all",
                      isSelected 
                        ? "bg-primary text-primary-foreground hover:bg-primary/80" 
                        : "hover:bg-muted hover:text-foreground"
                    )}
                    onClick={() => toggle(option)}
                  >
                    {isSelected && (
                      <CheckIcon className="mr-1 h-3 w-3" />
                    )}
                    {option}
                    {isSelected && (
                      <XIcon 
                        className="ml-1 h-3 w-3 opacity-70 hover:opacity-100" 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggle(option);
                        }}
                      />
                    )}
                  </Badge>
                </div>
              </TooltipTrigger>
              {timePeriod && (
                <TooltipContent className="bg-yellow-100 border-yellow-200 text-yellow-900">
                  <p className="font-medium">{option}</p>
                  <p className="text-sm text-yellow-700">{timePeriod}</p>
                </TooltipContent>
              )}
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
};

export default EraChipSelector;