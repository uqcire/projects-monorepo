<template>
  <div class="container mx-auto p-4">
    <div v-if="loading" class="flex justify-center items-center h-64">
      <span class="loading loading-spinner loading-lg"></span>
    </div>

    <div v-else-if="error" class="alert alert-error">
      <span>{{ error }}</span>
    </div>

    <div v-else-if="contact" class="w-full mx-auto">
      <!-- 使用ContactCard组件展示联系人详细信息 -->
      <ContactCard :contact="contact" @edit="handleEdit" @delete="handleDelete" @update="handleUpdateField" />
    </div>
  </div>
</template>

<script setup>
import ContactCard from '@/components/contacts/ContactCard.vue'
import { useContactsStore } from '@/store/contacts'
import { supabase } from '@/store/supabase'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const contactsStore = useContactsStore()

const loading = ref(true)
const error = ref(null)
const contact = ref(null)

// 获取联系人详情
async function fetchContact() {
  loading.value = true
  error.value = null
  try {
    const contactId = route.params.id
    // 每次都从Supabase拉取最新数据
    const { data, error: fetchError } = await supabase
      .from('contacts')
      .select('*')
      .eq('id', contactId)
      .single()
    if (fetchError) throw fetchError
    contact.value = data
  } catch (e) {
    error.value = '加载联系人失败'
    console.error(e)
  } finally {
    loading.value = false
  }
}

// 处理编辑
function handleEdit() {
  // 这里可以实现跳转到编辑页面或弹窗
}

// 处理删除
async function handleDelete() {
  if (confirm('确定要删除这个联系人吗？')) {
    try {
      await contactsStore.deleteContact(contact.value.id)
      router.push('/contacts')
    } catch (e) {
      console.error('删除联系人失败:', e)
    }
  }
}

// 处理行内编辑保存
async function handleUpdateField({ field, value }) {
  if (!contact.value) return
  if (field === 'refresh') {
    await fetchContact()
    return
  }
  if (field === 'name') {
    await contactsStore.updateContact(contact.value.id, value)
    contact.value = { ...contact.value, first_name: value.firstName, last_name: value.lastName }
  } else {
    await contactsStore.updateContact(contact.value.id, { [field]: value })
    contact.value = { ...contact.value, [field]: value }
  }
  await fetchContact()
}

onMounted(fetchContact)
</script>
