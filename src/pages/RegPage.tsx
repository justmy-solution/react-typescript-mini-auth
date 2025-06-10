
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { isValidEmail } from "@/lib/utils";

const RegPage: React.FC = () => {
  const { register, registerAnonymous, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  // If already authenticated, redirect to home
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError(null);
  };

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }
    
    try {
      const success = await register(email.trim());
      
      if (success) {
        navigate(`/auth/email?email=${encodeURIComponent(email.trim())}`);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    }
  };

  const handleAnonymousRegister = async () => {
    try {
      const accessCode = await registerAnonymous();
      
      if (accessCode) {
        navigate(`/reg/code?code=${accessCode}`);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <Card className="auth-card">
        <h1 className="auth-heading">Create an Account</h1>
        <p className="auth-subheading">Register with your email or create an anonymous account</p>
        
        <form onSubmit={handleEmailRegister} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="your@email.com"
              className={error ? "border-destructive" : ""}
              disabled={isLoading}
              autoComplete="email"
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-auth" 
            disabled={isLoading || !email.trim()}
          >
            {isLoading ? "Processing..." : "Register with Email"}
          </Button>
        </form>
        
        <div className="my-6 flex items-center">
          <Separator className="flex-grow" />
          <span className="mx-4 text-xs text-muted-foreground">OR</span>
          <Separator className="flex-grow" />
        </div>
        
        <Button 
          onClick={handleAnonymousRegister}
          variant="outline"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Anonymous Registration"}
        </Button>
        
        <div className="mt-6 text-center">
          <Separator className="my-4" />
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <a 
              href="/auth" 
              className="text-auth hover:underline font-medium"
              onClick={(e) => {
                e.preventDefault();
                navigate("/auth");
              }}
            >
              Log In
            </a>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default RegPage;
