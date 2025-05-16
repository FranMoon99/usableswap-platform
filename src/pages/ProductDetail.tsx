import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Calendar, 
  Heart, 
  Share2, 
  Flag, 
  MapPin, 
  ChevronRight,
  MessageCircle,
  Phone
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import FeaturedProducts from '@/components/FeaturedProducts';

// Mock product data
const mockProductDetails = {
  id: '1',
  title: 'iPhone 13 Pro Max - 256GB',
  description: 'Vendo iPhone 13 Pro Max en perfecto estado. Comprado hace 10 meses, siempre con funda y protector de pantalla. Incluye cargador original, caja y todos los accesorios. Color: Azul Sierra. Batería al 92% de salud. Libre para cualquier operador. Motivo de venta: cambio a modelo más reciente.',
  price: 750,
  originalPrice: 1299,
  discount: '42%',
  location: 'Madrid, Centro',
  seller: {
    id: 'user123',
    name: 'David García',
    rating: 4.8,
    reviews: 24,
    memberSince: 'Junio 2022',
    verified: true,
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
  },
  category: 'Electrónica',
  subcategory: 'Smartphones',
  condition: 'Como nuevo',
  published: '2023-11-15T14:30:00',
  views: 253,
  images: [
    'https://images.unsplash.com/photo-1611472173362-3f53dbd65d80?q=80&w=2874&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?q=80&w=2880&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1574719128055-f4f84a835363?q=80&w=2574&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?q=80&w=2592&auto=format&fit=crop'
  ],
  features: [
    'Pantalla Super Retina XDR de 6,7"',
    'Procesador A15 Bionic',
    '256GB de almacenamiento',
    'Cámara triple de 12MP',
    'Batería con 92% de salud',
    'iOS 16 actualizado'
  ]
};

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState(mockProductDetails);
  const [mainImage, setMainImage] = useState(mockProductDetails.images[0]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  
  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    window.scrollTo(0, 0);
    
    return () => clearTimeout(timer);
  }, []);
  
  const formattedDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  const handleImageClick = (image: string) => {
    setMainImage(image);
  };

  const handleContactSeller = () => {
    if (!isAuthenticated) {
      toast({
        title: "Inicia sesión para contactar",
        description: "Necesitas una cuenta para enviar mensajes",
        variant: "default",
      });
      navigate('/login', { state: { redirectTo: `/product/${id}` } });
      return;
    }

    // In a real app, this would create a conversation if it doesn't exist
    // For now, we'll navigate to a mock conversation
    navigate('/conversations/1');
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-16 pb-20">
        <div className="container mx-auto px-4 pt-8">
          {/* Breadcrumbs */}
          <div className="flex items-center text-sm text-gray-500 mb-6">
            <a href="/" className="hover:text-primary transition-colors">Inicio</a>
            <ChevronRight className="h-4 w-4 mx-2" />
            <a href="/categories" className="hover:text-primary transition-colors">{product.category}</a>
            <ChevronRight className="h-4 w-4 mx-2" />
            <a href={`/categories/${product.subcategory.toLowerCase()}`} className="hover:text-primary transition-colors">{product.subcategory}</a>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-gray-700 font-medium truncate">{product.title}</span>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                <img 
                  src={mainImage} 
                  alt={product.title} 
                  className="w-full h-full object-cover object-center"
                />
              </div>
              
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image, index) => (
                  <div 
                    key={index}
                    className={`aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${mainImage === image ? 'border-primary' : 'border-transparent hover:border-gray-300'}`}
                    onClick={() => handleImageClick(image)}
                  >
                    <img 
                      src={image} 
                      alt={`${product.title} - Imagen ${index + 1}`} 
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                ))}
              </div>
            </div>
            
            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                    {product.condition}
                  </Badge>
                  <Badge variant="outline" className="bg-green-500/10 text-green-700 border-green-200">
                    {product.discount} de descuento
                  </Badge>
                </div>
                
                <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
                
                <div className="flex items-end space-x-3 mb-4">
                  <span className="text-3xl font-bold">
                    {product.price.toLocaleString('es-ES', { 
                      style: 'currency', 
                      currency: 'EUR',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0 
                    })}
                  </span>
                  <span className="text-lg text-gray-500 line-through">
                    {product.originalPrice.toLocaleString('es-ES', { 
                      style: 'currency', 
                      currency: 'EUR',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0 
                    })}
                  </span>
                </div>
                
                <div className="flex items-center text-sm text-gray-500 space-x-4">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>Publicado: {formattedDate(product.published)}</span>
                  </div>
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-1">
                      <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                      <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" clipRule="evenodd" />
                    </svg>
                    <span>{product.views} visitas</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <Button className="flex-1" onClick={handleContactSeller}>
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Contactar
                </Button>
                <Button variant="outline" className="flex-1">
                  <Phone className="h-5 w-5 mr-2" />
                  Llamar
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Heart className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0">
                    <img 
                      src={product.seller.avatar} 
                      alt={product.seller.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                    />
                  </div>
                  <div className="ml-4">
                    <div className="flex items-center">
                      <h3 className="font-medium">{product.seller.name}</h3>
                      {product.seller.verified && (
                        <Badge variant="outline" className="ml-2 bg-blue-500/10 text-blue-600 border-blue-200 text-xs">
                          Verificado
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <div className="flex text-yellow-400 mr-1">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={i < Math.floor(product.seller.rating) ? "currentColor" : "none"} stroke="currentColor" className="w-3.5 h-3.5">
                            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                          </svg>
                        ))}
                      </div>
                      <span>{product.seller.rating} ({product.seller.reviews} reseñas)</span>
                    </div>
                    <p className="text-xs text-gray-500">Miembro desde {product.seller.memberSince}</p>
                  </div>
                </div>
                <div className="flex items-center text-sm">
                  <MapPin className="h-4 w-4 text-gray-500 mr-1" />
                  <span>{product.location}</span>
                </div>
              </div>
              
              <Tabs defaultValue="description" className="w-full">
                <TabsList className="w-full grid grid-cols-3 mb-6">
                  <TabsTrigger value="description">Descripción</TabsTrigger>
                  <TabsTrigger value="features">Características</TabsTrigger>
                  <TabsTrigger value="details">Detalles</TabsTrigger>
                </TabsList>
                <TabsContent value="description" className="space-y-4">
                  <p className="text-gray-700 whitespace-pre-line">
                    {product.description}
                  </p>
                </TabsContent>
                <TabsContent value="features" className="space-y-4">
                  <ul className="space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="h-5 w-5 text-primary mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                          <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                        </svg>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </TabsContent>
                <TabsContent value="details" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Categoría</p>
                      <p className="font-medium">{product.category}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Subcategoría</p>
                      <p className="font-medium">{product.subcategory}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Condición</p>
                      <p className="font-medium">{product.condition}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Ubicación</p>
                      <p className="font-medium">{product.location}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Fecha de publicación</p>
                      <p className="font-medium">{formattedDate(product.published)}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">ID del producto</p>
                      <p className="font-medium">{product.id}</p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-200 text-sm text-gray-500">
                <button className="flex items-center hover:text-primary transition-colors">
                  <Flag className="h-4 w-4 mr-1" />
                  <span>Reportar anuncio</span>
                </button>
                <div>ID: {product.id}</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Similar products */}
        <div className="mt-20">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8">Productos similares</h2>
          </div>
          <FeaturedProducts />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProductDetail;
