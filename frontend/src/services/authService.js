const API_URL = 'http://127.0.0.1:8000/api';

export const login = async (email, password) => {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    credentials: 'include', // habilita cookies
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error('Credenciales incorrectas');
  }

  return await response.json(); // devuelve user
};

export const getUser = async () => {
  const response = await fetch(`${API_URL}/me`, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('No autenticado');
  }

  return await response.json();
};

export const logout = async () => {
  await fetch(`${API_URL}/logout`, {
    method: 'POST',
    credentials: 'include',
  });
};