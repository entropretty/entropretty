export const black = "#000000"
export const white = "#fff"
export const light = "#aaa"
export const dark = "#666"

export const COLORS = {
  black,
  white,
  light,
  dark,
} as const

export type Colors = typeof COLORS
