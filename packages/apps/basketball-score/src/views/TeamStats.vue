<script setup>
import TeamStatsTable from '@/components/TeamStatsTable.vue';
import { useAuthStore } from '@/stores/auth';
import { useGameStore } from '@/stores/game';
import { usePlayerStore } from '@/stores/player';
import { useTeamStore } from '@/stores/team';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const playerStore = usePlayerStore()
const teamStore = useTeamStore()
const gameStore = useGameStore()
const authStore = useAuthStore()
const router = useRouter()

const editingGameId = ref(null)
const editingGameName = ref('')

// 添加筛选状态
const selectedGameType = ref('all')

// 筛选选项
const gameTypeOptions = [
  { value: 'all', label: 'All Games' },
  { value: 'grading', label: 'Grading' },
  { value: 'tournament', label: 'Tournament' },
  { value: 'regular', label: 'Regular' }
]

// 添加新比赛
const addNewGame = async () => {
  try {
    const gameData = {
      name: `Game ${gameStore.games.length + 1}`,
      date: new Date().toISOString().split('T')[0],
      team_stats: {},
      player_stats: []
    }
    const gameId = await gameStore.addGame(gameData)
    router.push(`/game/${gameId}`)
  } catch (error) {
    console.error('Error creating new game:', error)
    alert('Error creating new game，please try again')
  }
}

// 确保数据加载
onMounted(async () => {
  try {
    await Promise.all([
      playerStore.fetchPlayers(),
      gameStore.fetchGames()
    ])
  } catch (error) {
    console.error('Error loading data:', error)
  }
})

// 获取团队比赛数据
const teamGameStats = computed(() => {
  let games = gameStore.games.map(game => {
    // 解构响应式对象
    const rawGame = {
      id: game.id,
      name: game.name,
      date: game.date,
      team_stats: game.team_stats ? { ...game.team_stats } : {},
      player_stats: game.player_stats ? [...game.player_stats] : []
    }

    console.log('Processing game raw data:', rawGame)

    let stats = rawGame.team_stats
    const playerStats = rawGame.player_stats

    // 如果team_stats为空，从player_stats计算
    if (Object.keys(stats).length === 0 && playerStats.length > 0) {
      stats = playerStats.reduce((acc, player) => {
        ['MIN', 'FGM', 'FGA', 'threePM', 'threePA', 'FTM', 'FTA',
          'OREB', 'DREB', 'AST', 'TOV', 'STL', 'BLK', 'PF'].forEach(key => {
            acc[key] = (acc[key] || 0) + (Number(player[key]) || 0)
          })
        return acc
      }, {})
      stats.GR = '-'
      stats.GT = '-'
    }

    // 计算得分
    const pts = ((Number(stats.FGM) || 0) * 2) +
      ((Number(stats.threePM) || 0) * 3) +
      (Number(stats.FTM) || 0)

    return {
      id: rawGame.id,
      name: rawGame.name,
      date: rawGame.date,
      opponent: stats.opponent || '-',
      GR: stats.GR || '-',
      GT: stats.GT || '-',
      FGM: Number(stats.FGM) || 0,
      FGA: Number(stats.FGA) || 0,
      threePM: Number(stats.threePM) || 0,
      threePA: Number(stats.threePA) || 0,
      FTM: Number(stats.FTM) || 0,
      FTA: Number(stats.FTA) || 0,
      OREB: Number(stats.OREB) || 0,
      DREB: Number(stats.DREB) || 0,
      AST: Number(stats.AST) || 0,
      STL: Number(stats.STL) || 0,
      BLK: Number(stats.BLK) || 0,
      TOV: Number(stats.TOV) || 0,
      PF: Number(stats.PF) || 0,
      PTS: pts
    }
  })

  // 根据选中的比赛类型筛选
  if (selectedGameType.value !== 'all') {
    games = games.filter(game => {
      const gameType = game.GT.toLowerCase()
      return gameType === selectedGameType.value || (gameType === 'regular season' && selectedGameType.value === 'regular')
    })
  }

  return games
})

// 获取团队平均数据
const teamAverageStats = computed(() => {
  const games = teamGameStats.value
  if (!games || !games.length) return {
    PTS: 0,
    FGM: 0,
    FGA: 0,
    threePM: 0,
    threePA: 0,
    FTM: 0,
    FTA: 0,
    OREB: 0,
    DREB: 0,
    AST: 0,
    STL: 0,
    BLK: 0,
    TOV: 0,
    PF: 0
  }

  const totalGames = games.length
  const totals = games.reduce((acc, game) => {
    Object.keys(game).forEach(key => {
      if (typeof game[key] === 'number') {
        acc[key] = (acc[key] || 0) + (Number(game[key]) || 0)
      }
    })
    return acc
  }, {})

  const averages = {}
  Object.keys(totals).forEach(key => {
    if (key === 'id') return // 跳过id字段
    const value = totals[key] / totalGames
    // 确保所有数值保留两位小数
    averages[key] = Number(value.toFixed(2))
  })

  return averages
})

// 开始编辑比赛名称
const startEditGameName = (game) => {
  editingGameId.value = game.id
  editingGameName.value = game.name
}

// 保存比赛名称
const saveGameName = () => {
  if (editingGameId.value && editingGameName.value.trim()) {
    gameStore.updateGame(editingGameId.value, {
      name: editingGameName.value.trim()
    })
    editingGameId.value = null
    editingGameName.value = ''
  }
}

// 取消编辑
const cancelEdit = () => {
  editingGameId.value = null
  editingGameName.value = ''
}

// 计算命中率
const calculatePercentage = (made, attempted) => {
  if (!attempted) return 'N/A'
  const percentage = (made / attempted) * 100
  return percentage.toFixed(1) === '0.0' ? '0.00' : percentage.toFixed(2) + '%'
}
</script>

<template>
  <div class="container mx-auto py-4">
    <div class="flex flex-col gap-4 rounded-lg">
      <!-- 平均数据卡片 -->
      <div class="p-4 border rounded shadow-lg">
        <!-- Glossary -->
        <div class="overflow-x-auto overflow-y-auto">
          <div class="collapse ">
            <input type="checkbox" />
            <div class="collapse-title">
              <button class="btn btn-soft btn-sm">
                Glossary
              </button>
            </div>
            <div class="collapse-content">
              <table class="table-sm text-left font-bold">
                <!-- head -->
                <!-- body -->
                <tbody>
                  <!-- row 1 -->
                  <tr>
                    <th>GP - Game Played</th>
                    <th>GR - Game Result</th>
                    <th>GT - Game Type</th>
                    <th>PTS - Points</th>
                    <th>FG - Field Goal</th>
                    <th>FGM - Field Goal Made</th>
                  </tr>
                  <!-- row 2 -->
                  <tr>
                    <th>FGA - Field Goal Attempted</th>
                    <th>FG% - Field Goal Percentage</th>
                    <th>3P - Three-Point Field Goal</th>
                    <th>3PM - Three-Point Field Goal Made</th>
                    <th>3PA - Three-Point Field Goal Attempted</th>
                    <th>3P% - Three-Point Field Goal Percentage</th>
                  </tr>
                  <!-- row 3 -->
                  <tr>
                    <th>FT - Free Throw</th>
                    <th>FTM - Free Throw Made</th>
                    <th>FTA - Free Throw Attempted</th>
                    <th>FT% - Free Throw Percentage</th>
                    <th>OREB - Offensive Rebound</th>
                    <th>DREB - Defensive Rebound</th>
                  </tr>
                  <!-- row 4 -->
                  <tr>
                    <th>REB - Rebound</th>
                    <th>AST - Assist</th>
                    <th>STL - Steal</th>
                    <th>BLK - Block</th>
                    <th>TOV - Turnover</th>
                    <th>PF - Personal Fouls</th>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="flex-col justify-between items-center">
          <div class="p-4 border-b">
            <h3 class="text-xl font-bold">Team Average Statistics</h3>
          </div>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
            <div class="stat rounded-lg shadow-lg">
              <div class="stat-title">PTS</div>
              <div class="stat-value">{{ teamAverageStats?.PTS?.toFixed(2) || '0.00' }}</div>
            </div>
            <div class="stat rounded-lg shadow-lg">
              <div class="stat-title">FG%</div>
              <div class="stat-value">{{ calculatePercentage(teamAverageStats?.FGM, teamAverageStats?.FGA) }}</div>
            </div>
            <div class="stat rounded-lg shadow-lg">
              <div class="stat-title">3P%</div>
              <div class="stat-value">{{ calculatePercentage(teamAverageStats?.threePM, teamAverageStats?.threePA) }}
              </div>
            </div>
            <div class="stat rounded-lg shadow-lg">
              <div class="stat-title">FT%</div>
              <div class="stat-value">{{ calculatePercentage(teamAverageStats?.FTM, teamAverageStats?.FTA) }}</div>
            </div>
            <div class="stat rounded-lg shadow-lg">
              <div class="stat-title">REB</div>
              <div class="stat-value">{{ ((teamAverageStats?.OREB || 0) + (teamAverageStats?.DREB || 0)).toFixed(2) }}
              </div>
            </div>
            <div class="stat rounded-lg shadow-lg">
              <div class="stat-title">AST</div>
              <div class="stat-value">{{ teamAverageStats?.AST?.toFixed(2) || '0.00' }}</div>
            </div>
            <div class="stat rounded-lg shadow-lg">
              <div class="stat-title">STL</div>
              <div class="stat-value">{{ teamAverageStats?.STL?.toFixed(2) || '0.00' }}</div>
            </div>
            <div class="stat rounded-lg shadow-lg">
              <div class="stat-title">BLK</div>
              <div class="stat-value">{{ teamAverageStats?.BLK?.toFixed(2) || '0.00' }}</div>
            </div>
            <div class="stat rounded-lg shadow-lg">
              <div class="stat-title">TOV</div>
              <div class="stat-value">{{ teamAverageStats?.TOV?.toFixed(2) || '0.00' }}</div>
            </div>
            <div class="stat rounded-lg shadow-lg">
              <div class="stat-title">PF</div>
              <div class="stat-value">{{ teamAverageStats?.PF?.toFixed(2) || '0.00' }}</div>
            </div>
          </div>
        </div>
      </div>
      <!-- 比赛数据表格 -->
      <div class="flex flex-col gap-4">
        <div class="overflow-hidden border rounded-lg shadow-lg p-4">
          <div class="flex justify-between items-center p-4 border-b">
            <h2 class="text-xl font-bold">Game Statistics ({{ teamGameStats.length }} GP)</h2>
            <div class="flex gap-4">
              <select v-model="selectedGameType" class="select select-sm">
                <option v-for="option in gameTypeOptions" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
              <button v-if="authStore.isAdmin" @click="addNewGame" class="btn btn-primary btn-sm">
                Add New Game
              </button>
            </div>
          </div>
          <div class="overflow-hidden rounded-lg shadow-lg pt-4">
            <TeamStatsTable :stats="teamGameStats" :editing-game-id="editingGameId" :editing-game-name="editingGameName"
              @start-edit="startEditGameName" @save-edit="saveGameName" @cancel-edit="cancelEdit"
              @update:editing-game-name="editingGameName = $event" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
