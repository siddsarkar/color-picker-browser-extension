import { type ColorMode } from '@/core/enums/color-mode'
import type Color from '@/features/color-picker/domain/entities/color'

export default abstract class ColorRepository {
  getAllColors(): Promise<Color[]>
  removeAllColors(): Promise<void>
  addColor(color: Color): Promise<void>
  removeColor(color: Color): Promise<void>
  getColorMode(): Promise<ColorMode>
  setColorMode(mode: ColorMode): Promise<void>
}
