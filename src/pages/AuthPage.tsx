
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import SmartInput from "@/components/auth/SmartInput";
import { isValidEmail } from "@/lib/utils";

const AuthPage: React.FC = () => {
  const { login, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // If already authenticated, redirect to home
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (value: string) => {
    setErrorMessage(null);
    
    try {
      const success = await login(value);
      
      // If input is email and login is successful, navigate to PIN verification
      if (success && isValidEmail(value)) {
        navigate(`/auth/email?email=${encodeURIComponent(value)}`);
      }
      // If success with code, redirection will happen via the useEffect above
    } catch (err) {
      setErrorMessage("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <Card className="auth-card">
        <h1 className="auth-heading">Log In</h1>
        <p className="auth-subheading">Enter your email to receive a PIN code or use your 16-digit access code</p>
        
        <SmartInput 
          onSubmit={handleSubmit} 
          isLoading={isLoading} 
        />
        
        {errorMessage && (
          <p className="text-destructive text-center text-sm mt-4">{errorMessage}</p>
        )}
        
        <div className="mt-6 text-center">
          <Separator className="my-4" />
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <a 
              href="/reg" 
              className="text-auth hover:underline font-medium"
              onClick={(e) => {
                e.preventDefault();
                navigate("/reg");
              }}
            >
              Register
            </a>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default AuthPage;
