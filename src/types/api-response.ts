export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: unknown;
}

export const successResponse = <T>(data: T, message?: string) => ({
  success: true,
  message,
  data,
});

export const errorResponse = (error: unknown, message?: string) => ({
  success: false,
  message,
  error,
});
