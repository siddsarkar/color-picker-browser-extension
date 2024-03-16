import { type ColorMode } from '@/core/enums/color-mode'
import Color from '@/features/color-picker/domain/entities/color'
import type ClearAllColorsUseCase from '@/features/color-picker/domain/usecases/clear-all-colors-usecase'
import type GetAllColorsUseCase from '@/features/color-picker/domain/usecases/get-all-colors-usecase'
import type GetColorModeUseCase from '@/features/color-picker/domain/usecases/get-color-mode-usecase'
import type SaveColorUseCase from '@/features/color-picker/domain/usecases/save-color-usecase'
import type SetColorModeUseCase from '@/features/color-picker/domain/usecases/set-color-mode-usecase'
import type PickerModel from '@/features/color-picker/presentation/models/picker-model'
import type PickerView from '@/features/color-picker/presentation/views/sidepanel/picker-view'

export default class PickerController {
  constructor(
    private readonly model: PickerModel,
    private readonly view: PickerView,
    private readonly getAllColorsUseCase: GetAllColorsUseCase,
    private readonly clearAllColorsUseCase: ClearAllColorsUseCase,
    private readonly saveColorUseCase: SaveColorUseCase,
    private readonly getColorModeUseCase: GetColorModeUseCase,
    private readonly setColorModeUseCase: SetColorModeUseCase
  ) {
    // LISTEN TO VIEW EVENTS
    this.view.on('onColorPickerClick', () => {
      this.pickColor().catch(console.error)
    })

    this.view.on('onClearColorsClick', () => {
      this.clearColors().catch(console.error)
    })

    this.view.on('onUpdateColorMode', (mode: ColorMode) => {
      this.updateColorMode(mode).catch(console.error)
    })
  }

  async init(): Promise<void> {
    const colors = await this.getAllColorsUseCase.execute()
    const colorMode = await this.getColorModeUseCase.execute()

    this.model.colorMode = colorMode
    this.model.colors = colors
  }

  async clearColors(): Promise<void> {
    this.model.colors = []
    await this.clearAllColorsUseCase.execute()
  }

  async pickColor(): Promise<void> {
    this.model.setPickerStatus(true)
    try {
      // @ts-expect-error - EyeDropper is not yet available in the types
      // eslint-disable-next-line no-undef
      const picker = new EyeDropper()

      const pickedColor = await picker.open()
      const pickedColorCode = pickedColor.sRGBHex as string

      // add to model
      this.model.addColor(new Color(pickedColorCode))

      // save to storage
      await this.saveColorUseCase.execute(new Color(pickedColorCode))
    } catch (error) {
      console.error('EyeDropper failed to open', error)
    } finally {
      this.model.setPickerStatus(false)
    }
  }

  async updateColorMode(mode: ColorMode): Promise<void> {
    this.model.colorMode = mode

    // save to storage
    await this.setColorModeUseCase.execute(mode)
  }
}
