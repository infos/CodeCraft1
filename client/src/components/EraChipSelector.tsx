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
    'Ancient Egyptian': '3100-30 BCE', 
    'Classical Antiquity': '800 BCE-600 CE',
    'Hellenistic': '323-146 BCE',
    'Roman Republic': '509-27 BCE',
    'Roman Empire': '27 BCE-476 CE',
    'Byzantine': '330-1453 CE',
    'Medieval': '476-1453 CE',
    'Renaissance': '1400-1600 CE',
    'Early Modern': '1450-1800 CE',
    'Enlightenment': '1685-1815 CE'
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
    <TooltipProvider>
      <div className={cn("flex flex-wrap gap-2", className)}>
        {options.map(option => {
          const isSelected = current.includes(option);
          const timePeriod = eraYears[option];
          
          return (
            <Tooltip key={option}>
              <TooltipTrigger asChild>
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
              </TooltipTrigger>
              {timePeriod && (
                <TooltipContent>
                  <p className="font-medium">{option}</p>
                  <p className="text-sm text-muted-foreground">{timePeriod}</p>
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