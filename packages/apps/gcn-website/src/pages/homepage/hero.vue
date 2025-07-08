<script lang="ts" setup name="hero"></script>
<template>
  <section>
    <div class="hero-image">
      <div class="container">
        <div class="hero--homepage py-13 w-1/2 text-white pl-4">
          <p>The Working Future</p>
          <h2>Take control of your supply chain</h2>
          <p class="text-2xl">
            Accelerate performance and growth for your entire supply chain. Ship to and from anywhere. Track everything. Collaborate with
            everyone. See what happens when data drives your decisions.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss">
.hero-image {
  background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('../../assets/farm.jpeg');
  @apply bg-center bg-no-repeat bg-cover relative h-screen flex items-center;
}
</style>
