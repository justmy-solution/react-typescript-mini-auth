
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { copyToClipboard } from "@/lib/utils";
import { toast } from "@/components/ui/sonner";

const CodeRegPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [accessCode, setAccessCode] = useState<string>("");
  const [hasCopied, setHasCopied] = useState<boolean>(false);

  // Extract code from query parameter
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const codeParam = params.get("code");
    
    if (!codeParam) {
      navigate("/reg");
    } else {
      setAccessCode(codeParam);
    }
  }, [location.search, navigate]);

  // If authenticated, redirect to home
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleCopyCode = async () => {
    const success = await copyToClipboard(accessCode);
    if (success) {
      setHasCopied(true);
      toast.success("Access code copied to clipboard!");
      setTimeout(() => setHasCopied(false), 2000);
    } else {
      toast.error("Failed to copy code. Please try again.");
    }
  };

  const handleLoginNow = () => {
    navigate(`/auth`);
  };

  if (!accessCode) {
    return null; // Don't render until code is loaded
  }

  // Format code for display (e.g., 1234-5678-9012-3456)
  const formattedCode = accessCode.match(/.{1,4}/g)?.join('-') || accessCode;

  return (
    <div className="auth-container">
      <Card className="auth-card">
        <h1 className="auth-heading">Your Access Code</h1>
        
        <div className="my-6 p-4 bg-auth-accent rounded-md text-center">
          <p className="text-sm text-muted-foreground mb-2">
            Save this code to access your account
          </p>
          
          <div className="font-mono text-xl md:text-2xl tracking-wider text-foreground my-4 break-all">
            {formattedCode}
          </div>
          
          <p className="text-xs text-destructive font-medium mt-4">
            Important: Store this code securely, it cannot be recovered later!
          </p>
        </div>
        
        <div className="space-y-4">
          <Button
            onClick={handleCopyCode}
            variant="outline"
            className="w-full"
          >
            {hasCopied ? "Copied!" : "Copy to Clipboard"}
          </Button>
          
          <Button
            onClick={handleLoginNow}
            className="w-full bg-auth"
          >
            Continue to Login
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default CodeRegPage;
