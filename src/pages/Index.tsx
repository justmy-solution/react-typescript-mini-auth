
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const Index: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  // If not authenticated, redirect to auth page
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth");
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
  };

  if (!isAuthenticated || !user) {
    return null; // Don't render until auth check completes
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md mx-auto p-6">
        <div className="text-center space-y-6">
          <h1 className="text-2xl font-bold">Welcome to Mini Auth System</h1>
          
          <div className="p-4 rounded-md bg-auth-accent">
            <h2 className="font-medium mb-2">Account Information</h2>
            <div className="text-left space-y-2">
              <p><span className="text-muted-foreground">User ID:</span> {user.id}</p>
              {user.email && <p><span className="text-muted-foreground">Email:</span> {user.email}</p>}
              {user.accessCode && (
                <p>
                  <span className="text-muted-foreground">Access Code:</span>{" "}
                  <span className="font-mono">{user.accessCode}</span>
                </p>
              )}
              <p>
                <span className="text-muted-foreground">Created:</span>{" "}
                {new Date(user.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground">
            You are successfully authenticated!
          </p>
          
          <Button onClick={handleLogout} variant="outline" className="w-full">
            Log Out
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Index;
