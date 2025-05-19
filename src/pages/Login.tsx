
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { toast } from 'sonner';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MailCheck, AlertCircle, Lock } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email({ message: 'Correo electrónico inválido' }),
  password: z.string().min(6, { message: 'La contraseña debe tener al menos 6 caracteres' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const { login, isAccountLocked, getRemainingLockTime } = useAuth();
  const navigate = useNavigate();
  const [verificationError, setVerificationError] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");
  const [lockedAccount, setLockedAccount] = useState(false);
  const [lockedEmail, setLockedEmail] = useState("");
  const [remainingLockTime, setRemainingLockTime] = useState(0);
  const [lockTimerInterval, setLockTimerInterval] = useState<number | null>(null);
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const formatLockTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    // Clean up interval on unmount
    return () => {
      if (lockTimerInterval) {
        clearInterval(lockTimerInterval);
      }
    };
  }, [lockTimerInterval]);

  // Update timer when we have a locked account
  useEffect(() => {
    if (lockedAccount && lockedEmail) {
      // Set initial time
      setRemainingLockTime(getRemainingLockTime(lockedEmail));
      
      // Update every second
      const interval = window.setInterval(() => {
        const newTime = getRemainingLockTime(lockedEmail);
        setRemainingLockTime(newTime);
        
        // If lock time has expired, remove lock UI
        if (newTime <= 0) {
          setLockedAccount(false);
          setLockedEmail("");
          clearInterval(interval);
          setLockTimerInterval(null);
        }
      }, 1000);
      
      setLockTimerInterval(interval);
    }
  }, [lockedAccount, lockedEmail, getRemainingLockTime]);

  const onSubmit = async (data: LoginFormValues) => {
    try {
      // Check if account is locked before attempting login
      if (isAccountLocked(data.email)) {
        setLockedAccount(true);
        setLockedEmail(data.email);
        setRemainingLockTime(getRemainingLockTime(data.email));
        
        toast.error('Cuenta bloqueada', {
          description: 'Demasiados intentos fallidos. Por favor espera e intenta de nuevo.'
        });
        return;
      }
      
      await login(data.email, data.password);
      toast.success('¡Inicio de sesión exitoso!', {
        description: 'Bienvenido de vuelta a UsableSwap'
      });
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      
      // Check if it's an email verification error
      if (error instanceof Error && error.message === 'email_not_verified') {
        setVerificationError(true);
        setVerificationEmail(data.email);
        toast.error('Email no verificado', {
          description: 'Por favor verifica tu correo electrónico para continuar'
        });
      } else if (error instanceof Error && error.message === 'account_locked') {
        setLockedAccount(true);
        setLockedEmail(data.email);
        setRemainingLockTime(getRemainingLockTime(data.email));
        
        toast.error('Cuenta bloqueada', {
          description: 'Demasiados intentos fallidos. Por favor espera e intenta de nuevo.'
        });
      } else if (error instanceof Error && error.message === 'Contraseña incorrecta') {
        toast.error('Contraseña incorrecta', {
          description: 'Por favor verifica tu contraseña e intenta de nuevo'
        });
      } else {
        toast.error('Error al iniciar sesión', {
          description: 'Por favor verifica tus credenciales e intenta de nuevo'
        });
      }
    }
  };

  const handleVerifyClick = () => {
    // Navigate to Register which will show verification UI if user exists
    navigate('/register');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold mb-6">Iniciar sesión</h1>
          
          {verificationError && (
            <Alert className="mb-6 bg-amber-50 border-amber-200">
              <MailCheck className="h-5 w-5 text-amber-500" />
              <AlertDescription className="text-amber-700">
                Tu cuenta no ha sido verificada. Por favor verifica tu correo electrónico para poder iniciar sesión.
                <div className="mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleVerifyClick}
                    className="text-amber-800 border-amber-300 hover:bg-amber-100"
                  >
                    Verificar correo
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}
          
          {lockedAccount && (
            <Alert className="mb-6 bg-red-50 border-red-200">
              <Lock className="h-5 w-5 text-red-500" />
              <AlertDescription className="text-red-700">
                Tu cuenta ha sido temporalmente bloqueada debido a múltiples intentos de inicio de sesión fallidos.
                <div className="mt-1 font-medium">
                  Tiempo restante: {formatLockTime(remainingLockTime)}
                </div>
                <div className="mt-2 text-sm">
                  Por motivos de seguridad, deberás esperar antes de intentar iniciar sesión nuevamente.
                </div>
              </AlertDescription>
            </Alert>
          )}
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo electrónico</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="tu@email.com" 
                        type="email"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-center">
                      <FormLabel>Contraseña</FormLabel>
                      <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                        ¿Olvidaste tu contraseña?
                      </Link>
                    </div>
                    <FormControl>
                      <Input 
                        placeholder="******" 
                        type="password"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex flex-col gap-4">
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={lockedAccount}
                >
                  Iniciar sesión
                </Button>
                
                <div className="text-center text-sm">
                  <span>¿No tienes una cuenta? </span>
                  <Link to="/register" className="text-primary font-medium hover:underline">
                    Regístrate
                  </Link>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Login;
