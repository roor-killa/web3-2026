/**
 * Fonctions d'authentification - Sanctum Integration
 */

import { apiPost, apiGet, removeToken, ApiResponse } from './api';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface LoginResponse extends ApiResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface RegisterResponse extends ApiResponse {
  user: User;
}

/**
 * Enregistrer un nouvel utilisateur
 */
export const register = async (payload: RegisterPayload): Promise<User> => {
  const response = await apiPost<RegisterResponse>('/auth/register', payload);
  return response.user;
};

/**
 * Connexion et récupération du token
 */
export const login = async (payload: LoginPayload): Promise<LoginResponse> => {
  const response = await apiPost<LoginResponse>('/auth/login', payload);

  // sauvegarder le token
  if (response.access_token) {
    setToken(response.access_token);
  }

  return response;
};

/**
 * Récupérer les informations de l'utilisateur courant
 */
export const getCurrentUser = async (): Promise<User> => {
  const response = await apiGet<{ user: User }>('/auth/user');
  return response.user;
};

/**
 * Déconnexion (révoquer le token courant)
 */
export const logout = async (): Promise<void> => {
  try {
    await apiPost('/auth/logout', {});
  } finally {
    // Supprimer le token localement même si la requête échoue
    removeToken();
  }
};

/**
 * Lister tous les tokens de l'utilisateur
 */
export const listTokens = async (): Promise<any[]> => {
  const response = await apiGet<{ tokens: any[] }>('/auth/tokens');
  return response.tokens;
};

/**
 * Révoquer un token spécifique
 */
export const revokeToken = async (tokenId: number): Promise<void> => {
  await apiPost(`/auth/tokens/${tokenId}`, {});
};

/**
 * Révoquer tous les tokens (déconnexion partout)
 */
export const revokeAllTokens = async (): Promise<void> => {
  try {
    await apiPost('/auth/logout-all', {});
  } finally {
    removeToken();
  }
};

/**
 * Vérifier si l'utilisateur est authentifié
 */
export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('access_token');
};
export function setToken(token: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('access_token', token);
  }
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access_token');
}

