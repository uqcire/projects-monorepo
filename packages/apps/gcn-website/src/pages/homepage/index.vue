<script lang="ts" setup name="homepage">
import { NGrid, NGridItem } from 'naive-ui';
import HomepageDisruptor from './disruptor.vue';
import Hero from './hero.vue';
</script>

<template>
  <Hero />
  <section>
    <n-grid :cols="2">
      <n-grid-item class="bg-fgl-primary py-12 px-6">
        <div class="mx-6 text-white">
          <h2>A Carrier Network as Vast as the Ocean</h2>
          <p class="text-2xl">
            At GCN, transparency makes it easier to share info with carriers. The results are faster access to available space, sailings,
            and ways for you to find the ideal blend of cost and transit time.
          </p>
        </div>
      </n-grid-item>
      <n-grid-item>
        <div class="bg-image"></div>
      </n-grid-item>
    </n-grid>
  </section>

  <!-- logistics -->
  <section>
    <n-grid :cols="2">
      <n-grid-item>
        <div class="bg-image-2"></div>
      </n-grid-item>
      <n-grid-item class="py-12 px-6">
        <div class="mx-6 text-fgl-text-color-1">
          <h2>Ship, Track, and Scale</h2>
          <p class="text-2xl">
            With logistics partners in more than 80 countries, companies of any size can transport goods to and from more places with
            greater ease and agility.
          </p>
        </div>
      </n-grid-item>
    </n-grid>
  </section>

  <!-- procurement -->
  <section>
    <n-grid :cols="2">
      <n-grid-item class="bg-gray-200 py-12 px-6">
        <div class="mx-6 text-fgl-text-color-1">
          <h2>Put Your Trade Data to Work</h2>
          <p class="text-2xl">
            Your trade data has immense power. Use it wisely. GCN helps you detect and design fresh strategies to diminish risk and optimize
            performance across all your transactions.
          </p>
        </div>
      </n-grid-item>
      <n-grid-item>
        <div class="bg-image-3"></div>
      </n-grid-item>
    </n-grid>
  </section>

  <!-- disruptor -->
  <HomepageDisruptor />
</template>

<style lang="scss">
.bg-image {
  background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('../../assets/disribution-center.jpg');
  @apply bg-center bg-no-repeat bg-cover relative h-full;
}
.bg-image-2 {
  background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('../../assets/container-yard.jpg');
  @apply bg-center bg-no-repeat bg-cover relative h-full;
}

.bg-image-3 {
  background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('../../assets/market.jpg');
  @apply bg-center bg-no-repeat bg-cover relative h-full;
}
</style>
