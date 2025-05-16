
import React, { useState } from 'react';
import { Filter, SortAsc, SortDesc } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Slider } from '@/components/ui/slider';
import {
  ToggleGroup,
  ToggleGroupItem
} from '@/components/ui/toggle-group';
import { Badge } from '@/components/ui/badge';

interface FilterOption {
  id: string;
  label: string;
}

export interface ProductFiltersProps {
  onFilterChange: (filters: {
    categories: string[];
    conditions: string[];
    priceRange: [number, number];
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  }) => void;
  minPrice: number;
  maxPrice: number;
  categories: FilterOption[];
  conditions: FilterOption[];
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
  onFilterChange,
  minPrice,
  maxPrice,
  categories,
  conditions
}) => {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([minPrice, maxPrice]);
  const [sortBy, setSortBy] = useState<string>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  
  // Handle filter changes
  const handleFilterChange = () => {
    onFilterChange({
      categories: selectedCategories,
      conditions: selectedConditions,
      priceRange,
      sortBy,
      sortOrder
    });
    
    // Calculate active filters count
    let count = 0;
    if (selectedCategories.length > 0) count++;
    if (selectedConditions.length > 0) count++;
    if (priceRange[0] > minPrice || priceRange[1] < maxPrice) count++;
    setActiveFiltersCount(count);
  };
  
  // Handle category selection
  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    setSelectedCategories(prev => {
      if (checked) {
        return [...prev, categoryId];
      } else {
        return prev.filter(id => id !== categoryId);
      }
    });
  };
  
  // Handle condition selection
  const handleConditionChange = (conditionId: string, checked: boolean) => {
    setSelectedConditions(prev => {
      if (checked) {
        return [...prev, conditionId];
      } else {
        return prev.filter(id => id !== conditionId);
      }
    });
  };
  
  // Handle price range change
  const handlePriceChange = (value: number[]) => {
    setPriceRange([value[0], value[1]]);
  };
  
  // Handle sort by change
  const handleSortByChange = (value: string) => {
    setSortBy(value);
  };
  
  // Handle sort order change
  const handleSortOrderChange = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };
  
  // Apply filters
  const applyFilters = () => {
    handleFilterChange();
    setIsFiltersOpen(false);
  };
  
  // Reset filters
  const resetFilters = () => {
    setSelectedCategories([]);
    setSelectedConditions([]);
    setPriceRange([minPrice, maxPrice]);
    setSortBy('date');
    setSortOrder('desc');
    handleFilterChange();
  };
  
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Collapsible
            open={isFiltersOpen}
            onOpenChange={setIsFiltersOpen}
            className="w-full"
          >
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="flex items-center space-x-2">
                <Filter className="h-4 w-4" />
                <span>Filtros</span>
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </CollapsibleTrigger>
            
            <CollapsibleContent className="mt-4 border rounded-lg p-4 bg-white shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Categories */}
                <div>
                  <h3 className="font-medium mb-3">Categorías</h3>
                  <div className="space-y-2">
                    {categories.map(category => (
                      <div key={category.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`category-${category.id}`}
                          checked={selectedCategories.includes(category.id)}
                          onCheckedChange={(checked) => 
                            handleCategoryChange(category.id, checked === true)
                          }
                        />
                        <label
                          htmlFor={`category-${category.id}`}
                          className="text-sm cursor-pointer"
                        >
                          {category.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Conditions */}
                <div>
                  <h3 className="font-medium mb-3">Estado</h3>
                  <div className="space-y-2">
                    {conditions.map(condition => (
                      <div key={condition.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`condition-${condition.id}`}
                          checked={selectedConditions.includes(condition.id)}
                          onCheckedChange={(checked) => 
                            handleConditionChange(condition.id, checked === true)
                          }
                        />
                        <label
                          htmlFor={`condition-${condition.id}`}
                          className="text-sm cursor-pointer"
                        >
                          {condition.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Price Range */}
                <div>
                  <h3 className="font-medium mb-3">Precio</h3>
                  <div className="px-2">
                    <Slider
                      defaultValue={[minPrice, maxPrice]}
                      value={[priceRange[0], priceRange[1]]}
                      min={minPrice}
                      max={maxPrice}
                      step={10}
                      onValueChange={handlePriceChange}
                      className="mb-6"
                    />
                    <div className="flex justify-between">
                      <span className="text-sm">
                        {priceRange[0].toLocaleString('es-ES', {
                          style: 'currency',
                          currency: 'EUR',
                          minimumFractionDigits: 0
                        })}
                      </span>
                      <span className="text-sm">
                        {priceRange[1].toLocaleString('es-ES', {
                          style: 'currency',
                          currency: 'EUR',
                          minimumFractionDigits: 0
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Action buttons */}
              <div className="flex justify-end space-x-2 mt-6 border-t pt-4">
                <Button
                  variant="ghost"
                  onClick={resetFilters}
                >
                  Reiniciar
                </Button>
                <Button
                  onClick={applyFilters}
                >
                  Aplicar filtros
                </Button>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
        
        {/* Sorting options */}
        <div className="flex space-x-2">
          <Select value={sortBy} onValueChange={handleSortByChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Fecha</SelectItem>
              <SelectItem value="price">Precio</SelectItem>
              <SelectItem value="title">Título</SelectItem>
            </SelectContent>
          </Select>
          
          <Button
            variant="outline"
            size="icon"
            onClick={handleSortOrderChange}
          >
            {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;
