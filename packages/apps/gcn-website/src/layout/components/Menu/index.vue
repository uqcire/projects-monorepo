<script lang="ts" name="Menu" setup>
import { Logo } from '@/layout/components/Logo';
import { GlobalOutlined } from '@vicons/antd';
import { NDivider, NIcon, NSpace } from 'naive-ui';
</script>

<template>
  <header class="bg-fgl-primary">
    <!-- top-hat -->
    <section class="header__tophat">
      <nav class="utility-navigation__wrapper">
        <section class="container">
          <n-space justify="space-between" align="center">
            <div class="utility-navigation__left">
              <ul class="primary-nav__level-one">
                <n-divider vertical />
                <li>
                  <router-link :to="{ name: 'Offices' }"> OFFICES </router-link>
                </li>
                <n-divider vertical />
                <li>
                  <router-link :to="{ name: 'Contact' }"> CONTACT </router-link>
                </li>
                <n-divider vertical />
              </ul>
            </div>
            <div class="utility-navigation__right">
              <ul class="primary-nav__level-one">
                <n-icon>
                  <GlobalOutlined />
                </n-icon>
                <li>AUSTRALIA</li>
                <!-- <n-divider vertical />
                <li>SIGN IN</li>
                <n-divider vertical /> -->
              </ul>
            </div>
          </n-space>
        </section>
      </nav>
    </section>

    <!-- nav -->
    <section class="primary-nav">
      <div class="container">
        <n-space justify="start" align="center">
          <div class="primary-nav__logo">
            <Logo text-color="text-white" />
          </div>
          <!-- <div class="primary-nav__right-wrap w-full">
            <n-space justify="space-between" align="center">
              <div class="primary-nav__nav">
                <nav>
                  <ul class="primary-nav__level-one">
                    <li>
                      <router-link :to="{ name: '404' }"> Industries </router-link>
                    </li>
                    <li>
                      <router-link :to="{ name: '404' }"> Services </router-link>
                    </li>
                    <li>
                      <router-link :to="{ name: '404' }"> Insights </router-link>
                    </li>
                    <li>
                      <router-link :to="{ name: '404' }"> Company </router-link>
                    </li>
                    <li>
                      <router-link :to="{ name: '404' }"> Careers </router-link>
                    </li>
                  </ul>
                </nav>
              </div>
            </n-space>
          </div> -->
        </n-space>
      </div>
    </section>
  </header>
</template>

<style lang="scss">
.header__tophat {
  @apply border-b border-fgl-border-color py-1;
}
.utility-navigation__left > ul > li {
  @apply text-xs;
}

.utility-navigation__right > ul > li {
  @apply text-xs;
}

.primary-nav__nav {
  max-width: 85rem;
}
.primary-nav__logo {
  @apply m-3;
}
.primary-nav__level-one {
  @apply flex flex-row flex-nowrap text-white my-auto;

  & li {
    @apply mx-2;

    &:hover {
      @apply text-fgl-coconut;
    }
  }
}
</style>
