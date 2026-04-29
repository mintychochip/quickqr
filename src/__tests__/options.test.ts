import { describe, it, expect } from 'vitest'
import {
  DotOptions,
  QROptions,
  ImageOptions,
  CornerOptions,
  BackgroundOptions,
  QRMode,
  QRErrorCorrectionLevel,
  CrossOriginType,
} from '@/container/qrcode/options.ts'
import { DotStyleType } from '@/container/qrcode/dot_style_type.ts'
import { Colors } from '@/container/color.ts'

describe('DotOptions', () => {
  it('creates default instance with create()', () => {
    const options = DotOptions.create()
    expect(options.color).toEqual(Colors.BLACK)
    expect(options.gradient).toBeNull()
    expect(options.type).toBe(DotStyleType.SQUARE)
    expect(options.roundSize).toBe(true)
  })

  it('builds with builder pattern', () => {
    const options = DotOptions.builder()
      .color(Colors.WHITE)
      .type(DotStyleType.ROUNDED)
      .roundSize(false)
      .build()

    expect(options.color).toEqual(Colors.WHITE)
    expect(options.type).toBe(DotStyleType.ROUNDED)
    expect(options.roundSize).toBe(false)
  })

  it('preserves immutability via builder spread', () => {
    const original = DotOptions.create()
    const built = DotOptions.builder().color(Colors.WHITE).build()

    expect(original.color).toEqual(Colors.BLACK)
    expect(built.color).toEqual(Colors.WHITE)
  })
})

describe('QROptions', () => {
  it('creates default instance with create()', () => {
    const options = QROptions.create()
    expect(options.typeNumber).toBe(0)
    expect(options.mode).toBe(QRMode.BYTE)
    expect(options.errorCorrectionLevel).toBe(QRErrorCorrectionLevel.Q)
  })

  it('builds with all properties via builder', () => {
    const options = QROptions.builder()
      .typeNumber(5)
      .mode(QRMode.NUMERIC)
      .errorCorrectionLevel(QRErrorCorrectionLevel.H)
      .build()

    expect(options.typeNumber).toBe(5)
    expect(options.mode).toBe(QRMode.NUMERIC)
    expect(options.errorCorrectionLevel).toBe(QRErrorCorrectionLevel.H)
  })

  it('supports all QR modes', () => {
    const modes = [
      QRMode.BYTE,
      QRMode.ALPHA_NUMERIC,
      QRMode.NUMERIC,
      QRMode.KANJI,
    ]

    modes.forEach((mode) => {
      const options = QROptions.builder().mode(mode).build()
      expect(options.mode).toBe(mode)
    })
  })

  it('supports all error correction levels', () => {
    const levels = [
      QRErrorCorrectionLevel.L,
      QRErrorCorrectionLevel.M,
      QRErrorCorrectionLevel.Q,
      QRErrorCorrectionLevel.H,
    ]

    levels.forEach((level) => {
      const options = QROptions.builder().errorCorrectionLevel(level).build()
      expect(options.errorCorrectionLevel).toBe(level)
    })
  })
})

describe('ImageOptions', () => {
  it('creates default instance with create()', () => {
    const options = ImageOptions.create()
    expect(options.hideBackgroundDots).toBe(true)
    expect(options.imageSize).toBe(0.4)
    expect(options.margin).toBe(0)
    expect(options.crossOrigin).toBeNull()
    expect(options.saveAsBlob).toBe(true)
  })

  it('builds with all properties via builder', () => {
    const options = ImageOptions.builder()
      .hideBackgroundDots(false)
      .imageSize(0.6)
      .margin(10)
      .crossOrigin(CrossOriginType.ANONYMOUS)
      .saveAsBlob(false)
      .build()

    expect(options.hideBackgroundDots).toBe(false)
    expect(options.imageSize).toBe(0.6)
    expect(options.margin).toBe(10)
    expect(options.crossOrigin).toBe(CrossOriginType.ANONYMOUS)
    expect(options.saveAsBlob).toBe(false)
  })

  it('supports cross origin types', () => {
    const anonymous = ImageOptions.builder()
      .crossOrigin(CrossOriginType.ANONYMOUS)
      .build()
    expect(anonymous.crossOrigin).toBe('anonymous')

    const credentials = ImageOptions.builder()
      .crossOrigin(CrossOriginType.CREDENTIALS)
      .build()
    expect(credentials.crossOrigin).toBe('credentials')
  })

  it('allows null cross origin', () => {
    const options = ImageOptions.builder().crossOrigin(null).build()
    expect(options.crossOrigin).toBeNull()
  })
})

describe('CornerOptions', () => {
  it('creates default instance with create()', () => {
    const options = CornerOptions.create()
    expect(options.color).toEqual(Colors.BLACK)
    expect(options.gradient).toBeNull()
    expect(options.type).toBe(DotStyleType.SQUARE)
  })

  it('builds with all properties via builder', () => {
    const options = CornerOptions.builder()
      .color(Colors.WHITE)
      .type(DotStyleType.DOTS)
      .build()

    expect(options.color).toEqual(Colors.WHITE)
    expect(options.type).toBe(DotStyleType.DOTS)
  })

  it('supports all dot style types', () => {
    const types = [
      DotStyleType.SQUARE,
      DotStyleType.ROUNDED,
      DotStyleType.DOTS,
      DotStyleType.CLASSY,
      DotStyleType.CLASSY_ROUNDED,
    ]

    types.forEach((type) => {
      const options = CornerOptions.builder().type(type).build()
      expect(options.type).toBe(type)
    })
  })
})

describe('BackgroundOptions', () => {
  it('creates default instance with create()', () => {
    const options = BackgroundOptions.create()
    expect(options.color).toEqual(Colors.BLACK)
    expect(options.gradient).toBeNull()
  })

  it('builds with color via builder', () => {
    const options = BackgroundOptions.builder().color(Colors.WHITE).build()
    expect(options.color).toEqual(Colors.WHITE)
  })

  it('builds with gradient via builder', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- test mock, intentionally flexible
    const mockGradient = { type: 'linear', stops: [] } as any
    const options = BackgroundOptions.builder().gradient(mockGradient).build()
    expect(options.gradient).toEqual(mockGradient)
  })

  it('allows null gradient', () => {
    const options = BackgroundOptions.builder().gradient(null).build()
    expect(options.gradient).toBeNull()
  })
})

describe('Builder patterns immutability', () => {
  it('DotOptions builder returns new instance each build', () => {
    const builder = DotOptions.builder().color(Colors.WHITE)
    const first = builder.build()
    const second = builder.type(DotStyleType.ROUNDED).build()

    expect(first.color).toEqual(Colors.WHITE)
    expect(first.type).toBe(DotStyleType.SQUARE) // original default
    expect(second.type).toBe(DotStyleType.ROUNDED)
  })

  it('builders create independent instances', () => {
    const builder1 = DotOptions.builder()
    const builder2 = DotOptions.builder()

    const options1 = builder1.color(Colors.WHITE).build()
    const options2 = builder2.type(DotStyleType.DOTS).build()

    expect(options1.color).toEqual(Colors.WHITE)
    expect(options1.type).toBe(DotStyleType.SQUARE)
    expect(options2.color).toEqual(Colors.BLACK)
    expect(options2.type).toBe(DotStyleType.DOTS)
  })
})
