import { ColorMode } from '@/core/enums/color-mode'
import type Color from '@/features/color-picker/domain/entities/color'
import EventEmitter from 'siddsarkar-tiny-event-emitter'

// Declare Model Events
enum _MODEL_EVENTS {
  colorsChange = 'colorsChange',
  colorModeChange = 'colorModeChange',
  pickerStatusChange = 'pickerStatusChange'
}

// Declare Event Type
type PickerModelEvents = keyof typeof _MODEL_EVENTS

// Model Class
export default class PickerModel extends EventEmitter<PickerModelEvents> {
  private _colors: Color[]
  private _colorMode: ColorMode

  constructor(colors: Color[] = [], colorMode: ColorMode = ColorMode.hex) {
    super(Object.values(_MODEL_EVENTS) as PickerModelEvents[])

    this._colors = colors
    this._colorMode = colorMode
  }

  get colors(): Color[] {
    return this._colors
  }

  set colors(colors: Color[]) {
    this._colors = colors
    this.event('colorsChange')
  }

  get colorMode(): ColorMode {
    return this._colorMode
  }

  set colorMode(mode: ColorMode) {
    this._colorMode = mode
    this.event('colorModeChange')
  }

  addColor(color: Color): void {
    this._colors.push(color)
    this.event('colorsChange')
  }

  setPickerStatus(isLoading: boolean): void {
    this.event('pickerStatusChange', isLoading)
  }
}
