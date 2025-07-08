import { defineStore } from 'pinia'
import { useGameStore } from './game'

export const useTeamStore = defineStore('team', {
  state: () => ({
    name: '我的球队',
    games: []
  }),

  actions: {
    async fetchTeamData() {
      // 模拟从后端获取数据
      // 实际项目中这里应该是一个 API 调用
      const gameStore = useGameStore()
      this.games = gameStore.games
    },

    updateTeamName(name) {
      this.name = name
    }
  },

  getters: {
    // 获取所有比赛数据
    getAllGames() {
      return this.games
    },

    // 计算球队平均数据
    getTeamAverageStats() {
      if (!this.games.length) return null

      const totalGames = this.games.length
      const averageStats = {
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
        TOV: 0,
        STL: 0,
        BLK: 0,
        PF: 0
      }

      // 计算总和
      this.games.forEach(game => {
        Object.keys(averageStats).forEach(key => {
          if (game.teamStats && game.teamStats[key]) {
            averageStats[key] += game.teamStats[key]
          }
        })
      })

      // 计算平均值
      Object.keys(averageStats).forEach(key => {
        averageStats[key] = Number((averageStats[key] / totalGames).toFixed(1))
      })

      return averageStats
    }
  }
})
