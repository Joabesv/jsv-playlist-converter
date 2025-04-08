<template>
  <Button 
    v-if="!authStore.isAuthenticated" 
    @click="authStore.login" 
    :disabled="authStore.isLoading"
    class="flex items-center gap-2"
  >
    <Disc class="h-5 w-5" />
    <span>Login with Spotify</span>
  </Button>
  <Button 
    v-else
    @click="authStore.logout" 
    :disabled="authStore.isLoading"
    variant="outline"
    class="flex items-center gap-2"
  >
    <LogOutIcon class="h-4 w-4" />
    <span>Logout</span>
  </Button>
</template>

<script setup lang="ts">
import { Button } from '@jsv-pc/ui/components/button'
import { useAuthStore } from '@/store/useAuthStore'
import { Disc, LogOutIcon } from 'lucide-vue-next'
const authStore = useAuthStore()
</script>