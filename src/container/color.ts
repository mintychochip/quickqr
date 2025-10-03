export class Color {

  hex: string;

  private constructor(hex: string) {
    this.hex = hex;
  }

  static fromHex(hex: string): Color {
    return new Color(hex);
  }

  static fromRgb(r: number, g: number, b: number): Color {
    return new Color(String((r << 16) | (g << 8) | b));
  }

  toString(): string {
    return this.hex;
  }
}
