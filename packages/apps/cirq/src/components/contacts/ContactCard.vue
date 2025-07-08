<template>
  <div class="grid grid-cols-[80%_1fr] grid-rows-[1fr] gap-8 pl-4">
    <!-- 左侧：头像、姓名、公司、社交媒体 -->
    <div class="flex gap-6 flex-col items-start mb-6">
      <!-- section 1: 头像、姓名、公司职位、社交媒体、action bar -->
      <div class="flex flex-row justify-between gap-4 w-full border-b border-gray-200 pb-4">
        <div class="flex gap-4">
          <!-- 头像 -->
          <div class="avatar avatar-placeholder">
            <div
              class="ring-primary ring-offset-base-200 bg-neutral text-neutral-content w-30 rounded-full ring-2 ring-offset-2">
              <span class="text-4xl">{{ getInitials(contact) }}</span>
            </div>
          </div>
          <!-- 姓名、公司职位、社交媒体 -->
          <div class="flex gap-2 flex-col">
            <!-- 姓名行内编辑 -->
            <div class="pt-2">
              <input type="text" v-if="editingField === 'name'" v-model="editValue" @input="syncNameToContact"
                @keyup.enter="saveEdit('name')" @blur="cancelEdit('name')" class="input" />
              <span v-else class="text-2xl font-bold transition duration-150 hover:bg-base-200 rounded px-1"
                @click="startEdit('name', contact.first_name + ' ' + contact.last_name)">
                {{ contact.first_name }} {{ contact.last_name }}
              </span>
            </div>
            <!-- 公司行内编辑 -->
            <div class="text-gray-500">
              <input v-if="editingField === 'company'" v-model="editValue" @keyup.enter="saveEdit('company')"
                @blur="cancelEdit" class="input input-sm" />
              <span v-else class="transition duration-150 hover:bg-base-200 rounded px-1"
                @click="startEdit('company', contact.company)">
                {{ contact.company }}
              </span>
            </div>
            <!-- 社交媒体 -->
            <div class="flex flex-row gap-3 mb-4">
              <a :href="contact.email ? 'mailto:' + contact.email : undefined"
                :class="['btn btn-circle', contact.email ? 'btn-secondary' : 'btn-disabled opacity-50 pointer-events-none']"
                title="Email">
                <i-ic:baseline-email />
              </a>
              <a :href="contact.social_profiles?.wechat || undefined" target="_blank"
                :class="['btn btn-circle', contact.social_profiles?.wechat ? 'btn-secondary' : 'btn-disabled opacity-50 pointer-events-none']"
                title="WeChat">
                <i-fa6-brands:weixin />
              </a>
              <a :href="contact.social_profiles?.instagram || undefined" target="_blank"
                :class="['btn btn-circle', contact.social_profiles?.instagram ? 'btn-secondary' : 'btn-disabled opacity-50 pointer-events-none']"
                title="Instagram">
                <i-fa6-brands:instagram />
              </a>
              <a :href="contact.social_profiles?.facebook || undefined" target="_blank"
                :class="['btn btn-circle', contact.social_profiles?.facebook ? 'btn-secondary' : 'btn-disabled opacity-50 pointer-events-none']"
                title="Facebook">
                <i-fa6-brands:facebook />
              </a>
              <a :href="contact.social_profiles?.twitter || undefined" target="_blank"
                :class="['btn btn-circle', contact.social_profiles?.twitter ? 'btn-secondary' : 'btn-disabled opacity-50 pointer-events-none']"
                title="Twitter">
                <i-fa6-brands:x-twitter />
              </a>
              <a :href="contact.social_profiles?.linkedin || undefined" target="_blank"
                :class="['btn btn-circle', contact.social_profiles?.linkedin ? 'btn-secondary' : 'btn-disabled opacity-50 pointer-events-none']"
                title="LinkedIn">
                <i-fa6-brands:linkedin-in />
              </a>
            </div>
          </div>
        </div>

        <!-- action bar -->
        <div>
          <div class="dropdown">
            <div tabindex="0" role="button" class="btn m-1">Actions <i-fa6-solid:angle-down /></div>
            <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
              <li><a>Item 1</a></li>
              <li><a>Item 2</a></li>
            </ul>
          </div>
        </div>
      </div>
      <!-- section 2 -->
      <!-- 上次互动、互动频率设置 -->
      <div class="flex flex-col gap-6 w-full border-b border-gray-200 pb-4">
        <div class="grid grid-cols-[15%_1fr] grid-rows-[1fr] gap-6">
          <div>
            <i class=" i-lucide-clock text-lg"></i>
            <span class="font-semibold">Last Interaction</span>
          </div>
          <div>
            <input type="date" class="input input-ghost" />
          </div>
        </div>
        <div class="grid grid-cols-[15%_1fr] grid-rows-[1fr] gap-6">
          <div>
            <i class="i-lucide-repeat text-lg"></i>
            <span class="font-semibold">Frequency</span>
          </div>
          <div>
            <select class="select select-ghost">
              <option disabled selected>Set keep in touch...</option>
              <option>Every week</option>
              <option>Every 2 weeks</option>
              <option>Every month</option>
              <option>Every 6 weeks</option>
              <option>Every 3 months</option>
              <option>Every 6 months</option>
              <option>Every year</option>
              <option>Don't keep in touch</option>
            </select>
          </div>
        </div>
      </div>
      <!-- section 3 -->
      <!-- 备注、添加备注、reminder设置 -->
      <div class="flex flex-col gap-6 w-full border-b border-gray-200 pb-4">
        <!-- 备注输入 -->
        <textarea rows="6" class="textarea textarea-xl w-full" placeholder="What would you like to add?"
          v-model="noteContent"></textarea>
        <!-- 添加备注、reminder设置 -->
        <div class="flex flex-row gap-6">
          <div class="flex gap-6 justify-between w-full">
            <div class="flex flex-row gap-2">
              <input type="date" class="input" v-model="noteDate" />
              <select class="select" v-model="noteType">
                <option disabled value="">Select a note type...</option>
                <option value="Meeting">📆 Meeting</option>
                <option value="Email">✉️ Email</option>
                <option value="Call">📞 Call</option>
                <option value="Text/Messaging">📱 Text/Messaging</option>
                <option value="Note">📝 Note</option>
                <option value="Meal">🍔 Meal</option>
                <option value="Networking">💼️ Networking</option>
                <option value="Party/Social">🥂️ Party/Social</option>
                <option value="Other">⚽️ Other</option>
                <option value="Coffee">☕️ Coffee</option>
              </select>
            </div>
            <div class="flex flex-row gap-2">
              <button class="btn btn-primary" :disabled="!noteContent || !noteDate || !noteType || isAddingNote"
                @click="handleAddNote">Add note</button>
            </div>
          </div>
        </div>
        <!-- notes展示区 -->
        <div v-if="Array.isArray(contact.notes) && contact.notes.length" class="mt-4 flex flex-col gap-2">
          <div v-for="(note, idx) in contact.notes" :key="idx" class="bg-base-200 rounded p-2">
            <div class="text-xs text-gray-500 flex justify-between">
              <span>{{ note.date }}</span>
              <span>{{ note.type }}</span>
            </div>
            <div class="mt-1">{{ note.content }}</div>
          </div>
        </div>
        <div v-else class="text-gray-400 text-xs mt-4">No notes yet.</div>
        <!-- 调试输出 -->
        <div class="text-xs text-gray-400 mt-2">
          noteContent: {{ noteContent }}<br>
          noteDate: {{ noteDate }}<br>
          noteType: {{ noteType }}<br>
          isAddingNote: {{ isAddingNote }}
        </div>
      </div>
      <!-- section 4 -->
      <!-- Reminder 显示列表 -->
      <div class="flex flex-col gap-6">
        reminder data display list
      </div>
    </div>



    <!-- 右侧：详细表单区 -->
    <div class="flex gap-6 flex-col items-start mb-6 border-l border-gray-200 pl-4">
      <!-- related contacts -->
      <div class="border-b border-gray-200 pb-4 w-full">
        <div class="font-semibold text-sm mb-1">Related Contacts</div>
        <div class="bg-white rounded px-2 py-1 border text-xs">{{ contact.groups || '无' }}</div>
      </div>
      <!-- groups -->
      <div class="border-b border-gray-200 pb-4 w-full">
        <div class="font-semibold text-sm mb-1">Groups</div>
        <div class="bg-white rounded px-2 py-1 border text-xs">{{ contact.groups || '无' }}</div>
      </div>
      <!-- tags -->
      <div class="border-b border-gray-200 pb-4 w-full">
        <div class="font-semibold text-sm mb-1">Tags</div>
        <div class="flex flex-wrap gap-1">
          <span v-for="tag in contact.tags" :key="tag" class="badge badge-outline text-xs">{{ tag }}</span>
          <span v-if="!contact.tags || !contact.tags.length" class="text-gray-400">无</span>
        </div>
      </div>
      <!-- contact info -->
      <div class="flex flex-col gap-2 border-b border-gray-200 pb-4 w-full">
        <!-- email -->
        <div>
          <div class="font-semibold text-sm mb-1">Email</div>
          <div class="bg-white rounded px-2 py-1 border text-xs">{{ contact.email || '无' }}</div>
        </div>
        <!-- phone -->
        <div>
          <div class="font-semibold text-sm mb-1">Phone</div>
          <div class="bg-white rounded px-2 py-1 border text-xs">{{ contact.phone || '无' }}</div>
        </div>
        <!-- address -->
        <div>
          <div class="font-semibold text-sm mb-1">Address</div>
          <div class="bg-white rounded px-2 py-1 border text-xs">{{ contact.address || '无' }}</div>
        </div>
        <!-- location -->
        <div>
          <div class="font-semibold text-sm mb-1">Location</div>
          <div class="bg-white rounded px-2 py-1 border text-xs">{{ contact.location || '无' }}</div>
        </div>
        <!-- birthday -->
        <div>
          <div class="font-semibold text-sm mb-1">Birthday</div>
          <div class="bg-white rounded px-2 py-1 border text-xs">{{ contact.birthday ? formatDate(contact.birthday) :
            '无'
          }}</div>
        </div>
        <!-- website -->
        <div>
          <div class="font-semibold text-sm mb-1">Website</div>
          <div class="bg-white rounded px-2 py-1 border text-xs">{{ contact.website || '无' }}</div>
        </div>
        <!-- company -->
        <div>
          <div class="font-semibold text-sm mb-1">Company</div>
          <div class="bg-white rounded px-2 py-1 border text-xs">{{ contact.company || '无' }}</div>
        </div>
      </div>
      <!-- custom fields -->
      <div class="border-b border-gray-200 pb-4 w-full">
        <div class="font-semibold text-sm mb-1">Custom Fields</div>
        <div v-if="contact.custom_fields && Object.keys(contact.custom_fields).length">
          <div v-for="(value, key) in contact.custom_fields" :key="key" class="text-xs">
            <span class="font-semibold">{{ key }}:</span> {{ value }}
          </div>
        </div>
        <div v-else class="text-gray-400 text-xs">无</div>
      </div>
      <!-- social links -->
      <div class="flex flex-col gap-2">
        <div class="font-semibold text-sm mb-1">Social Links</div>
        <div class="flex flex-col gap-2">
          <div class="flex items-center gap-4">
            <span class="text-lg flex-shrink-0 w-8 flex justify-center"><i-fa6-brands:weixin /></span>
            <input type="text" class="input input-sm flex-1" placeholder="Add/paste Wechat link"
              v-model="contact.social_profiles.wechat" />
          </div>
          <div class="flex items-center gap-4">
            <span class="text-lg flex-shrink-0 w-8 flex justify-center"><i-fa6-brands:instagram /></span>
            <input type="text" class="input input-sm flex-1" placeholder="Add/paste Instagram link"
              v-model="contact.social_profiles.instagram" />
          </div>
          <div class="flex items-center gap-4">
            <span class="text-lg flex-shrink-0 w-8 flex justify-center"><i-fa6-brands:facebook /></span>
            <input type="text" class="input input-sm flex-1" placeholder="Add/paste Facebook link"
              v-model="contact.social_profiles.facebook" />
          </div>
          <div class="flex items-center gap-4">
            <span class="text-lg flex-shrink-0 w-8 flex justify-center"><i-fa6-brands:x-twitter /></span>
            <input type="text" class="input input-sm flex-1" placeholder="Add/paste Twitter link"
              v-model="contact.social_profiles.twitter" />
          </div>
          <div class="flex items-center gap-4">
            <span class="text-lg flex-shrink-0 w-8 flex justify-center"><i-fa6-brands:linkedin-in /></span>
            <input type="text" class="input input-sm flex-1" placeholder="Add/paste LinkedIn link"
              v-model="contact.social_profiles.linkedin" />
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script setup>
import { useContactsStore } from '@/store/contacts'
import { computed, nextTick, ref } from 'vue'

const props = defineProps({
  contact: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['edit', 'delete', 'update'])
const contactsStore = useContactsStore()

const editingField = ref(null)
const editValue = ref('')

// 备注相关
const noteContent = ref('')
const noteDate = ref('')
const noteType = ref('')
const isAddingNote = ref(false)

function startEdit(field, value) {
  editingField.value = field
  editValue.value = value
  nextTick(() => {
    const input = document.querySelector('input[autofocus]')
    if (input) {
      input.focus()
      input.select()
    }
  })
}

function syncNameToContact() {
  const [firstName, ...lastNameArr] = editValue.value.split(' ')
  props.contact.first_name = firstName
  props.contact.last_name = lastNameArr.join(' ')
}

function cancelEdit(field) {
  if (field === 'name') {
    saveEdit('name')
  } else {
    editingField.value = null
  }
}

async function saveEdit(field) {
  if (field === 'name') {
    const [firstName, ...lastNameArr] = editValue.value.split(' ')
    props.contact.first_name = firstName
    props.contact.last_name = lastNameArr.join(' ')
    emit('update', {
      field: 'name',
      value: {
        firstName: firstName,
        lastName: lastNameArr.join(' ')
      }
    })
  } else {
    emit('update', {
      field,
      value: editValue.value
    })
  }
  editingField.value = null
}

// 获取姓名首字母
function getInitials(contact) {
  const first = contact.first_name?.[0] || ''
  const last = contact.last_name?.[0] || ''
  return (first + last).toUpperCase()
}

// 格式化日期
function formatDate(date) {
  if (!date) return ''
  return new Date(date).toLocaleDateString()
}

// 检查是否有社交媒体信息
const hasSocialProfiles = computed(() => {
  const profiles = props.contact.social_profiles || {}
  return Object.values(profiles).some(value => value)
})

// 检查是否有自定义字段
const hasCustomFields = computed(() => {
  const fields = props.contact.custom_fields || {}
  return Object.keys(fields).length > 0
})

// 处理删除
function handleDelete() {
  if (confirm('确定要删除这个联系人吗？')) {
    emit('delete')
  }
}

async function handleAddNote() {
  if (!noteContent.value || !noteDate.value || !noteType.value) return
  isAddingNote.value = true
  try {
    await contactsStore.addNote(props.contact.id, {
      content: noteContent.value,
      date: noteDate.value,
      type: noteType.value
    })
    noteContent.value = ''
    noteDate.value = ''
    noteType.value = ''
    // 重新拉取联系人数据
    emit('update', { field: 'refresh' })
  } catch (e) {
    // 可加错误提示
    console.error(e)
  } finally {
    isAddingNote.value = false
  }
}
</script>

<style scoped></style>
