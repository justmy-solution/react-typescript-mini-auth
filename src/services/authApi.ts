
import { LoginEmailResponse, RegisterAnonymousResponse, RegisterResponse, UserData, VerifyPinResponse } from "@/types/auth";

// This would normally come from your environment variables
const API_DELAY = 500; // Simulate API delay
const VALID_TEST_PIN = "123456";

// Helper to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Email validation regex
const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Check if string is a 16-digit code
const isAccessCode = (code: string) => {
  return /^\d{16}$/.test(code);
};

// Generate a random 16-digit code
const generateAccessCode = (): string => {
  return Array.from({ length: 16 }, () => Math.floor(Math.random() * 10)).join('');
};

// Auth API Service
export const authApi = {
  // Login with email (sends PIN)
  async loginWithEmail(email: string): Promise<LoginEmailResponse> {
    await delay(API_DELAY);
    
    if (!isValidEmail(email)) {
      return { 
        success: false, 
        message: "Invalid email format" 
      };
    }

    return {
      success: true,
      message: "PIN sent to your email"
    };
  },

  // Login with access code
  async loginWithCode(code: string): Promise<VerifyPinResponse> {
    await delay(API_DELAY);
    
    if (!isAccessCode(code)) {
      return { 
        success: false, 
        message: "Invalid access code format. Must be 16 digits." 
      };
    }

    // Normally we'd verify this against a database
    // For demo, check if the code is in localStorage
    const storedUsers = JSON.parse(localStorage.getItem('authUsers') || '[]');
    const user = storedUsers.find((u: UserData) => u.accessCode === code);

    if (!user) {
      return {
        success: false,
        message: "Invalid access code"
      };
    }

    return {
      success: true,
      user,
      message: "Login successful"
    };
  },

  // Register with email
  async register(email: string): Promise<RegisterResponse> {
    await delay(API_DELAY);
    
    if (!isValidEmail(email)) {
      return { 
        success: false, 
        message: "Invalid email format" 
      };
    }

    // Check if user already exists
    const storedUsers = JSON.parse(localStorage.getItem('authUsers') || '[]');
    const existingUser = storedUsers.find((u: UserData) => u.email === email);

    if (existingUser) {
      return {
        success: false,
        message: "Email already registered"
      };
    }

    return {
      success: true,
      message: "PIN sent to your email"
    };
  },

  // Register anonymous (generate access code)
  async registerAnonymous(): Promise<RegisterAnonymousResponse> {
    await delay(API_DELAY);
    
    const accessCode = generateAccessCode();
    
    // Save user to localStorage
    const user: UserData = {
      id: crypto.randomUUID(),
      accessCode,
      createdAt: Date.now()
    };

    const storedUsers = JSON.parse(localStorage.getItem('authUsers') || '[]');
    localStorage.setItem('authUsers', JSON.stringify([...storedUsers, user]));

    return {
      success: true,
      accessCode
    };
  },

  // Verify PIN
  async verifyPin(pin: string, email: string): Promise<VerifyPinResponse> {
    await delay(API_DELAY);
    
    // Check PIN format
    if (pin.length !== 6 || !/^\d+$/.test(pin)) {
      return {
        success: false,
        message: "Invalid PIN format"
      };
    }

    // For testing, accept the test PIN
    if (pin !== VALID_TEST_PIN) {
      return {
        success: false,
        message: "Invalid PIN"
      };
    }

    // Check if email is valid
    if (!isValidEmail(email)) {
      return {
        success: false,
        message: "Invalid email format"
      };
    }

    // Check if user exists, create if not
    let storedUsers = JSON.parse(localStorage.getItem('authUsers') || '[]');
    let user = storedUsers.find((u: UserData) => u.email === email);

    if (!user) {
      user = {
        id: crypto.randomUUID(),
        email,
        createdAt: Date.now()
      };
      storedUsers.push(user);
      localStorage.setItem('authUsers', JSON.stringify(storedUsers));
    }

    return {
      success: true,
      user,
      message: "PIN verified successfully"
    };
  },

  // Resend PIN
  async resendPin(email: string): Promise<LoginEmailResponse> {
    await delay(API_DELAY);
    
    if (!isValidEmail(email)) {
      return { 
        success: false, 
        message: "Invalid email format" 
      };
    }

    return {
      success: true,
      message: "New PIN sent to your email"
    };
  }
};
