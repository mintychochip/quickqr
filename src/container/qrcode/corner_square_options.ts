import type { Color } from "@/container/color.ts";
import { Colors } from "@/container/color.ts";
import type { Gradient } from "@/container/qrcode/gradient.ts";
import { DotStyleType } from "@/container/qrcode/dot_style_type.ts";

export class CornerOptions {
  color: Color | null = Colors.BLACK;
  gradient: Gradient | null = null;
  type: DotStyleType = DotStyleType.SQUARE;

  private constructor() {

  }

  static builder(): CornerOptionsBuilder {
    return new CornerOptionsBuilder();
  }

  static create(): CornerOptions {
    return new CornerOptions();
  }
}

class CornerOptionsBuilder {
  private readonly options: CornerOptions;

  constructor() {
    this.options = CornerOptions.create();
  }

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
    return {...this.options};
  }
}

