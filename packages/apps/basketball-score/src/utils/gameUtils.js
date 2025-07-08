// 常量
export const GAME_RESULTS = ['Win', 'Loss', 'Tie']
export const GAME_TYPES = ['Tournement', 'Grading', 'Regular']
export const STAT_FIELDS = ['MIN', 'FGM', 'FGA', 'threePM', 'threePA', 'FTM', 'FTA',
  'OREB', 'DREB', 'AST', 'TOV', 'STL', 'BLK', 'PF']

// 计算团队统计数据
export const calculateTeamStats = (playerStats) => {
  return playerStats.reduce((team, player) => {
    STAT_FIELDS.forEach(key => {
      team[key] = (team[key] || 0) + Number(player[key])
    })
    return team
  }, {})
}

// 保持团队信息
export const preserveTeamInfo = (newTeamStats, existingTeamStats) => {
  return Object.assign(newTeamStats, {
    opponent: existingTeamStats.opponent || '-',
    GR: existingTeamStats.GR || '-',
    GT: existingTeamStats.GT || '-'
  })
}

// 计算命中率
export const calculatePercentage = (made, attempted) => {
  if (!attempted) return 'N/A'
  return ((made / attempted) * 100).toFixed(1) + '%'
}

// 计算得分
export const calculatePoints = (stat) => {
  return (stat.FGM * 2) + (stat.threePM * 3) + stat.FTM
}

// 格式化时间显示
export const formatTime = (minutes, seconds) => {
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

// 格式化显示时间（用于非编辑状态）
export const formatDisplayTime = (minutes) => {
  const mins = Math.floor(minutes)
  const secs = Math.round((minutes - mins) * 60)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

// 创建新的球员统计数据
export const createEmptyPlayerStats = (playerId) => ({
  playerId: Number(playerId),
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
  PF: 0
})
