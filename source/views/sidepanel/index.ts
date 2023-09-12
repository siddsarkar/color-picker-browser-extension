import './style.css'

// retrieve colors from local storage
const storedColors: string[] =
  JSON.parse(localStorage.getItem('colors') ?? '[]') || []

const colorsContainerElement = document.querySelector('#colors')!
const clearColorsButton = document.querySelector('#clear-colors')!

window.onload = async () => {
  // @ts-expect-error - The type definition is missing the EyeDropper class.
  if (!window.EyeDropper) {
    console.error('EyeDropper not found')
    return
  }

  // @ts-expect-error - The type definition is missing the EyeDropper class.
  const eyeDropper = new EyeDropper()

  const colorPickerButton = document.querySelector('#button')!
  const colorPickerButtonIcon = colorPickerButton.querySelector('i')!

  colorPickerButton.addEventListener('click', async () => {
    try {
      colorPickerButtonIcon.classList.remove('fa-eye-dropper')
      colorPickerButtonIcon.classList.add('fa-spinner', 'fa-spin')

      const pickedColor = await eyeDropper.open()
      const pickedColorCode = pickedColor.sRGBHex

      colorPickerButtonIcon.classList.remove('fa-spinner', 'fa-spin')
      colorPickerButtonIcon.classList.add('fa-eye-dropper')

      const element = createColorElement(pickedColorCode)
      colorsContainerElement.prepend(element)

      // save to local storage
      localStorage.setItem(
        'colors',
        JSON.stringify([...storedColors, pickedColorCode])
      )
    } catch (err) {
      console.error('EyeDropper failed to open', err)
    }
  })
}

storedColors.forEach(color => {
  const element = createColorElement(color)
  colorsContainerElement.prepend(element)
})

clearColorsButton.addEventListener('click', () => {
  localStorage.setItem('colors', JSON.stringify([]))
  colorsContainerElement.innerHTML = ''
})

function colorIsDark(colorCode: string) {
  if (colorCode === '') return false

  colorCode = colorCode.replace('#', '')
  const t = parseInt(colorCode.substring(0, 2), 16),
    n = parseInt(colorCode.substring(2, 4), 16),
    s = parseInt(colorCode.substring(4, 6), 16),
    o = (t * 299 + n * 587 + s * 114) / 1e3

  return o >= 128 ? false : true
}

function createColorElement(colorCode: string) {
  const colorElement = document.createElement('button')

  const colorElementIcon = document.createElement('i')
  const colorElementText = document.createElement('p')

  colorElement.style.backgroundColor = colorCode
  colorElement.classList.add(
    'justify-between',
    'aspect-square',
    'flex',
    'flex-col',
    'rounded-lg'
  )
  !colorIsDark(colorCode) &&
    colorElement.classList.add('border', 'border-grey-500')

  colorElement.addEventListener('click', () => {
    colorElementIcon.classList.remove('fa-copy')
    colorElementIcon.classList.add('fa-check')

    navigator.clipboard.writeText(colorCode)

    setTimeout(() => {
      colorElementIcon.classList.add('fa-copy')
      colorElementIcon.classList.remove('fa-check')
    }, 1000)
  })

  colorElementIcon.style.color = colorIsDark(colorCode) ? '#ffffff' : '#000000'
  colorElementIcon.classList.add(
    'self-end',
    'fa-solid',
    'fa-copy',
    'mt-3',
    'mr-3'
  )

  colorElementText.classList.add('self-center', 'mb-3')
  colorElementText.textContent = colorCode
  colorElementText.style.color = colorIsDark(colorCode) ? '#ffffff' : '#000000'

  colorElement.appendChild(colorElementIcon)
  colorElement.appendChild(colorElementText)

  return colorElement
}
