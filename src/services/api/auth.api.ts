import { post, get } from './http'
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  ForgotPasswordRequest,
  UserProfileResponse,
} from '@/types/auth'

export const authApi = {
  checkEmail: (email: string) => get<{ exists: boolean }>(`/auth/check-email?email=${email}`),

  register: (data: RegisterRequest) => post<{ message: string }>('/auth/register', data),

  login: (data: LoginRequest) => post<AuthResponse>('/auth/login', data),

  logout: () => post<{ message: string }>('/auth/logout', {}),

  forgotPassword: (data: ForgotPasswordRequest) =>
    post<{ message: string }>('/user/forgot-password', data),

  me: () => get<UserProfileResponse>('/user/me'),
}
