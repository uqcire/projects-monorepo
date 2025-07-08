<script setup>
import GarlicPickle from '@/assets/product__garlic--pickle.png';
import SauceRoast from '@/assets/product__sauce--garlic--roast.png';
import SauceUmami from '@/assets/product__sauce--garlic--umami.png';
</script>

<template>
  <div class="relative min-h-screen overflow-hidden bg-[#ED6C2B] text-[#FDF9E6]">
    <!-- Yellow Background Shape -->
    <div class="absolute -right-1/2 top-0 z-0 h-[150%] w-[150%] bg-[#FFD400]"
      style="clip-path: ellipse(50% 60% at 80% 50%)"></div>

    <!-- Giant "Contact" text -->
    <div
      class="absolute -bottom-16 left-1/2 z-10 w-full -translate-x-1/2 text-center font-extrabold leading-none lg:-bottom-24"
      style="font-size: 28vw">
      contact
    </div>

    <!-- Main Content Grid -->
    <main class="relative z-20 mx-auto max-h-screen">
      <!-- Middle Column: Contact Info -->
      <div class="absolute left-[8.2rem] top-[16vh] w-[43.2rem] flex flex-col gap-4">
        <div class="flex gap-4 items-center">
          <div class="flex h-15 w-15 shrink-0 items-center justify-center rounded-full border-2 border-[#FDF9E6] p-2">
            <span><i-fa6-brands:instagram class="h-10 w-10" /></span>
          </div>
          <div class="flex h-15 w-15 shrink-0 items-center justify-center rounded-full border-2 border-[#FDF9E6] p-2">
            <span><i-simple-icons:xiaohongshu class="h-10 w-10" /></span>
          </div>
        </div>
        <div class="text-2xl font-basic flex flex-col gap-4">
          <p>Have something to say? So do we.</p>
          <p>
            Whether you're a home cook who fell in love with garlic, a retailer curious about stocking our jars, or just
            someone who misses the taste of "home" We'd love to hear from you. We're building more than a garlic brand.
            We're bringing flavor, family and authenticity to every table.
          </p>
          <p class="font-bold">Drop us a line. Your ideas, stories and tastebuds are all welcome here.</p>
        </div>

      </div>

      <div class="absolute left-[8.2rem] top-[62vh]">
        <a href="mailto:hello@dflm.com.au" class="font-basic text-6xl font-black hover:underline">
          hello@dflm.com.au
        </a>
      </div>

      <!-- Right Column: Floating Products -->
      <div>
        <div class="absolute top-[12vh] right-[36.5rem]">
          <img :src="GarlicPickle" alt="Pickle Garlic" class="w-[28rem] -rotate-24" />
        </div>
        <div class=" absolute top-[40vh] right-[28.5rem]">
          <img :src="SauceRoast" alt="Roast Garlic Sauce" class="w-[26rem] rotate-16" />
        </div>
        <div class="absolute right-[12.5rem]">
          <img :src="SauceUmami" alt="Umami Sauce" class="w-[36rem] rotate-8" />
        </div>
      </div>

    </main>
  </div>
</template>

<style scoped>
/* Using a more specific font could improve the look, but sticking to font-sans for now. */
</style>
