
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { formatTimeRemaining } from "@/lib/utils";

interface PinInputProps {
  onSubmit: (pin: string) => void;
  onResend: () => void;
  isLoading: boolean;
  length?: number;
}

const PinInput: React.FC<PinInputProps> = ({
  onSubmit,
  onResend,
  isLoading,
  length = 6
}) => {
  const [pin, setPin] = useState<string[]>(Array(length).fill(""));
  const [timer, setTimer] = useState<number>(60);
  const [timerActive, setTimerActive] = useState<boolean>(true);
  const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(length).fill(null));

  // Initialize and handle the countdown timer
  useEffect(() => {
    let interval: number | undefined;
    
    if (timerActive && timer > 0) {
      interval = window.setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setTimerActive(false);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer, timerActive]);

  // Handle PIN input changes
  const handleChange = (index: number, value: string) => {
    // Allow only digits
    if (!/^\d*$/.test(value)) return;
    
    const newPin = [...pin];
    newPin[index] = value.slice(-1); // Take only the last character if multiple are pasted
    setPin(newPin);
    
    // Auto-focus next input
    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
    
    // Check if all digits are entered
    if (newPin.every(digit => digit !== "") && !newPin.includes("")) {
      // Automatically submit if all digits are filled
      onSubmit(newPin.join(""));
    }
  };

  // Handle key presses
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      // Focus previous input when backspace is pressed on empty input
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      // Focus previous input on left arrow key
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      // Focus next input on right arrow key
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullPin = pin.join("");
    if (fullPin.length === length) {
      onSubmit(fullPin);
    }
  };

  // Handle resend PIN
  const handleResend = () => {
    onResend();
    setTimer(60);
    setTimerActive(true);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="pin-input-container">
          {pin.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              disabled={isLoading}
              className="pin-input"
              autoFocus={index === 0}
            />
          ))}
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-auth" 
          disabled={isLoading || pin.includes("") || pin.length !== length}
        >
          {isLoading ? "Verifying..." : "Verify PIN"}
        </Button>
      </form>
      
      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-2">
          Didn't receive a PIN?
        </p>
        {timerActive ? (
          <p className="text-sm text-muted-foreground">
            Resend PIN in {formatTimeRemaining(timer)}
          </p>
        ) : (
          <Button
            variant="ghost"
            onClick={handleResend}
            disabled={isLoading}
            className="text-auth hover:text-auth hover:bg-auth-accent"
          >
            Resend PIN
          </Button>
        )}
      </div>
    </div>
  );
};

export default PinInput;
