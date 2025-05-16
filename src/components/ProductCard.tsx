
import React from 'react';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useFavorites } from '@/contexts/FavoritesContext';

export interface ProductProps {
  id: string;
  title: string;
  price: number;
  image: string;
  location: string;
  category: string;
  condition: string;
  isNew?: boolean;
}

const ProductCard: React.FC<ProductProps> = ({ 
  id, 
  title, 
  price, 
  image, 
  location, 
  category,
  condition,
  isNew 
}) => {
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();
  const favorite = isFavorite(id);

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to product detail
    
    if (favorite) {
      removeFromFavorites(id);
    } else {
      addToFavorites({
        id,
        title,
        price,
        image,
        location,
        category,
        condition,
      });
    }
  };

  return (
    <div 
      className="group relative rounded-xl overflow-hidden bg-white product-card-hover border border-gray-100 transition-all duration-300"
    >
      {/* Image container with aspect ratio */}
      <Link to={`/product/${id}`} className="block relative aspect-square overflow-hidden">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Favorite button */}
        <Button
          variant="outline"
          size="icon"
          className={cn(
            "absolute z-10 right-3 top-3 h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm border-0 shadow-sm transition-opacity duration-300",
            favorite ? "opacity-100 text-red-500 hover:text-red-600" : "opacity-0 group-hover:opacity-100"
          )}
          onClick={handleFavoriteToggle}
        >
          <Heart className={cn("h-4 w-4", favorite ? "fill-current" : "")} />
        </Button>
        
        {/* New badge */}
        {isNew && (
          <Badge className="absolute z-10 left-3 top-3 bg-primary/90 backdrop-blur-sm">
            Nuevo
          </Badge>
        )}
        
        {/* Condition badge */}
        <Badge 
          variant="outline" 
          className={cn(
            "absolute z-10 left-3 bottom-3 backdrop-blur-sm",
            condition === "Nuevo" ? "bg-green-500/10 text-green-700 border-green-200" :
            condition === "Como nuevo" ? "bg-blue-500/10 text-blue-700 border-blue-200" :
            condition === "Buen estado" ? "bg-yellow-500/10 text-yellow-700 border-yellow-200" :
            "bg-gray-500/10 text-gray-700 border-gray-200"
          )}
        >
          {condition}
        </Badge>
      </Link>
      
      {/* Content */}
      <div className="p-4">
        <Link to={`/product/${id}`}>
          <h3 className="text-base font-medium line-clamp-1 mb-1 group-hover:text-primary transition-colors">
            {title}
          </h3>
        </Link>
        
        <p className="text-lg font-semibold mb-2">
          {price.toLocaleString('es-ES', { 
            style: 'currency', 
            currency: 'EUR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0 
          })}
        </p>
        
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span className="truncate">{location}</span>
          <span className="bg-gray-100 px-2 py-0.5 rounded-full">{category}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
