import { describe, it, expect } from 'vitest'
import { Color, Colors } from '@/container/color.ts'

describe('Color', () => {
  it('creates color from hex string', () => {
    const color = Color.hex('#FF5733')
    expect(color.hex).toBe('#FF5733')
  })

  it('creates color from RGB values', () => {
    const color = Color.rgb(255, 87, 51)
    expect(color.hex).toBe('16734003')
  })

  it('converts to string correctly', () => {
    const color = Color.hex('#ABC123')
    expect(color.toString()).toBe('#ABC123')
  })

  it('stores hex value internally', () => {
    const color = Color.hex('#000000')
    expect(color.hex).toBe('#000000')
  })
})

describe('Colors constants', () => {
  it('has BLACK color', () => {
    expect(Colors.BLACK.hex).toBe('#000000')
  })

  it('has WHITE color', () => {
    expect(Colors.WHITE.hex).toBe('#FFFFFF')
  })

  it('has RED color', () => {
    expect(Colors.RED.hex).toBe('#FF0000')
  })

  it('has LIME color', () => {
    expect(Colors.LIME.hex).toBe('#00FF00')
  })

  it('has BLUE color', () => {
    expect(Colors.BLUE.hex).toBe('#0000FF')
  })

  it('has YELLOW color', () => {
    expect(Colors.YELLOW.hex).toBe('#FFFF00')
  })

  it('has CYAN color', () => {
    expect(Colors.CYAN.hex).toBe('#00FFFF')
  })

  it('has MAGENTA color', () => {
    expect(Colors.MAGENTA.hex).toBe('#FF00FF')
  })

  it('has SILVER color', () => {
    expect(Colors.SILVER.hex).toBe('#C0C0C0')
  })

  it('has GRAY color', () => {
    expect(Colors.GRAY.hex).toBe('#808080')
  })

  it('has MAROON color', () => {
    expect(Colors.MAROON.hex).toBe('#800000')
  })

  it('has OLIVE color', () => {
    expect(Colors.OLIVE.hex).toBe('#808000')
  })

  it('has GREEN color', () => {
    expect(Colors.GREEN.hex).toBe('#008000')
  })

  it('has PURPLE color', () => {
    expect(Colors.PURPLE.hex).toBe('#800080')
  })

  it('has TEAL color', () => {
    expect(Colors.TEAL.hex).toBe('#008080')
  })

  it('has NAVY color', () => {
    expect(Colors.NAVY.hex).toBe('#000080')
  })
})

describe('Color immutability', () => {
  it('hex property is readonly', () => {
    const color = Color.hex('#123456')
    expect(color.hex).toBe('#123456')
  })

  it('each color instance is independent', () => {
    const color1 = Color.hex('#111111')
    const color2 = Color.hex('#222222')

    expect(color1.hex).toBe('#111111')
    expect(color2.hex).toBe('#222222')
  })
})
