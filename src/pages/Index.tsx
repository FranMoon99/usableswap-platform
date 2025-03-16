
import React, { useEffect } from 'react';
import Hero from '@/components/Hero';
import FeaturedProducts from '@/components/FeaturedProducts';
import CategorySection from '@/components/CategorySection';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';

const Index = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-16">
        <Hero />
        
        {/* Value Proposition */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ),
                  title: "Seguridad garantizada",
                  description: "Todas las transacciones están protegidas con los más altos estándares de seguridad."
                },
                {
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ),
                  title: "Rápido y sencillo",
                  description: "Publica tu producto en menos de 2 minutos y empieza a recibir ofertas."
                },
                {
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
                    </svg>
                  ),
                  title: "Sin comisiones",
                  description: "No cobramos comisión por tus ventas. El valor total es para ti."
                }
              ].map((item, index) => (
                <div 
                  key={index}
                  className="text-center p-6 animate-fade-in"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className="mx-auto w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-medium mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        <FeaturedProducts />
        <CategorySection />
        
        {/* Testimonials Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Lo que dicen nuestros usuarios</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Miles de usuarios confían en nosotros para sus compras y ventas de artículos usados.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  quote: "Vendí mi iPhone en menos de 24 horas a un precio justo. El proceso fue increíblemente sencillo.",
                  name: "Carlos Martínez",
                  role: "Vendedor",
                  avatar: "https://randomuser.me/api/portraits/men/32.jpg"
                },
                {
                  quote: "Encontré una bicicleta en perfecto estado a mitad de precio. La comunicación con el vendedor fue excelente.",
                  name: "Laura Gómez",
                  role: "Compradora",
                  avatar: "https://randomuser.me/api/portraits/women/44.jpg"
                },
                {
                  quote: "UsableSwap me ha permitido ahorrar mucho dinero comprando artículos de segunda mano en perfecto estado.",
                  name: "Miguel Sánchez",
                  role: "Comprador frecuente",
                  avatar: "https://randomuser.me/api/portraits/men/67.jpg"
                }
              ].map((testimonial, index) => (
                <div 
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 animate-fade-in"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className="flex items-center mb-4">
                    <div className="flex-shrink-0">
                      <img 
                        src={testimonial.avatar} 
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    </div>
                    <div className="ml-4">
                      <h4 className="font-medium">{testimonial.name}</h4>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                  <blockquote className="text-gray-600 italic">"{testimonial.quote}"</blockquote>
                  <div className="mt-4 flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                      </svg>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-primary/90 to-blue-600/90 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">¿Tienes algo que vender?</h2>
            <p className="text-white/90 max-w-2xl mx-auto mb-8 text-lg">
              Únete a miles de usuarios que ya están vendiendo sus artículos usados y ganando dinero extra.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="bg-white text-primary font-medium px-8 py-3 rounded-full hover:bg-gray-100 transition-colors">
                Vender ahora
              </button>
              <button className="bg-transparent border border-white text-white font-medium px-8 py-3 rounded-full hover:bg-white/10 transition-colors">
                Saber más
              </button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
