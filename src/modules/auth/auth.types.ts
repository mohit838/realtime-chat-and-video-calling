export interface AuthTokenPayload {
  id: number;
  email: string;
  [key: string]: unknown;
}

export interface LoginResponse {
  token: string;
}

export interface RegisterResponse {
  userId: number;
}

export interface AuthUser {
  id: number;
  email: string;
  role?: string;
}
