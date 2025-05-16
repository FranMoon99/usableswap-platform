
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

const EmailVerification = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const { verifyEmail } = useAuth();
  const navigate = useNavigate();
  
  const [verificationState, setVerificationState] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setVerificationState('error');
        setErrorMessage('Token de verificación no proporcionado');
        return;
      }
      
      try {
        await verifyEmail(token);
        setVerificationState('success');
        toast.success('¡Email verificado correctamente!', {
          description: 'Ahora puedes acceder a todas las funciones de UsableSwap'
        });
      } catch (error) {
        console.error('Verification error:', error);
        setVerificationState('error');
        
        if (error instanceof Error) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage('Ha ocurrido un error durante la verificación');
        }
        
        toast.error('Error de verificación', {
          description: errorMessage
        });
      }
    };
    
    verifyToken();
  }, [token, verifyEmail]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-16 flex items-center justify-center">
        <div className="max-w-md w-full text-center p-8 bg-white rounded-lg border shadow-sm">
          {verificationState === 'loading' && (
            <div className="py-8 flex flex-col items-center">
              <Loader2 className="h-16 w-16 text-primary animate-spin mb-4" />
              <h2 className="text-2xl font-semibold mb-2">Verificando tu email</h2>
              <p className="text-gray-500">Esto solo tomará un momento...</p>
            </div>
          )}
          
          {verificationState === 'success' && (
            <div className="py-8 flex flex-col items-center">
              <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
              <h2 className="text-2xl font-semibold mb-2">¡Email verificado!</h2>
              <p className="text-gray-500 mb-6">Tu cuenta ha sido verificada correctamente.</p>
              
              <div className="flex gap-4">
                <Button onClick={() => navigate('/login')}>
                  Iniciar sesión
                </Button>
                <Button variant="outline" onClick={() => navigate('/')}>
                  Ir al inicio
                </Button>
              </div>
            </div>
          )}
          
          {verificationState === 'error' && (
            <div className="py-8 flex flex-col items-center">
              <XCircle className="h-16 w-16 text-red-500 mb-4" />
              <h2 className="text-2xl font-semibold mb-2">Error de verificación</h2>
              <p className="text-gray-500 mb-6">{errorMessage || 'Ha ocurrido un error durante la verificación.'}</p>
              
              <div className="flex gap-4">
                <Button onClick={() => navigate('/register')}>
                  Volver al registro
                </Button>
                <Button variant="outline" onClick={() => navigate('/')}>
                  Ir al inicio
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default EmailVerification;
