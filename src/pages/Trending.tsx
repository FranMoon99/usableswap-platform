
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

// Mock trending categories data
const trendingCategories = [
  { 
    id: 'electronics', 
    name: 'Electrónica', 
    trend: 'up', 
    percentage: 12,
    products: 345,
    popular: ['Smartphones', 'Tablets', 'Auriculares']
  },
  { 
    id: 'clothing', 
    name: 'Ropa', 
    trend: 'up', 
    percentage: 8,
    products: 523,
    popular: ['Zapatillas', 'Camisetas', 'Chaquetas'] 
  },
  { 
    id: 'furniture', 
    name: 'Muebles', 
    trend: 'down', 
    percentage: 3,
    products: 187,
    popular: ['Sofás', 'Mesas', 'Sillas'] 
  },
  { 
    id: 'sports', 
    name: 'Deportes', 
    trend: 'up', 
    percentage: 15,
    products: 276,
    popular: ['Bicicletas', 'Balones', 'Ropa deportiva'] 
  },
  { 
    id: 'books', 
    name: 'Libros', 
    trend: 'down', 
    percentage: 2,
    products: 312,
    popular: ['Novelas', 'Autoayuda', 'Literatura clásica'] 
  },
  { 
    id: 'home', 
    name: 'Hogar', 
    trend: 'up', 
    percentage: 5,
    products: 230,
    popular: ['Decoración', 'Utensilios', 'Iluminación'] 
  },
];

// Mock trending products data
const trendingProducts = [
  {
    id: '101',
    title: 'Auriculares Bluetooth Sony',
    category: 'Electrónica',
    views: 1250,
    trend: 'up',
    percentage: 32,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2940&auto=format&fit=crop'
  },
  {
    id: '102',
    title: 'Mountain Bike Trek',
    category: 'Deportes',
    views: 980,
    trend: 'up',
    percentage: 15,
    image: 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?q=80&w=2908&auto=format&fit=crop'
  },
  {
    id: '103',
    title: 'Sofá modular 3 plazas',
    category: 'Muebles',
    views: 745,
    trend: 'up',
    percentage: 10,
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=2940&auto=format&fit=crop'
  },
  {
    id: '104',
    title: 'Samsung Galaxy S21',
    category: 'Electrónica',
    views: 1750,
    trend: 'up',
    percentage: 42,
    image: 'https://images.unsplash.com/photo-1610945264803-c22b62d2a7b3?q=80&w=2574&auto=format&fit=crop'
  }
];

const Trending = () => {
  const [timeFilter, setTimeFilter] = useState('week'); // 'day', 'week', 'month'
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-16">
        {/* Hero section */}
        <section className="py-16 bg-gradient-to-r from-primary/5 to-primary/10">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-3xl md:text-4xl font-bold mb-4">
                  Tendencias del Mercado
                </h1>
                <p className="text-gray-600 mb-8 text-lg">
                  Descubre qué categorías y productos están en tendencia 
                  y mantente al día con las últimas demandas del mercado.
                </p>
              </motion.div>
              
              <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1 mb-8">
                <button
                  onClick={() => setTimeFilter('day')}
                  className={`px-4 py-2 text-sm font-medium rounded-md ${
                    timeFilter === 'day' ? 'bg-primary text-white' : 'text-gray-600'
                  }`}
                >
                  Hoy
                </button>
                <button
                  onClick={() => setTimeFilter('week')}
                  className={`px-4 py-2 text-sm font-medium rounded-md ${
                    timeFilter === 'week' ? 'bg-primary text-white' : 'text-gray-600'
                  }`}
                >
                  Esta semana
                </button>
                <button
                  onClick={() => setTimeFilter('month')}
                  className={`px-4 py-2 text-sm font-medium rounded-md ${
                    timeFilter === 'month' ? 'bg-primary text-white' : 'text-gray-600'
                  }`}
                >
                  Este mes
                </button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Trending Categories */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="mb-10">
              <h2 className="text-2xl font-bold mb-4">Categorías en Tendencia</h2>
              <p className="text-gray-600">
                Las categorías que más interés están generando entre los usuarios.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {trendingCategories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Link to={`/categories/${category.id}`} className="block h-full">
                    <Card className="h-full hover:shadow-md transition-shadow duration-300">
                      <CardHeader>
                        <div className="flex justify-between items-center mb-2">
                          <CardTitle className="text-lg">{category.name}</CardTitle>
                          <Badge 
                            variant={category.trend === 'up' ? 'default' : 'destructive'}
                            className="flex items-center gap-1"
                          >
                            {category.trend === 'up' ? (
                              <>
                                <TrendingUp className="w-3 h-3" /> 
                                +{category.percentage}%
                              </>
                            ) : (
                              <>
                                <TrendingDown className="w-3 h-3" /> 
                                {category.percentage}%
                              </>
                            )}
                          </Badge>
                        </div>
                        <CardDescription>
                          {category.products} productos disponibles
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {category.popular.map(tag => (
                            <Badge key={tag} variant="outline">{tag}</Badge>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button variant="ghost" size="sm" className="ml-auto" asChild>
                          <span>Ver categoría <span aria-hidden="true">→</span></span>
                        </Button>
                      </CardFooter>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Trending Products */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="mb-10">
              <h2 className="text-2xl font-bold mb-4">Productos en Tendencia</h2>
              <p className="text-gray-600">
                Los productos más vistos y buscados de esta semana.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {trendingProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Link to={`/product/${product.id}`} className="block h-full">
                    <Card className="h-full overflow-hidden hover:shadow-md transition-shadow duration-300">
                      <div className="aspect-square overflow-hidden relative">
                        <img 
                          src={product.image} 
                          alt={product.title}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                        <Badge 
                          className="absolute top-3 right-3 flex items-center gap-1"
                          variant={product.trend === 'up' ? 'default' : 'destructive'}
                        >
                          <TrendingUp className="w-3 h-3" /> 
                          +{product.percentage}%
                        </Badge>
                      </div>
                      <CardContent className="pt-4">
                        <h3 className="font-medium mb-1 line-clamp-1">{product.title}</h3>
                        <div className="flex justify-between items-center">
                          <Badge variant="outline">{product.category}</Badge>
                          <span className="text-sm text-gray-500">{product.views.toLocaleString()} vistas</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-10 text-center">
              <Button variant="outline" size="lg">
                Ver más productos en tendencia
              </Button>
            </div>
          </div>
        </section>
        
        {/* Insights section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-8">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-2xl font-bold mb-6">¿Por qué seguir las tendencias?</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    {
                      title: "Mejores precios",
                      description: "Los productos de tendencia suelen mantener mejor su valor de reventa."
                    },
                    {
                      title: "Mayor demanda",
                      description: "Los artículos en tendencia se venden hasta 3 veces más rápido."
                    },
                    {
                      title: "Decisiones informadas",
                      description: "Conoce qué busca el mercado antes de comprar o vender."
                    }
                  ].map((item, index) => (
                    <div key={index} className="text-center">
                      <h3 className="text-lg font-medium mb-2">{item.title}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Trending;
