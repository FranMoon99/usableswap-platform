
import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
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
import { AlertCircle } from 'lucide-react';

// Schema with enhanced password validation
const resetPasswordSchema = z.object({
  password: z.string()
    .min(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
    .refine(
      (value) => /[A-Z]/.test(value),
      { message: 'La contraseña debe incluir al menos una letra mayúscula' }
    )
    .refine(
      (value) => /[a-z]/.test(value),
      { message: 'La contraseña debe incluir al menos una letra minúscula' }
    )
    .refine(
      (value) => /[0-9]/.test(value),
      { message: 'La contraseña debe incluir al menos un número' }
    )
    .refine(
      (value) => /[^A-Za-z0-9]/.test(value),
      { message: 'La contraseña debe incluir al menos un carácter especial' }
    ),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

const ResetPassword = () => {
  const { resetPassword } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const [passwordReset, setPasswordReset] = useState(false);
  const [invalidToken, setInvalidToken] = useState(false);
  const [passwordRequirements, setPasswordRequirements] = useState<{
    length: boolean;
    uppercase: boolean;
    lowercase: boolean;
    number: boolean;
    special: boolean;
  }>({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });
  
  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
    mode: 'onChange',
  });

  // Update password requirements indicators in real-time
  const updatePasswordRequirements = (password: string) => {
    setPasswordRequirements({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    });
  };

  // Monitor password field changes
  React.useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'password' && value.password) {
        updatePasswordRequirements(value.password);
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);

  // Check if token is provided
  React.useEffect(() => {
    if (!token) {
      setInvalidToken(true);
    }
  }, [token]);

  const onSubmit = async (data: ResetPasswordFormValues) => {
    if (!token) {
      setInvalidToken(true);
      return;
    }

    try {
      await resetPassword(token, data.password);
      setPasswordReset(true);
      toast.success('Contraseña actualizada', {
        description: 'Tu contraseña ha sido actualizada exitosamente'
      });
    } catch (error) {
      console.error('Password reset error:', error);
      
      if (error instanceof Error && (
        error.message === 'Token inválido o expirado' || 
        error.message === 'El token ha expirado'
      )) {
        setInvalidToken(true);
        toast.error('Token inválido', {
          description: 'El enlace de restablecimiento ha expirado o no es válido'
        });
      } else {
        toast.error('Error', {
          description: 'Ha ocurrido un error al restablecer tu contraseña'
        });
      }
    }
  };

  if (invalidToken) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-grow container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto">
            <Alert className="mb-6 bg-red-50 border-red-200">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <AlertTitle className="text-red-800">Enlace inválido</AlertTitle>
              <AlertDescription className="text-red-700">
                El enlace de restablecimiento de contraseña ha expirado o no es válido.
                Por favor solicita un nuevo enlace.
              </AlertDescription>
            </Alert>
            
            <div className="flex flex-col gap-4">
              <Button 
                asChild
                className="w-full"
              >
                <Link to="/forgot-password">Solicitar nuevo enlace</Link>
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

  if (passwordReset) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-grow container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-4">¡Contraseña actualizada!</h1>
            <p className="mb-6 text-gray-600">
              Tu contraseña ha sido actualizada exitosamente. Ahora puedes iniciar sesión con tu nueva contraseña.
            </p>
            
            <Button 
              asChild
              className="w-full"
            >
              <Link to="/login">Iniciar sesión</Link>
            </Button>
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
          <h1 className="text-3xl font-bold mb-2">Crear nueva contraseña</h1>
          <p className="text-gray-500 mb-6">
            Ingresa tu nueva contraseña a continuación.
          </p>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nueva contraseña</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="******" 
                        type="password"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                    
                    {/* Password requirements indicators */}
                    <div className="mt-2 space-y-1 text-xs">
                      <div className={`flex items-center gap-1 ${passwordRequirements.length ? 'text-green-600' : 'text-gray-500'}`}>
                        <div className={`w-1 h-1 rounded-full ${passwordRequirements.length ? 'bg-green-600' : 'bg-gray-400'}`}></div>
                        Al menos 8 caracteres
                      </div>
                      <div className={`flex items-center gap-1 ${passwordRequirements.uppercase ? 'text-green-600' : 'text-gray-500'}`}>
                        <div className={`w-1 h-1 rounded-full ${passwordRequirements.uppercase ? 'bg-green-600' : 'bg-gray-400'}`}></div>
                        Al menos una letra mayúscula (A-Z)
                      </div>
                      <div className={`flex items-center gap-1 ${passwordRequirements.lowercase ? 'text-green-600' : 'text-gray-500'}`}>
                        <div className={`w-1 h-1 rounded-full ${passwordRequirements.lowercase ? 'bg-green-600' : 'bg-gray-400'}`}></div>
                        Al menos una letra minúscula (a-z)
                      </div>
                      <div className={`flex items-center gap-1 ${passwordRequirements.number ? 'text-green-600' : 'text-gray-500'}`}>
                        <div className={`w-1 h-1 rounded-full ${passwordRequirements.number ? 'bg-green-600' : 'bg-gray-400'}`}></div>
                        Al menos un número (0-9)
                      </div>
                      <div className={`flex items-center gap-1 ${passwordRequirements.special ? 'text-green-600' : 'text-gray-500'}`}>
                        <div className={`w-1 h-1 rounded-full ${passwordRequirements.special ? 'bg-green-600' : 'bg-gray-400'}`}></div>
                        Al menos un carácter especial (!@#$%^&*)
                      </div>
                    </div>
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
              
              <Button type="submit" className="w-full">
                Restablecer contraseña
              </Button>
            </form>
          </Form>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ResetPassword;
