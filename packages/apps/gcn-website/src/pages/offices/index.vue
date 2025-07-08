<script lang="ts" setup name="offices">
import { ContactFormCard } from '@/components/ContactFormCard';
import { ArrowRightOutlined } from '@vicons/antd';
import { NIcon, NSpace } from 'naive-ui';
</script>

<template>
  <article>
    <header class="hero--hub">
      <div class="hero__image">
        <div class="container">
          <div class="hero__text-content">
            <div class="hero__top-wrapper">
              <div class="hero__title-wrapper">
                <p class="hero__tag">GCN Office</p>
                <h2 class="hero__title">Melbourne</h2>
                <div class="hero__contact-container">
                  <div class="hero__contact-info-wrap">
                    <p class="hero__address">
                      <span>160 Fulham Road</span>
                      <br />
                      <span>Alphington, VIC 3078</span>
                      <br />
                      <span>Australia</span>
                    </p>
                    <div class="hero__directions-link">
                      <a
                        href="https://www.google.com/maps/place/160+Fulham+Rd,+Alphington+VIC+3078/@-37.7682787,145.0262267,17z/data=!3m1!4b1!4m5!3m4!1s0x6ad64412c2653037:0x28dfbc413eb120b4!8m2!3d-37.768283!4d145.0284154"
                        target="_blank"
                        class="textlink"
                      >
                        <n-space align="center">
                          <span>Get directions</span>
                          <n-icon class="textlink--cta">
                            <ArrowRightOutlined />
                          </n-icon>
                        </n-space>
                      </a>
                    </div>
                    <br />
                    <div class="hero__contact-list">
                      <span class="hero__contact-item">
                        Email:&nbsp;
                        <a href="mailto:hello@gcn-australia.com.au">hello@gcn-australia.com.au</a>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- overview -->
    <section class="overview">
      <div class="container">
        <div class="w-8/12 my-6">
          <h5>
            Launched in 2014, GCN Melbourne operates in tandem with the local fresh produce growers and logistic companies. Our collective
            Australian practice works primarily with major fresh produce importing companies throughout China and South East Asia.
          </h5>
        </div>
      </div>
    </section>

    <!-- contact form -->
    <ContactFormCard />
  </article>
</template>

<style lang="scss">
.hero--hub {
  .hero__image {
    background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
      url('https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Frydercom.com.au%2FUpload%2Flisting%2F500719559%2F500719559_1_IMG_6919.JPG&f=1&nofb=1');
    @apply bg-center bg-no-repeat bg-cover relative h-full;
  }

  .hero__text-content {
    @apply py-12;
  }

  .hero__title-wrapper {
    @apply py-4 px-6 bg-white opacity-90 border-t-8 border-gcn-keppel w-4/12;
  }

  .hero__directions-link {
    @apply text-sm;
  }

  .textlink {
    @apply cursor-pointer font-lato;

    &:hover {
      @apply text-gcn-keppel;

      .textlink--cta {
        right: -0.25rem;
        @apply text-gcn-keppel transition-all duration-200 ease-out;
      }
    }
  }

  .hero__contact-item {
    a:hover {
      @apply text-gcn-keppel;
    }
  }
}
</style>
