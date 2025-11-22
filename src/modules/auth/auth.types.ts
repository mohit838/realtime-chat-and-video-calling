export interface AuthTokenPayload {
  id: number;
  email: string;
  roles: string[];
  [key: string]: unknown;
}

export interface AuthUser {
  id: number;
  email: string;
  roles: string[];
}

export interface RegisterResponse {
  id: number;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}
