<template>
  <div>
    <section class="py-12">
      <div v-if="!authStore.isAuthenticated" class="text-center">
        <h2 class="text-3xl font-bold mb-6">Convert Your Spotify Playlists</h2>
        <p class="mb-8 text-muted-foreground max-w-lg mx-auto">
          Login with your Spotify account to access and convert your playlists.
        </p>
      </div>
      
      <div v-else>
        <UserProfile :profile="authStore.profile" />
        <div class="mt-8">
          <router-link to="/dashboard">
            <Button>Go to Dashboard</Button>
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import UserProfile from '@/components/UserProfile.vue'
import { useAuthStore } from '@/store/useAuthStore'
import { Button } from '@jsv-pc/ui/components/button'

const authStore = useAuthStore()
</script>