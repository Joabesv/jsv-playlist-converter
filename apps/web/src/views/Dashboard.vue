<template>
  <div>
    <h2 class="text-2xl font-bold mb-6">Your Spotify Dashboard</h2>
    
    <div v-if="isLoading" class="flex justify-center">
      Aguardando...
    </div>
    
    <div v-else-if="isError" class="text-destructive">
      Failed to load profile data
    </div>
    
    <div v-else>
      <UserProfile :profile="profile" />
      
      <!-- Here you would add components for playlist management -->
      <div class="mt-8">
        <h3 class="text-xl font-semibold mb-4">Your Playlists</h3>
        <p class="text-muted-foreground">
          Feature coming soon: View and convert your Spotify playlists
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import UserProfile from '@/components/UserProfile.vue'
import { useUserProfile } from '@/api/spotify.queries'

const { data: profile, isError, isLoading } = useUserProfile(1000 * 5)
console.log(profile.value)
</script>