
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Linkedin, 
  Heart 
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-100">
      <div className="container mx-auto px-4 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="mb-6">
              <Link to="/" className="text-2xl font-semibold inline-block">
                <span className="text-primary">Usable</span>
                <span>Swap</span>
              </Link>
              <p className="text-gray-600 mt-2">
                La plataforma líder de compraventa de artículos usados. Conectamos compradores y vendedores de forma segura.
              </p>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white transition-colors">
                <Linkedin size={18} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-base font-semibold mb-4">Links Rápidos</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-600 hover:text-primary transition-colors">Inicio</Link>
              </li>
              <li>
                <Link to="/categories" className="text-gray-600 hover:text-primary transition-colors">Categorías</Link>
              </li>
              <li>
                <Link to="/trending" className="text-gray-600 hover:text-primary transition-colors">Tendencias</Link>
              </li>
              <li>
                <Link to="/sell" className="text-gray-600 hover:text-primary transition-colors">Vender</Link>
              </li>
              <li>
                <Link to="/help" className="text-gray-600 hover:text-primary transition-colors">Centro de ayuda</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-base font-semibold mb-4">Información</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-gray-600 hover:text-primary transition-colors">Sobre nosotros</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-primary transition-colors">Contacto</Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-600 hover:text-primary transition-colors">Blog</Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-600 hover:text-primary transition-colors">Términos y condiciones</Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-600 hover:text-primary transition-colors">Política de privacidad</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-base font-semibold mb-4">Suscríbete</h3>
            <p className="text-gray-600 mb-4">
              Recibe notificaciones sobre nuevos productos y ofertas especiales.
            </p>
            <div className="relative mb-4">
              <input 
                type="email" 
                placeholder="Tu email" 
                className="w-full h-12 pl-4 pr-12 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
              <button 
                type="button"
                className="absolute right-1 top-1 h-10 w-10 rounded-lg bg-primary text-white flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
              </button>
            </div>
            <p className="text-sm text-gray-500">
              Al suscribirte, aceptas nuestra política de privacidad.
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-8 text-center text-sm text-gray-500">
          <p className="flex items-center justify-center">
            &copy; {new Date().getFullYear()} UsableSwap. Todos los derechos reservados. 
            <span className="inline-flex items-center ml-1">
              Hecho con <Heart className="h-4 w-4 text-red-500 mx-1" /> en España
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
