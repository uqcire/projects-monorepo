<script lang="ts" setup name="404">
import { ContactFormCard } from '@/components/ContactFormCard';
</script>

<template>
  <article class="mb-12">
    <div class="container">
      <div id="sub-section-start">
        <header class="hero--hub hero--hub-no-image">
          <div class="hero__text-content">
            <div class="hero__top-wrap">
              <div class="title-wrap">
                <div class="hero__title">
                  <h1 class="mt-8 mb-2">404 Error</h1>
                </div>
              </div>
            </div>
          </div>
        </header>
        <div>
          <h4>We're sorry, but the page you requested has moved or doesn't exist. We suggest you:</h4>
          <ul class="list-disc text-xl">
            <li class="mb-1">Use the "Back" button in your browser to return to the previous page</li>
            <li>Return to the GCN <router-link class="textlink" :to="{ name: 'Home' }">home page</router-link></li>
          </ul>
          <p class="text-xl">Or, <router-link class="textlink" :to="{ name: 'Contact' }">contact us.</router-link></p>
        </div>
      </div>
    </div>
  </article>
  <ContactFormCard />
</template>

<style lang="scss" scoped>
.hero--hub {
  @apply mb-0;
}

.textlink {
  @apply border-b border-gcn-keppel;

  &:hover {
    @apply border-b-0 text-gcn-keppel;
  }
}
</style>
