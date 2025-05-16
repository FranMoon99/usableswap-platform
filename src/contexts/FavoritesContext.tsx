
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { toast } from '@/hooks/use-toast';

export type FavoriteProduct = {
  id: string;
  title: string;
  price: number;
  image: string;
  location: string;
  category: string;
  condition: string;
};

interface FavoritesContextType {
  favorites: FavoriteProduct[];
  addToFavorites: (product: FavoriteProduct) => void;
  removeFromFavorites: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  loading: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteProduct[]>([]);
  const [loading, setLoading] = useState(true);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const loadFavorites = () => {
      try {
        const userId = user?.id || 'guest';
        const savedFavorites = localStorage.getItem(`favorites_${userId}`);
        if (savedFavorites) {
          setFavorites(JSON.parse(savedFavorites));
        }
      } catch (error) {
        console.error('Error loading favorites:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, [user]);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    if (!loading) {
      const userId = user?.id || 'guest';
      localStorage.setItem(`favorites_${userId}`, JSON.stringify(favorites));
    }
  }, [favorites, loading, user]);

  const addToFavorites = (product: FavoriteProduct) => {
    if (!isAuthenticated) {
      toast({
        title: "Inicia sesión para guardar favoritos",
        description: "Necesitas una cuenta para guardar productos en tu lista de favoritos",
        variant: "default",
      });
      return;
    }

    setFavorites(prev => {
      if (prev.some(item => item.id === product.id)) {
        return prev;
      }
      toast({
        title: "Producto añadido a favoritos",
        description: product.title,
        variant: "default",
      });
      return [...prev, product];
    });
  };

  const removeFromFavorites = (productId: string) => {
    setFavorites(prev => {
      const newFavorites = prev.filter(item => item.id !== productId);
      if (newFavorites.length !== prev.length) {
        toast({
          title: "Producto eliminado de favoritos",
          variant: "default",
        });
      }
      return newFavorites;
    });
  };

  const isFavorite = (productId: string) => {
    return favorites.some(item => item.id === productId);
  };

  const value = {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    loading
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
