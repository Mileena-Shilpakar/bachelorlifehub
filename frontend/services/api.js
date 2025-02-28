// services/api.js
const API_URL = "http://127.0.0.1:8000/api";

export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) return null;

  try {
    const response = await fetch(`${API_URL}/user/token/refresh/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    const data = await response.json();
    if (response.ok && data.access) {
      localStorage.setItem('accessToken', data.access);
      return data.access;
    }
  } catch (error) {
    console.error('Error refreshing token:', error);
  }
  return null;
};