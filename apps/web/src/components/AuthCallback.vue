<template>
  <div class="flex flex-col items-center justify-center h-[50vh]">
    <Spinner v-if="isLoading" class="w-12 h-12" />
    <div v-if="error" class="text-destructive mt-4">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from '@kitbag/router'
import { useAuthStore } from '@/store/useAuthStore'

const router = useRouter()
const authStore = useAuthStore()
const isLoading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    await authStore.validateAuth()
    router.push('/')
  } catch (err: any) {
    error.value = err.message || 'Authentication failed'
  } finally {
    isLoading.value = false
  }
})
</script>
