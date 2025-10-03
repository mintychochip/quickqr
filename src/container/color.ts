export class Color {

  hex: string;

  private constructor(hex: string) {
    this.hex = hex;
  }

  static hex(hex: string): Color {
    return new Color(hex);
  }

  static rgb(r: number, g: number, b: number): Color {
    return new Color(String((r << 16) | (g << 8) | b));
  }

  toString(): string {
    return this.hex;
  }
}

export const Colors = {
  BLACK: Color.hex("#000000"),
  WHITE: Color.hex("#FFFFFF"),
  RED: Color.hex("#FF0000"),
  LIME: Color.hex("#00FF00"),
  BLUE: Color.hex("#0000FF"),
  YELLOW: Color.hex("#FFFF00"),
  CYAN: Color.hex("#00FFFF"),
  MAGENTA: Color.hex("#FF00FF"),
  SILVER: Color.hex("#C0C0C0"),
  GRAY: Color.hex("#808080"),
  MAROON: Color.hex("#800000"),
  OLIVE: Color.hex("#808000"),
  GREEN: Color.hex("#008000"),
  PURPLE: Color.hex("#800080"),
  TEAL: Color.hex("#008080"),
  NAVY: Color.hex("#000080"),
};


