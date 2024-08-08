<template>
  <HeaderComponent v-if="route.name !== 'login'"></HeaderComponent>
  <NuxtRouteAnnouncer />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
<script lang="ts" setup>
const route = useRoute()
</script>