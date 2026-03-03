const API_BASE = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/v1').replace(/\/$/, '');

export const getToken = (): string | null =>
  typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
export const setToken = (t: string) => localStorage.setItem('admin_token', t);
export const clearToken = () => localStorage.removeItem('admin_token');

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers ?? {}),
  };
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (res.status === 401) {
    clearToken();
    window.location.href = '/auth/sign-in';
    throw new Error('Unauthorized');
  }
  if (res.status === 204) return undefined as T;
  if (!res.ok) {
    const b = await res.json().catch(() => ({}));
    throw new Error(b?.error ?? b?.message ?? `HTTP ${res.status}`);
  }
  return res.json();
}

export interface AdminUser { id: number; email: string; created_at: string }
export interface Article { id: number; title: string; body: string; status: number; published: boolean; created_at: string; updated_at: string }
export interface Client { id: number; name: string; url: string; order: number; created_at: string; updated_at: string }
export interface BrandingRequest {
  id: number; business_name: string; contact_name: string; email: string; phone: string;
  industry: string; target_audience: string; logo_type: string; additional_notes: string;
  status: string; client_type: string; website: string; about_project: string;
  project_type: string; favorite_colors: string; logo_applications: string[];
  milestones: string; deadline: string; created_at: string; updated_at: string;
}
export interface Service { id: number; title: string; description: string; slug: string; created_at: string; updated_at: string }
export interface Project { id: number; title: string; description: string; url: string; created_at: string; updated_at: string }
export interface Medium { id: number; url: string; filename: string; content_type: string; created_at: string }

export const authApi = {
  login: (email: string, password: string) =>
    request<{ token: string; user: AdminUser }>('/auth/login', {
      method: 'POST', body: JSON.stringify({ session: { email, password } }),
    }),
};

export const articlesApi = {
  index:   ()                                    => request<Article[]>('/admin/articles'),
  show:    (id: number)                          => request<Article>(`/admin/articles/${id}`),
  create:  (data: Partial<Article>)              => request<Article>('/admin/articles', { method: 'POST', body: JSON.stringify({ article: data }) }),
  update:  (id: number, data: Partial<Article>)  => request<Article>(`/admin/articles/${id}`, { method: 'PUT', body: JSON.stringify({ article: data }) }),
  destroy: (id: number)                          => request<void>(`/admin/articles/${id}`, { method: 'DELETE' }),
};

export const clientsApi = {
  index:   ()                                   => request<Client[]>('/admin/clients'),
  show:    (id: number)                         => request<Client>(`/admin/clients/${id}`),
  create:  (data: Partial<Client>)              => request<Client>('/admin/clients', { method: 'POST', body: JSON.stringify({ client: data }) }),
  update:  (id: number, data: Partial<Client>)  => request<Client>(`/admin/clients/${id}`, { method: 'PUT', body: JSON.stringify({ client: data }) }),
  destroy: (id: number)                         => request<void>(`/admin/clients/${id}`, { method: 'DELETE' }),
};

export const brandingRequestsApi = {
  index:   ()           => request<BrandingRequest[]>('/admin/branding_requests'),
  show:    (id: number) => request<BrandingRequest>(`/admin/branding_requests/${id}`),
  destroy: (id: number) => request<void>(`/admin/branding_requests/${id}`, { method: 'DELETE' }),
};

export const servicesApi = {
  index:   ()                                    => request<Service[]>('/admin/services'),
  show:    (id: number)                          => request<Service>(`/admin/services/${id}`),
  create:  (data: Partial<Service>)              => request<Service>('/admin/services', { method: 'POST', body: JSON.stringify({ service: data }) }),
  update:  (id: number, data: Partial<Service>)  => request<Service>(`/admin/services/${id}`, { method: 'PUT', body: JSON.stringify({ service: data }) }),
  destroy: (id: number)                          => request<void>(`/admin/services/${id}`, { method: 'DELETE' }),
};

export const projectsApi = {
  index:   ()                                    => request<Project[]>('/admin/projects'),
  show:    (id: number)                          => request<Project>(`/admin/projects/${id}`),
  create:  (data: Partial<Project>)              => request<Project>('/admin/projects', { method: 'POST', body: JSON.stringify({ project: data }) }),
  update:  (id: number, data: Partial<Project>)  => request<Project>(`/admin/projects/${id}`, { method: 'PUT', body: JSON.stringify({ project: data }) }),
  destroy: (id: number)                          => request<void>(`/admin/projects/${id}`, { method: 'DELETE' }),
};

export const mediaApi = {
  index: () => request<Medium[]>('/admin/media'),
  create: (formData: FormData) => {
    const token = getToken();
    return fetch(`${API_BASE}/admin/media`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    }).then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json() as Promise<Medium>; });
  },
  destroy: (id: number) => request<void>(`/admin/media/${id}`, { method: 'DELETE' }),
};