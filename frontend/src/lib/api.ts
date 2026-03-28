import { useAuthStore } from '../stores/authStore'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const getHeaders = () => {
  const token = useAuthStore.getState().token
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  return headers
}

export const api = {
  products: {
    getAll: () => fetch(`${API_URL}/products`, { headers: getHeaders() }).then(res => res.json()),
    getById: (id: number) => fetch(`${API_URL}/products/${id}`, { headers: getHeaders() }).then(res => res.json()),
    create: (data: unknown) => fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    }).then(res => res.json()),
    update: (id: number, data: unknown) => fetch(`${API_URL}/products/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    }).then(res => res.json()),
    delete: (id: number) => fetch(`${API_URL}/products/${id}`, { 
      method: 'DELETE',
      headers: getHeaders()
    }).then(res => res.json()),
  },
  sales: {
    getAll: () => fetch(`${API_URL}/sales`, { headers: getHeaders() }).then(res => res.json()),
    create: (data: unknown) => fetch(`${API_URL}/sales`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    }).then(res => res.json()),
  },
  auth: {
    login: (data: unknown) => fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(res => res.json()),
    register: (data: unknown) => fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(res => res.json()),
  }
};
