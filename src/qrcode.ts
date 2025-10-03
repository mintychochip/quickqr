import type {QRCode} from 'qr-code-styling';
import type {Color} from './container/color.ts'

const CornerStyle = {
  NONE: "none",
  SQUARE: "square",
  DOT: "dot",
  EXTRA_ROUNDED: "extra_rounded",
} as const;

const QRMode = {
  BYTE: "byte",
  ALPHA_NUMERIC: "alpha_numeric",
  NUMERIC: "numeric",
  KANJI: "kanji",
} as const;

const QRErrorCorrectionLevel = {
  L: "L",
  Q: "Q",
  M: "M",
  H: "H",
} as const;

const DotStyleType = {
  SQUARE: "square",
  DOTS: "dots",
  ROUNDED: "rounded",
  EXTRA_ROUNDED: "extra_rounded",
  CLASSY: "classy",
  CLASSY_ROUNDED: "classy_rounded",
} as const;

const CornerDotStyle = {
  NONE: "none",
  DOT: "dot",
  SQUARE: "square",
} as const;

const ColorType = {
  SINGLE_COLOR: "SINGLE_COLOR",
  GRADIENT: "GRADIENT",
} as const;

const GradientType = {
  LINEAR: "LINEAR",
  RADIAL: "RADIAL",
} as const;

// Types exactly matching const names
export type CornerStyle = typeof CornerStyle[keyof typeof CornerStyle];
export type QRMode = typeof QRMode[keyof typeof QRMode];
export type QRErrorCorrectionLevel = typeof QRErrorCorrectionLevel[keyof typeof QRErrorCorrectionLevel];
export type DotStyleType = typeof DotStyleType[keyof typeof DotStyleType];
export type CornerDotStyle = typeof CornerDotStyle[keyof typeof CornerDotStyle];
export type ColorType = typeof ColorType[keyof typeof ColorType];
export type GradientType = typeof GradientType[keyof typeof GradientType];

// Exports
export {
  CornerStyle,
  QRMode,
  QRErrorCorrectionLevel,
  DotStyleType,
  CornerDotStyle,
  ColorType,
  GradientType,
};

export class QRCodeProperty<T> {
  readonly propertyName: string

  private constructor(propertyName: string) {
    this.propertyName = propertyName;
  }
}

export interface QRCodePropertyFactory<T> {
  create(value: T): QRCodeProperty<T>;
}

export class QRCodePropertyStyling {

  private readonly styling: Map<string, unknown> = new Map();

  getValue<T>(property: QRCodeProperty<T>): T | null {
    if (this.styling.has(property.propertyName)) {
      return this.styling.get(property.propertyName) as T;
    }
    return null;
  }

  getValueOrDefault<T>(property: QRCodeProperty<T>, defaultValue: T): T {
    if (this.styling.has(property.propertyName)) {
      return this.styling.get(property.propertyName) as T;
    }
    return defaultValue;
  }

  setValue<T>(property: QRCodeProperty<T>, value: T): void {
    this.styling.set(property.propertyName, value);
  }
}

class QRCodePropertyRegistry {

  private constructor() {

  }

  private static registry: Map<string, QRCodeProperty<object>> = new Map();

  static register(propertyName: string): void {
    this.registry.set(propertyName, {propertyName: propertyName});
  }

  static property<T>(propertyName: string): QRCodeProperty<T> {
    const property = this.registry.get(propertyName);
    if (!property) {
      throw new Error(`Property ${propertyName} does not exist`);
    }
    return property as QRCodeProperty<T>;
  }

  static {
    this.register("dot-style-type");
    this.register("dot-color-type");
    this.register("dot-gradient-type");
    this.register("dot-color");
    this.register("dot-rotation");
    this.register("corner-square-style");
    this.register("corner-color-type");
    this.register("corner-gradient-type");
    this.register("corner-color");
    this.register("corner-dot-style");
    this.register("corner-dot-color-type");
    this.register("corner-dot-gradient-type");
    this.register("corner-dot-color");
    this.register("background-color-type");
    this.register("background-color");
    this.register("hide-background-dots");
    this.register("image-size");
    this.register("image-margin");
    this.register("type-number");
    this.register("qr-mode");
    this.register("qr-error-correction-level");
  }
}

export const DOT_STYLE_TYPE = QRCodePropertyRegistry.property<DotStyleType>("dot-style-type");
export const DOT_COLOR_TYPE = QRCodePropertyRegistry.property<ColorType>("dot-color-type");
export const DOT_GRADIENT_TYPE = QRCodePropertyRegistry.property<GradientType>("dot-gradient-type");
export const DOT_COLOR = QRCodePropertyRegistry.property<Color[]>("dot-color");
export const DOT_ROTATION = QRCodePropertyRegistry.property<number>("dot-rotation");

export const CORNER_SQUARE_STYLE = QRCodePropertyRegistry.property<CornerStyle>("corner-square-style");
export const CORNER_COLOR_TYPE = QRCodePropertyRegistry.property<ColorType>("corner-color-type");
export const CORNER_GRADIENT_TYPE = QRCodePropertyRegistry.property<GradientType>("corner-gradient-type");
export const CORNER_COLOR = QRCodePropertyRegistry.property<Color[]>("corner-color");

export const CORNER_DOT_STYLE = QRCodePropertyRegistry.property<CornerDotStyle>("corner-dot-style");
export const CORNER_DOT_COLOR_TYPE = QRCodePropertyRegistry.property<ColorType>("corner-dot-color-type");
export const CORNER_DOT_GRADIENT_TYPE = QRCodePropertyRegistry.property<GradientType>("corner-dot-gradient-type");
export const CORNER_DOT_COLOR = QRCodePropertyRegistry.property<Color[]>("corner-dot-color");

export const BACKGROUND_COLOR_TYPE = QRCodePropertyRegistry.property<ColorType>("background-color-type");
export const BACKGROUND_COLOR = QRCodePropertyRegistry.property<Color[]>("background-color");
export const HIDE_BACKGROUND_DOTS = QRCodePropertyRegistry.property<boolean>("hide-background-dots");

export const IMAGE_SIZE = QRCodePropertyRegistry.property<number>("image-size");
export const IMAGE_MARGIN = QRCodePropertyRegistry.property<number>("image-margin");

export const TYPE_NUMBER = QRCodePropertyRegistry.property<number>("type-number");
export const QR_MODE = QRCodePropertyRegistry.property<QRMode>("qr-mode");
export const QR_ERROR_CORRECTION_LEVEL =
  QRCodePropertyRegistry.property<QRErrorCorrectionLevel>("qr-error-correction-level");
