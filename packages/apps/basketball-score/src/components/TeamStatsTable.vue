<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps({
  stats: {
    type: Array,
    required: true
  },
  editingGameId: {
    type: [Number, String],
    default: null
  },
  editingGameName: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['start-edit', 'save-edit', 'cancel-edit', 'update:editingGameName'])

const headers = [
  'GAME', 'GR', 'GT', 'PTS', 'FGM', 'FGA', 'FG%',
  '3PM', '3PA', '3P%', 'FTM', 'FTA', 'FT%',
  'OREB', 'DREB', 'REB', 'AST', 'TOV', 'STL', 'BLK', 'PF'
]

const calculatePTS = (record) => {
  return (record.FGM * 2) + (record.threePM * 3) + record.FTM
}

const calculatePercentage = (made, attempted) => {
  if (!attempted) return 'N/A'
  return ((made / attempted) * 100).toFixed(1) + '%'
}

const calculateREB = (record) => {
  return (record.OREB || 0) + (record.DREB || 0)
}

const handleInput = (event) => {
  emit('update:editingGameName', event.target.value)
}

const goToGameDetail = (gameId) => {
  if (props.editingGameId === gameId) return
  router.push(`/game/${gameId}`)
}
</script>

<template>
  <div class="overflow-auto rounded-lg shadow-lg">
    <table class="table-md min-w-full">
      <thead>
        <tr>
          <th class="px-6 py-3 text-left text-md font-medium text-gray-600">
            Game
          </th>
          <th class="px-6 py-3 text-left text-md font-medium text-gray-600">
            Opponent
          </th>
          <th class="px-6 py-3 text-left text-md font-medium text-gray-600">
            Date
          </th>
          <th class="px-6 py-3 text-left text-md font-medium text-gray-600">
            GR
          </th>
          <th class="px-6 py-3 text-left text-md font-medium text-gray-600">
            GT
          </th>
          <th class="px-6 py-3 text-left text-md font-medium text-gray-600">
            PTS
          </th>
          <th class="px-6 py-3 text-left text-md font-medium text-gray-600">
            FG
          </th>
          <th class="px-6 py-3 text-left text-md font-medium text-gray-600">
            3FG
          </th>
          <th class="px-6 py-3 text-left text-md font-medium text-gray-600">
            FT
          </th>
          <th class="px-6 py-3 text-left text-md font-medium text-gray-600">
            REB
          </th>
          <th class="px-6 py-3 text-left text-md font-medium text-gray-600">
            AST
          </th>
          <th class="px-6 py-3 text-left text-md font-medium text-gray-600">
            STL
          </th>
          <th class="px-6 py-3 text-left text-md font-medium text-gray-600">
            BLK
          </th>
          <th class="px-6 py-3 text-left text-md font-medium text-gray-600">
            TOV
          </th>
          <th class="px-6 py-3 text-left text-md font-medium text-gray-600">
            PF
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200">
        <tr v-for="stat in stats" :key="stat.id" class="hover:bg-gray-50 cursor-pointer"
          @click="goToGameDetail(stat.id)">
          <td class="px-6 py-4 whitespace-nowrap">
            {{ stat.name }}
          </td>
          <!-- 对手名称 -->
          <td class="px-6 py-4 whitespace-nowrap">
            {{ stat.opponent }}
          </td>
          <!-- 比赛日期 -->
          <td class="px-6 py-4 whitespace-nowrap">
            {{ stat.date }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            {{ stat.GR }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            {{ stat.GT }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap font-semibold">
            {{ stat.PTS }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            {{ stat.FGM }}/{{ stat.FGA }}
            <span class="text-gray-500 text-sm">
              ({{ calculatePercentage(stat.FGM, stat.FGA) }})
            </span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            {{ stat.threePM }}/{{ stat.threePA }}
            <span class="text-gray-500 text-sm">
              ({{ calculatePercentage(stat.threePM, stat.threePA) }})
            </span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            {{ stat.FTM }}/{{ stat.FTA }}
            <span class="text-gray-500 text-sm">
              ({{ calculatePercentage(stat.FTM, stat.FTA) }})
            </span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            {{ stat.OREB + stat.DREB }}
            <span class="text-gray-500 text-sm">
              ({{ stat.OREB }}/{{ stat.DREB }})
            </span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            {{ stat.AST }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            {{ stat.STL }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            {{ stat.BLK }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            {{ stat.TOV }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            {{ stat.PF }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
