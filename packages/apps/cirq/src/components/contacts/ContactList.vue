<template>
  <div>
    <!-- 分组联系人列表 -->
    <div v-if="groupedContacts.length">
      <div v-for="group in groupedContacts" :key="group.letter" class="mb-2">
        <!-- 字母分隔条 -->
        <div class="bg-base-200 px-2 py-1 font-bold text-gray-500 sticky top-0 z-10">
          {{ group.letter }}
        </div>
        <!-- 联系人列表 -->
        <div v-for="contact in group.contacts" :key="contact.id"
          class="pl-4 py-2 border-b flex items-center cursor-pointer hover:bg-base-100"
          @click="handleRowClick(contact.id)">
          <div class="avatar placeholder mr-3">
            <div class="bg-neutral text-neutral-content rounded-full w-8">
              <span>{{ getInitials(contact) }}</span>
            </div>
          </div>
          <div>
            <div class="font-bold">{{ contact.first_name }} {{ contact.last_name }}</div>
            <div class="text-xs text-gray-400">{{ contact.company }}</div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="text-center text-gray-500 p-8">暂无联系人</div>
  </div>
</template>

<script setup>
import { useContactsStore } from '@/store/contacts'
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const contactsStore = useContactsStore()

// 获取姓名首字母
function getInitials(contact) {
  const first = contact.first_name?.[0] || ''
  const last = contact.last_name?.[0] || ''
  return (first + last).toUpperCase()
}

// 过滤和分组联系人
const groupedContacts = computed(() => {
  let filtered = contactsStore.contacts
  // 分组
  const groups = {}
  filtered.forEach(contact => {
    const name = (contact.last_name || contact.first_name || '').trim()
    let letter = name.charAt(0).toUpperCase()
    if (/[A-Z]/.test(letter)) {
      // 字母分组
    } else if (/[0-9]/.test(letter)) {
      // 数字分组
    } else {
      letter = '#'
    }
    if (!groups[letter]) groups[letter] = []
    groups[letter].push(contact)
  })
  // 排序：数字0-9，A-Z，最后是#
  const sortedKeys = Object.keys(groups).sort((a, b) => {
    if (a === '#') return 1
    if (b === '#') return -1
    if (/[0-9]/.test(a) && /[A-Z]/.test(b)) return -1
    if (/[A-Z]/.test(a) && /[0-9]/.test(b)) return 1
    return a.localeCompare(b)
  })
  return sortedKeys.map(letter => ({ letter, contacts: groups[letter] }))
})

// 行点击
function handleRowClick(id) {
  router.push(`/contacts/${id}`)
}

onMounted(() => {
  contactsStore.fetchContacts()
})
</script>
