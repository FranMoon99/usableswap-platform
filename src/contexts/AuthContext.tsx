import React, { createContext, useState, useContext, useEffect } from 'react';
import { validatePassword } from '@/utils/passwordUtils';

type User = {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  emailVerified: boolean;
};

// Interface for tracking login attempts
interface LoginAttempt {
  email: string;
  timestamp: number;
  ipAddress: string; // In a real app, this would be the actual IP
}

interface LockedAccount {
  email: string;
  until: number; // Timestamp when the lockout expires
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  verifyEmail: (token: string) => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  isAccountLocked: (email: string) => boolean;
  getRemainingLockTime: (email: string) => number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Configuration for brute force protection
const MAX_LOGIN_ATTEMPTS = 5; // Max failed attempts before lockout
const ATTEMPT_WINDOW = 15 * 60 * 1000; // 15 minutes in milliseconds
const LOCKOUT_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loginAttempts, setLoginAttempts] = useState<LoginAttempt[]>([]);
  const [lockedAccounts, setLockedAccounts] = useState<LockedAccount[]>([]);

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

    // Load existing login attempts and locked accounts from localStorage
    try {
      const storedAttempts = localStorage.getItem('loginAttempts');
      if (storedAttempts) {
        setLoginAttempts(JSON.parse(storedAttempts));
      }

      const storedLocks = localStorage.getItem('lockedAccounts');
      if (storedLocks) {
        setLockedAccounts(JSON.parse(storedLocks));
      }
    } catch (error) {
      console.error("Failed to load security data:", error);
    }
    
    setIsLoading(false);
  }, []);

  // Save login attempts to localStorage when they change
  useEffect(() => {
    if (loginAttempts.length > 0) {
      localStorage.setItem('loginAttempts', JSON.stringify(loginAttempts));
    }
  }, [loginAttempts]);

  // Save locked accounts to localStorage when they change
  useEffect(() => {
    if (lockedAccounts.length > 0) {
      localStorage.setItem('lockedAccounts', JSON.stringify(lockedAccounts));
    }
  }, [lockedAccounts]);

  // Check if an account is currently locked
  const isAccountLocked = (email: string): boolean => {
    // Clean up expired lockouts first
    const now = Date.now();
    const currentLocks = lockedAccounts.filter(lock => lock.until > now);
    
    if (currentLocks.length !== lockedAccounts.length) {
      setLockedAccounts(currentLocks);
    }
    
    return currentLocks.some(lock => lock.email === email);
  };

  // Get remaining lock time in seconds
  const getRemainingLockTime = (email: string): number => {
    const now = Date.now();
    const lock = lockedAccounts.find(l => l.email === email);
    
    if (!lock) return 0;
    
    const remainingMs = Math.max(0, lock.until - now);
    return Math.ceil(remainingMs / 1000); // Convert to seconds
  };

  // Record a failed login attempt
  const recordFailedAttempt = (email: string) => {
    const now = Date.now();
    const mockIp = "127.0.0.1"; // In a real app, this would be the user's IP
    
    // Add the new attempt
    const newAttempt: LoginAttempt = {
      email,
      timestamp: now,
      ipAddress: mockIp
    };
    
    // Filter out old attempts that are outside our window
    const recentAttempts = [
      ...loginAttempts.filter(attempt => 
        attempt.timestamp > now - ATTEMPT_WINDOW
      ),
      newAttempt
    ];
    
    setLoginAttempts(recentAttempts);
    
    // Check if we need to lock this account
    const userAttempts = recentAttempts.filter(
      attempt => attempt.email === email
    );
    
    if (userAttempts.length >= MAX_LOGIN_ATTEMPTS) {
      lockAccount(email);
    }
  };

  // Lock an account
  const lockAccount = (email: string) => {
    const now = Date.now();
    const lockExpiry = now + LOCKOUT_DURATION;
    
    // Remove any existing lock for this account
    const updatedLocks = lockedAccounts.filter(lock => lock.email !== email);
    
    // Add the new lock
    updatedLocks.push({
      email,
      until: lockExpiry
    });
    
    setLockedAccounts(updatedLocks);
  };

  // Reset failed attempts after successful login
  const resetFailedAttempts = (email: string) => {
    const filteredAttempts = loginAttempts.filter(attempt => attempt.email !== email);
    setLoginAttempts(filteredAttempts);
    
    // Also remove any locks
    const filteredLocks = lockedAccounts.filter(lock => lock.email !== email);
    setLockedAccounts(filteredLocks);
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Check if the account is locked
      if (isAccountLocked(email)) {
        throw new Error('account_locked');
      }
      
      // In a real app, you'd make an API call to authenticate
      // For demo purposes, we'll simulate a successful login and check verification
      
      // Simulate checking if user exists in localStorage (for our mock database)
      const usersStore = localStorage.getItem('usersDb') || '{}';
      const users = JSON.parse(usersStore);
      
      if (!users[email]) {
        // Record failed attempt even if user doesn't exist (prevents user enumeration)
        recordFailedAttempt(email);
        throw new Error('Usuario no encontrado');
      }
      
      // In real app we would verify password hash here
      const userData = users[email];

      // Simple password check for our demo (in a real app, this would use bcrypt or similar)
      if (password !== userData.password) {
        recordFailedAttempt(email);
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
      
      // Reset failed attempts counter after successful login
      resetFailedAttempts(email);
      
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
      
      // Validate password
      const passwordCheck = validatePassword(password);
      if (!passwordCheck.valid) {
        throw new Error(passwordCheck.message || 'Contraseña inválida');
      }
      
      // In a real app, you'd make an API call to register the user
      // For demo purposes, we'll simulate a successful registration
      
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
        password, // In a real app, we would hash this password
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

  const requestPasswordReset = async (email: string) => {
    try {
      setIsLoading(true);
      
      // Check if the account is locked
      if (isAccountLocked(email)) {
        throw new Error('account_locked');
      }
      
      // In a real app, you'd make an API call to request a password reset
      // For demo purposes, we'll simulate a successful password reset
      
      // Generate a new password reset token
      const passwordResetToken = Math.random().toString(36).substr(2, 16);
      
      // Store the password reset token in localStorage (in a real app this would be in your database)
      const tokens = JSON.parse(localStorage.getItem('passwordResetTokens') || '{}');
      tokens[email] = {
        token: passwordResetToken,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours from now
      };
      localStorage.setItem('passwordResetTokens', JSON.stringify(tokens));
      
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (token: string, newPassword: string) => {
    try {
      setIsLoading(true);
      
      // Validate password
      const passwordCheck = validatePassword(newPassword);
      if (!passwordCheck.valid) {
        throw new Error(passwordCheck.message || 'Contraseña inválida');
      }
      
      // In a real app, you'd make an API call to reset the password
      // For demo purposes, we'll simulate a successful password reset
      
      // Get tokens from localStorage
      const tokens = JSON.parse(localStorage.getItem('passwordResetTokens') || '{}');
      
      // Check if token exists
      if (!tokens[token]) {
        throw new Error('Token de restablecimiento de contraseña inválido o expirado');
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
      
      // Update user password
      users[email].password = newPassword;
      localStorage.setItem('usersDb', JSON.stringify(users));
      
      // Remove used token
      delete tokens[token];
      localStorage.setItem('passwordResetTokens', JSON.stringify(tokens));
      
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
    requestPasswordReset,
    resetPassword,
    isAccountLocked,
    getRemainingLockTime,
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
