export const API_BASE_URL = process.env.NEXT_PUBLIC_KARIBDOCS_API_URL ?? "http://localhost:8000";

type JwtPayload = {
    exp?: number;
};

function decodeJwtPayload(token: string): JwtPayload | null {
    try {
        const parts = token.split(".");
        if (parts.length !== 3) {
            return null;
        }

        const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
        const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
        const decoded = atob(padded);
        return JSON.parse(decoded) as JwtPayload;
    } catch {
        return null;
    }
}

export function clearAuthStorage(): void {
    if (typeof window === "undefined") {
        return;
    }

    localStorage.removeItem("accessToken");
    localStorage.removeItem("isAuthenticated");
}

export function isAccessTokenValid(token: string): boolean {
    const payload = decodeJwtPayload(token);
    if (!payload || typeof payload.exp !== "number") {
        return false;
    }

    const nowInSeconds = Math.floor(Date.now() / 1000);
    return payload.exp > nowInSeconds;
}

export function hasValidAccessToken(): boolean {
    if (typeof window === "undefined") {
        return false;
    }

    const token = localStorage.getItem("accessToken");
    if (!token) {
        return false;
    }

    if (!isAccessTokenValid(token)) {
        clearAuthStorage();
        return false;
    }

    return true;
}

export function getAccessToken(): string | null {
    if (!hasValidAccessToken()) {
        return null;
    }

    return localStorage.getItem("accessToken");
}

export function requireAccessToken(): string {
    const token = getAccessToken();
    if (!token) {
        throw new Error("Token absent. Connecte-toi pour utiliser cette fonctionnalite.");
    }

    return token;
}

export async function karibFetch(path: string, init: RequestInit = {}, authenticated = true): Promise<Response> {
    const headers = new Headers(init.headers);

    if (authenticated) {
        const token = requireAccessToken();
        headers.set("Authorization", `Bearer ${token}`);
    }

    return fetch(`${API_BASE_URL}${path}`, {
        ...init,
        headers,
    });
}

export async function readErrorMessage(response: Response, fallbackMessage: string): Promise<string> {
    const data = await response.json().catch(() => null);
    return data?.detail ?? fallbackMessage;
}