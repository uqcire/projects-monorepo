<template>
  <div class="p-4 max-w-4xl mx-auto">
    <h2 class="text-xl font-bold mb-4">联系人管理</h2>

    <!-- 联系人列表 -->
    <div class="mb-8">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold">联系人列表</h3>
        <button class="btn btn-primary" @click="showForm = true">
          添加联系人
        </button>
      </div>

      <div v-if="contactsStore.loading" class="text-info">加载中...</div>
      <div v-if="contactsStore.error" class="text-error">错误：{{ contactsStore.error }}</div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="contact in contactsStore.contacts" :key="contact.id" class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <h3 class="card-title">
              {{ contact.first_name }} {{ contact.last_name }}
            </h3>
            <p v-if="contact.company" class="text-sm text-gray-500">
              {{ contact.company }}
            </p>
            <div class="text-sm">
              <p v-if="contact.email">{{ contact.email }}</p>
              <p v-if="contact.phone">{{ contact.phone }}</p>
            </div>
            <div class="flex flex-wrap gap-1 mt-2">
              <span v-for="tag in contact.tags" :key="tag" class="badge badge-sm">
                {{ tag }}
              </span>
            </div>
            <div class="card-actions justify-end mt-4">
              <button class="btn btn-sm btn-error" @click="deleteContact(contact.id)">
                删除
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 联系人表单 -->
    <div v-if="showForm" class="mt-8">
      <form @submit.prevent="createNewContact" class="space-y-2">
        <input v-model="newContact.firstName" class="input input-bordered" placeholder="名" required />
        <input v-model="newContact.lastName" class="input input-bordered" placeholder="姓" required />
        <input v-model="newContact.email" class="input input-bordered" placeholder="邮箱" required />
        <button class="btn btn-primary" type="submit">保存</button>
        <button class="btn" type="button" @click="showForm = false">取消</button>
      </form>
    </div>
  </div>
</template>

<script setup>
// 这里写你的逻辑
import { useContactsStore } from '@/store/contacts';
import { ref } from 'vue';

const contactsStore = useContactsStore()
const showForm = ref(false)
const newContact = ref({ firstName: '', lastName: '', email: '' })

async function createNewContact() {
  console.log('点击了添加联系人', newContact.value)
  try {
    await contactsStore.createContact(newContact.value)
    newContact.value = { firstName: '', lastName: '', email: '' }
    await contactsStore.fetchContacts()
  } catch (e) {
    console.error('添加联系人出错', e)
  }
}
</script>
