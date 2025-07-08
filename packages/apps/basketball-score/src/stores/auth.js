import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAdmin: false,
  }),

  actions: {
    login(password) {
      // 这里使用一个简单的密码验证，实际应用中应该使用更安全的方式
      if (password === import.meta.env.VITE_ADMIN_PASSWORD) {
        this.isAdmin = true
        localStorage.setItem('isAdmin', 'true')
        return true
      }
      return false
    },

    logout() {
      this.isAdmin = false
      localStorage.removeItem('isAdmin')
    },

    checkAuth() {
      // 检查本地存储中的登录状态
      this.isAdmin = localStorage.getItem('isAdmin') === 'true'
    }
  }
})
