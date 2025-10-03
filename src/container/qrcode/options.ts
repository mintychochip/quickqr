import type { Color } from "@/container/color.ts";
import { Colors } from "@/container/color.ts";
import type { Gradient } from "@/container/qrcode/gradient.ts";
import { DotStyleType } from "@/container/qrcode/dot_style_type.ts";

export const QRMode = {
  BYTE: "Byte",
  ALPHA_NUMERIC: "Alphanumeric",
  NUMERIC: "Numeric",
  KANJI: "Kanji",
} as const;

export const QRErrorCorrectionLevel = {
  L: "L",
  Q: "Q",
  M: "M",
  H: "H",
} as const;

export type QRMode = typeof QRMode[keyof typeof QRMode];
export type QRErrorCorrectionLevel =
  typeof QRErrorCorrectionLevel[keyof typeof QRErrorCorrectionLevel];

export const CrossOriginType = {
  ANONYMOUS: "anonymous",
  CREDENTIALS: "credentials",
} as const;

export type CrossOriginType = typeof CrossOriginType[keyof typeof CrossOriginType];

export class DotOptions {
  color: Color | null = Colors.BLACK;
  gradient: Gradient | null = null;
  type: DotStyleType = DotStyleType.SQUARE;
  roundSize: boolean = true;

  private constructor() {}

  static create(): DotOptions {
    return new DotOptions();
  }

  static builder(): DotOptionsBuilder {
    return new DotOptionsBuilder();
  }
}

class DotOptionsBuilder {
  private readonly options: DotOptions = DotOptions.create();

  color(color: Color | null): this {
    this.options.color = color;
    return this;
  }

  gradient(gradient: Gradient | null): this {
    this.options.gradient = gradient;
    return this;
  }

  type(type: DotStyleType): this {
    this.options.type = type;
    return this;
  }

  roundSize(round: boolean): this {
    this.options.roundSize = round;
    return this;
  }

  build(): DotOptions {
    return { ...this.options };
  }
}

export class QROptions {
  typeNumber = 0;
  mode: QRMode = QRMode.BYTE;
  errorCorrectionLevel: QRErrorCorrectionLevel = QRErrorCorrectionLevel.Q;

  private constructor() {}

  static create(): QROptions {
    return new QROptions();
  }

  static builder(): QROptionsBuilder {
    return new QROptionsBuilder();
  }
}

class QROptionsBuilder {
  private readonly options: QROptions = QROptions.create();

  typeNumber(typeNumber: number): this {
    this.options.typeNumber = typeNumber;
    return this;
  }

  mode(mode: QRMode): this {
    this.options.mode = mode;
    return this;
  }

  errorCorrectionLevel(level: QRErrorCorrectionLevel): this {
    this.options.errorCorrectionLevel = level;
    return this;
  }

  build(): QROptions {
    return { ...this.options };
  }
}

export class ImageOptions {
  hideBackgroundDots = true;
  imageSize = 0.4;
  margin = 0;
  crossOrigin: CrossOriginType | null = null;
  saveAsBlob = true;

  private constructor() {}

  static create(): ImageOptions {
    return new ImageOptions();
  }

  static builder(): ImageOptionsBuilder {
    return new ImageOptionsBuilder();
  }
}

class ImageOptionsBuilder {
  private readonly options: ImageOptions = ImageOptions.create();

  hideBackgroundDots(hide: boolean): this {
    this.options.hideBackgroundDots = hide;
    return this;
  }

  imageSize(size: number): this {
    this.options.imageSize = size;
    return this;
  }

  margin(margin: number): this {
    this.options.margin = margin;
    return this;
  }

  crossOrigin(crossOrigin: CrossOriginType | null): this {
    this.options.crossOrigin = crossOrigin;
    return this;
  }

  saveAsBlob(save: boolean): this {
    this.options.saveAsBlob = save;
    return this;
  }

  build(): ImageOptions {
    return { ...this.options };
  }
}

export class CornerOptions {
  color: Color | null = Colors.BLACK;
  gradient: Gradient | null = null;
  type: DotStyleType = DotStyleType.SQUARE;

  private constructor() {}

  static create(): CornerOptions {
    return new CornerOptions();
  }

  static builder(): CornerOptionsBuilder {
    return new CornerOptionsBuilder();
  }
}

class CornerOptionsBuilder {
  private readonly options: CornerOptions = CornerOptions.create();

  color(color: Color | null): this {
    this.options.color = color;
    return this;
  }

  gradient(gradient: Gradient | null): this {
    this.options.gradient = gradient;
    return this;
  }

  type(type: DotStyleType): this {
    this.options.type = type;
    return this;
  }

  build(): CornerOptions {
    return { ...this.options };
  }
}

export class BackgroundOptions {
  color: Color = Colors.BLACK;
  gradient: Gradient | null = null;

  private constructor() {}

  static create(): BackgroundOptions {
    return new BackgroundOptions();
  }

  static builder(): BackgroundOptionsBuilder {
    return new BackgroundOptionsBuilder();
  }
}

class BackgroundOptionsBuilder {
  private readonly options: BackgroundOptions = BackgroundOptions.create();

  color(color: Color): this {
    this.options.color = color;
    return this;
  }

  gradient(gradient: Gradient | null): this {
    this.options.gradient = gradient;
    return this;
  }

  build(): BackgroundOptions {
    return { ...this.options };
  }
}
