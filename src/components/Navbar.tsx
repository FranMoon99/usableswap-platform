
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Heart, ShoppingBag, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import AuthButtons from './AuthButtons';
import { useAuth } from '@/contexts/AuthContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      if (isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    }
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out px-4 md:px-6',
        isScrolled 
          ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' 
          : 'bg-transparent py-5'
      )}
    >
      <div className="container mx-auto flex items-center justify-between">
        <Link 
          to="/" 
          className="text-2xl font-semibold tracking-tight transition-colors"
        >
          <span className="text-primary">Usable</span>
          <span>Swap</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8 items-center">
          <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
            Inicio
          </Link>
          <Link to="/categories" className="text-sm font-medium hover:text-primary transition-colors">
            Categorías
          </Link>
          <Link to="/trending" className="text-sm font-medium hover:text-primary transition-colors">
            Tendencias
          </Link>
          <Link to="/sell" className="text-sm font-medium hover:text-primary transition-colors">
            Vender
          </Link>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Buscar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                "w-0 pl-9 pr-2 py-2 rounded-full border border-transparent focus:w-40 focus:border-gray-200",
                "transition-all duration-300 outline-none bg-transparent focus:bg-white/80"
              )}
            />
            <Button 
              type="submit" 
              variant="ghost" 
              size="icon" 
              className="absolute left-0 top-1/2 -translate-y-1/2 rounded-full hover:bg-gray-100"
              disabled={!searchQuery.trim()}
            >
              <Search className="h-5 w-5" />
            </Button>
          </form>
          
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-100">
            <Heart className="h-5 w-5" />
          </Button>
          
          <AuthButtons />
          
          <Button className="rounded-full" asChild>
            <Link to="/sell">
              <ShoppingBag className="h-5 w-5 mr-2" />
              <span>Vender artículo</span>
            </Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden" 
          onClick={toggleMobileMenu}
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden glass-effect absolute top-full left-0 right-0 px-4 py-5 shadow-lg animate-slide-down bg-white/95">
          <form onSubmit={handleSearch} className="relative mb-6">
            <input
              type="text"
              placeholder="¿Qué estás buscando?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 bg-white/80"
            />
            <Button 
              type="submit" 
              variant="ghost" 
              size="icon" 
              className="absolute left-0 top-1/2 -translate-y-1/2"
              disabled={!searchQuery.trim()}
            >
              <Search className="h-5 w-5" />
            </Button>
          </form>
          
          <nav className="flex flex-col space-y-4 mb-6">
            <Link 
              to="/" 
              className="text-base font-medium hover:text-primary transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Inicio
            </Link>
            <Link 
              to="/categories" 
              className="text-base font-medium hover:text-primary transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Categorías
            </Link>
            <Link 
              to="/trending" 
              className="text-base font-medium hover:text-primary transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Tendencias
            </Link>
            <Link 
              to="/sell" 
              className="text-base font-medium hover:text-primary transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Vender
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <Button variant="outline" size="sm" className="flex-1" asChild>
                <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)}>Mi Perfil</Link>
              </Button>
            ) : (
              <>
                <Button variant="outline" size="sm" className="flex-1" asChild>
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>Iniciar sesión</Link>
                </Button>
                <Button size="sm" className="flex-1" asChild>
                  <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>Registrarse</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
