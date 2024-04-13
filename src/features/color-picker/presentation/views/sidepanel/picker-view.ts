import { ColorMode } from '@/core/enums/color-mode'
import type Color from '@/features/color-picker/domain/entities/color'
import type ColorModel from '@/features/color-picker/presentation/models/picker-model'
import EventEmitter from 'siddsarkar-tiny-event-emitter'

// Declare View Events
const _VIEW_EVENTS = {
  onColorPickerClick: 'onColorPickerClick',
  onClearColorsClick: 'onClearColorsClick',
  onUpdateColorMode: 'onUpdateColorMode'
} as const

// Declare Event Type
type PickerViewEvents = keyof typeof _VIEW_EVENTS

// View Class
export default class PickerView extends EventEmitter<PickerViewEvents> {
  constructor(
    private readonly model: ColorModel,
    private readonly colorsContainerEl: HTMLElement,
    private readonly pickerBtnEl: HTMLButtonElement,
    private readonly pickerBtnIconEl: HTMLElement,
    private readonly clearColorsBtnEl: HTMLButtonElement,
    private readonly openOptionsEl: HTMLButtonElement,
    private readonly optionsEl: HTMLDivElement,
    private readonly colorModeSelectEl: HTMLSelectElement
  ) {
    super(Object.values(_VIEW_EVENTS))

    this.addListeners()
  }

  addListeners(): void {
    this.pickerBtnEl.addEventListener(
      'click',
      this.event.bind(this, 'onColorPickerClick')
    )

    this.clearColorsBtnEl.addEventListener(
      'click',
      this.event.bind(this, 'onClearColorsClick')
    )

    this.openOptionsEl.addEventListener(
      'click',
      this.handleOpenOptionsClick.bind(this)
    )

    this.colorModeSelectEl.addEventListener(
      'change',
      this.handleColorModeChange.bind(this)
    )

    // LISTEN TO MODEL EVENTS
    this.model.on('colorsChange', this.renderColors.bind(this))
    this.model.on('colorModeChange', this.updateColorModeSelect.bind(this))
    this.model.on('pickerStatusChange', this.togglePickerBtnLoading.bind(this))
  }

  renderColors(): void {
    this.clearEl(this.colorsContainerEl)

    const { colors } = this.model

    if (colors.length < 1) {
      this.colorsContainerEl.prepend(this.getEmptyColorEl())
    } else {
      colors.forEach(this.prependColor.bind(this))
    }
  }

  updateColorModeSelect(): void {
    this.colorModeSelectEl.value = this.model.colorMode

    this.renderColors()
  }

  togglePickerBtnLoading(isLoading: boolean): void {
    if (isLoading) {
      this.pickerBtnIconEl.classList.remove('fa-eye-dropper')
      this.pickerBtnIconEl.classList.add('fa-spinner', 'fa-spin')
    } else {
      this.pickerBtnIconEl.classList.remove('fa-spinner', 'fa-spin')
      this.pickerBtnIconEl.classList.add('fa-eye-dropper')
    }
  }

  private handleOpenOptionsClick(): void {
    this.optionsEl.classList.toggle('hidden')
    this.openOptionsEl.classList.toggle('selected')
  }

  private handleColorModeChange(): void {
    const colorMode = this.colorModeSelectEl.value as ColorMode
    this.event('onUpdateColorMode', colorMode)
  }

  private prependColor(color: Color): void {
    const colorElement = this.getColorEl(color)
    this.colorsContainerEl.prepend(colorElement)
  }

  private getColorString(color: Color, mode: ColorMode): string {
    switch (mode) {
      case ColorMode.hex:
        return color.hex
      case ColorMode.rgb:
        return color.rgb
      case ColorMode.hsl:
        return color.hsl
      case ColorMode.flutter:
        return color.flutterColor
    }
  }

  private getColorEl(color: Color): HTMLElement {
    const colorMode = this.model.colorMode
    const colorCode = this.getColorString(color, colorMode)

    const colorElement = document.createElement('button')
    colorElement.style.backgroundColor = color.hex
    colorElement.classList.add(
      'flex',
      'flex-col',
      'justify-between',
      'aspect-square',
      'rounded-lg',
      'border',
      'border-slate-900/10',
      'dark:border-slate-50/[0.06]'
    )

    const colorElementIcon = document.createElement('i')
    colorElementIcon.style.color = color.isDark ? '#ffffff' : '#000000'
    colorElementIcon.classList.add(
      'self-end',
      'fa-solid',
      'fa-copy',
      'mt-3',
      'mr-3'
    )

    const colorElementText = document.createElement('p')
    colorElementText.classList.add('flex', 'px-3', 'py-1.5', 'rounded-es-md')
    colorElementText.style.backgroundColor = color.isDark
      ? 'rgba(0,0,0,0.2)'
      : 'rgba(255,255,255,0.2)'
    colorElementText.textContent = colorCode
    colorElementText.style.color = color.isDark ? '#ffffff' : '#000000'

    colorElement.appendChild(colorElementIcon)
    colorElement.appendChild(colorElementText)
    colorElement.addEventListener(
      'click',
      this.handleColorElementClick.bind(this, colorCode, colorElementIcon)
    )

    return colorElement
  }

  private handleColorElementClick(
    colorStr: string,
    colorElementIcon: HTMLElement
  ): void {
    colorElementIcon.classList.remove('fa-copy')
    colorElementIcon.classList.add('fa-check')

    navigator.clipboard.writeText(colorStr).catch(function (err) {
      console.error('Could not copy text: ', err)
    })

    setTimeout(() => {
      colorElementIcon.classList.add('fa-copy')
      colorElementIcon.classList.remove('fa-check')
    }, 1000)
  }

  private getEmptyColorEl(): HTMLElement {
    const noColorsEl = document.createElement('i')

    noColorsEl.textContent = 'No colors picked yet.'
    noColorsEl.classList.add(
      'text-center',
      'text-slate-400',
      'flex',
      'items-center'
    )

    return noColorsEl
  }

  private clearEl(el: HTMLElement): void {
    while (el.firstChild !== null) {
      el.removeChild(el.firstChild)
    }
  }
}
