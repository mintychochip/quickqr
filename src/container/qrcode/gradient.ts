import type {Color} from "@/container/color.ts";
import {Colors} from "@/container/color.ts";

const GradientType = {
  LINEAR: "linear",
  RADIAL: "radial",
} as const;

export type GradientType = typeof GradientType[keyof typeof GradientType];

export class Gradient {
  type: GradientType = GradientType.LINEAR;
  rotation: number = 0;
  colorStops: Color[] = [Colors.BLACK];

  private constructor() {

  }

  static builder(): GradientBuilder {
    return new GradientBuilder();
  }

  static create(): Gradient {
    return new Gradient();
  }
}

export class GradientBuilder {
  private readonly options: Gradient = Gradient.create();

  type(type: GradientType): this {
    this.options.type = type;
    return this;
  }

  rotation(rotation: number): this {
    this.options.rotation = rotation;
    return this;
  }

  colorStops(...colors: Color[]): this {
    this.options.colorStops = colors;
    return this;
  }

  build(): Gradient {
    return {...this.options};
  }
}

