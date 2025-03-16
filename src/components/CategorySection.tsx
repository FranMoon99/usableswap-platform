
import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
  background: string;
}

const categories: Category[] = [
  {
    id: 'electronics',
    name: 'Electrónica',
    icon: '📱',
    count: 2415,
    background: 'from-blue-500/10 to-purple-500/10'
  },
  {
    id: 'fashion',
    name: 'Moda',
    icon: '👕',
    count: 1823,
    background: 'from-pink-500/10 to-red-500/10'
  },
  {
    id: 'home',
    name: 'Hogar',
    icon: '🏠',
    count: 1567,
    background: 'from-amber-500/10 to-orange-500/10'
  },
  {
    id: 'sports',
    name: 'Deportes',
    icon: '⚽',
    count: 985,
    background: 'from-green-500/10 to-teal-500/10'
  },
  {
    id: 'toys',
    name: 'Juguetes',
    icon: '🧸',
    count: 742,
    background: 'from-yellow-500/10 to-amber-500/10'
  },
  {
    id: 'books',
    name: 'Libros',
    icon: '📚',
    count: 1234,
    background: 'from-cyan-500/10 to-blue-500/10'
  }
];

const CategorySection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Explora por categorías</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Navega entre miles de productos clasificados por categorías para encontrar lo que necesitas.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <Link 
              key={category.id}
              to={`/categories/${category.id}`}
              className={cn(
                "relative overflow-hidden rounded-xl p-6 border border-gray-100 shadow-sm group bg-gradient-to-br animate-fade-in",
                category.background
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-2xl">
                  {category.icon}
                </div>
                <div className="flex-grow">
                  <h3 className="font-medium text-lg mb-1 group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {category.count.toLocaleString()} productos
                  </p>
                </div>
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white/60 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                  <ChevronRight className="h-4 w-4" />
                </div>
              </div>
              
              {/* Background decoration */}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/20 rounded-full blur-2xl opacity-60" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
