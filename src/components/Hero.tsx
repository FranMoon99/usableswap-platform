
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import SearchBar from './SearchBar';

const categories = [
  'Electrónica', 'Moda', 'Hogar', 'Deportes', 'Juguetes', 'Libros', 'Vehículos'
];

const Hero = () => {
  return (
    <section className="relative w-full h-[85vh] min-h-[600px] overflow-hidden flex items-center">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50 to-blue-100" />
      
      {/* Content */}
      <div className="container mx-auto relative z-10 px-4">
        <div className="w-full max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
          <div className="space-y-4">
            <span className="inline-block text-xs md:text-sm font-medium bg-primary/10 text-primary px-3 py-1 rounded-full">
              La plataforma de compraventa más simple
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Encuentra artículos únicos a precios increíbles
            </h1>
            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
              Compra y vende de forma segura, rápida y sin complicaciones. Miles de artículos te esperan.
            </p>
          </div>
          
          {/* Search bar */}
          <div className="w-full max-w-2xl mx-auto">
            <SearchBar placeholder="¿Qué estás buscando?" />
          </div>
          
          {/* Categories */}
          <div className="pt-4">
            <h2 className="text-sm text-gray-500 mb-3">Categorías populares</h2>
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((category, index) => (
                <Button
                  key={category}
                  variant="outline"
                  className={cn(
                    "rounded-full bg-white/80 backdrop-blur-sm hover:bg-primary hover:text-primary-foreground transition-all duration-300",
                    `animate-fade-in animate-delay-${index * 100}`
                  )}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default Hero;
