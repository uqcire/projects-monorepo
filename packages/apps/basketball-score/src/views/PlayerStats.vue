<script setup>
import { useAuthStore } from '@/stores/auth';
import { usePlayerStore } from '@/stores/player';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()
const store = usePlayerStore()
const authStore = useAuthStore()
const newPlayerName = ref('')
const newPlayerNumber = ref('')
const isLoading = ref(false)
const errorMessage = ref('')
const showAddDialog = ref(false)

// 添加排序配置
const sortConfig = ref({
  key: null,
  direction: 'asc'
})

// 添加排序方法
const sortStats = (key) => {
  if (sortConfig.value.key === key) {
    sortConfig.value.direction = sortConfig.value.direction === 'asc' ? 'desc' : 'asc'
  } else {
    sortConfig.value.key = key
    sortConfig.value.direction = 'asc'
  }
}

// 获取排序图标
const getSortIcon = (key) => {
  if (sortConfig.value.key !== key) return '↕️'
  return sortConfig.value.direction === 'asc' ? '↑' : '↓'
}

// 获取排序后的球员数据
const sortedPlayers = computed(() => {
  if (!sortConfig.value.key) return store.players

  return [...store.players].sort((a, b) => {
    let aValue, bValue

    // 特殊处理不同类型的数据
    switch (sortConfig.value.key) {
      case 'name':
        aValue = a.name
        bValue = b.name
        break
      case 'number':
        aValue = Number(a.number) || Number.MAX_SAFE_INTEGER
        bValue = Number(b.number) || Number.MAX_SAFE_INTEGER
        break
      case 'GP':
        aValue = getPlayerStats(a.id).length
        bValue = getPlayerStats(b.id).length
        break
      case 'MIN':
        aValue = getPlayerAverageStats(a.id)?.MIN || 0
        bValue = getPlayerAverageStats(b.id)?.MIN || 0
        break
      case 'AP':
        aValue = getPlayerAverageStats(a.id)?.PTS || 0
        bValue = getPlayerAverageStats(b.id)?.PTS || 0
        break
      case 'FG%':
        const aStats = getPlayerAverageStats(a.id)
        const bStats = getPlayerAverageStats(b.id)
        aValue = aStats?.FGM / (aStats?.FGA || 1) || 0
        bValue = bStats?.FGM / (bStats?.FGA || 1) || 0
        break
      case '3P%':
        const aStats3P = getPlayerAverageStats(a.id)
        const bStats3P = getPlayerAverageStats(b.id)
        aValue = aStats3P?.threePM / (aStats3P?.threePA || 1) || 0
        bValue = bStats3P?.threePM / (bStats3P?.threePA || 1) || 0
        break
      case 'FT%':
        const aStatsFT = getPlayerAverageStats(a.id)
        const bStatsFT = getPlayerAverageStats(b.id)
        aValue = aStatsFT?.FTM / (aStatsFT?.FTA || 1) || 0
        bValue = bStatsFT?.FTM / (bStatsFT?.FTA || 1) || 0
        break
      case 'REB':
        const aStatsREB = getPlayerAverageStats(a.id)
        const bStatsREB = getPlayerAverageStats(b.id)
        aValue = (aStatsREB?.OREB || 0) + (aStatsREB?.DREB || 0)
        bValue = (bStatsREB?.OREB || 0) + (bStatsREB?.DREB || 0)
        break
      default:
        aValue = getPlayerAverageStats(a.id)?.[sortConfig.value.key] || 0
        bValue = getPlayerAverageStats(b.id)?.[sortConfig.value.key] || 0
    }

    // 确保数字正确排序
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortConfig.value.direction === 'asc' ? aValue - bValue : bValue - aValue
    }

    // 字符串排序
    if (aValue < bValue) return sortConfig.value.direction === 'asc' ? -1 : 1
    if (aValue > bValue) return sortConfig.value.direction === 'asc' ? 1 : -1
    return 0
  })
})

// 确保数据加载
onMounted(async () => {
  if (store.players.length === 0) {
    await store.fetchPlayers()
  }
})

// 打开添加球员对话框
const openAddDialog = () => {
  showAddDialog.value = true
  newPlayerName.value = ''
  newPlayerNumber.value = ''
  errorMessage.value = ''
}

// 关闭添加球员对话框
const closeAddDialog = () => {
  showAddDialog.value = false
  newPlayerName.value = ''
  newPlayerNumber.value = ''
  errorMessage.value = ''
}

// 新增球员方法
const addNewPlayer = async () => {
  if (!newPlayerName.value.trim()) {
    errorMessage.value = 'Please enter the player\'s name'
    return
  }

  if (!newPlayerNumber.value) {
    errorMessage.value = 'Please enter the player\'s number'
    return
  }

  try {
    isLoading.value = true
    errorMessage.value = ''

    const playerId = await store.addPlayer({
      name: newPlayerName.value.trim(),
      number: String(newPlayerNumber.value),
      stats: []
    })

    // 清空输入并跳转
    newPlayerName.value = ''
    newPlayerNumber.value = ''
    router.push(`/players/${playerId}`)
  } catch (error) {
    console.error('ADD PLAYER ERROR:', error)
    errorMessage.value = 'Add player failed, please try again'
  } finally {
    isLoading.value = false
  }
}

// 获取球员统计数据
const getPlayerStats = (playerId) => {
  return store.getPlayerStats(playerId) || []
}

// 获取球员平均数据
const getPlayerAverageStats = (playerId) => {
  return store.getPlayerAverageStats(playerId) || {}
}

// 计算命中率
const calculatePercentage = (made, attempted) => {
  if (!attempted) return 'N/A'
  return ((made / attempted) * 100).toFixed(1) + '%'
}
</script>

<template>
  <div class="container mx-auto py-4">
    <div class="flex flex-col gap-4 border rounded-lg shadow-lg p-4">
      <!-- Header -->
      <div class="flex justify-between items-center mb-6 border-b pb-4">
        <h1 class="text-xl font-bold">Player Statistics</h1>
        <button v-if="authStore.isAdmin" @click="openAddDialog" class="btn btn-primary">Add New Player</button>
      </div>
      <!-- 球员数据表格 -->
      <div class="overflow-hidden rounded-lg shadow-lg">
        <div class="overflow-x-auto">
          <table class="table min-w-full divide-y divide-gray-200">
            <thead>
              <tr class="h-14 bg-base-200">
                <th
                  class="sticky left-0 bg-base-200 z-10 px-6 py-3 text-left text-md font-medium text-gray-600 cursor-pointer w-48 whitespace-nowrap"
                  @click="sortStats('name')">
                  Player {{ getSortIcon('name') }}
                </th>
                <th class="px-6 py-3 text-left text-md font-medium text-gray-600 cursor-pointer whitespace-nowrap"
                  @click="sortStats('number')">
                  Number {{ getSortIcon('number') }}
                </th>
                <th class="px-6 py-3 text-left text-md font-medium text-gray-600 cursor-pointer whitespace-nowrap"
                  @click="sortStats('GP')">
                  GP {{ getSortIcon('GP') }}
                </th>
                <th class="px-6 py-3 text-center text-md font-medium text-gray-600 cursor-pointer whitespace-nowrap"
                  @click="sortStats('MIN')">
                  MIN {{ getSortIcon('MIN') }}
                </th>
                <th class="px-6 py-3 text-center text-md font-medium text-gray-600 cursor-pointer whitespace-nowrap"
                  @click="sortStats('AP')">
                  AP {{ getSortIcon('AP') }}
                </th>
                <th class="px-6 py-3 text-center text-md font-medium text-gray-600 cursor-pointer whitespace-nowrap"
                  @click="sortStats('FG%')">
                  FG% {{ getSortIcon('FG%') }}
                </th>
                <th class="px-6 py-3 text-center text-md font-medium text-gray-600 cursor-pointer whitespace-nowrap"
                  @click="sortStats('3P%')">
                  3P% {{ getSortIcon('3P%') }}
                </th>
                <th class="px-6 py-3 text-center text-md font-medium text-gray-600 cursor-pointer whitespace-nowrap"
                  @click="sortStats('FT%')">
                  FT% {{ getSortIcon('FT%') }}
                </th>
                <th class="px-6 py-3 text-center text-md font-medium text-gray-600 cursor-pointer whitespace-nowrap"
                  @click="sortStats('REB')">
                  REB {{ getSortIcon('REB') }}
                </th>
                <th class="px-6 py-3 text-center text-md font-medium text-gray-600 cursor-pointer whitespace-nowrap"
                  @click="sortStats('AST')">
                  AST {{ getSortIcon('AST') }}
                </th>
                <th class="px-6 py-3 text-center text-md font-medium text-gray-600 cursor-pointer whitespace-nowrap"
                  @click="sortStats('STL')">
                  STL {{ getSortIcon('STL') }}
                </th>
                <th class="px-6 py-3 text-center text-md font-medium text-gray-600 cursor-pointer whitespace-nowrap"
                  @click="sortStats('BLK')">
                  BLK {{ getSortIcon('BLK') }}
                </th>
                <th class="px-6 py-3 text-center text-md font-medium text-gray-600 cursor-pointer whitespace-nowrap"
                  @click="sortStats('TOV')">
                  TOV {{ getSortIcon('TOV') }}
                </th>
                <th class="px-6 py-3 text-center text-md font-medium text-gray-600 cursor-pointer whitespace-nowrap"
                  @click="sortStats('PF')">
                  PF {{ getSortIcon('PF') }}
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="player in sortedPlayers" :key="player.id"
                class="h-14 hover:bg-gray-100 cursor-pointer transition-colors duration-150"
                @click="router.push(`/players/${player.id}`)">
                <td class="sticky left-0  z-10 px-6 py-3 text-left text-md font-medium text-gray-600 truncate w-48">
                  <div class="text-left">{{ player.name }}</div>
                </td>
                <td class="px-6 py-3 whitespace-nowrap">
                  <div class="text-left">#{{ player.number || '-' }}</div>
                </td>
                <td class="px-6 py-3 whitespace-nowrap">
                  <div class="text-left">{{ getPlayerStats(player.id).length }}</div>
                </td>
                <td class="px-6 py-3 whitespace-nowrap">
                  <div class="text-center">{{ getPlayerAverageStats(player.id)?.MIN?.toFixed(1) || '0.0' }}</div>
                </td>
                <td class="px-6 py-3 whitespace-nowrap">
                  <div class="text-center">{{ getPlayerAverageStats(player.id)?.PTS?.toFixed(1) || '0.0' }}</div>
                </td>
                <td class="px-6 py-3 whitespace-nowrap">
                  <div class="text-center">
                    {{ calculatePercentage(
                      getPlayerAverageStats(player.id)?.FGM,
                      getPlayerAverageStats(player.id)?.FGA
                    ) }}
                  </div>
                </td>
                <td class="px-6 py-3 whitespace-nowrap">
                  <div class="text-center">
                    {{ calculatePercentage(
                      getPlayerAverageStats(player.id)?.threePM,
                      getPlayerAverageStats(player.id)?.threePA
                    ) }}
                  </div>
                </td>
                <td class="px-6 py-3 whitespace-nowrap">
                  <div class="text-center">
                    {{ calculatePercentage(
                      getPlayerAverageStats(player.id)?.FTM,
                      getPlayerAverageStats(player.id)?.FTA
                    ) }}
                  </div>
                </td>
                <td class="px-6 py-3 whitespace-nowrap">
                  <div class="text-center">
                    {{ ((getPlayerAverageStats(player.id)?.OREB || 0) +
                      (getPlayerAverageStats(player.id)?.DREB || 0)).toFixed(1) }}
                  </div>
                </td>
                <td class="px-6 py-3 whitespace-nowrap">
                  <div class="text-center">
                    {{ getPlayerAverageStats(player.id)?.AST?.toFixed(1) || '0.0' }}
                  </div>
                </td>
                <td class="px-6 py-3 whitespace-nowrap">
                  <div class="text-center">
                    {{ getPlayerAverageStats(player.id)?.STL?.toFixed(1) || '0.0' }}
                  </div>
                </td>
                <td class="px-6 py-3 whitespace-nowrap">
                  <div class="text-center">
                    {{ getPlayerAverageStats(player.id)?.BLK?.toFixed(1) || '0.0' }}
                  </div>
                </td>
                <td class="px-6 py-3 whitespace-nowrap">
                  <div class="text-center">
                    {{ getPlayerAverageStats(player.id)?.TOV?.toFixed(1) || '0.0' }}
                  </div>
                </td>
                <td class="px-6 py-3 whitespace-nowrap">
                  <div class="text-center">
                    {{ getPlayerAverageStats(player.id)?.PF?.toFixed(1) || '0.0' }}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>


    <!-- 添加球员对话框 -->
    <div v-if="showAddDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="card bg-white w-96">
        <div class="card-body">
          <!-- Title -->
          <h2 class="card-title text-2xl font-bold pb-4">Add new player</h2>
          <!-- Form -->
          <div class="flex flex-col gap-4">
            <div class="flex flex-col gap-2">
              <label class="floating-label">
                <span>Player Name</span>
                <input v-model="newPlayerName" type="text" placeholder="Please enter the player's name"
                  class="input input-lg" :disabled="isLoading" @keyup.enter="addNewPlayer" />
              </label>
            </div>
            <div class="flex flex-col gap-2">
              <label class="floating-label">
                <span>Player Number</span>
                <input v-model.number="newPlayerNumber" type="number" placeholder="Please enter the player's number"
                  class="input input-lg" :disabled="isLoading" @keyup.enter="addNewPlayer" />
              </label>
            </div>
            <div v-if="errorMessage" class="text-red-500 text-sm">
              {{ errorMessage }}
            </div>
            <!-- Actions -->
            <div class="card-actions">
              <div class="flex gap-2">
                <button @click="addNewPlayer" class="btn btn-primary" :disabled="isLoading">
                  {{ isLoading ? 'Adding...' : 'Confirm' }}
                </button>
                <button @click="closeAddDialog" class="btn" :disabled="isLoading">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 无数据提示 -->
    <div v-if="store.players.length === 0" class="text-center text-gray-500 mt-8">
      No player data yet
    </div>
  </div>
</template>
