import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export interface CuisineSelectorProps {
  /** List of cuisines (or categories) to display */
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

const CuisineSelector: React.FC<CuisineSelectorProps> = ({
  options,
  selected = [],
  onChange,
  multiple = true,
  className,
}) => {
  const [current, setCurrent] = useState<string[]>(selected);

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
    <div className={cn("flex flex-wrap gap-2", className)}>
      {options.map(option => {
        const isSelected = current.includes(option);
        return (
          <button
            key={option}
            type="button"
            onClick={() => toggle(option)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200",
              isSelected
                ? "bg-primary text-primary-foreground border border-primary" 
                : "bg-background text-foreground border border-input hover:bg-accent hover:text-accent-foreground"
            )}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
};

export default CuisineSelector;