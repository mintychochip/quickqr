export class Color {
  r: number;
  g: number;
  b: number;

  constructor(r: number, g: number, b: number) {
    this.r = r;
    this.g = g;
    this.b = b;
  }

  static rgb(r: number, g: number, b: number): Color {
    return new Color(r, g, b);
  }

  toHex(): string {
    // Convert RGB to hex string
    return (
      "#" +
      ((1 << 24) + (this.r << 16) + (this.g << 8) + this.b)
        .toString(16)
        .slice(1)
        .toUpperCase()
    );
  }

  toNumber(): number {
    // Pack RGB into a number (24 bits)
    return (this.r << 16) | (this.g << 8) | this.b;
  }
}
