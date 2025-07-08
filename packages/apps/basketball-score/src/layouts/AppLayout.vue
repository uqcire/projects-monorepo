<script setup>
import { useAuthStore } from '@/stores/auth'
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'

const authStore = useAuthStore()
const showLoginDialog = ref(false)
const password = ref('')
const errorMessage = ref('')

onMounted(() => {
  authStore.checkAuth()
})

const openLoginDialog = () => {
  showLoginDialog.value = true
  password.value = ''
  errorMessage.value = ''
}

const handleLogin = () => {
  if (authStore.login(password.value)) {
    showLoginDialog.value = false
    password.value = ''
    errorMessage.value = ''
  } else {
    errorMessage.value = 'password is incorrect'
  }
}

const handleLogout = () => {
  authStore.logout()
}
</script>

<template>
  <div class="min-h-screen bg-base-200">
    <div class="container mx-auto p-4">
      <header class="mb-16">
        <div class="navbar bg-primary text-white p-2">
          <div class="flex-1">
            <button class="btn btn-ghost text-xl">
              <RouterLink to="/">Team</RouterLink>
            </button>
            <button class="btn btn-ghost text-xl">
              <RouterLink to="/players">Players</RouterLink>
            </button>
          </div>
          <div class="flex-none">
            <input v-if="!authStore.isAdmin" @click="openLoginDialog" type="checkbox" class="toggle" />
            <input v-else @click="handleLogout" type="checkbox" checked="checked" class="toggle" />

          </div>
        </div>
      </header>
      <main>
        <slot />
      </main>
    </div>
  </div>

  <!-- 登录对话框 -->
  <div v-if="showLoginDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="card bg-white w-96">
      <div class="card-body">
        <h2 class="card-title text-2xl font-bold pb-4">Admin Login</h2>
        <div class="flex flex-col gap-4">
          <div class="flex flex-col gap-2">
            <label class="floating-label">
              <span>Password</span>
              <input v-model="password" type="password" placeholder="Please enter the admin password" class="input"
                @keyup.enter="handleLogin" />
            </label>
          </div>
          <div v-if="errorMessage" class="text-red-500 text-sm">
            {{ errorMessage }}
          </div>
          <div class="card-actions">
            <div class="flex gap-2">
              <button @click="handleLogin" class="btn btn-primary btn-sm">
                Confirm
              </button>
              <button @click="showLoginDialog = false" class="btn btn-soft btn-sm">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
