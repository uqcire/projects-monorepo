import { describe, expect, it } from 'vitest'

// 类型检查工具函数测试示例
describe('类型检查工具函数测试', () => {
  it('应该能够检查数据类型', () => {
    const str = 'hello'
    const num = 42
    const arr = [1, 2, 3]
    const obj = { key: 'value' }

    expect(typeof str).toBe('string')
    expect(typeof num).toBe('number')
    expect(Array.isArray(arr)).toBe(true)
    expect(typeof obj).toBe('object')
  })

  it('应该能够检查空值', () => {
    const nullValue = null
    const undefinedValue = undefined
    const emptyString = ''
    const zeroValue = 0

    expect(nullValue == null).toBe(true)
    expect(undefinedValue == null).toBe(true)
    expect(emptyString === '').toBe(true)
    expect(zeroValue === 0).toBe(true)
  })

  it('应该能够检查对象属性', () => {
    const obj = { name: 'Test', age: 25 }

    expect('name' in obj).toBe(true)
    expect('age' in obj).toBe(true)
    expect('email' in obj).toBe(false)
    expect(obj.hasOwnProperty('name')).toBe(true)
  })

  it('应该能够检查数组内容', () => {
    const numbers = [1, 2, 3, 4, 5]
    const strings = ['a', 'b', 'c']
    const mixed = [1, 'a', true, null]

    expect(numbers.every(n => typeof n === 'number')).toBe(true)
    expect(strings.every(s => typeof s === 'string')).toBe(true)
    expect(mixed.some(item => typeof item === 'boolean')).toBe(true)
  })
})
