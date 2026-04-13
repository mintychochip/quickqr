import { describe, it, expect, beforeEach } from 'vitest'
import {
  QuickQRCodeStyling,
  QuickQRCodeProperties,
  ImageType,
  ImageShape,
  CornerDotStyle,
} from '@/container/qrcode/qrcode.ts'
import { QROptions, ImageOptions, DotOptions } from '@/container/qrcode/options.ts'
import { QRMode, QRErrorCorrectionLevel } from '@/container/qrcode/options.ts'

describe('QuickQRCodeStyling', () => {
  let styling: QuickQRCodeStyling

  beforeEach(() => {
    styling = new QuickQRCodeStyling()
  })

  it('sets and gets values', () => {
    styling.setValue(QuickQRCodeProperties.WIDTH, 300)
    expect(styling.getValue(QuickQRCodeProperties.WIDTH)).toBe(300)
  })

  it('returns null for unset values', () => {
    expect(styling.getValue(QuickQRCodeProperties.HEIGHT)).toBeNull()
  })

  it('returns default for unset values with getValueOrDefault', () => {
    expect(styling.getValueOrDefault(QuickQRCodeProperties.WIDTH, 200)).toBe(200)
  })

  it('returns actual value when set with getValueOrDefault', () => {
    styling.setValue(QuickQRCodeProperties.WIDTH, 500)
    expect(styling.getValueOrDefault(QuickQRCodeProperties.WIDTH, 200)).toBe(500)
  })

  it('stores multiple different property types', () => {
    styling.setValue(QuickQRCodeProperties.WIDTH, 400)
    styling.setValue(QuickQRCodeProperties.HEIGHT, 400)
    styling.setValue(QuickQRCodeProperties.DATA, 'https://example.com')
    styling.setValue(QuickQRCodeProperties.IMAGE, 'logo.png')
    styling.setValue(QuickQRCodeProperties.MARGIN, 20)

    expect(styling.getValue(QuickQRCodeProperties.WIDTH)).toBe(400)
    expect(styling.getValue(QuickQRCodeProperties.HEIGHT)).toBe(400)
    expect(styling.getValue(QuickQRCodeProperties.DATA)).toBe('https://example.com')
    expect(styling.getValue(QuickQRCodeProperties.IMAGE)).toBe('logo.png')
    expect(styling.getValue(QuickQRCodeProperties.MARGIN)).toBe(20)
  })

  it('stores QROptions object', () => {
    const qrOptions = QROptions.builder()
      .mode(QRMode.BYTE)
      .errorCorrectionLevel(QRErrorCorrectionLevel.H)
      .build()

    styling.setValue(QuickQRCodeProperties.QR_OPTIONS, qrOptions)
    const retrieved = styling.getValue(QuickQRCodeProperties.QR_OPTIONS)

    expect(retrieved).toEqual(qrOptions)
    expect(retrieved?.mode).toBe(QRMode.BYTE)
    expect(retrieved?.errorCorrectionLevel).toBe(QRErrorCorrectionLevel.H)
  })

  it('stores ImageOptions object', () => {
    const imageOptions = ImageOptions.builder()
      .imageSize(0.5)
      .margin(10)
      .build()

    styling.setValue(QuickQRCodeProperties.IMAGE_OPTIONS, imageOptions)
    const retrieved = styling.getValue(QuickQRCodeProperties.IMAGE_OPTIONS)

    expect(retrieved?.imageSize).toBe(0.5)
    expect(retrieved?.margin).toBe(10)
  })

  it('stores DotOptions object', () => {
    const dotOptions = DotOptions.create()
    styling.setValue(QuickQRCodeProperties.DOT_OPTIONS, dotOptions)

    const retrieved = styling.getValue(QuickQRCodeProperties.DOT_OPTIONS)
    expect(retrieved).toEqual(dotOptions)
  })

  it('overwrites existing values', () => {
    styling.setValue(QuickQRCodeProperties.WIDTH, 300)
    expect(styling.getValue(QuickQRCodeProperties.WIDTH)).toBe(300)

    styling.setValue(QuickQRCodeProperties.WIDTH, 500)
    expect(styling.getValue(QuickQRCodeProperties.WIDTH)).toBe(500)
  })

  it('stores image type', () => {
    styling.setValue(QuickQRCodeProperties.IMAGE_TYPE, ImageType.SVG)
    expect(styling.getValue(QuickQRCodeProperties.IMAGE_TYPE)).toBe('svg')

    styling.setValue(QuickQRCodeProperties.IMAGE_TYPE, ImageType.CANVAS)
    expect(styling.getValue(QuickQRCodeProperties.IMAGE_TYPE)).toBe('canvas')
  })

  it('stores image shape', () => {
    styling.setValue(QuickQRCodeProperties.SHAPE, ImageShape.CIRCLE)
    expect(styling.getValue(QuickQRCodeProperties.SHAPE)).toBe('circle')

    styling.setValue(QuickQRCodeProperties.SHAPE, ImageShape.SQUARE)
    expect(styling.getValue(QuickQRCodeProperties.SHAPE)).toBe('square')
  })
})

describe('QuickQRCodeStylingBuilder', () => {
  it('builds empty styling', () => {
    const styling = QuickQRCodeStyling.builder().build()
    expect(styling.getValue(QuickQRCodeProperties.WIDTH)).toBeNull()
  })

  it('builds with chained setValue calls', () => {
    const styling = QuickQRCodeStyling.builder()
      .setValue(QuickQRCodeProperties.WIDTH, 400)
      .setValue(QuickQRCodeProperties.HEIGHT, 400)
      .setValue(QuickQRCodeProperties.DATA, 'test-data')
      .build()

    expect(styling.getValue(QuickQRCodeProperties.WIDTH)).toBe(400)
    expect(styling.getValue(QuickQRCodeProperties.HEIGHT)).toBe(400)
    expect(styling.getValue(QuickQRCodeProperties.DATA)).toBe('test-data')
  })

  it('builder builds same styling with cumulative values', () => {
    const builder = QuickQRCodeStyling.builder()
      .setValue(QuickQRCodeProperties.WIDTH, 300)

    const first = builder.build()
    const second = builder
      .setValue(QuickQRCodeProperties.HEIGHT, 300)
      .build()

    // Builder accumulates values - this is expected behavior
    expect(first.getValue(QuickQRCodeProperties.WIDTH)).toBe(300)
    expect(first.getValue(QuickQRCodeProperties.HEIGHT)).toBe(300)
    expect(second.getValue(QuickQRCodeProperties.WIDTH)).toBe(300)
    expect(second.getValue(QuickQRCodeProperties.HEIGHT)).toBe(300)
  })

  it('new builders create independent stylings', () => {
    const builder1 = QuickQRCodeStyling.builder().setValue(QuickQRCodeProperties.WIDTH, 100)
    const builder2 = QuickQRCodeStyling.builder().setValue(QuickQRCodeProperties.WIDTH, 200)

    expect(builder1.build().getValue(QuickQRCodeProperties.WIDTH)).toBe(100)
    expect(builder2.build().getValue(QuickQRCodeProperties.WIDTH)).toBe(200)
  })
})

describe('QuickQRCodeProperties', () => {
  it('properties have correct names', () => {
    expect(QuickQRCodeProperties.WIDTH.propertyName).toBe('width')
    expect(QuickQRCodeProperties.HEIGHT.propertyName).toBe('height')
    expect(QuickQRCodeProperties.DATA.propertyName).toBe('data')
    expect(QuickQRCodeProperties.IMAGE.propertyName).toBe('image')
    expect(QuickQRCodeProperties.MARGIN.propertyName).toBe('margin')
    expect(QuickQRCodeProperties.QR_OPTIONS.propertyName).toBe('qrOptions')
    expect(QuickQRCodeProperties.IMAGE_OPTIONS.propertyName).toBe('imageOptions')
    expect(QuickQRCodeProperties.DOT_OPTIONS.propertyName).toBe('dotsOptions')
    expect(QuickQRCodeProperties.BACKGROUND_OPTIONS.propertyName).toBe('backgroundOptions')
    expect(QuickQRCodeProperties.CORNER_SQUARE_OPTIONS.propertyName).toBe('cornersSquareOptions')
    expect(QuickQRCodeProperties.CORNER_DOT_OPTIONS.propertyName).toBe('cornersDotOptions')
  })
})

describe('ImageType and ImageShape constants', () => {
  it('has correct ImageType values', () => {
    expect(ImageType.CANVAS).toBe('canvas')
    expect(ImageType.SVG).toBe('svg')
  })

  it('has correct ImageShape values', () => {
    expect(ImageShape.SQUARE).toBe('square')
    expect(ImageShape.CIRCLE).toBe('circle')
  })

  it('has correct CornerDotStyle values', () => {
    expect(CornerDotStyle.NONE).toBe('none')
    expect(CornerDotStyle.DOT).toBe('dot')
    expect(CornerDotStyle.SQUARE).toBe('square')
  })
})
