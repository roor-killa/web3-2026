/**
 * Client HTTP pour KaribMarket FastAPI (localhost:8000)
 * Séparé du client Laravel pour ne pas interférer
 */

const FASTAPI_URL = (process.env.NEXT_PUBLIC_FASTAPI_URL ?? "http://localhost:8000") + "/api/v1";

// Token spécifique FastAPI (stocké séparément du token Laravel)
export const getFastapiToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("fastapi_token");
};

export const setFastapiToken = (token: string) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("fastapi_token", token);
};

export const removeFastapiToken = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("fastapi_token");
};

const fastapiCall = async <T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = `${FASTAPI_URL}${endpoint}`;
  const token = getFastapiToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || `HTTP ${response.status}`);
  }

  return response.json();
};

// -------------------------
// Auth FastAPI
// -------------------------
export const fastapiLogin = async (
  email: string,
  password: string
): Promise<void> => {
  const body = new URLSearchParams({ username: email, password });

  const response = await fetch(`${FASTAPI_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  if (!response.ok) throw new Error("Identifiants invalides");

  const data = await response.json();
  setFastapiToken(data.access_token);
};

export const fastapiRegister = async (
  nom: string,
  email: string,
  telephone: string,
  mot_de_passe: string
): Promise<void> => {
  const response = await fetch(`${FASTAPI_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nom, email, telephone, mot_de_passe }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || "Erreur lors de l'inscription");
  }
};

// -------------------------
// Dashboard stats
// -------------------------
export interface DashboardStats {
  total_urls: number;
  urls_actives: number;
  total_donnees: number;
  derniere_maj: string | null;
}

export const getDashboardStats = (): Promise<DashboardStats> =>
  fastapiCall("/admin/scrape-urls/stats");

// -------------------------
// Scrape URLs
// -------------------------
export interface ScrapeUrl {
  id: number;
  url: string;
  label: string | null;
  actif: boolean;
  created_at: string | null;
  last_scraped_at: string | null;
  nb_donnees: number;
}

export const getScrapeUrls = (): Promise<ScrapeUrl[]> =>
  fastapiCall("/admin/scrape-urls");

export const addScrapeUrl = (url: string, label?: string): Promise<ScrapeUrl> =>
  fastapiCall("/admin/scrape-urls", {
    method: "POST",
    body: JSON.stringify({ url, label }),
  });

export const deleteScrapeUrl = (id: number): Promise<void> =>
  fastapiCall(`/admin/scrape-urls/${id}`, { method: "DELETE" });

export const toggleScrapeUrl = (id: number, actif: boolean): Promise<ScrapeUrl> =>
  fastapiCall(`/admin/scrape-urls/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ actif }),
  });

// -------------------------
// Prix Kiprix
// -------------------------
export interface Produit {
  id: number;
  name: string;
  price_france: string | null;
  price_dom: string | null;
  difference: string | null;
  territory: string | null;
  territory_name: string | null;
  scraped_at: string | null;
}

export const getProduits = (params?: {
  search?: string;
  territory?: string;
  page?: number;
}): Promise<{ total: number; page: number; limit: number; resultats: Produit[] }> => {
  const query = new URLSearchParams();
  if (params?.search) query.set("search", params.search);
  if (params?.territory) query.set("territory", params.territory);
  if (params?.page) query.set("page", String(params.page));
  return fastapiCall(`/prix?${query.toString()}`);
};
