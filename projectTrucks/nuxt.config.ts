// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  nitro: {
    preset: 'node-server'
  },
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  css: ['@/assets/styles/main.scss'],
  modules: ['@pinia/nuxt', "@nuxtjs/supabase"],
  pinia: {
    storesDirs: ['./stores'],
  },
  supabase: {
    redirectOptions: {
      login: "/login",
      callback: "/profile",
      exclude: ["/"],
    },
  },
  
})

