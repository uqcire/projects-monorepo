import { describe, expect, it } from 'vitest'

// 游戏工具函数测试示例
describe('游戏工具函数测试', () => {
  it('应该能够计算得分', () => {
    const score1 = 10
    const score2 = 15
    const total = score1 + score2
    expect(total).toBe(25)
  })

  it('应该能够判断比赛结果', () => {
    const team1Score = 95
    const team2Score = 87
    const winner = team1Score > team2Score ? 'team1' : 'team2'
    expect(winner).toBe('team1')
  })

  it('应该能够格式化时间', () => {
    const seconds = 125
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    const formatted = `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
    expect(formatted).toBe('2:05')
  })

  it('应该能够计算投篮命中率', () => {
    const made = 8
    const attempted = 12
    const percentage = Math.round((made / attempted) * 100)
    expect(percentage).toBe(67)
  })
})
