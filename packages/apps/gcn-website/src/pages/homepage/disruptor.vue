<script lang="ts" setup name="HomepageDisruptor">
import { NSpace } from 'naive-ui';
</script>

<template>
  <section>
    <div class="py-8 bg-gcn-keppel text-white">
      <n-space vertical justify="center" align="center">
        <h3>How can we help you?</h3>
        <div class="disruptor__description">
          <router-link class="disruptor__links" :to="{ name: 'Contact' }">Get in touch</router-link>
          with us or
          <router-link class="disruptor__links" :to="{ name: 'Offices' }">find our office</router-link>
          closest to you.
        </div>
      </n-space>
    </div>
  </section>
</template>

<style lang="scss">
.disruptor__text-wrapper {
  @apply py-8 bg-gcn-keppel text-white;
}
.disruptor__description {
  @apply text-xl;
}
.disruptor__links {
  @apply border-b;

  &:hover {
    @apply bg-[#3157A7];
  }
}
</style>
