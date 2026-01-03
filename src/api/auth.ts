import { use } from 'react';
import type { LoginResponseDTO, UserDTO } from '../types'
import { fetchWithAuth } from './fetchWithAuth';

export async function login(username: string, password: string) {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text);
  }

  const data: LoginResponseDTO = await res.json();
  console.log("[RECEIVED] LoginResponseDTO from log in:", data);
  
  return data;
}

export async function register(payload: {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}) {
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text);
  }

  const data: LoginResponseDTO = await res.json();

  console.log("[RECEIVED] LoginResponseDTO from sign up:", data);

  return data;
}

export async function fetchUserData(userId:number) {
  console.log("[FETCH] called with userId:", userId)
  const res = await fetchWithAuth(`/api/users/${userId}`)
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text);
  }
  const data = (await res.json()) as UserDTO
  console.log("User data fetched:", data)
  return data
}