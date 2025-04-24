import React, { useState, useEffect } from 'react';

export interface CuisineSelectorProps {
  /** List of cuisines (or categories) to display */
  options: string[];
  /** Controlled selection (optional) */
  selected?: string[];
  /** Called whenever selection changes */
  onChange?: (selected: string[]) => void;
  /** Allow multiple selections? Default `true` */
  multiple?: boolean;
}

const CuisineSelector: React.FC<CuisineSelectorProps> = ({
  options,
  selected = [],
  onChange,
  multiple = true,
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
    <div className="flex flex-wrap gap-2">
      {options.map(option => {
        const isSelected = current.includes(option);
        return (
          <button
            key={option}
            type="button"
            onClick={() => toggle(option)}
            className={`
              px-4 py-2 rounded-full text-sm font-medium transition
              ${isSelected
                ? 'bg-blue-600 text-white border border-blue-600'
                : 'bg-white text-gray-800 border border-gray-300 hover:bg-gray-100'}
            `}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
};

export default CuisineSelector;