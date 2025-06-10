
export type AuthMethod = "email" | "code" | "google";

export interface UserData {
  id: string;
  email?: string;
  accessCode?: string;
  createdAt: number;
}

export interface AuthContextType {
  user: UserData | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (emailOrCode: string) => Promise<boolean>;
  register: (email: string) => Promise<boolean>;
  verifyPin: (pin: string, email: string) => Promise<boolean>;
  registerAnonymous: () => Promise<string>;
  logout: () => void;
  resendPin: (email: string) => Promise<boolean>;
  clearError: () => void;
}

export interface LoginEmailResponse {
  success: boolean;
  message: string;
}

export interface VerifyPinResponse {
  success: boolean;
  user?: UserData;
  message?: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
}

export interface RegisterAnonymousResponse {
  success: boolean;
  accessCode: string;
}
