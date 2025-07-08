<script lang="ts" setup name="Footer">
import { Logo } from '@/layout/components/Logo';
// import { InstagramFilled, LinkedinFilled, WechatFilled } from '@vicons/antd';
import { NSpace, NForm, NFormItem, NInput, NGrid, NGridItem, NButton } from 'naive-ui';

const formRef: any = ref(null);
const router = useRouter();
const formValue: any = ref({ email: '' });
const rules = {
  email: {
    required: true,
    trigger: 'blur',
    message: 'Please enter your email address',
  },
};

const handleValidateClick = (e: any) => {
  e.preventDefault();
  formRef.value.validate((errors: any) => {
    if (!errors) {
      router.push({ name: 'SubscribeThankYou' });
    }
  });
};
</script>

<template>
  <footer class="bg-fgl-primary">
    <div class="container">
      <div class="footer__sign-up">
        <n-grid x-gap="16" :cols="2">
          <n-grid-item>
            <div class="description">
              <h6>
                Stay ahead in a rapidly changing world. Subscribe to GCN Insights, our monthly look at the critical issues facing fresh
                produce supply chain.
              </h6>
            </div>

            <n-form ref="formRef" inline :model="formValue" :rules="rules">
              <!-- input -->
              <n-form-item path="email">
                <n-input v-model:value="formValue.email" size="large" placeholder="Your email address" />
              </n-form-item>

              <!-- button -->
              <n-form-item>
                <n-button type="error" size="large" @click="handleValidateClick">SUBSCRIBE</n-button>
              </n-form-item>
            </n-form>
          </n-grid-item>
        </n-grid>
      </div>

      <!-- content -->
      <div class="footer__content">
        <n-space vertical>
          <!-- top -->
          <div class="footer__top-row">
            <n-space justify="space-between">
              <!-- logo -->
              <div class="footer__heading">
                <Logo text-color="text-white" />
              </div>

              <!-- social -->
              <!-- <div class="footer__social">
                <ul class="social-links">
                  <li class="social-links__item">
                    <n-icon size="24">
                      <LinkedinFilled />
                    </n-icon>
                  </li>
                  <li class="social-links__item">
                    <n-icon size="24">
                      <InstagramFilled />
                    </n-icon>
                  </li>
                  <li class="social-links__item">
                    <n-icon size="24">
                      <WechatFilled />
                    </n-icon>
                  </li>
                </ul>
              </div> -->
            </n-space>
          </div>

          <!-- bottom -->
          <div class="footer__bottom-row">
            <div class="footer__links">
              <router-link :to="{ name: 'Contact' }"> Contact us </router-link>
              <!-- <router-link :to="{ name: '404' }"> Connect </router-link> -->
              <!-- <router-link :to="{ name: '404' }"> Subscribe </router-link> -->
              <!-- <router-link :to="{ name: '404' }"> Log in </router-link> -->
            </div>
            <div class="footer__legal">
              <p class="text-fgl-text-color-2 text-sm">© 2014-2022 Green Consolidated (Aust) Pty. Ltd.</p>
            </div>
          </div>
        </n-space>
      </div>
    </div>
  </footer>
</template>

<style lang="scss">
.footer__sign-up {
  @apply mb-2 pt-6 pb-2 border-b border-fgl-border-color;

  .n-form.n-form--inline .n-form-item {
    @apply w-full;
  }
}

.description {
  @apply text-white pr-3;
}

.newsletter__sign-up {
  @apply pl-3;

  .checkbox__label {
    .n-form-item.n-form-item--medium-size.n-form-item--top-labelled {
      height: 0px;
    }
  }

  .checkbox__label-text {
    @apply text-white;

    & p {
      @apply mb-0;
    }

    & a {
      @apply border-b;
    }
  }
}

.footer__top-row {
  @apply mb-12;
}

.social-links__item {
  @apply inline align-middle text-white ml-2;

  &:first-child {
    @apply ml-0;
  }
}

.footer__links {
  @apply mb-2;
  & a {
    @apply inline mr-3 text-white;
  }
}
</style>
