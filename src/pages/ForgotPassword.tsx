
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MailCheck } from 'lucide-react';

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Correo electrónico inválido' }),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword = () => {
  const { requestPasswordReset } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [emailSent, setEmailSent] = useState<string | null>(null);
  
  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    try {
      await requestPasswordReset(data.email);
      setEmailSent(data.email);
      setSubmitted(true);
      toast.success('Email enviado', {
        description: 'Se ha enviado un correo con instrucciones para restablecer tu contraseña'
      });
    } catch (error) {
      console.error('Password reset request error:', error);
      
      if (error instanceof Error && error.message === 'email_not_found') {
        // We don't want to reveal if an email exists in our system for security reasons,
        // so we'll show a success message anyway
        setEmailSent(data.email);
        setSubmitted(true);
        toast.success('Email enviado', {
          description: 'Si existe una cuenta con este email, recibirás instrucciones para restablecer tu contraseña'
        });
      } else if (error instanceof Error && error.message === 'account_locked') {
        toast.error('Cuenta bloqueada', {
          description: 'Tu cuenta está temporalmente bloqueada debido a múltiples intentos fallidos.'
        });
      } else {
        toast.error('Error', {
          description: 'Ha ocurrido un error. Por favor intenta de nuevo más tarde.'
        });
      }
    }
  };

  if (submitted && emailSent) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-grow container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto">
            <Alert className="mb-6 bg-amber-50 border-amber-200">
              <MailCheck className="h-5 w-5 text-amber-500" />
              <AlertTitle className="text-amber-800">Revisa tu correo electrónico</AlertTitle>
              <AlertDescription className="text-amber-700">
                Hemos enviado instrucciones de restablecimiento de contraseña a{' '}
                <span className="font-medium">{emailSent}</span>. Revisa tu bandeja de entrada y sigue las instrucciones.
              </AlertDescription>
            </Alert>
            
            <p className="text-sm text-gray-500 mb-6">
              Si no recibes el email en unos minutos, revisa tu carpeta de spam o solicita otro email.
            </p>
            
            <div className="flex flex-col gap-4">
              <Button 
                variant="outline" 
                onClick={() => form.reset() || setSubmitted(false)}
                className="w-full"
              >
                Solicitar otro email
              </Button>
              
              <Button 
                variant="ghost" 
                asChild
                className="w-full"
              >
                <Link to="/login">Volver al inicio de sesión</Link>
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
          <h1 className="text-3xl font-bold mb-2">¿Olvidaste tu contraseña?</h1>
          <p className="text-gray-500 mb-6">
            Ingresa tu correo electrónico y te enviaremos instrucciones para restablecer tu contraseña.
          </p>
          
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
              
              <div className="flex flex-col gap-4">
                <Button type="submit" className="w-full">
                  Enviar instrucciones
                </Button>
                
                <div className="text-center text-sm">
                  <Link to="/login" className="text-primary font-medium hover:underline">
                    Volver al inicio de sesión
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

export default ForgotPassword;
