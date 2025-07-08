<script lang="ts" setup name="ContactForm">
import { NButton, NForm, NFormItem, NInput } from 'naive-ui';

const router = useRouter();
const formRef: null | any = ref(null);
const formValue = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  company: '',
  subject: '',
  message: '',
});
const rules = {
  firstName: {
    required: true,
    message: 'First name is required.',
    trigger: 'input',
  },
  lastName: {
    required: true,
    message: 'Last name is required.',
    trigger: 'input',
  },
  email: {
    required: true,
    message: 'Email is required.',
    trigger: 'input',
  },
  phone: {
    required: true,
    message: 'Phone is required.',
    trigger: 'input',
  },
  company: {
    required: true,
    message: 'Company is required.',
    trigger: 'input',
  },
  subject: {
    required: true,
    message: 'Subject is required.',
    trigger: 'input',
  },
  message: {
    required: true,
    message: 'Message is required.',
    trigger: 'input',
  },
};

const handleValidateClick = (e: any) => {
  e.preventDefault();
  formRef.value.validate((errors: any) => {
    if (!errors) {
      router.push({ name: 'ContactThankYou' });
    }
  });
};
</script>

<template>
  <article>
    <header class="hero--contact-form">
      <div class="container">
        <div class="hero__text-content">
          <div class="hero__top-wrapper">
            <div class="hero__title-wrapper">
              <!-- title -->
              <div class="hero__title">
                <h2 class="mt-0">Contact Us</h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  </article>

  <!-- description -->
  <section>
    <div class="container">
      <h6>Thank you for your interest in GCN. Please fill out the form below so we can help serve you better.</h6>
      <p>Please note: while we appreciate your questions, we are unable to respond to all inquiries.</p>
    </div>
  </section>

  <!-- form -->
  <section>
    <div class="container">
      <div class="w-1/2">
        <n-form ref="formRef" size="large" :label-width="80" :model="formValue" :rules="rules">
          <!-- first name -->
          <n-form-item label="First Name" path="firstName">
            <n-input v-model:value="formValue.firstName" placeholder="" />
          </n-form-item>

          <!-- last name -->
          <n-form-item label="Last Name" path="lastName">
            <n-input v-model:value="formValue.lastName" placeholder="" />
          </n-form-item>

          <!-- email -->
          <n-form-item label="Email" path="email">
            <n-input v-model:value="formValue.email" placeholder="" />
          </n-form-item>

          <!-- phone -->
          <n-form-item label="Phone" path="phone">
            <n-input v-model:value="formValue.phone" placeholder="" />
          </n-form-item>

          <!-- company -->
          <n-form-item label="Company" path="company">
            <n-input v-model:value="formValue.company" placeholder="" />
          </n-form-item>

          <!-- subject -->
          <n-form-item label="Subject" path="subject">
            <n-input v-model:value="formValue.subject" placeholder="" />
          </n-form-item>

          <!-- message -->
          <n-form-item label="Message" path="message">
            <n-input
              v-model:value="formValue.message"
              type="textarea"
              :autosize="{
                minRows: 10,
                maxRows: 10,
              }"
              placeholder=""
            />
          </n-form-item>

          <!-- validate button -->
          <n-form-item>
            <n-button type="error" size="medium" @click="handleValidateClick">SUBMIT</n-button>
          </n-form-item>
        </n-form>
      </div>
    </div>
  </section>
</template>

<style lang="scss">
.hero--contact-form {
  .hero__text-content {
    @apply pt-4;
  }

  .hero__tag {
    @apply mb-1;
  }

  .hero__title-wrapper {
    @apply pt-4 px-6;
  }
}
</style>
