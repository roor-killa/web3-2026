/**
 * Configuration de l'URL de l'API.
 *
 * IMPORTANT : NEXT_PUBLIC_API_URL est injecté au BUILD time (côté serveur/SSR).
 * Dans le navigateur, le conteneur 'laravel_nginx' est inconnu.
 * → On utilise toujours localhost:8080 comme URL publique pour les requêtes client.
 */

// URL accessible depuis le navigateur (votre Mac)
const PUBLIC_API_URL = "http://localhost:8080/api";

// URL interne Docker (pour SSR côté serveur uniquement)
const INTERNAL_API_URL = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL}/api`
  : PUBLIC_API_URL;

// On choisit l'URL selon le contexte d'exécution
const API_URL =
  typeof window !== "undefined" ? PUBLIC_API_URL : INTERNAL_API_URL;

export interface ApiResponse<T = any> {
  success?: boolean;
  message?: string;
  data?: T;
  access_token?: string;
  token_type?: string;
  user?: any;
}

export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
};

export const setToken = (token: string) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("access_token", token);
};

export const removeToken = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("access_token");
};

export const apiCall = async <T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = `${API_URL}${endpoint}`;
  const token = getToken();

  const headers: Record<string, string> = {
    Accept: "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
};

export const apiGet = <T = any>(endpoint: string) =>
  apiCall<T>(endpoint, { method: "GET" });

export const apiPost = <T = any>(endpoint: string, body: any) =>
  apiCall<T>(endpoint, {
    method: "POST",
    body: JSON.stringify(body),
  });

export const apiPut = <T = any>(endpoint: string, body: any) =>
  apiCall<T>(endpoint, {
    method: "PUT",
    body: JSON.stringify(body),
  });

export const apiDelete = <T = any>(endpoint: string) =>
  apiCall<T>(endpoint, { method: "DELETE" });