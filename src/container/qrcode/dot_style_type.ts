export const DotStyleType = {
  SQUARE: "square",
  DOTS: "dots",
  ROUNDED: "rounded",
  EXTRA_ROUNDED: "extra_rounded",
  CLASSY: "classy",
  CLASSY_ROUNDED: "classy_rounded",
} as const;

export type DotStyleType = typeof DotStyleType[keyof typeof DotStyleType];
