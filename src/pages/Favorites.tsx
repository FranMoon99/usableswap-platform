
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';

const Favorites = () => {
  const { favorites, loading } = useFavorites();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated && !loading) {
      navigate('/login', { state: { redirectTo: '/favorites' } });
    }
  }, [isAuthenticated, loading, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Mis Favoritos</h1>
          
          {loading ? (
            <div className="flex justify-center">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : favorites.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {favorites.map(product => (
                <ProductCard 
                  key={product.id}
                  id={product.id}
                  title={product.title}
                  price={product.price}
                  image={product.image}
                  location={product.location}
                  category={product.category}
                  condition={product.condition}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-lg">
              <div className="inline-flex justify-center items-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <Heart className="h-8 w-8 text-gray-400" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">No tienes favoritos</h2>
              <p className="text-gray-500 mb-6">
                Guarda los productos que más te gusten para verlos más tarde
              </p>
              <Button onClick={() => navigate('/')}>
                Explorar productos
              </Button>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Favorites;
