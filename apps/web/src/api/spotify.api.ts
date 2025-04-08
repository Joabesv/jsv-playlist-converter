import { apiClient } from "./client"

export async function getUserProfile() {
  const user = await apiClient('/api/auth/spotify/me', {
    credentials: 'include'
  })
  return user;
}