import type { Color } from "@/container/color.ts";
import { Colors } from "@/container/color.ts";
import type { Gradient } from "@/container/qrcode/gradient.ts";

export class BackgroundOptions {
  color: Color = Colors.BLACK;
  gradient: Gradient | null = null;

  private constructor() {

  }

  static create(): BackgroundOptions {
    return new BackgroundOptions()
  }

  static builder(): BackGroundOptionsBuilder {
    return new BackGroundOptionsBuilder();
  }
}

class BackGroundOptionsBuilder {
  private options: BackgroundOptions = BackgroundOptions.create()

  color(color: Color): this {
    this.options.color = color;
    return this;
  }

  gradient(gradient: Gradient): this {
    this.options.gradient = gradient;
    return this;
  }

  build(): BackgroundOptions {
    return {...this.options};
  }
}
