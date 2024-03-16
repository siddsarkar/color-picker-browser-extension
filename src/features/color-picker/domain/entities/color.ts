import { colorIsDark, hexToHsl, hexToRgb } from '@/core/utils/color-utils'

export default class Color {
  constructor(public hex: string) {}

  get rgb(): string {
    return hexToRgb(this.hex)
  }

  get hsl(): string {
    return hexToHsl(this.hex)
  }

  get isDark(): boolean {
    return colorIsDark(this.hex)
  }
}
