<script lang="ts" setup name="ContactFormCard">
import { NButton } from 'naive-ui';
</script>

<template>
  <section>
    <div class="container">
      <div class="contact-form">
        <div class="w-8/12 mx-6 mt-6">
          <h3>Ready to talk?</h3>
          <p class="text-2xl">
            We work with ambitious companies who want to define the future of fresh produce supply chain, not hide from it. Together, we
            achieve extraordinary outcomes.
          </p>
          <n-button type="error">
            <router-link :to="{ name: 'Contact' }">CONTACT US</router-link>
          </n-button>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss">
.contact-form {
  @apply pb-8 mb-10 border border-fgl-text-color-3;
}
</style>
