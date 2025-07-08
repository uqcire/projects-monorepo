import { createPinia } from 'pinia'
import { useGameStore } from './game'
import { usePlayerStore } from './player'
import { useTeamStore } from './team'

export function setupStore(app) {
  const pinia = createPinia()
  app.use(pinia)

  // 初始化 stores
  const playerStore = usePlayerStore()
  const teamStore = useTeamStore()
  const gameStore = useGameStore()

  // 确保数据加载
  Promise.all([
    playerStore.fetchPlayers(),
    teamStore.fetchTeamData(),
    gameStore.fetchGames()
  ]).catch(console.error)
}
