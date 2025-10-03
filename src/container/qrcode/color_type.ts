const ColorType = {
  SINGLE_COLOR: "single_color",
  GRADIENT: "gradient",
} as const;

export type ColorType = typeof ColorType[keyof typeof ColorType];
