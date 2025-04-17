import { User, ApiResponse } from '@/types';
import { API_BASE_URL, AUTH_ROUTES } from '@/config/constants';

export async function login(email: string, password: string): Promise<ApiResponse<User>> {
  try {
    const response = await fetch(`${API_BASE_URL}${AUTH_ROUTES.LOGIN}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    return { data, status: response.status };
  } catch (error) {
    return { error: 'Failed to login', status: 500 };
  }
}

export async function register(name: string, email: string, password: string): Promise<ApiResponse<User>> {
  try {
    const response = await fetch(`${API_BASE_URL}${AUTH_ROUTES.REGISTER}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();
    return { data, status: response.status };
  } catch (error) {
    return { error: 'Failed to register', status: 500 };
  }
}

export async function logout(): Promise<ApiResponse<void>> {
  try {
    const response = await fetch(`${API_BASE_URL}${AUTH_ROUTES.LOGOUT}`, {
      method: 'POST',
    });

    return { status: response.status };
  } catch (error) {
    return { error: 'Failed to logout', status: 500 };
  }
}

export async function getSession(): Promise<ApiResponse<User>> {
  try {
    const response = await fetch(`${API_BASE_URL}${AUTH_ROUTES.SESSION}`);
    const data = await response.json();
    return { data, status: response.status };
  } catch (error) {
    return { error: 'Failed to get session', status: 500 };
  }
} 