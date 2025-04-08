<template>
  <div v-if="authStore.isAuthenticated">
    <div class="flex items-center space-x-4 p-4 bg-card rounded-lg shadow-sm">
      <Avatar v-if="profile.userAvatar">
        <AvatarImage :src="profile.userAvatar" alt="Profile" />
        <AvatarFallback>{{ profile.userName.substring(0, 2) }}</AvatarFallback>
      </Avatar>
      <div>
        <h3 class="font-medium">{{ profile.userName }}</h3>
        <p class="text-sm text-muted-foreground">{{ profile?.email }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/store/useAuthStore';
import { Avatar, AvatarImage, AvatarFallback } from '@jsv-pc/ui/components/avatar'
const { profile } = defineProps<{ profile: any }>();
const authStore = useAuthStore();
console.log(authStore.isAuthenticated)
</script>
