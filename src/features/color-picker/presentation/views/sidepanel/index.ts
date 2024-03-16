import ChromeDataMapper from '@/features/color-picker/data/datasources/local/chrome/chrome-data-mapper'
import ChromeStorage from '@/features/color-picker/data/datasources/local/chrome/chrome-storage'
import ColorRepositoryImpl from '@/features/color-picker/data/repositories/color-repository-impl'
import ClearAllColorsUseCase from '@/features/color-picker/domain/usecases/clear-all-colors-usecase'
import GetAllColorsUseCase from '@/features/color-picker/domain/usecases/get-all-colors-usecase'
import GetColorModeUseCase from '@/features/color-picker/domain/usecases/get-color-mode-usecase'
import SaveColorUseCase from '@/features/color-picker/domain/usecases/save-color-usecase'
import SetColorModeUseCase from '@/features/color-picker/domain/usecases/set-color-mode-usecase'
import PickerController from '@/features/color-picker/presentation/controllers/picker-controller'
import PickerModel from '@/features/color-picker/presentation/models/picker-model'
import PickerView from '@/features/color-picker/presentation/views/sidepanel/picker-view'
import './style.css'

// mappers
const localDataMapper = new ChromeDataMapper()

// data sources
const localChromeStorage = new ChromeStorage(chrome.storage.local)

// repositories
const repository = new ColorRepositoryImpl(localChromeStorage, localDataMapper)

// use cases
const getAllColorsUseCase = new GetAllColorsUseCase(repository)
const clearAllColorsUseCase = new ClearAllColorsUseCase(repository)
const saveColorUseCase = new SaveColorUseCase(repository)
const getColorModeUseCase = new GetColorModeUseCase(repository)
const setColorModeUseCase = new SetColorModeUseCase(repository)

const model = new PickerModel()
const view = new PickerView(
  model,
  document.getElementById('colors') as HTMLDivElement,
  document.getElementById('picker-btn') as HTMLButtonElement,
  document.getElementById('picker-btn-icon') as HTMLBaseElement,
  document.getElementById('clear-colors-btn') as HTMLButtonElement,
  document.getElementById('open-options') as HTMLButtonElement,
  document.getElementById('options') as HTMLDivElement,
  document.getElementById('color-mode') as HTMLSelectElement
)
const controller = new PickerController(
  model,
  view,
  getAllColorsUseCase,
  clearAllColorsUseCase,
  saveColorUseCase,
  getColorModeUseCase,
  setColorModeUseCase
)

controller.init().catch(console.error)

// export to global
;(window as any).model = model
;(window as any).view = view
;(window as any).controller = controller
