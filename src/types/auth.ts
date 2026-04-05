export interface RegisterRequest {
  name: string
  email: string
  password: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface AuthResponse {
  accessToken: string
  userId: string
  email: string
  name: string
}

export interface ForgotPasswordRequest {
  email: string
}
