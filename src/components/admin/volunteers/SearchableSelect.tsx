"use client";

import { Search, ChevronDown, Check, X } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';

export interface SelectOption {
  value: string;
  label: string;
  sublabel?: string;
}

interface Props {
  options: SelectOption[];
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function SearchableSelect({ options, value, onChange, placeholder = "Search...", disabled = false }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const filteredOptions = options.filter(opt =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    opt.sublabel?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedOption = options.find(o => o.value === value);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      setFocusedIndex(-1);
    } else {
      setSearchTerm('');
      setFocusedIndex(-1);
    }
  }, [isOpen]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        if (!disabled) setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex(prev => (prev < filteredOptions.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(prev => (prev > 0 ? prev - 1 : prev));
        break;
      case 'Enter':
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < filteredOptions.length) {
          onChange(filteredOptions[focusedIndex].value);
          setIsOpen(false);
        } else if (filteredOptions.length === 1) {
          onChange(filteredOptions[0].value);
          setIsOpen(false);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        break;
    }
  };

  useEffect(() => {
    if (isOpen && focusedIndex >= 0 && listRef.current) {
      const activeItem = listRef.current.children[focusedIndex] as HTMLElement;
      if (activeItem) {
        activeItem.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [focusedIndex, isOpen]);

  return (
    <div className="relative w-full" ref={containerRef} onKeyDown={handleKeyDown}>
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        tabIndex={disabled ? -1 : 0}
        className={`flex items-center justify-between w-full px-3 py-2 border rounded-xl text-sm bg-white outline-none focus:ring-2 focus:ring-teal-500/20 ${disabled ? 'opacity-50 cursor-not-allowed border-gray-200' : 'cursor-pointer hover:border-teal-400 border-gray-200'}`}
      >
        <div className="flex-1 truncate text-left mr-2">
          {selectedOption ? (
            <div className="flex flex-col">
              <span className="font-medium text-gray-900 truncate">{selectedOption.label}</span>
              {selectedOption.sublabel && <span className="text-xs text-gray-500 truncate">{selectedOption.sublabel}</span>}
            </div>
          ) : (
            <span className="text-gray-500">{placeholder}</span>
          )}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {selectedOption && !disabled && (
            <button
              type="button"
              className="p-1 hover:bg-gray-100 rounded-full focus:outline-none"
              onClick={(e) => {
                e.stopPropagation();
                onChange('');
                setIsOpen(true);
              }}
              title="Clear selection"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-100">
          <div className="p-2 border-b border-gray-100 flex items-center gap-2 sticky top-0 bg-white">
            <Search className="w-4 h-4 text-gray-400 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              className="flex-1 outline-none text-sm min-w-0"
              placeholder="Type to search..."
              value={searchTerm}
              onChange={e => {
                setSearchTerm(e.target.value);
                setFocusedIndex(-1);
              }}
              onKeyDown={(e) => {
                 if (e.key === ' ') e.stopPropagation();
              }}
            />
          </div>
          <div className="overflow-y-auto flex-1 p-1" ref={listRef}>
            {filteredOptions.length === 0 ? (
              <div className="p-4 text-sm text-gray-500 text-center">No results found</div>
            ) : (
              filteredOptions.map((option, index) => {
                const isSelected = value === option.value;
                const isFocused = focusedIndex === index;
                return (
                  <div
                    key={option.value}
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                    onMouseEnter={() => setFocusedIndex(index)}
                    className={`px-3 py-2 cursor-pointer rounded-lg flex items-center justify-between transition-colors ${
                      isSelected ? 'bg-teal-50 text-teal-700' : 
                      isFocused ? 'bg-gray-50 text-gray-900' : 'text-gray-700'
                    }`}
                  >
                    <div className="flex flex-col min-w-0 flex-1 mr-2">
                      <span className="font-medium truncate">{option.label}</span>
                      {option.sublabel && <span className="text-xs opacity-70 truncate">{option.sublabel}</span>}
                    </div>
                    {isSelected && <Check className="w-4 h-4 shrink-0" />}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
