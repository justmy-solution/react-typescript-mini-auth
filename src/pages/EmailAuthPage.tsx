
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PinInput from "@/components/auth/PinInput";

const EmailAuthPage: React.FC = () => {
  const { verifyPin, resendPin, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  // Extract email from query parameter
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const emailParam = params.get("email");
    
    if (!emailParam) {
      navigate("/auth");
    } else {
      setEmail(emailParam);
    }
  }, [location.search, navigate]);

  // If already authenticated, redirect to home
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmitPin = async (pin: string) => {
    setError(null);
    
    try {
      const success = await verifyPin(pin, email);
      
      if (!success) {
        setError("Invalid PIN. Please try again.");
      }
      // If successful, redirection will happen via the useEffect
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    }
  };

  const handleResendPin = async () => {
    setError(null);
    
    try {
      await resendPin(email);
    } catch (err) {
      setError("Failed to resend PIN. Please try again.");
    }
  };

  const handleBack = () => {
    navigate("/auth");
  };

  if (!email) {
    return null; // Don't render until email is loaded
  }

  return (
    <div className="auth-container">
      <Card className="auth-card">
        <h1 className="auth-heading">Enter PIN Code</h1>
        
        <p className="auth-subheading">
          A 6-digit PIN has been sent to<br />
          <span className="font-medium text-foreground">{email}</span>
        </p>
        
        <PinInput
          onSubmit={handleSubmitPin}
          onResend={handleResendPin}
          isLoading={isLoading}
        />
        
        {error && (
          <p className="text-destructive text-center text-sm mt-4">{error}</p>
        )}
        
        <div className="mt-6">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="w-full"
            disabled={isLoading}
          >
            Back to Login
          </Button>
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-xs text-muted-foreground">
            For testing, use PIN: 123456
          </p>
        </div>
      </Card>
    </div>
  );
};

export default EmailAuthPage;
