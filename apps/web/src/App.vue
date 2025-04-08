<template>
  <div class="min-h-screen bg-background">
    <header class="border-b border-border">
      <div class="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 class="text-xl font-bold">Spotify Playlist Converter</h1>
        <LoginButton />
      </div>
    </header>
    
    <main class="container mx-auto px-4 py-8">
      <RouterView />
    </main>

    <VueQueryDevtools :initial-is-open="true" />
  </div>
</template>

<script setup lang="ts">
import { VueQueryDevtools } from '@tanstack/vue-query-devtools'
import LoginButton from './components/Login.vue'
import { useAuthStore } from './store/useAuthStore'

const authStore = useAuthStore()
authStore.validateAuth()
</script>
