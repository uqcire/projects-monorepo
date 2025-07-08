<script lang="ts" setup name="HomepageLogo">
import { NSpace } from 'naive-ui';

const props = defineProps({
  textColor: {
    type: String,
    required: true,
    defalut: '',
  },
});
const textColor = ref(props.textColor);
const getImage = (name: string): string => new URL(`../../../assets/logo--3-${name}.svg`, import.meta.url).href;
const logoColor = computed(() => {
  if (textColor.value === 'text-white') {
    return getImage('dark');
  }
  return getImage('light');
});
</script>

<template>
  <router-link :to="{ name: 'Home' }">
    <n-space align="center">
      <div>
        <img class="h-3 mr-1" :src="logoColor" alt="logo" />
      </div>
      <h6 class="text-xl my-0 font-tcsans font-black" :class="textColor">
        碧海聯合 <span class="font-krona">GCN</span>
        <span class="text-fgl-valencia"> .</span>
      </h6>
    </n-space>
  </router-link>
</template>
