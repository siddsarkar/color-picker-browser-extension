export const colorIsDark = (colorCode: string): boolean => {
  if (colorCode === '') return false

  colorCode = colorCode.replace('#', '')

  const t = parseInt(colorCode.substring(0, 2), 16)
  const n = parseInt(colorCode.substring(2, 4), 16)
  const s = parseInt(colorCode.substring(4, 6), 16)
  const o = (t * 299 + n * 587 + s * 114) / 1e3

  return !(o >= 128)
}

export const hexToRgb = (hex: string): string => {
  if (hex === '') return ''

  const r = parseInt(hex.substring(1, 3), 16)
  const g = parseInt(hex.substring(3, 5), 16)
  const b = parseInt(hex.substring(5, 7), 16)

  return `rgb(${r}, ${g}, ${b})`
}

export const hexToHsl = (hex: string): string => {
  if (hex === '') return ''

  const r = parseInt(hex.substring(1, 3), 16) / 255
  const g = parseInt(hex.substring(3, 5), 16) / 255
  const b = parseInt(hex.substring(5, 7), 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)

  let h = (max + min) / 2
  let s = (max + min) / 2
  let l = (max + min) / 2

  if (max === min) h = s = 0
  else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }
    h /= 6
  }

  h = Math.round(h * 360)
  s = Math.round(s * 100)
  l = Math.round(l * 100)

  return `hsl(${h}, ${s}%, ${l}%)`
}
