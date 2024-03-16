import { ColorMode } from '@/core/enums/color-mode'
import type ChromeDataMapper from '@/features/color-picker/data/datasources/local/chrome/chrome-data-mapper'
import type ChromeStorage from '@/features/color-picker/data/datasources/local/chrome/chrome-storage'
import type Color from '@/features/color-picker/domain/entities/color'
import type ColorRepository from '@/features/color-picker/domain/repositories/color-repository'

export default class ColorRepositoryImpl implements ColorRepository {
  constructor(
    private readonly storage: ChromeStorage,
    private readonly mapper: ChromeDataMapper
  ) {}

  async getColorMode(): Promise<ColorMode> {
    const mode = await this.storage.getColorMode()

    if (mode === '') {
      this.setColorMode(ColorMode.hex).catch(console.error)
      return ColorMode.hex
    }

    return this.mapper.toColorMode(mode)
  }

  async setColorMode(mode: ColorMode): Promise<void> {
    await this.storage.setColorMode(mode)
  }

  async getAllColors(): Promise<Color[]> {
    const colors = await this.storage.getStoredColors()
    return this.mapper.toColors(colors)
  }

  async removeAllColors(): Promise<void> {
    await this.storage.clearColors()
  }

  async addColor(color: Color): Promise<void> {
    await this.storage.saveColor(color.hex)
  }

  async removeColor(color: Color): Promise<void> {
    await this.storage.removeColor(color.hex)
  }
}
