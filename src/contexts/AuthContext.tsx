
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { authApi } from "@/services/authApi";
import { AuthContextType, UserData } from "@/types/auth";
import { toast } from "@/components/ui/sonner";

// Create context with default values
const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// Auth Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (err) {
        console.error("Failed to parse stored user data", err);
        localStorage.removeItem("currentUser");
      }
    }
    setIsLoading(false);
  }, []);

  // Login with email or access code
  const login = async (emailOrCode: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Check if input is an email or access code
      if (emailOrCode.includes('@')) {
        // Login with email (send PIN)
        const response = await authApi.loginWithEmail(emailOrCode);
        
        if (response.success) {
          toast.success(response.message);
          setIsLoading(false);
          return true;
        } else {
          setError(response.message);
          toast.error(response.message);
          setIsLoading(false);
          return false;
        }
      } else {
        // Login with access code
        const response = await authApi.loginWithCode(emailOrCode);
        
        if (response.success && response.user) {
          setUser(response.user);
          setIsAuthenticated(true);
          localStorage.setItem("currentUser", JSON.stringify(response.user));
          toast.success("Login successful!");
          setIsLoading(false);
          return true;
        } else {
          setError(response.message || "Invalid credentials");
          toast.error(response.message || "Login failed");
          setIsLoading(false);
          return false;
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      toast.error(errorMessage);
      setIsLoading(false);
      return false;
    }
  };

  // Register with email
  const register = async (email: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await authApi.register(email);
      
      if (response.success) {
        toast.success(response.message);
        setIsLoading(false);
        return true;
      } else {
        setError(response.message);
        toast.error(response.message);
        setIsLoading(false);
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      toast.error(errorMessage);
      setIsLoading(false);
      return false;
    }
  };

  // Register anonymous user
  const registerAnonymous = async (): Promise<string> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await authApi.registerAnonymous();
      
      if (response.success) {
        toast.success("Anonymous account created successfully!");
        setIsLoading(false);
        return response.accessCode;
      } else {
        setError("Failed to create anonymous account");
        toast.error("Failed to create anonymous account");
        setIsLoading(false);
        return "";
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      toast.error(errorMessage);
      setIsLoading(false);
      return "";
    }
  };

  // Verify PIN
  const verifyPin = async (pin: string, email: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await authApi.verifyPin(pin, email);
      
      if (response.success && response.user) {
        setUser(response.user);
        setIsAuthenticated(true);
        localStorage.setItem("currentUser", JSON.stringify(response.user));
        toast.success("Login successful!");
        setIsLoading(false);
        return true;
      } else {
        setError(response.message || "Invalid PIN");
        toast.error(response.message || "Invalid PIN");
        setIsLoading(false);
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      toast.error(errorMessage);
      setIsLoading(false);
      return false;
    }
  };

  // Resend PIN
  const resendPin = async (email: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await authApi.resendPin(email);
      
      if (response.success) {
        toast.success(response.message);
        setIsLoading(false);
        return true;
      } else {
        setError(response.message);
        toast.error(response.message);
        setIsLoading(false);
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      toast.error(errorMessage);
      setIsLoading(false);
      return false;
    }
  };

  // Logout
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("currentUser");
    toast.success("Logged out successfully");
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    isLoading,
    error,
    isAuthenticated,
    login,
    register,
    verifyPin,
    registerAnonymous,
    logout,
    resendPin,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
