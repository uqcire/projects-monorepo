<template>
  <div class="flex flex-col min-h-screen w-full overflow-x-hidden bg-[#FDF9E6]">
    <AppHeader />
    <main class="flex-grow w-full overflow-x-hidden">
      <slot />
    </main>

    <AppFooter v-if="!$route.meta.hideFooter" />
  </div>
</template>

<script setup>
import AppFooter from '@/components/common/AppFooter.vue';
import AppHeader from '@/components/common/AppHeader.vue';
import { useRoute } from 'vue-router';

const route = useRoute();
</script>
