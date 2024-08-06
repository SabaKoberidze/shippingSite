export default defineNuxtRouteMiddleware((to) => {
    const user = useSupabaseUser()
    if(!user.value && to.path === '/profile'){
        return navigateTo('/login')
    }
})