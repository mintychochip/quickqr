import type {QRCodeProperty} from "@/container/qrcode/qrcode_property.ts";
import {
  BackgroundOptions,
  CornerOptions,
  DotOptions, ImageOptions,
  QROptions
} from "@/container/qrcode/options.ts";

export const ImageType = {
  CANVAS: 'canvas',
  SVG: 'svg'
} as const;

export const ImageShape = {
  SQUARE: 'square',
  CIRCLE: 'circle'
} as const;

export const CornerDotStyle = {
  NONE: "none",
  DOT: "dot",
  SQUARE: "square",
} as const;

// Types exactly matching const names
export type CornerDotStyle = typeof CornerDotStyle[keyof typeof CornerDotStyle];
export type ImageType = typeof ImageType[keyof typeof ImageType];
export type ImageShape = typeof ImageShape[keyof typeof ImageShape];

export class QRCodeProperty<T> {
  readonly propertyName: string;

  private constructor(propertyName: string) {
    this.propertyName = propertyName;
  }
}

class QuickQRCodePropertyRegistry {
  private constructor() {
    throw new Error("do not instantiate this class");
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
    this.register("width");
    this.register("height");
    this.register("type");
    this.register("shape");
    this.register("data");
    this.register("image");
    this.register("margin");
    this.register("qrOptions");
    this.register("imageOptions");
    this.register("dotsOptions");
    this.register("backgroundOptions");
    this.register("cornersSquareOptions");
    this.register("cornersDotOptions");
    this.register("nodeCanvas");
    this.register("jsDom");
  }
}

export const QuickQRCodeProperties = {
  WIDTH: QuickQRCodePropertyRegistry.property<number>("width"),
  HEIGHT: QuickQRCodePropertyRegistry.property<number>("height"),
  IMAGE_TYPE: QuickQRCodePropertyRegistry.property<ImageType>("type"),
  SHAPE: QuickQRCodePropertyRegistry.property<ImageShape>("shape"),
  DATA: QuickQRCodePropertyRegistry.property<string>("data"),
  IMAGE: QuickQRCodePropertyRegistry.property<string>("image"),
  MARGIN: QuickQRCodePropertyRegistry.property<number>("margin"),
  QR_OPTIONS: QuickQRCodePropertyRegistry.property<QROptions>("qrOptions"),
  IMAGE_OPTIONS: QuickQRCodePropertyRegistry.property<ImageOptions>("imageOptions"),
  DOT_OPTIONS: QuickQRCodePropertyRegistry.property<DotOptions>("dotsOptions"),
  BACKGROUND_OPTIONS: QuickQRCodePropertyRegistry.property<BackgroundOptions>("backgroundOptions"),
  CORNER_SQUARE_OPTIONS: QuickQRCodePropertyRegistry.property<CornerOptions>("cornersSquareOptions"),
  CORNER_DOT_OPTIONS: QuickQRCodePropertyRegistry.property<CornerOptions>("cornersDotOptions"),
} as const;

export class QuickQRCodeStyling {

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


