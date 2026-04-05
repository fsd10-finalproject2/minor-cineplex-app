import { post } from './http'
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  ForgotPasswordRequest,
} from '@/types/auth'

export const authApi = {
  register: (data: RegisterRequest) => post<{ message: string }>('/auth/register', data),

  login: (data: LoginRequest) => post<AuthResponse>('/auth/login', data),

  logout: () => post<{ message: string }>('/auth/logout', {}),

  forgotPassword: (data: ForgotPasswordRequest) =>
    post<{ message: string }>('/user/forgot-password', data),
}
