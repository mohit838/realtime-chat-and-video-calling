export interface AuthTokenPayload {
  id: number;
  email: string;
}

export interface LoginResponse {
  token: string;
}

export interface RegisterResponse {
  userId: number;
  message: string;
}

export interface AuthUser {
  id: number;
  email: string;
}
