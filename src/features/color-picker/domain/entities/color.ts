import { colorIsDark, hexToHsl, hexToRgb } from '@/core/utils/color-utils'

export default class Color {
  public hex: string

  constructor(hex: string) {
    this.hex = hex
  }

  get rgb(): string {
    return hexToRgb(this.hex)
  }

  get hsl(): string {
    return hexToHsl(this.hex)
  }

  get flutterColor(): string {
    const hexUpperCase = this.hex.toUpperCase()
    return 'Color(0xFF' + hexUpperCase.substring(1) + ')'
  }

  get isDark(): boolean {
    return colorIsDark(this.hex)
  }
}
