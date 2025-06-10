
import React, { useState, ChangeEvent } from "react";
import { isAccessCode, isValidEmail } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SmartInputProps {
  onSubmit: (value: string) => void;
  isLoading: boolean;
  placeholder?: string;
  className?: string;
}

const SmartInput: React.FC<SmartInputProps> = ({
  onSubmit,
  isLoading,
  placeholder = "Email or 16-digit code",
  className
}) => {
  const [value, setValue] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Trim the input value
    const trimmedValue = value.trim();
    
    // Check if input is empty
    if (!trimmedValue) {
      setError("Please enter an email or 16-digit access code");
      return;
    }
    
    // Check if input is email or access code
    const isEmail = isValidEmail(trimmedValue);
    const isCode = isAccessCode(trimmedValue);
    
    if (!isEmail && !isCode) {
      setError("Please enter a valid email or 16-digit access code");
      return;
    }
    
    onSubmit(trimmedValue);
  };

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-4", className)}>
      <div className="space-y-2">
        <Input
          type="text"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className={cn("text-base", error ? "border-destructive" : "")}
          disabled={isLoading}
          autoComplete="off"
          autoFocus
          spellCheck={false}
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-auth" 
        disabled={isLoading || !value.trim()}
      >
        {isLoading ? "Processing..." : "Continue"}
      </Button>
    </form>
  );
};

export default SmartInput;
