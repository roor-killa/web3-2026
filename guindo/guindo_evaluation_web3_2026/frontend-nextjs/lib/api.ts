const API_URL = "http://localhost:8080/api";

export interface ApiResponse<T = unknown> {
  success?: boolean;
  message?: string;
  data?: T;
}

export interface Certificate {
  id: number;
  student_name: string;
  title: string;
  issued_at: string;
  blockchain_hash: string;
  created_at: string;
  updated_at: string;
}

const call = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { message?: string }).message || `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
};

export const getCertificates = () =>
  call<ApiResponse<Certificate[]>>("/certificates");

export const getCertificate = (id: number) =>
  call<ApiResponse<Certificate>>(`/certificates/${id}`);

export const createCertificate = (body: Omit<Certificate, "id" | "created_at" | "updated_at">) =>
  call<ApiResponse<Certificate>>("/certificates", {
    method: "POST",
    body: JSON.stringify(body),
  });

export const deleteCertificate = (id: number) =>
  call<ApiResponse>(`/certificates/${id}`, { method: "DELETE" });
