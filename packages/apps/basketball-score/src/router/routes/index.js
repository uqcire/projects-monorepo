import { usePlayerStore } from '@/stores/player'

export const Routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/TeamStats.vue'),
    meta: {
      title: 'Team Stats',
    }
  },
  {
    path: '/game/:id',
    name: 'GameDetail',
    component: () => import('@/views/GameDetail.vue'),
    props: true,
    meta: {
      title: 'Game Detail',
      layout: 'AppLayout'
    }
  },
  {
    path: '/players',
    name: 'PlayerStats',
    component: () => import('@/views/PlayerStats.vue'),
    meta: {
      title: 'Player Stats',
      layout: 'AppLayout'
    }
  },
  {
    path: '/players/:id',
    name: 'PlayerDetail',
    component: () => import('@/views/PlayerDetail.vue'),
    props: true,
    beforeEnter: async (to, from, next) => {
      const store = usePlayerStore()
      // 确保数据已加载
      if (store.players.length === 0) {
        await store.fetchPlayers()
      }
      const playerExists = store.players.some(p => p.id === Number(to.params.id))
      playerExists ? next() : next('/players?error=player_not_found')
    },
    meta: {
      title: 'Player Detail',
      layout: 'AppLayout'
    }
  }
]
