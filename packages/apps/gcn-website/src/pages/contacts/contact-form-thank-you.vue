<script lang="ts" setup name="ContactThankYou">
import { ArrowRightOutlined } from '@vicons/antd';
import { NIcon, NSpace } from 'naive-ui';
</script>

<template>
  <article>
    <header class="hero--contact-form-thank-you">
      <div class="container">
        <div class="hero__text-content">
          <div class="hero__top-wrapper">
            <div class="hero__title-wrapper">
              <!-- title -->
              <div class="hero__title">
                <h2 class="mt-0">Thank You</h2>
              </div>

              <!-- description -->
              <div class="hero__description">
                <h6>Thank you for submitting your inquiry and getting in touch with GCN.</h6>
                <h6>Your inquiry will be directed to the appropriate team.</h6>
                <h6>we will respond as soon as possible.</h6>
                <h6>Please note: while we appreciate your questions and feedback, we are unable to respond to all inquiries.</h6>
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
.hero--contact-form-thank-you {
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
