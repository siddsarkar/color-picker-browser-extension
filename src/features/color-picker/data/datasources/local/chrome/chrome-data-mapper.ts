import { type ColorMode } from '@/core/enums/color-mode'
import Color from '@/features/color-picker/domain/entities/color'

export default class ChromeDataMapper {
  toColor(color: string): Color {
    return new Color(color)
  }

  toColors(colors: string[]): Color[] {
    return colors.map(c => this.toColor(c))
  }

  toColorMode(mode: string): ColorMode {
    return mode as ColorMode
  }
}
