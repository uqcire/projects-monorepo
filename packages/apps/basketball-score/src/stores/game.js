import { supabase } from '@/lib/supabase'
import { defineStore } from 'pinia'

export const useGameStore = defineStore('game', {
  state: () => ({
    games: []
  }),

  actions: {
    async fetchGames() {
      try {
        const { data, error } = await supabase
          .from('games')
          .select('*')
          .order('date', { ascending: false })

        if (error) throw error
        this.games = data || []
      } catch (error) {
        console.error('Error fetching games:', error)
      }
    },

    async addGame(gameData) {
      try {
        const { data, error } = await supabase
          .from('games')
          .insert([{
            name: gameData.name,
            date: gameData.date,
            opponent: gameData.opponent,
            team_stats: gameData.teamStats || {},
            player_stats: gameData.playerStats || [],
            videos: gameData.videos || []
          }])
          .select()
          .single()

        if (error) throw error
        this.games.unshift(data)
        return data.id
      } catch (error) {
        console.error('Error adding game:', error)
        throw error
      }
    },

    async updateGame(gameId, gameData) {
      try {
        const { data, error } = await supabase
          .from('games')
          .update({
            name: gameData.name,
            date: gameData.date,
            opponent: gameData.opponent,
            team_stats: gameData.team_stats,
            player_stats: gameData.player_stats || [],
            videos: gameData.videos || []
          })
          .eq('id', gameId)
          .select()
          .single()

        if (error) throw error
        const index = this.games.findIndex(g => g.id === gameId)
        if (index !== -1) {
          this.games[index] = data
        }
      } catch (error) {
        console.error('Error updating game:', error)
        throw error
      }
    },

    async updateGameStats(gameId, playerStats) {
      try {
        // 计算球队统计数据
        const teamStats = playerStats.reduce((team, player) => {
          // 基础数据
          ['MIN', 'FGM', 'FGA', 'threePM', 'threePA', 'FTM', 'FTA',
           'OREB', 'DREB', 'AST', 'TOV', 'STL', 'BLK', 'PF'].forEach(key => {
            team[key] = (team[key] || 0) + (Number(player[key]) || 0)
          })
          return team
        }, {})

        // 获取当前比赛数据以保留GR和GT
        const currentGame = this.games.find(g => g.id === gameId)
        const updatedTeamStats = {
          ...teamStats,
          GR: currentGame?.team_stats?.GR || '-',
          GT: currentGame?.team_stats?.GT || '-'
        }

        console.log('Updating team stats:', updatedTeamStats)

        const { data, error } = await supabase
          .from('games')
          .update({
            team_stats: updatedTeamStats,
            player_stats: playerStats
          })
          .eq('id', gameId)
          .select()
          .single()

        if (error) throw error
        const index = this.games.findIndex(g => g.id === gameId)
        if (index !== -1) {
          this.games[index] = data
          console.log('Updated game in store:', this.games[index])
        }

        // 重新获取所有比赛数据以确保同步
        await this.fetchGames()
      } catch (error) {
        console.error('Error updating game stats:', error)
        throw error
      }
    },

    async deleteGame(gameId) {
      try {
        const { error } = await supabase
          .from('games')
          .delete()
          .eq('id', gameId)

        if (error) throw error

        // 从本地状态中移除
        const index = this.games.findIndex(g => g.id === gameId)
        if (index !== -1) {
          this.games.splice(index, 1)
        }
      } catch (error) {
        console.error('Error deleting game:', error)
        throw error
      }
    }
  },

  getters: {
    getGameById: (state) => (id) => {
      return state.games.find(game => game.id === id)
    },

    getGameStats: (state) => (id) => {
      const game = state.games.find(game => game.id === id)
      return game ? {
        teamStats: game.team_stats || {},
        playerStats: game.player_stats || []
      } : null
    }
  }
})
