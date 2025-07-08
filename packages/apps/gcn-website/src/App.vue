<script lang="ts" setup name="App">
import theme from '@/styles/naive-ui-theme-overrides.json';
import { GlobalThemeOverrides, NConfigProvider, NLayout, NLayoutHeader, NLayoutFooter, NLayoutContent } from 'naive-ui';
import { Footer } from '@/layout/components/Footer';
import { Menu } from '@/layout/components/Menu';

const themeOverrides: GlobalThemeOverrides = theme;
</script>

<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <n-layout :native-scrollbar="false">
      <!-- header -->
      <n-layout-header>
        <Menu />
      </n-layout-header>

      <!-- main -->
      <n-layout-content>
        <main>
          <router-view></router-view>
        </main>
      </n-layout-content>

      <!-- footer -->
      <n-layout-footer>
        <Footer />
      </n-layout-footer>
    </n-layout>
  </n-config-provider>
</template>
