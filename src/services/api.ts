const API_URL = "https://api-bancaria.com/api";

export const api = {
  async fetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `Erro ${response.status}: ${response.statusText}`);
    }

    return response.json();
  },

  setAuthToken(token: string) {
    return {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };
  }
};