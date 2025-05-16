
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SearchBar from '@/components/SearchBar';
import ProductCard from '@/components/ProductCard';
import { Loader2 } from 'lucide-react';

// Simulated product data
const mockProducts = [
  {
    id: '1',
    title: 'iPhone 12 Pro - Excelente estado',
    description: 'Usado solo por 6 meses, viene con todos los accesorios originales y caja.',
    price: 699.99,
    images: ['https://images.unsplash.com/photo-1606041008023-472dfb5e530f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2376&q=80'],
    category: 'Electrónica',
    condition: 'Usado - Como nuevo',
    location: 'Madrid',
    seller: { id: '1', name: 'Carlos', rating: 4.8 },
    createdAt: '2023-05-10T10:30:00.000Z',
  },
  {
    id: '2',
    title: 'Camiseta Nike - Talla M',
    description: 'Camiseta deportiva, usada un par de veces, como nueva.',
    price: 19.99,
    images: ['https://images.unsplash.com/photo-1618354691373-d851c5c3a990?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1015&q=80'],
    category: 'Moda',
    condition: 'Usado - Buen estado',
    location: 'Barcelona',
    seller: { id: '2', name: 'Ana', rating: 4.9 },
    createdAt: '2023-05-11T14:20:00.000Z',
  },
  {
    id: '3',
    title: 'Mesa de comedor de madera maciza',
    description: 'Mesa de comedor extensible, para 6-8 personas. Madera de roble.',
    price: 249.99,
    images: ['https://images.unsplash.com/photo-1577140917170-285929fb55b7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80'],
    category: 'Hogar',
    condition: 'Usado - Buen estado',
    location: 'Valencia',
    seller: { id: '3', name: 'Miguel', rating: 4.7 },
    createdAt: '2023-05-09T09:15:00.000Z',
  },
  {
    id: '4',
    title: 'Bicicleta de montaña Trek',
    description: 'Bicicleta Trek Marlin 7, talla M/L, usada durante una temporada.',
    price: 499.99,
    images: ['https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2342&q=80'],
    category: 'Deportes',
    condition: 'Usado - Buen estado',
    location: 'Sevilla',
    seller: { id: '4', name: 'Laura', rating: 4.6 },
    createdAt: '2023-05-08T16:45:00.000Z',
  },
];

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [isLoading, setIsLoading] = useState(true);
  const [results, setResults] = useState<typeof mockProducts>([]);

  useEffect(() => {
    // Simulate API call for search
    setIsLoading(true);
    setTimeout(() => {
      const filteredProducts = query
        ? mockProducts.filter(product => 
            product.title.toLowerCase().includes(query.toLowerCase()) || 
            product.description.toLowerCase().includes(query.toLowerCase()) ||
            product.category.toLowerCase().includes(query.toLowerCase())
          )
        : mockProducts;
      
      setResults(filteredProducts);
      setIsLoading(false);
    }, 600); // Simulate loading delay
  }, [query]);

  const handleSearch = (newQuery: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set('q', newQuery);
    window.history.pushState({}, '', url);
    
    // Re-trigger search with new query
    const filteredProducts = newQuery
      ? mockProducts.filter(product => 
          product.title.toLowerCase().includes(newQuery.toLowerCase()) || 
          product.description.toLowerCase().includes(newQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(newQuery.toLowerCase())
        )
      : mockProducts;
    
    setResults(filteredProducts);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-4">Resultados de búsqueda para "{query}"</h1>
            <SearchBar 
              onSearch={handleSearch} 
              initialQuery={query}
              className="max-w-2xl"
            />
          </div>
          
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
              <p className="text-gray-500">Buscando productos...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {results.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <h3 className="text-xl font-medium mb-2">No se encontraron resultados</h3>
              <p className="text-gray-500 mb-6">
                No se encontraron productos que coincidan con tu búsqueda "{query}"
              </p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SearchResults;
