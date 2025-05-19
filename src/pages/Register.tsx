
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
import { MailCheck, AlertCircle } from 'lucide-react';
import { validatePassword } from '@/utils/passwordUtils';

// Updated schema with enhanced password validation
const registerSchema = z.object({
  name: z.string().min(2, { message: 'El nombre debe tener al menos 2 caracteres' }),
  email: z.string().email({ message: 'Correo electrónico inválido' }),
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

type RegisterFormValues = z.infer<typeof registerSchema>;

const Register = () => {
  const { register: registerUser, user, resendVerificationEmail } = useAuth();
  const navigate = useNavigate();
  const [registered, setRegistered] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
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
  
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
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
      
      // Clear email error when email field changes
      if (name === 'email') {
        setEmailError(null);
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      // Double-check password validity
      const passwordCheck = validatePassword(data.password);
      if (!passwordCheck.valid) {
        toast.error('Contraseña inválida', {
          description: passwordCheck.message
        });
        return;
      }
      
      await registerUser(data.name, data.email, data.password);
      toast.success('¡Registro exitoso!', {
        description: 'Se ha enviado un correo de verificación a tu dirección de email'
      });
      setRegistered(true);
    } catch (error) {
      console.error('Registration error:', error);
      
      // Handle duplicate email error
      if (error instanceof Error && error.message === 'El usuario ya existe') {
        setEmailError('Este correo electrónico ya está registrado');
        toast.error('Email ya registrado', {
          description: 'Este correo electrónico ya está en uso. Por favor utiliza otro.'
        });
      } else {
        toast.error('Error al registrarse', {
          description: 'Por favor intenta de nuevo más tarde'
        });
      }
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
                        className={emailError ? "border-red-500 focus-visible:ring-red-500" : ""}
                      />
                    </FormControl>
                    {emailError && (
                      <p className="text-sm font-medium text-destructive">{emailError}</p>
                    )}
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
