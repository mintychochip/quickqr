import type { QRCode } from 'qr-code-styling';
import type {Color} from './color'

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

const LQMH = {
  L: "L",
  Q: "Q",
  M: "M",
  H: "H",
} as const;

const DotStyle = {
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
export type LQMH = typeof LQMH[keyof typeof LQMH];
export type DotStyle = typeof DotStyle[keyof typeof DotStyle];
export type CornerDotStyle = typeof CornerDotStyle[keyof typeof CornerDotStyle];
export type ColorType = typeof ColorType[keyof typeof ColorType];
export type GradientType = typeof GradientType[keyof typeof GradientType];

// Exports
export {
  CornerStyle,
  QRMode,
  LQMH,
  DotStyle,
  CornerDotStyle,
  ColorType,
  GradientType,
};

export interface QRCodeProperty<T> {
    readonly propertyName: string
}

export interface QRCodePropertyFactory<T> {
    create(value: T): QRCodeProperty<T>;
}

class QRCodePropertyStyling {
  styling: Map<string, unknown>;

  constructor() {
    this.styling = new Map();
  }

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
    static registry: Map<string, QRCodeProperty<Object>> = new Map();

    static {
        this.register("dots_style",)
        this.register("")
    }

    static register<T>(propertyName: string): void {
        this.registry.set(propertyName, {
            propertyName: propertyName
        });
    }

    static property<T>(propertyName: string): QRCodeProperty<T> {
        this.registry.get
    }
}

const DOT_STYLE_TYPE: QRCodeProperty<DotStyleType>
const DOT_COLOR_TYPE: QRCodeProperty<ColorType>
const DOT_GRADIANT_TYPE: QRCodeProperty<GradientType> 
const DOT_COLOR: QRCodeProperty<Color[]> = {

}
const DOT_ROTATION: QRCodeProperty<number>
const CORNER_SQUARE_STYLE: QRCodeProperty<CornerStyle>
const CORNER_COLOR_TYPE: QRCodeProperty<ColorType>
const CORNER_GRADIENT_TYPE: QRCodeProperty<GradientType>
const CORNER_COLOR: QRCodeProperty<Color[]>
const CORNER_DOT_STYLE: QRCodeProperty<CornerDotStyle>
const CORNER_DOT_COLOR_TYPE: QRCodeProperty<ColorType>
const CORNER_DOT_GRADIENT_TYPE: QRCodeProperty<GradientType>
const CORNER_DOT_COLOR: QRCodeProperty<Color[]>
const BACKGROUND_COLOR_TYPE: QRCodeProperty<ColorType>
const BACKGROUND_COLOR: QRCodeProperty<Color[]>
const HIDE_BACKGROUND_DOTS: QRCodeProperty<boolean>
const IMAGE_SIZE: QRCodeProperty<number>
const IMAGE_MARGIN: QRCodeProperty<number>
const TYPE_NUMBER: QRCodeProperty<number>
const QR_MODE: QRCodeProperty<QRModeType>
const QR_ERROR_CORRECTION_LEVEL: QRCodeProperty<QRErrorCorrectionLevel>

export interface QRCodePropertyInstance {
    property(): QRCodeProperty<Object>;
    value: Blob;
}