<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <!-- 基本信息 -->
    <div class="grid grid-cols-2 gap-4">
      <div class="form-control">
        <label class="label">
          <span class="label-text">名</span>
        </label>
        <input v-model="formData.firstName" type="text" class="input input-bordered" required />
      </div>
      <div class="form-control">
        <label class="label">
          <span class="label-text">姓</span>
        </label>
        <input v-model="formData.lastName" type="text" class="input input-bordered" required />
      </div>
    </div>

    <div class="form-control">
      <label class="label">
        <span class="label-text">公司</span>
      </label>
      <input v-model="formData.company" type="text" class="input input-bordered" />
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div class="form-control">
        <label class="label">
          <span class="label-text">电话</span>
        </label>
        <input v-model="formData.phone" type="tel" class="input input-bordered" />
      </div>
      <div class="form-control">
        <label class="label">
          <span class="label-text">邮箱</span>
        </label>
        <input v-model="formData.email" type="email" class="input input-bordered" required />
      </div>
    </div>

    <div class="form-control">
      <label class="label">
        <span class="label-text">地址</span>
      </label>
      <textarea v-model="formData.address" class="textarea textarea-bordered" rows="2"></textarea>
    </div>

    <div class="form-control">
      <label class="label">
        <span class="label-text">生日</span>
      </label>
      <input v-model="formData.birthday" type="date" class="input input-bordered" />
    </div>

    <!-- 社交媒体 -->
    <div class="card bg-base-200 p-4">
      <h3 class="font-bold mb-2">社交媒体</h3>
      <div class="grid grid-cols-2 gap-4">
        <div class="form-control">
          <label class="label">
            <span class="label-text">Twitter</span>
          </label>
          <input v-model="formData.socialProfiles.twitter" type="text" class="input input-bordered" />
        </div>
        <div class="form-control">
          <label class="label">
            <span class="label-text">Facebook</span>
          </label>
          <input v-model="formData.socialProfiles.facebook" type="text" class="input input-bordered" />
        </div>
        <div class="form-control">
          <label class="label">
            <span class="label-text">Instagram</span>
          </label>
          <input v-model="formData.socialProfiles.instagram" type="text" class="input input-bordered" />
        </div>
        <div class="form-control">
          <label class="label">
            <span class="label-text">WeChat</span>
          </label>
          <input v-model="formData.socialProfiles.wechat" type="text" class="input input-bordered" />
        </div>
        <div class="form-control">
          <label class="label">
            <span class="label-text">TikTok</span>
          </label>
          <input v-model="formData.socialProfiles.tiktok" type="text" class="input input-bordered" />
        </div>
      </div>
    </div>

    <!-- 标签系统 -->
    <div class="form-control">
      <label class="label">
        <span class="label-text">标签</span>
      </label>
      <div class="flex flex-wrap gap-2">
        <div v-for="tag in availableTags" :key="tag" class="badge badge-lg cursor-pointer"
          :class="formData.tags.includes(tag) ? 'badge-primary' : 'badge-outline'" @click="toggleTag(tag)">
          {{ tag }}
        </div>
        <input v-model="newTag" @keydown.enter.prevent="addNewTag" type="text" placeholder="添加新标签..."
          class="input input-bordered input-sm w-32" />
      </div>
    </div>

    <!-- 自定义字段 -->
    <div class="card bg-base-200 p-4">
      <div class="flex justify-between items-center mb-2">
        <h3 class="font-bold">自定义字段</h3>
        <button type="button" class="btn btn-sm" @click="addCustomField">
          添加字段
        </button>
      </div>
      <div v-for="(value, key) in formData.customFields" :key="key" class="flex gap-2 mb-2">
        <input v-model="customFieldKeys[key]" type="text" class="input input-bordered flex-1" placeholder="字段名" />
        <input v-model="formData.customFields[key]" type="text" class="input input-bordered flex-1" placeholder="值" />
        <button type="button" class="btn btn-error btn-sm" @click="removeCustomField(key)">
          删除
        </button>
      </div>
    </div>

    <!-- 备注 -->
    <div class="form-control">
      <label class="label">
        <span class="label-text">备注</span>
      </label>
      <textarea v-model="formData.notes" class="textarea textarea-bordered" rows="3"></textarea>
    </div>

    <div class="flex justify-end gap-2">
      <button type="button" class="btn" @click="$emit('cancel')">
        取消
      </button>
      <button type="submit" class="btn btn-primary" :disabled="loading">
        {{ loading ? '保存中...' : '保存' }}
      </button>
    </div>
  </form>
</template>

<script setup>
import { reactive, ref } from 'vue'

const props = defineProps({
  initialData: {
    type: Object,
    default: () => ({})
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['submit', 'cancel'])

// 表单数据
const formData = reactive({
  firstName: '',
  lastName: '',
  company: '',
  phone: '',
  email: '',
  address: '',
  birthday: '',
  socialProfiles: {
    twitter: '',
    facebook: '',
    instagram: '',
    wechat: '',
    tiktok: ''
  },
  tags: [],
  customFields: {},
  notes: ''
})

// 初始化表单数据
if (props.initialData) {
  Object.assign(formData, {
    firstName: props.initialData.firstName || '',
    lastName: props.initialData.lastName || '',
    company: props.initialData.company || '',
    phone: props.initialData.phone || '',
    email: props.initialData.email || '',
    address: props.initialData.address || '',
    birthday: props.initialData.birthday || '',
    socialProfiles: props.initialData.socialProfiles || {
      twitter: '',
      facebook: '',
      instagram: '',
      wechat: '',
      tiktok: ''
    },
    tags: props.initialData.tags || [],
    customFields: props.initialData.customFields || {},
    notes: props.initialData.notes || ''
  })
}

// 标签系统
const availableTags = ref(['家人', '朋友', '同事', '客户', '重要'])
const newTag = ref('')

function toggleTag(tag) {
  const index = formData.tags.indexOf(tag)
  if (index === -1) {
    formData.tags.push(tag)
  } else {
    formData.tags.splice(index, 1)
  }
}

function addNewTag() {
  if (newTag.value && !formData.tags.includes(newTag.value)) {
    formData.tags.push(newTag.value)
    availableTags.value.push(newTag.value)
    newTag.value = ''
  }
}

// 自定义字段
const customFieldKeys = reactive({})

function addCustomField() {
  const key = `field_${Object.keys(formData.customFields).length + 1}`
  formData.customFields[key] = ''
  customFieldKeys[key] = ''
}

function removeCustomField(key) {
  delete formData.customFields[key]
  delete customFieldKeys[key]
}

// 提交表单
function handleSubmit() {
  // 处理自定义字段的键名
  const processedCustomFields = {}
  Object.entries(formData.customFields).forEach(([key, value]) => {
    const newKey = customFieldKeys[key] || key
    processedCustomFields[newKey] = value
  })

  emit('submit', {
    ...formData,
    customFields: processedCustomFields
  })
}
</script>
