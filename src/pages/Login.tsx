
import React from 'react';
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
import { MailCheck } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email({ message: 'Correo electrónico inválido' }),
  password: z.string().min(6, { message: 'La contraseña debe tener al menos 6 caracteres' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [verificationError, setVerificationError] = React.useState(false);
  const [verificationEmail, setVerificationEmail] = React.useState("");
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
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
      } else {
        toast.error('Error al iniciar sesión', {
          description: 'Por favor verifica tus credenciales e intenta de nuevo'
        });
      }
    }
  };

  const handleVerifyClick = () => {
    // Navigate to Register which will show verification UI if user exists
    // In a real app you might have a dedicated verification page
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
              
              <div className="flex flex-col gap-4">
                <Button type="submit" className="w-full">
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
