<template>
  <!-- Header -->
  <header class="fixed top-0 left-0 right-0 z-[9000] w-full overflow-x-hidden">
    <div class="max-w-[2000px] mx-auto px-8 pt-8">
      <div class="flex items-center justify-between">
        <div class="flex gap-6 items-center transition-all duration-300"
          :class="{ 'opacity-100 translate-y-0': !isScrolled, 'opacity-0 -translate-y-10': isScrolled }">
          <router-link to="/">
            <img :src="Logo" alt="Logo" class="w-20 h-20" />
          </router-link>
          <span class="text-6xl font-black font-pilar text-[#7F0506]">
            <router-link to="/">
              OneSpoon
            </router-link>
          </span>
        </div>

        <!-- 汉堡包菜单按钮 - 在联系页面隐藏 -->
        <button v-if="$route.path !== '/contact'" @click="toggleMenu"
          class="btn btn-ghost p-3 border-none bg-transparent hover:bg-[#77C6B5] transition-colors duration-200">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-[#7F0506]" fill="none" viewBox="0 0 24 24"
            stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </div>
  </header>

  <!-- Menu Layer - 下拉菜单配全屏模糊背景 -->
  <Teleport to="body">
    <Transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0"
      enter-to-class="opacity-100" leave-active-class="transition ease-in duration-200" leave-from-class="opacity-100"
      leave-to-class="opacity-0">
      <div v-if="isMenuOpen" class="fixed inset-0 z-[99999] bg-black/20 backdrop-blur-sm" @click="closeMenu">
        <!-- 下拉菜单内容 -->
        <div class="absolute top-24 right-8 bg-[#ED6C2B] rounded-[24vw] shadow-xl" @click.stop>
          <div class="p-18">
            <router-link to="/about" @click="closeMenu"
              class="block text-[#7F0506] font-black text-8xl pb-4 font-pilar hover:bg-[#7F0506]/10  transition-all duration-200">
              About
            </router-link>

            <router-link to="/contact" @click="closeMenu"
              class="block text-[#7F0506] font-black text-8xl pb-4 font-pilar hover:bg-[#7F0506]/10  transition-all duration-200">
              Contact
            </router-link>
            <a href="http://dflmgro.com/enindex.aspx" target="_blank" rel="noopener noreferrer" @click="closeMenu"
              class="transition-all duration-200">
              <img :src=ESunrise alt="E-Sunrise Logo" />
            </a>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import ESunrise from '@/assets/brand__logo--e-sunrise-group.png';
import Logo from '@/assets/brand__logo--primary-garlic-outline.png';
import { onMounted, onUnmounted, ref } from 'vue';

const isScrolled = ref(false);
const isMenuOpen = ref(false);

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50;
};

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = () => {
  isMenuOpen.value = false;
};

// 按 ESC 键关闭菜单
const handleEscKey = (event) => {
  if (event.key === 'Escape') {
    closeMenu();
  }
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  document.addEventListener('keydown', handleEscKey);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  document.removeEventListener('keydown', handleEscKey);
});
</script>
