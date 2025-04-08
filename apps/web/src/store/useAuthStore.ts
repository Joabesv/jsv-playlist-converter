import { apiClient } from "@/api/client";
import { defineStore } from "pinia"
import { computed, ref } from "vue"

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(false);
  const profile = ref<any | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const userAvatar = computed(() => {
    return profile.value?.images?.[0]?.url || '';
  });

  const userName = computed(() => {
    return profile.value?.display_name || 'User';
  });

  async function login() {
    isLoading.value = true;
    error.value = null;
    try {
      // Make a GET request to get the authorization URL
      const response = await apiClient<{ url: string }>('/api/auth/spotify', {
        credentials: 'include',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      // Redirect to Spotify OAuth
      if (response.url) {
        window.location.href = response.url;
      } else {
        throw new Error('No authorization URL returned');
      }
    } catch (err) {
      error.value = 'Failed to start authentication';
      console.error(err);
    } finally {
      isLoading.value = false;
    }
  }

  async function logout() {
    isLoading.value = true;
    error.value = null;
    try {
      await apiClient('/api/auth/spotify/logout', {
        credentials: 'include'
      });
      isAuthenticated.value = false;
      profile.value = null;
    } catch (err) {
      error.value = 'Failed to logout';
      console.error(err);
    } finally {
      isLoading.value = false;
    }
  }

  async function refreshToken() {
    try {
      await apiClient('/api/auth/spotify/refresh', {
        credentials: 'include'
      });
      return true;
    } catch (err) {
      console.error('Failed to refresh token:', err);
      return false;
    }
  }

  async function validateAuth() {
    try {
      const { valid } = await apiClient<{ valid: boolean }>('/api/auth/spotify/validate', {
        credentials: 'include'
      });
      
      isAuthenticated.value = valid;
      
      if (valid) {
        // If valid, fetch profile data
        try {
          profile.value = await apiClient<UserProfile>('/api/auth/spotify/me', {
            credentials: 'include'
          });
        } catch (profileErr) {
          console.error('Error fetching profile:', profileErr);
        }
      }
      
      return valid;
    } catch (err) {
      console.error('Error validating auth:', err);
      isAuthenticated.value = false;
      return false;
    }
  }

  return {
    isAuthenticated,
    profile,
    isLoading,
    error,
    userAvatar,
    userName,
    login,
    logout,
    refreshToken,
    validateAuth
  };
});