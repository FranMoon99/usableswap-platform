
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { toast } from 'sonner';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    // Redirect to login if not authenticated
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    logout();
    toast.success('Has cerrado sesión correctamente');
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">Mi Perfil</h1>
            <Button variant="outline" onClick={handleLogout}>
              Cerrar sesión
            </Button>
          </div>
          
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center space-x-6 mb-6">
              <div className="bg-gray-100 rounded-full p-2">
                <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-2xl font-semibold text-primary">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-semibold">{user.name}</h2>
                <p className="text-gray-600">{user.email}</p>
                <p className="text-sm text-gray-500 mt-1">Miembro desde {new Date().toLocaleDateString()}</p>
              </div>
            </div>
            
            <div className="border-t pt-4 mt-4">
              <h3 className="text-xl font-semibold mb-4">Mis productos</h3>
              <div className="bg-gray-50 p-6 rounded-md text-center">
                <p className="text-gray-500">No tienes productos publicados</p>
                <Button className="mt-4" onClick={() => navigate('/sell')}>
                  Publicar producto
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;
