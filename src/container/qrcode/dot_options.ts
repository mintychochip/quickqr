import type {Color} from "@/container/color.ts";
import {Colors} from "@/container/color.ts";
import type {Gradient} from "@/container/qrcode/gradient.ts";
import {DotStyleType} from "@/container/qrcode/dot_style_type.ts";

export class DotOptions {

  color: Color | null = Colors.BLACK;
  gradient: Gradient | null = null;
  type: DotStyleType = DotStyleType.SQUARE;
  roundSize: boolean = true;

  private constructor() {

  }

  static builder(): DotOptionsBuilder {
    return new DotOptionsBuilder();
  }

  static create(): DotOptions {
    return new DotOptions();
  }
}

class DotOptionsBuilder {
  private readonly options: DotOptions;

  constructor() {
    this.options = DotOptions.create();
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

  roundSize(round: boolean): this {
    this.options.roundSize = round;
    return this;
  }

  build(): DotOptions {
    return {...this.options};
  }
}


