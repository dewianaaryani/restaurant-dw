export interface Category {
  id: string;
  name: string;
  desc: string | null;
  menuCount: number;
  created_at: string;
  updated_at: string;
}

export interface ApiError {
  error: string;
  details?: unknown;
}
