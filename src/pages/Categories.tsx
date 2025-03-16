
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { cn } from '@/lib/utils';

interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
  background: string;
  description: string;
  image: string;
}

const categories: Category[] = [
  {
    id: 'electronics',
    name: 'Electrónica',
    icon: '📱',
    count: 2415,
    background: 'from-blue-500/10 to-purple-500/10',
    description: 'Encuentra smartphones, ordenadores, tabletas y otros dispositivos electrónicos a precios increíbles.',
    image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'fashion',
    name: 'Moda',
    icon: '👕',
    count: 1823,
    background: 'from-pink-500/10 to-red-500/10',
    description: 'Ropa, calzado y accesorios de segunda mano en perfecto estado y a precios reducidos.',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'home',
    name: 'Hogar',
    icon: '🏠',
    count: 1567,
    background: 'from-amber-500/10 to-orange-500/10',
    description: 'Muebles, decoración, electrodomésticos y todo lo que necesitas para tu casa.',
    image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'sports',
    name: 'Deportes',
    icon: '⚽',
    count: 985,
    background: 'from-green-500/10 to-teal-500/10',
    description: 'Equipamiento deportivo, bicicletas, patines y accesorios para mantenerte en forma.',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'toys',
    name: 'Juguetes',
    icon: '🧸',
    count: 742,
    background: 'from-yellow-500/10 to-amber-500/10',
    description: 'Juguetes, juegos de mesa, muñecos y artículos para niños de todas las edades.',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'books',
    name: 'Libros',
    icon: '📚',
    count: 1234,
    background: 'from-cyan-500/10 to-blue-500/10',
    description: 'Libros nuevos y usados, cómics, revistas y material educativo a precios económicos.',
    image: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=800&q=80'
  }
];

const CategoryPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // If we have a categoryId, show specific category
  if (categoryId) {
    const category = categories.find(cat => cat.id === categoryId);
    
    if (!category) {
      return (
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow flex items-center justify-center pt-16">
            <div className="text-center">
              <h1 className="text-3xl font-bold">Categoría no encontrada</h1>
              <p className="mt-4 text-gray-600">Lo sentimos, la categoría que buscas no existe.</p>
              <Link to="/categories" className="mt-6 inline-block text-primary hover:underline">
                Ver todas las categorías
              </Link>
            </div>
          </main>
          <Footer />
        </div>
      );
    }
    
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-16">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
              <Link to="/" className="hover:text-primary">Inicio</Link>
              <ChevronRight className="h-4 w-4" />
              <Link to="/categories" className="hover:text-primary">Categorías</Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-gray-900">{category.name}</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div>
                <motion.h1 
                  className="text-4xl font-bold mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {category.name}
                </motion.h1>
                <motion.p 
                  className="text-gray-600 mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  {category.description}
                </motion.p>
                <motion.div 
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <span className="text-lg font-medium">{category.count.toLocaleString()}</span>
                  <span className="text-gray-500">artículos disponibles</span>
                </motion.div>
              </div>
              <motion.div
                className="rounded-xl overflow-hidden h-64 md:h-auto"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <img 
                  src={category.image} 
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </div>
            
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Productos populares en {category.name}</h2>
              <p className="text-gray-600">
                Estos son los artículos más buscados en esta categoría
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
              {Array.from({ length: 8 }).map((_, index) => (
                <motion.div 
                  key={index}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <div className="aspect-square bg-gray-100 relative">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                      <span>Imagen del producto</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium truncate">Producto ejemplo</h3>
                    <p className="text-primary font-bold mt-1">€XX.XX</p>
                    <p className="text-gray-500 text-sm mt-1">Madrid</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  // If no categoryId, show all categories
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-16">
        <div className="container mx-auto px-4 py-12">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold mb-4">Explora todas las categorías</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Navega entre miles de productos clasificados por categorías para encontrar lo que necesitas.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <motion.div 
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col"
              >
                <Link 
                  to={`/categories/${category.id}`}
                  className={cn(
                    "relative overflow-hidden rounded-xl p-6 border border-gray-100 shadow-sm group bg-gradient-to-br flex-1",
                    category.background
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm text-3xl">
                      {category.icon}
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-medium text-xl mb-1 group-hover:text-primary transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {category.count.toLocaleString()} productos
                      </p>
                    </div>
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/60 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                      <ChevronRight className="h-5 w-5" />
                    </div>
                  </div>
                  
                  <p className="mt-4 text-gray-600">
                    {category.description}
                  </p>
                  
                  {/* Background decoration */}
                  <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-white/20 rounded-full blur-2xl opacity-60" />
                </Link>
                <div className="mt-4 aspect-video rounded-xl overflow-hidden">
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CategoryPage;
