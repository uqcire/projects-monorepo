import { supabase } from '@/lib/supabase'
import { defineStore } from 'pinia'
import { useGameStore } from './game'

export const usePlayerStore = defineStore('player', {
  state: () => ({
    players: []
  }),

  actions: {
    async fetchPlayers() {
      try {
        const { data, error } = await supabase
          .from('players')
          .select('*')
          .order('name')

        if (error) throw error
        this.players = data || []
      } catch (error) {
        console.error('Error fetching players:', error)
      }
    },

    async addPlayer(playerData) {
      try {
        const { data, error } = await supabase
          .from('players')
          .insert([{
            name: playerData.name,
            number: playerData.number,
            stats: [] // 添加空的统计数据数组
          }])
          .select()
          .single()

        if (error) throw error
        this.players.push(data)
        return data.id
      } catch (error) {
        console.error('Error adding player:', error)
        throw error
      }
    },

    async updatePlayer(playerId, playerData) {
      try {
        const { data, error } = await supabase
          .from('players')
          .update({
            name: playerData.name,
            number: playerData.number,
            stats: playerData.stats || [] // 确保 stats 字段存在
          })
          .eq('id', playerId)
          .select()
          .single()

        if (error) throw error
        const index = this.players.findIndex(p => p.id === playerId)
        if (index !== -1) {
          this.players[index] = data
        }
      } catch (error) {
        console.error('Error updating player:', error)
        throw error
      }
    },

    async updatePlayerStats(playerId, gameId, stats) {
      try {
        const player = this.players.find(p => p.id === playerId)
        if (!player) return

        // 确保 stats 是一个数组
        const playerStats = Array.isArray(player.stats) ? player.stats : []
        const gameIndex = playerStats.findIndex(s => s.gameId === gameId)

        if (gameIndex !== -1) {
          playerStats[gameIndex] = { ...playerStats[gameIndex], ...stats }
        } else {
          playerStats.push({ gameId, ...stats })
        }

        // 更新 Supabase
        const { data, error } = await supabase
          .from('players')
          .update({
            stats: playerStats,
            updated_at: new Date().toISOString()
          })
          .eq('id', playerId)
          .select()
          .single()

        if (error) throw error

        // 更新本地状态
        const index = this.players.findIndex(p => p.id === playerId)
        if (index !== -1) {
          this.players[index] = data
        }
      } catch (error) {
        console.error('Error updating player stats:', error)
        throw error
      }
    },

    async deletePlayer(playerId) {
      try {
        const { error } = await supabase
          .from('players')
          .delete()
          .eq('id', playerId)

        if (error) throw error

        // 从本地状态中移除
        const index = this.players.findIndex(p => p.id === playerId)
        if (index !== -1) {
          this.players.splice(index, 1)
        }
      } catch (error) {
        console.error('Error deleting player:', error)
        throw error
      }
    }
  },

  getters: {
    getPlayerById: (state) => (id) => {
      return state.players.find(player => player.id === id)
    },

    getAllPlayers: (state) => {
      return state.players
    },

    // 获取球员所有比赛数据
    getPlayerStats: (state) => (playerId) => {
      const player = state.players.find(p => p.id === playerId)
      const gameStore = useGameStore()
      const playerStats = player?.stats || []

      return playerStats.map(stat => {
        const game = gameStore.getGameById(stat.gameId)
        return {
          ...stat,
          name: game?.name || `比赛 ${stat.gameId}`,
          team_stats: game?.team_stats || {}
        }
      })
    },

    // 计算球员平均数据
    getPlayerAverageStats: (state) => (playerId) => {
      const player = state.players.find(p => p.id === playerId)
      const stats = player?.stats || []

      if (!stats.length) return null

      const totalGames = stats.length
      const averageStats = {
        gamesPlayed: totalGames,
        MIN: 0,
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
        PF: 0,
        PTS: 0
      }

      // 计算总和
      stats.forEach(game => {
        Object.keys(averageStats).forEach(key => {
          if (key !== 'gamesPlayed') {
            if (key === 'PTS') {
              // 计算得分：(FGM * 2) + (threePM * 3) + FTM
              averageStats.PTS += (game.FGM * 2) + (game.threePM * 3) + game.FTM
            } else if (game[key]) {
              averageStats[key] += game[key]
            }
          }
        })
      })

      // 计算平均值
      Object.keys(averageStats).forEach(key => {
        if (key !== 'gamesPlayed') {
          averageStats[key] = Number((averageStats[key] / totalGames).toFixed(1))
        }
      })

      return averageStats
    }
  }
})
