<script setup>
import Figure from '@/assets/brand__character--haosuandao--mascot.png';
import SaucesCombo from '@/assets/product__sauce--garlic--combo-lineup.png';
import SauceDishes from '@/assets/visual__dishes--garlic-sauce-application.png';
</script>

<template>
  <section class="relative min-h-screen w-full overflow-hidden">
    <!-- 背景SVG -->
    <svg class="absolute inset-0 w-full h-full z-0" viewBox="0 0 1920 900" preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg">
      <!-- 红色底色 -->
      <rect width="1920" height="900" fill="#FFD400" />
      <!-- 黄色有机形状（放大并偏移，形成大面积覆盖） -->
      <path fill="#77C6B5"
        d="M24.8,-39.8C32.3,-38.7,38.5,-32.3,44.7,-24.8C50.8,-17.2,56.8,-8.6,61.2,2.5C65.5,13.6,68,27.2,63.7,37.9C59.4,48.5,48.2,56.3,36.4,54.9C24.7,53.5,12.3,42.9,1.5,40.3C-9.4,37.7,-18.7,43.2,-25.6,41.8C-32.5,40.4,-36.9,32.1,-36.5,24C-36.2,15.9,-31,8,-32,-0.6C-33,-9.1,-40.1,-18.2,-39,-23.8C-37.9,-29.3,-28.6,-31.3,-20.7,-32.1C-12.8,-33,-6.4,-32.8,1.1,-34.8C8.7,-36.7,17.4,-40.9,24.8,-39.8Z"
        transform="translate(700 1100) scale(24,24)" />
    </svg>
    <!-- 主标题 -->
    <div class="absolute left-0 top-7/14 -translate-y-1/2 z-10 p-12">
      <h1 class="font-black font-basic text-[7vw] leading-[0.95] text-[#7F0506] drop-shadow-lg">
        <span class="text-[9vw]">Real garlic</span><br>
        <span class="text-[9vw]">Big flavor</span><br>
        <span>Zero nonsense</span>
      </h1>
    </div>

    <!-- 右边副标题 -->
    <div class="absolute right-1/30 top-2/10 z-20 p-8 w-[24vw]">
      <div class="text-[#7F0506] font-black text-5xl font-basic leading-tight drop-shadow-lg">
        No additives. <br>
        No shortcuts. <br>
        Just one spoon of bold, honest flavor, ready when you are.
      </div>
    </div>

    <!-- 左下角次要信息 -->
    <div
      class="absolute left-0 bottom-16 z-20 text-[#7F0506] font-black text-2xl font-basic w-[46vw] drop-shadow-lg p-12">
      With over 20 years of garlic expertise and a clean-label commitment, Haosuandao brings you flavor that's easy to
      use, full of taste, and made to brighten everyday cooking. One spoon at a time. <span
        class="inline-block">♡</span>
    </div>

    <!--  人物插画（用你的图片或 SVG 替换） -->
    <div class="absolute right-0 top-5/10 -translate-x-1/8 -translate-y-9/20 z-10">
      <img :src="Figure" alt="Hero Illustration" class="w-[48vw] h-auto object-contain" />
    </div>
  </section>

  <!-- Section 2: Company Information -->
  <section class="relative mx-auto p-12 pb-12">
    <div class="flex flex-col gap-12">
      <h2 class="font-black text-8xl font-basic text-[#7F0506] leading-tight pl-64">
        A Spoonful of Garlic, No Nonsense. All Yum.
      </h2>
      <div class="flex">
        <!-- 左侧图片容器 -->
        <div class="relative w-[50%] flex items-center justify-center pb-48">
          <!-- 叠加的图片 -->
          <img :src="SaucesCombo" alt="Garlic Sauces Set" class="w-auto h-[60vh] object-contain" />
        </div>

        <!-- 右侧文字 -->
        <div class="flex flex-col gap-4 w-[36rem]">
          <div class="font-bold text-[#7F0506] text-2xl">We make garlic that's real, clean, and ready when you are. ♡
          </div>
          <div class="flex flex-col gap-4 font-bold font-basic text-lg text-[#7F0506]">
            <p>
              Haosuandao is a garlic-focused condiment brand developed by Jiangsu Liming Food Group, one of China's
              leading agricultural enterprises with over 20 years of experience in garlic production and processing.
            </p>
            <p>
              We are committed to real ingredients and honest flavor. Each jar is made with authentic garlic and
              contains no added preservatives, colorants, or artificial flavors. Our mission is to offer a healthier and
              more convenient way to enjoy the richness of garlic in everyday meals.
            </p>
            <p>
              Supported by the supply chain strength and strict quality standards of Liming Group, Haosuandao combines
              traditional garlic craftsmanship with the needs of modern kitchens. Whether it's a quick solo dish or a
              shared dinner, we believe every spoonful of flavor should feel natural, effortless, and full of heart.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Section 3: Photos -->
  <!-- Blob Overlays -->
  <div class="relative w-full h-0 z-20 overflow-visible" style="margin-top: -15vh;">
    <img :src="SauceDishes" alt="Garlic Sauces Dishes Application" class="absolute -right-[6vw] w-[60vw]" />
  </div>
  <section
    class="relative w-full min-h-[60vh] overflow-hidden bg-[#ED6C2B] flex flex-col justify-center items-center py-16">
    <!-- 波浪分割线 -->
    <div class="absolute top-0 left-0 w-full h-32 z-0"
      style="background: #FDF9E6; border-radius: 0 0 100% 100% / 0 0 80% 80%;"></div>
    <!-- 主要文案 -->
    <div class="relative z-30 mt-24 flex flex-col items-start pt-32">
      <h2 class="font-black font-basic text-5xl leading-tight text-[#FDF9E6] drop-shadow-lg pl-48 w-1/2">
        One spoon of real garlic, zero stress. Full flavor made simple, with nothing fake and nothing extra.
      </h2>
    </div>
  </section>

  <!-- About Us Section -->
  <section class="relative min-h-screen w-full overflow-hidden bg-[#77C6B5]">
    <!-- 蓝色有机形状背景 -->
    <svg class="absolute inset-0 w-full h-full z-0" viewBox="-100 0 1920 1000" preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg">
      <!-- 蓝色大椭圆形状 -->
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <path fill="#ED6C2B"
          d="M43.4,-65.1C55.2,-60,62.8,-46.1,59.7,-33.1C56.6,-20.1,42.7,-8,36.7,2.4C30.7,12.7,32.6,21.4,32.2,35.6C31.8,49.8,29.1,69.7,18.7,80.3C8.4,90.8,-9.5,92,-24.1,85.9C-38.7,79.9,-50.1,66.6,-60,53.1C-69.8,39.7,-78.1,26,-74.4,14.2C-70.7,2.3,-55,-7.8,-42.9,-13.4C-30.7,-19,-22.2,-20.1,-15.6,-27.6C-9.1,-35,-4.5,-48.9,5.7,-57.7C15.8,-66.5,31.7,-70.2,43.4,-65.1Z"
          transform="translate(100 100)" />
      </svg>
    </svg>

    <!-- 主要内容 -->
    <div class="relative z-20 flex flex-col items-center justify-center min-h-screen text-center px-12 gap-8">
      <!-- 主标题 -->
      <h2 class="font-black font-basic text-[4.5vw] leading-tight text-[#FDF9E6] max-w-4xl drop-shadow-lg">
        All the authentic garlic you need is in OneSpoon
      </h2>
      <!-- 描述文字 -->
      <p class="text-[#FDF9E6] text-xl font-bold font-basic leading-relaxed max-w-3xl drop-shadow-lg">
        Across every corner of the kitchen, enthusiasts of real flavor will find authentic spots
        to suit every taste and dish, leaving with a smile on their face and the certainty of having
        experienced the very best that garlic has to offer.
      </p>
      <!-- CTA 按钮 -->
      <router-link to="/about"
        class="inline-block px-12 py-4 border-2 border-[#FDF9E6] text-[#FDF9E6] font-bold text-xl rounded-full hover:bg-[#7F0506] hover:text-[#FDF9E6] transition-all duration-300 drop-shadow-2xl">
        About us
      </router-link>
    </div>
  </section>
</template>

<style></style>
