import type {QRCodeProperty} from "@/container/qrcode/qrcode_property.ts";
import {QuickQRCodeProperties} from "@/container/qrcode/qrcode_property.ts";
import {DotOptions} from "@/container/qrcode/dot_options.ts";
import {BackgroundOptions} from "@/container/qrcode/background_options.ts";
import {CornerOptions} from "@/container/qrcode/corner_square_options.ts";

export const ImageType = {
  CANVAS: 'canvas',
  SVG: 'svg'
} as const;

export const ImageShape = {
  SQUARE: 'square',
  CIRCLE: 'circle'
} as const;

export type ImageType = typeof ImageType[keyof typeof ImageType];

export type ImageShape = typeof ImageShape[keyof typeof ImageShape];

export class QuickQRCodeStyling {

  private readonly styling: Map<string, unknown> = new Map();

  private constructor() {
    this.setValue(QuickQRCodeProperties.)
    this.setValue(QuickQRCodeProperties.DOT_OPTIONS,DotOptions.create())
    this.setValue(QuickQRCodeProperties.BACKGROUND_OPTIONS,BackgroundOptions.create())
    this.setValue(QuickQRCodeProperties.CORNER_SQUARE_OPTIONS, CornerOptions.create())
    this.setValue(QuickQRCodeProperties.CORNER_DOT_OPTIONS,CornerOptions.create())
    this.setValue(QuickQRCodeProperties)
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

  static builder(): QuickQRCodeStylingBuilder {
    return new QuickQRCodeStylingBuilder();
  }
}

class QuickQRCodeStylingBuilder {
  private readonly styling = new QuickQRCodeStyling();

  setValue<T>(property: QRCodeProperty<T>, value: T): QuickQRCodeStylingBuilder {
    this.styling.setValue(property,value);
    return this;
  }

  build(): QuickQRCodeStyling {
    return this.styling;
  }
}


