import React, { createContext, useState, useContext, useEffect } from 'react';
import * as bcrypt from 'bcryptjs';

type User = {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  emailVerified: boolean;
};

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  verifyEmail: (token: string) => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Number of salt rounds for bcrypt (higher is more secure but slower)
const SALT_ROUNDS = 10;

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing user session in localStorage on app initialization
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      // In a real app, you'd make an API call to authenticate
      
      // Simulate checking if user exists in localStorage (for our mock database)
      const usersStore = localStorage.getItem('usersDb') || '{}';
      const users = JSON.parse(usersStore);
      
      if (!users[email]) {
        throw new Error('Usuario no encontrado');
      }
      
      // Get user data
      const userData = users[email];
      
      // Compare the hashed password
      const passwordMatch = await bcrypt.compare(password, userData.password);
      if (!passwordMatch) {
        throw new Error('Contraseña incorrecta');
      }
      
      // Check if email is verified
      if (!userData.emailVerified) {
        throw new Error('email_not_verified');
      }
      
      const mockUser: User = {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        emailVerified: userData.emailVerified
      };
      
      // Store user in localStorage
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      // In a real app, you'd make an API call to register the user
      
      // Generate an ID for the user and a verification token
      const userId = Math.random().toString(36).substr(2, 9);
      const verificationToken = Math.random().toString(36).substr(2, 16);
      
      // Store the verification token in localStorage (in a real app this would be in your database)
      const tokens = JSON.parse(localStorage.getItem('verificationTokens') || '{}');
      tokens[verificationToken] = {
        email,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours from now
      };
      localStorage.setItem('verificationTokens', JSON.stringify(tokens));
      
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
      
      // Store the user in our mock database (localStorage)
      const usersStore = localStorage.getItem('usersDb') || '{}';
      const users = JSON.parse(usersStore);
      
      // Check if user already exists
      if (users[email]) {
        throw new Error('El usuario ya existe');
      }
      
      users[email] = {
        id: userId,
        email,
        name,
        password: hashedPassword, // Store the hashed password
        emailVerified: false,
        registeredAt: new Date().toISOString()
      };
      
      localStorage.setItem('usersDb', JSON.stringify(users));
      
      // Create unverified user object
      const mockUser: User = {
        id: userId,
        email,
        name,
        emailVerified: false
      };
      
      // Store user in localStorage session
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
      
      // In a real app, we'd send a verification email here
      console.log('Verification token for', email, ':', verificationToken);
      
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    } finally {
      setIsLoading(false);
    }
  };

  const verifyEmail = async (token: string) => {
    try {
      setIsLoading(true);
      
      // Get tokens from localStorage
      const tokens = JSON.parse(localStorage.getItem('verificationTokens') || '{}');
      
      // Check if token exists
      if (!tokens[token]) {
        throw new Error('Token de verificación inválido o expirado');
      }
      
      // Check if token is expired
      const tokenData = tokens[token];
      const expiry = new Date(tokenData.expires);
      
      if (expiry < new Date()) {
        throw new Error('El token ha expirado');
      }
      
      // Get the email associated with this token
      const email = tokenData.email;
      
      // Get users from localStorage
      const usersStore = localStorage.getItem('usersDb') || '{}';
      const users = JSON.parse(usersStore);
      
      // Check if user exists
      if (!users[email]) {
        throw new Error('Usuario no encontrado');
      }
      
      // Update user verification status
      users[email].emailVerified = true;
      localStorage.setItem('usersDb', JSON.stringify(users));
      
      // Remove used token
      delete tokens[token];
      localStorage.setItem('verificationTokens', JSON.stringify(tokens));
      
      // Update current user if it's the same user
      if (user && user.email === email) {
        const updatedUser = {
          ...user,
          emailVerified: true
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
      }
      
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const resendVerificationEmail = async () => {
    try {
      if (!user) {
        throw new Error('No hay usuario activo');
      }
      
      setIsLoading(true);
      
      // Generate a new verification token
      const verificationToken = Math.random().toString(36).substr(2, 16);
      
      // Store the verification token in localStorage
      const tokens = JSON.parse(localStorage.getItem('verificationTokens') || '{}');
      tokens[verificationToken] = {
        email: user.email,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours from now
      };
      localStorage.setItem('verificationTokens', JSON.stringify(tokens));
      
      // In a real app, we'd send a verification email here
      console.log('New verification token for', user.email, ':', verificationToken);
      
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = {
    user,
    isLoading,
    login,
    register,
    logout,
    verifyEmail,
    resendVerificationEmail,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
