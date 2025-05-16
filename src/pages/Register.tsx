
import React, { useState } from 'react';
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MailCheck } from 'lucide-react';

const registerSchema = z.object({
  name: z.string().min(2, { message: 'El nombre debe tener al menos 2 caracteres' }),
  email: z.string().email({ message: 'Correo electrónico inválido' }),
  password: z.string().min(6, { message: 'La contraseña debe tener al menos 6 caracteres' }),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const Register = () => {
  const { register, user, resendVerificationEmail } = useAuth();
  const navigate = useNavigate();
  const [registered, setRegistered] = useState(false);
  
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      await register(data.name, data.email, data.password);
      toast.success('¡Registro exitoso!', {
        description: 'Se ha enviado un correo de verificación a tu dirección de email'
      });
      setRegistered(true);
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Error al registrarse', {
        description: 'Por favor intenta de nuevo más tarde'
      });
    }
  };

  const handleResendVerification = async () => {
    try {
      await resendVerificationEmail();
      toast.success('Email de verificación enviado', {
        description: 'Por favor revisa tu bandeja de entrada'
      });
    } catch (error) {
      console.error('Failed to resend verification email:', error);
      toast.error('Error al enviar email', {
        description: 'Por favor intenta de nuevo más tarde'
      });
    }
  };

  // If user is registered but not verified, show verification notification
  if (registered || (user && !user.emailVerified)) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-grow container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto">
            <Alert className="mb-6 bg-amber-50 border-amber-200">
              <MailCheck className="h-5 w-5 text-amber-500" />
              <AlertTitle className="text-amber-800">Verifica tu correo electrónico</AlertTitle>
              <AlertDescription className="text-amber-700">
                Te hemos enviado un email con un enlace de verificación.
                Por favor revisa tu bandeja de entrada y sigue las instrucciones.
              </AlertDescription>
            </Alert>
            
            <p className="text-sm text-gray-500 mb-6">
              Si no has recibido el email, revisa tu carpeta de spam o haz clic en el botón para enviar otro.
            </p>
            
            <div className="flex flex-col gap-4">
              <Button 
                variant="outline" 
                onClick={handleResendVerification}
                className="w-full"
              >
                Reenviar email de verificación
              </Button>
              
              <Button 
                variant="ghost" 
                onClick={() => navigate('/')}
                className="w-full"
              >
                Volver al inicio
              </Button>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold mb-6">Crear cuenta</h1>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Tu nombre" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
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
                    <FormLabel>Contraseña</FormLabel>
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
              
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmar contraseña</FormLabel>
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
                <Button type="submit" className="w-full">
                  Registrarse
                </Button>
                
                <div className="text-center text-sm">
                  <span>¿Ya tienes una cuenta? </span>
                  <Link to="/login" className="text-primary font-medium hover:underline">
                    Inicia sesión
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

export default Register;
