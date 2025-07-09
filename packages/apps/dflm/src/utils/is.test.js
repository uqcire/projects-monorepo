import { describe, expect, it } from 'vitest'

// 简单的工具函数测试示例
describe('工具函数测试', () => {
  it('应该能够正常运行测试', () => {
    expect(true).toBe(true)
  })

  it('应该能够测试基本的数学运算', () => {
    expect(1 + 1).toBe(2)
    expect(2 * 3).toBe(6)
  })

  it('应该能够测试字符串操作', () => {
    const str = 'Hello World'
    expect(str.toLowerCase()).toBe('hello world')
    expect(str.includes('World')).toBe(true)
  })

  it('应该能够测试数组操作', () => {
    const arr = [1, 2, 3]
    expect(arr.length).toBe(3)
    expect(arr.includes(2)).toBe(true)
    expect(arr.map(x => x * 2)).toEqual([2, 4, 6])
  })

  it('应该能够测试对象操作', () => {
    const obj = { name: 'Test', value: 42 }
    expect(obj.name).toBe('Test')
    expect(obj.value).toBe(42)
    expect(Object.keys(obj)).toEqual(['name', 'value'])
  })
})
