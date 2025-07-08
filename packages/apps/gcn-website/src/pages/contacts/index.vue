<script lang="ts" setup name="Contact">
import { ContactFormCard } from '@/components/ContactFormCard';
import { ArrowRightOutlined } from '@vicons/antd';
import { NDivider, NGrid, NGridItem, NIcon, NSpace } from 'naive-ui';
</script>

<template>
  <article>
    <header class="hero--contact">
      <div class="container">
        <div class="hero__text-content">
          <div class="hero__top-wrapper">
            <div class="hero__title-wrapper">
              <p class="hero__tag">About GCN</p>
              <n-space justify="space-between" align="baseline">
                <!-- title -->
                <div class="hero__title">
                  <h2 class="mt-0">Contact Us</h2>
                </div>

                <!-- description -->
                <div class="hero__description">
                  <p class="text-4xl">Thanks for your interest. How can we help?</p>
                </div>
              </n-space>
            </div>
          </div>
        </div>
      </div>
    </header>
  </article>

  <!-- contact details -->
  <section class="pb-8">
    <div class="container">
      <n-grid :cols="3">
        <!-- office -->
        <n-grid-item class="contact__item">
          <n-space justify="center" align="center">
            <div>
              <h4>Melbourne</h4>
              <div>
                <p>
                  <span>Green Consolidated (Aust) Pty. Ltd.</span>
                  <br />
                  <span>160 Fulham Road</span>
                  <br />
                  <span>Alphington, VIC 3078</span>
                  <br />
                  <span>Australia</span>
                  <br />
                  <n-divider />
                  <span class="contact__item-email">
                    Email:&nbsp;
                    <a href="mailto:hello@gcn-australia.com.au">hello@gcn-australia.com.au</a>
                  </span>
                </p>
              </div>
            </div>
          </n-space>
        </n-grid-item>

        <!-- sales & marketing -->
        <n-grid-item class="contact__item">
          <n-space justify="center" align="center">
            <div>
              <h4>New Business</h4>
              <div>
                <p>
                  <span>Would you like to hire us?</span>
                  <br />
                  <span>Our dedicated case teams typically</span>
                  <br />
                  <span>partner with clients over their fresh produce</span>
                  <br />
                  <span>supply chain issues.</span>
                  <n-divider />
                  <span class="contact__item-email">
                    Email:&nbsp;
                    <a href="mailto:eric.qu@gcn-australia.com.au">eric.qu@gcn-australia.com.au</a>
                  </span>
                </p>
              </div>
            </div>
          </n-space>
        </n-grid-item>

        <!-- logistics -->
        <n-grid-item class="contact__item">
          <n-space justify="center" align="center">
            <div>
              <h4>Supply Chain</h4>
              <div>
                <p>
                  <span>Got an issue for supply chain</span>
                  <br />
                  <span>or logistics</span>
                  <br />
                  <span>Our dedicated experts team can</span>
                  <br />
                  <span>provide the best solution you need.</span>
                  <br />
                  <n-divider />
                  <span class="contact__item-email">
                    Email:&nbsp;
                    <a href="mailto:chris.huang@gcn-australia.com.au">chris.huang@gcn-australia.com.au</a>
                  </span>
                </p>
              </div>
            </div>
          </n-space>
        </n-grid-item>
      </n-grid>
    </div>
  </section>

  <!-- card to office page -->
  <section class="pb-8">
    <div class="container">
      <router-link :to="{ name: 'Offices' }">
        <div class="hero__image">
          <n-space align="center">
            <div class="textlink">
              <h3>
                We wrok as one to help you achieve the extraorinary.
                <n-icon class="textlink--cta">
                  <ArrowRightOutlined />
                </n-icon>
              </h3>
            </div>
          </n-space>
        </div>
      </router-link>
    </div>
  </section>
  <ContactFormCard />
</template>

<style lang="scss" scoped>
.hero--contact {
  .hero__text-content {
    @apply pt-4;
  }

  .hero__tag {
    @apply mb-1;
  }

  .hero__title-wrapper {
    @apply py-4 px-6;
  }
}

.contact__item {
  @apply border border-fgl-text-color-3;

  &-email {
    a:hover {
      @apply text-gcn-keppel;
    }
  }
}

.hero__image {
  background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('../../assets/160-fulham.jpg');
  @apply bg-center bg-no-repeat bg-cover relative h-full;
}
.textlink {
  @apply text-white py-12 mx-6 w-2/3;

  &:hover {
    .textlink--cta {
      right: -0.5rem;
      @apply text-gcn-keppel transition-all duration-300 ease-linear;
    }
  }

  &--cta {
    @apply top-1;
  }
}
</style>
