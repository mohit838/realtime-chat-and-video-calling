export type UserRole = "admin" | "moderator" | "user";

export interface PaginationParams {
  page: number;
  pageSize: number;
}
