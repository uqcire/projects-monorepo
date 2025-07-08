<script setup>
import { useAuthStore } from '@/stores/auth';
import { useGameStore } from '@/stores/game';
import { usePlayerStore } from '@/stores/player';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute()
const router = useRouter()
const playerStore = usePlayerStore()
const gameStore = useGameStore()
const authStore = useAuthStore()

// 添加筛选状态
const selectedGameType = ref('all')

// 筛选选项
const gameTypeOptions = [
  { value: 'all', label: 'All Games' },
  { value: 'grading', label: 'Grading' },
  { value: 'tournament', label: 'Tournament' },
  { value: 'regular', label: 'Regular' }
]

// 确保游戏数据加载
onMounted(async () => {
  if (playerStore.players.length === 0) {
    await playerStore.fetchPlayers()
  }
  if (gameStore.games.length === 0) {
    await gameStore.fetchGames()
  }
})

const playerId = computed(() => Number(route.params.id))
const player = computed(() => playerStore.players.find(p => p.id === playerId.value))
const playerStats = computed(() => {
  const stats = playerStore.getPlayerStats(playerId.value)
  let filteredStats = stats.map(stat => {
    const game = gameStore.games.find(g => g.id === stat.gameId)
    return {
      ...stat,
      opponent: game?.team_stats?.opponent || '-',
      team_stats: game?.team_stats || {}
    }
  })

  // 根据选中的比赛类型筛选
  if (selectedGameType.value !== 'all') {
    filteredStats = filteredStats.filter(stat => {
      const gameType = stat.team_stats?.GT?.toLowerCase()
      return gameType === selectedGameType.value || (gameType === 'regular season' && selectedGameType.value === 'regular')
    })
  }

  return filteredStats
})
const playerAverageStats = computed(() => {
  // 使用筛选后的比赛数据计算平均值
  const stats = playerStats.value
  if (!stats || stats.length === 0) {
    return {
      MIN: 0, FGM: 0, FGA: 0, threePM: 0, threePA: 0,
      FTM: 0, FTA: 0, OREB: 0, DREB: 0, AST: 0,
      STL: 0, BLK: 0, TOV: 0, PF: 0, PTS: 0
    }
  }

  const totals = stats.reduce((acc, stat) => {
    Object.keys(stat).forEach(key => {
      if (typeof stat[key] === 'number') {
        acc[key] = (acc[key] || 0) + (Number(stat[key]) || 0)
      }
    })
    // 计算总得分
    acc.PTS = (acc.PTS || 0) + calculatePoints(stat)
    return acc
  }, {})

  const averages = {}
  const gamesCount = stats.length
  Object.keys(totals).forEach(key => {
    const value = totals[key] / gamesCount
    // 确保所有数值保留两位小数
    averages[key] = Number(value.toFixed(2))
  })

  return averages
})

// 编辑状态管理
const isEditing = ref(false)
const editingName = ref('')
const editingNumber = ref('')

// 开始编辑
const startEdit = () => {
  editingName.value = player.value.name
  editingNumber.value = player.value.number
  isEditing.value = true
}

// 保存编辑
const saveEdit = async () => {
  if (!editingName.value.trim()) {
    alert('Please enter a player name')
    return
  }

  try {
    await playerStore.updatePlayer(player.value.id, {
      ...player.value,
      name: editingName.value.trim(),
      number: String(editingNumber.value)
    })
    isEditing.value = false
  } catch (error) {
    console.error('Error updating player:', error)
    alert('Error updating player, please try again')
  }
}

// 取消编辑
const cancelEdit = () => {
  isEditing.value = false
  editingName.value = ''
  editingNumber.value = ''
}

// 计算命中率（用于表格显示，不带小数）
const calculateTablePercentage = (made, attempted) => {
  if (!attempted) return 'N/A'
  const percentage = (made / attempted) * 100
  return Math.round(percentage) + '%'
}

// 计算命中率（用于统计卡片显示，保留两位小数）
const calculatePercentage = (made, attempted) => {
  if (!attempted) return 'N/A'
  const percentage = (made / attempted) * 100
  return percentage.toFixed(1) === '0.0' ? '0.00' : percentage.toFixed(2) + '%'
}

// 计算得分
const calculatePoints = (stat) => {
  return (stat.FGM * 2) + (stat.threePM * 3) + stat.FTM
}

// 返回团队统计页面
const goBack = () => {
  router.push('/players')
}

// 删除球员
const deletePlayer = async () => {
  if (confirm('Are you sure you want to delete this player? This action will also delete all of this player\'s game records and cannot be undone.')) {
    try {
      await playerStore.deletePlayer(player.value.id)
      router.push('/players')
    } catch (error) {
      console.error('Error deleting player:', error)
      alert('Error deleting player, please try again')
    }
  }
}

// 删除比赛记录
const deleteGameRecord = async (gameId) => {
  if (!confirm('Are you sure you want to delete this game record? This action cannot be undone.')) return

  try {
    // 从球员的统计数据中移除这场比赛
    const updatedStats = player.value.stats.filter(stat => stat.gameId !== gameId)

    // 更新球员数据
    await playerStore.updatePlayer(player.value.id, {
      ...player.value,
      stats: updatedStats
    })

    // 重新获取球员数据
    await playerStore.fetchPlayers()
  } catch (error) {
    console.error('delete game record failed:', error)
    alert('Delete game record failed, please try again')
  }
}

</script>

<template>
  <div v-if="player" class="p-4">
    <div class="flex flex-col gap-4">
      <!-- 返回按钮修正路径 -->
      <div>
        <button @click="goBack" class="btn btn-soft btn-sm">
          ← Players
        </button>
      </div>

      <!-- 球员信息头 -->
      <div class="flex flex-col gap-4 mb-6">
        <div v-if="!isEditing" class="flex items-center gap-4">
          <div class="flex items-center gap-2">
            <span class="text-4xl font-bold text-gray-600">#{{ player.number || '-' }}</span>
            <h1 class="text-4xl font-bold">{{ player.name }}</h1>
          </div>
        </div>
        <div v-else class="flex items-center gap-2">
          <div class="flex gap-2">
            <input v-model.number="editingNumber" type="number" min="0" placeholder="Player number"
              class="px-2 py-1 border rounded w-24" />
            <input v-model="editingName" type="text" placeholder="Player name" class="px-2 py-1 border rounded" />
          </div>
          <div class="flex gap-2">
            <button @click="saveEdit" class="btn btn-primary btn-sm">
              Save
            </button>
            <button @click="cancelEdit" class="btn btn-soft btn-sm">
              Cancel
            </button>
          </div>
        </div>
        <div v-if="authStore.isAdmin" class="flex gap-2">
          <button @click="startEdit" class="btn btn-primary btn-sm">
            Edit information
          </button>
          <button @click="deletePlayer" class="btn btn-error btn-sm">
            Delete Player
          </button>
        </div>
      </div>
      <!-- 数据展示 -->
      <div class="flex flex-col gap-4">
        <!-- 生涯数据总览 -->
        <div class="p-4 border rounded shadow-lg">
          <div class="flex flex-col gap-4">
            <!-- Header -->
            <div class="border-b p-4">
              <h2 class="text-xl font-bold">Career Data Overview ({{ playerStats.length }} GP)</h2>
            </div>
            <!-- 数据卡片 -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <!-- 场均时间 -->
              <div class="stat rounded-lg shadow-lg">
                <div class="stat-title">MIN</div>
                <div class="stat-value">{{ playerAverageStats?.MIN?.toFixed(1) || '0.0' }}</div>
              </div>
              <!-- 场均得分 -->
              <div class="stat rounded-lg shadow-lg">
                <div class="stat-title">AP</div>
                <div class="stat-value">{{ playerAverageStats?.PTS?.toFixed(1) || '0.0' }}</div>
              </div>
              <!-- 投篮命中率 -->
              <div class="stat rounded-lg shadow-lg">
                <div class="stat-title">FG% ({{ playerAverageStats?.FGM }}/{{ playerAverageStats?.FGA }})</div>
                <div class="stat-value">
                  {{ calculatePercentage(playerAverageStats?.FGM, playerAverageStats?.FGA) }}
                </div>
              </div>
              <!-- 罚球命中率 -->
              <div class="stat rounded-lg shadow-lg">
                <div class="stat-title">FT% ({{ playerAverageStats?.FTM }}/{{ playerAverageStats?.FTA }})</div>
                <div class="stat-value">
                  {{ calculatePercentage(playerAverageStats?.FTM, playerAverageStats?.FTA) }}
                </div>
              </div>
              <!-- 三分命中率 -->
              <div class="stat rounded-lg shadow-lg">
                <div class="stat-title">3P% ({{ playerAverageStats?.threePM }}/{{ playerAverageStats?.threePA }})</div>
                <div class="stat-value">
                  {{ calculatePercentage(playerAverageStats?.threePM, playerAverageStats?.threePA) }}
                </div>
              </div>
              <!-- 篮板 -->
              <div class="stat rounded-lg shadow-lg">
                <div class="stat-title">REB</div>
                <div class="stat-value">
                  {{ ((playerAverageStats?.OREB || 0) + (playerAverageStats?.DREB || 0)).toFixed(1) }}
                </div>
              </div>
              <!-- 助攻 -->
              <div class="stat rounded-lg shadow-lg">
                <div class="stat-title">AST</div>
                <div class="stat-value">{{ playerAverageStats?.AST?.toFixed(1) || '0.0' }}</div>
              </div>
              <!-- 抢断 -->
              <div class="stat rounded-lg shadow-lg">
                <div class="stat-title">STL</div>
                <div class="stat-value">{{ playerAverageStats?.STL?.toFixed(1) || '0.0' }}</div>
              </div>
              <!-- 盖帽 -->
              <div class="stat rounded-lg shadow-lg">
                <div class="stat-title">BLK</div>
                <div class="stat-value">{{ playerAverageStats?.BLK?.toFixed(1) || '0.0' }}</div>
              </div>
              <!-- 失误 -->
              <div class="stat rounded-lg shadow-lg">
                <div class="stat-title">TOV</div>
                <div class="stat-value">{{ playerAverageStats?.TOV?.toFixed(1) || '0.0' }}</div>
              </div>
              <!-- 犯规 -->
              <div class="stat rounded-lg shadow-lg">
                <div class="stat-title">PF</div>
                <div class="stat-value">{{ playerAverageStats?.PF?.toFixed(1) || '0.0' }}</div>
              </div>
            </div>
          </div>
        </div>
        <!-- 比赛数据表格 -->
        <div class="overflow-hidden rounded-lg shadow-lg border p-4">
          <div class="flex justify-between items-center p-4 border-b">

            <h2 class="text-xl font-bold">Game Records ({{ playerStats.length }} GP)</h2>
            <select v-model="selectedGameType" class="select select-sm">
              <option v-for="option in gameTypeOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>

          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full table-md">
              <thead>
                <tr>
                  <th class="px-6 py-3 text-left text-md font-medium text-gray-600">Game</th>
                  <th class="px-6 py-3 text-left text-md font-medium text-gray-600">Opponent</th>
                  <th class="px-6 py-3 text-left text-md font-medium text-gray-600">Result</th>
                  <th class="px-6 py-3 text-left text-md font-medium text-gray-600">Type</th>
                  <th class="px-6 py-3 text-left text-md font-medium text-gray-600">MIN</th>
                  <th class="px-6 py-3 text-left text-md font-medium text-gray-600">PTS</th>
                  <th class="px-6 py-3 text-left text-md font-medium text-gray-600">FG</th>
                  <th class="px-6 py-3 text-left text-md font-medium text-gray-600">3P</th>
                  <th class="px-6 py-3 text-left text-md font-medium text-gray-600">FT</th>
                  <th class="px-6 py-3 text-left text-md font-medium text-gray-600">REB</th>
                  <th class="px-6 py-3 text-left text-md font-medium text-gray-600">AST</th>
                  <th class="px-6 py-3 text-left text-md font-medium text-gray-600">STL</th>
                  <th class="px-6 py-3 text-left text-md font-medium text-gray-600">BLK</th>
                  <th class="px-6 py-3 text-left text-md font-medium text-gray-600">TOV</th>
                  <th class="px-6 py-3 text-left text-md font-medium text-gray-600">PF</th>
                  <th v-if="authStore.isAdmin" class="px-6 py-3 text-left text-md font-medium text-gray-600">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="stat in playerStats" :key="stat.gameId" class="hover:bg-gray-100">
                  <td class="px-6 py-4 whitespace-nowrap cursor-pointer" @click="router.push(`/game/${stat.gameId}`)">
                    {{ stat.name }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap cursor-pointer" @click="router.push(`/game/${stat.gameId}`)">
                    {{ stat.opponent }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap cursor-pointer" @click="router.push(`/game/${stat.gameId}`)">{{
                    stat.team_stats?.GR || '-' }}</td>
                  <td class="px-6 py-4 whitespace-nowrap cursor-pointer" @click="router.push(`/game/${stat.gameId}`)">{{
                    stat.team_stats?.GT || '-' }}</td>
                  <td class="px-6 py-4 whitespace-nowrap cursor-pointer" @click="router.push(`/game/${stat.gameId}`)">{{
                    stat.MIN || 0 }}</td>
                  <td class="px-6 py-4 whitespace-nowrap cursor-pointer" @click="router.push(`/game/${stat.gameId}`)">{{
                    calculatePoints(stat) }}</td>
                  <td class="px-6 py-4 whitespace-nowrap cursor-pointer" @click="router.push(`/game/${stat.gameId}`)">
                    {{ stat.FGM || 0 }}/{{ stat.FGA || 0 }}
                    <span class="text-gray-500 text-sm">
                      ({{ calculateTablePercentage(stat.FGM, stat.FGA) }})
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap cursor-pointer" @click="router.push(`/game/${stat.gameId}`)">
                    {{ stat.threePM || 0 }}/{{ stat.threePA || 0 }}
                    <span class="text-gray-500 text-sm">
                      ({{ calculateTablePercentage(stat.threePM, stat.threePA) }})
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap cursor-pointer" @click="router.push(`/game/${stat.gameId}`)">
                    {{ stat.FTM || 0 }}/{{ stat.FTA || 0 }}
                    <span class="text-gray-500 text-sm">
                      ({{ calculateTablePercentage(stat.FTM, stat.FTA) }})
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap cursor-pointer" @click="router.push(`/game/${stat.gameId}`)">
                    {{ (stat.OREB || 0) + (stat.DREB || 0) }}
                    <span class="text-gray-500 text-sm">
                      ({{ stat.OREB || 0 }}/{{ stat.DREB || 0 }})
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap cursor-pointer" @click="router.push(`/game/${stat.gameId}`)">{{
                    stat.AST || 0 }}</td>
                  <td class="px-6 py-4 whitespace-nowrap cursor-pointer" @click="router.push(`/game/${stat.gameId}`)">{{
                    stat.STL || 0 }}</td>
                  <td class="px-6 py-4 whitespace-nowrap cursor-pointer" @click="router.push(`/game/${stat.gameId}`)">{{
                    stat.BLK || 0 }}</td>
                  <td class="px-6 py-4 whitespace-nowrap cursor-pointer" @click="router.push(`/game/${stat.gameId}`)">{{
                    stat.TOV || 0 }}</td>
                  <td class="px-6 py-4 whitespace-nowrap cursor-pointer" @click="router.push(`/game/${stat.gameId}`)">{{
                    stat.PF || 0 }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <button v-if="authStore.isAdmin" @click.stop="deleteGameRecord(stat.gameId)"
                      class="btn btn-error btn-xs">
                      Delete
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="p-4">
    <div class="text-center text-gray-500">Loading</div>
  </div>
</template>
