<script lang="ts" setup name="SubscriptionThankYou">
import { ArrowRightOutlined } from '@vicons/antd';
import { NIcon, NSpace } from 'naive-ui';
</script>

<template>
  <article>
    <header class="hero--subscription-thank-you">
      <div class="container">
        <div class="hero__text-content">
          <div class="hero__top-wrapper">
            <div class="hero__title-wrapper">
              <!-- title -->
              <div class="hero__title">
                <h2 class="mt-0">Thank you for subscribing</h2>
              </div>

              <!-- description -->
              <div class="hero__description">
                <h6>
                  Once you confirm your email address, you will start receiving our latest insight on fresh produce supply chain topics that
                  matter most to you.
                </h6>
              </div>
              <div>
                <router-link class="textlink" :to="{ name: 'Home' }"
                  ><n-space align="center">
                    <span>Go back</span>
                    <n-icon class="textlink--cta">
                      <ArrowRightOutlined />
                    </n-icon> </n-space
                ></router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  </article>
</template>

<style lang="scss">
.hero--subscription-thank-you {
  .hero__text-content {
    @apply pt-8 pb-12 mb-6;
  }

  .hero__tag {
    @apply mb-1;
  }

  .hero__title-wrapper {
    @apply pt-4 px-6;
  }

  .textlink {
    @apply cursor-pointer font-lato text-lg;

    &--cta {
      top: 0.2rem;
    }

    &:hover {
      @apply text-gcn-keppel;

      .textlink--cta {
        right: -0.5rem;

        @apply text-gcn-keppel transition-all duration-200 ease-out;
      }
    }
  }
}
</style>
