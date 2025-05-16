
import React, { useState, FormEvent, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface SearchBarProps {
  className?: string;
  placeholder?: string;
  onSearch?: (query: string) => void;
  initialQuery?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  className,
  placeholder = "¿Qué estás buscando?",
  onSearch,
  initialQuery = ''
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
    }
  }, [initialQuery]);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      if (onSearch) {
        onSearch(query.trim());
      } else {
        navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      }
    }
  };
  
  const clearSearch = () => {
    setQuery('');
  };
  
  return (
    <form 
      onSubmit={handleSearch}
      className={cn(
        "relative max-w-xl w-full mx-auto",
        className
      )}
    >
      <div className={cn(
        "relative flex items-center transition-all duration-300",
        isFocused ? "scale-105" : "scale-100"
      )}>
        <input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={cn(
            "w-full h-12 pl-12 pr-12 rounded-full border outline-none transition-all duration-300",
            "bg-white/90 backdrop-blur-sm",
            isFocused 
              ? "border-primary shadow-md shadow-primary/10" 
              : "border-gray-200 shadow-sm"
          )}
        />
        
        <Search className={cn(
          "absolute left-4 w-5 h-5 transition-colors duration-300",
          isFocused ? "text-primary" : "text-gray-400"
        )} />
        
        {query && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={clearSearch}
            className="absolute right-12 h-5 w-5 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        
        <Button
          type="submit"
          size="sm"
          className={cn(
            "absolute right-1 top-1 h-10 rounded-full px-4 transition-all duration-300",
            !query.trim() && "opacity-70 cursor-not-allowed"
          )}
          disabled={!query.trim()}
        >
          Buscar
        </Button>
      </div>
    </form>
  );
};

export default SearchBar;
