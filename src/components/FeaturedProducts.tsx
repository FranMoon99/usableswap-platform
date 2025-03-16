
import React from 'react';
import ProductCard, { ProductProps } from './ProductCard';

// Mock data for featured products
const mockProducts: ProductProps[] = [
  {
    id: '1',
    title: 'iPhone 13 Pro Max - 256GB',
    price: 750,
    image: 'https://images.unsplash.com/photo-1611472173362-3f53dbd65d80?q=80&w=2874&auto=format&fit=crop',
    location: 'Madrid',
    category: 'Electrónica',
    condition: 'Como nuevo',
    isNew: true
  },
  {
    id: '2',
    title: 'Bicicleta de montaña Trek',
    price: 320,
    image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=2940&auto=format&fit=crop',
    location: 'Barcelona',
    category: 'Deportes',
    condition: 'Buen estado'
  },
  {
    id: '3',
    title: 'PlayStation 5 con 2 mandos',
    price: 400,
    image: 'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?q=80&w=2627&auto=format&fit=crop',
    location: 'Valencia',
    category: 'Electrónica',
    condition: 'Como nuevo'
  },
  {
    id: '4',
    title: 'Sofá de 3 plazas color gris',
    price: 250,
    image: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?q=80&w=2940&auto=format&fit=crop',
    location: 'Sevilla',
    category: 'Hogar',
    condition: 'Buen estado'
  },
  {
    id: '5',
    title: 'MacBook Pro 2021 M1 Pro',
    price: 1100,
    image: 'https://images.unsplash.com/photo-1569770218135-bea267ed7e84?q=80&w=2160&auto=format&fit=crop',
    location: 'Madrid',
    category: 'Electrónica',
    condition: 'Como nuevo'
  },
  {
    id: '6',
    title: 'Cámara Sony Alpha A7 III',
    price: 950,
    image: 'https://images.unsplash.com/photo-1516724562728-afc824a36e84?q=80&w=2942&auto=format&fit=crop',
    location: 'Barcelona',
    category: 'Electrónica',
    condition: 'Buen estado'
  },
  {
    id: '7',
    title: 'Nintendo Switch OLED',
    price: 280,
    image: 'https://images.unsplash.com/photo-1617096200347-cb04ae810b1d?q=80&w=2940&auto=format&fit=crop',
    location: 'Valencia',
    category: 'Electrónica',
    condition: 'Nuevo',
    isNew: true
  },
  {
    id: '8',
    title: 'Mesa de comedor extensible',
    price: 180,
    image: 'https://images.unsplash.com/photo-1577140917170-285929fb55b7?q=80&w=2940&auto=format&fit=crop',
    location: 'Zaragoza',
    category: 'Hogar',
    condition: 'Buen estado'
  }
];

const FeaturedProducts = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Productos destacados</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Descubre artículos únicos seleccionados por nuestro equipo en base a popularidad y calidad.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {mockProducts.map((product, index) => (
            <div 
              key={product.id} 
              className="animate-fade-in" 
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <ProductCard {...product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
