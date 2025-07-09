import { describe, expect, it } from 'vitest'

// 验证工具函数测试示例
describe('验证工具函数测试', () => {
  it('应该能够验证邮箱格式', () => {
    const validEmail = 'test@example.com'
    const invalidEmail = 'invalid-email'

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    expect(emailRegex.test(validEmail)).toBe(true)
    expect(emailRegex.test(invalidEmail)).toBe(false)
  })

  it('应该能够验证手机号格式', () => {
    const validPhone = '13800138000'
    const invalidPhone = '123'

    const phoneRegex = /^1[3-9]\d{9}$/

    expect(phoneRegex.test(validPhone)).toBe(true)
    expect(phoneRegex.test(invalidPhone)).toBe(false)
  })

  it('应该能够验证必填字段', () => {
    const requiredField = 'Some Value'
    const emptyField = ''

    const isRequired = (value) => value && value.trim().length > 0

    expect(isRequired(requiredField)).toBe(true)
    expect(isRequired(emptyField)).toBe(false)
  })

  it('应该能够验证字符串长度', () => {
    const shortString = 'Hi'
    const longString = 'This is a very long string for testing'

    const minLength = 3
    const maxLength = 20

    expect(shortString.length >= minLength).toBe(false)
    expect(longString.length <= maxLength).toBe(false)
  })
})
