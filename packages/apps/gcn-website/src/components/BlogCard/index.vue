<script lang="ts" setup name="BlogCard">
import { NCard, NSpace } from 'naive-ui';
</script>

<template>
  <section>
    <div class="py-8">
      <n-space justify="center" align="center">
        <div class="card">
          <n-card style="max-width: 360px" hoverable>
            <template #cover>
              <a href="#">
                <img
                  src="https://www.producereport.com/sites/default/files/styles/large/public/field/image/oranges-2994617_960_540.jpg?itok=WeVHEtj8"
                />
              </a>
            </template>
            <div class="card__content-container">
              <div class="card-content">
                <a href="#">
                  <span class="card__tag">Fresh Fruits</span>
                  <h6>Australian Fruit Exports to China Drop 35% Led by Grapes, Citrus</h6>
                  <div class="card__desc">Australia’s total global fruit export value...</div>
                </a>
              </div>
            </div>
            <template #footer>
              <span class="card__footer"> Article </span>
            </template>
          </n-card>
        </div>
      </n-space>
    </div>
  </section>
</template>

<style lang="scss">
.card {
  &__tag {
    @apply text-sm text-white font-medium bg-fgl-primary p-1;
  }
  h6 {
    @apply leading-5 mt-2;
  }

  &__desc {
    @apply pt-2;
  }
  .n-card__footer {
    @apply pb-1;
  }
  &__footer {
    @apply text-xs text-fgl-text-color-3 pb-1;
  }
}
</style>
