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

export class QROptions {
  typeNumber: number = 0;
  mode: QRMode = QRMode.BYTE;
  errorCorrectionLevel: QRErrorCorrectionLevel = QRErrorCorrectionLevel.Q;

  private constructor() {

  }

  static builder(): QROptionsBuilder {
    return new QROptionsBuilder();
  }

  static create(): QROptions {
    return new QROptions();
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
    return {...this.options};
  }
}
