export default class ChromeStorage {
  constructor(private readonly storage: chrome.storage.StorageArea) {}

  private readonly colorStorageKey = 'colors'

  async getStoredColors(): Promise<string[]> {
    let colors: string[] = []
    try {
      const result = await this.storage.get({
        [this.colorStorageKey]: []
      })

      colors = result[this.colorStorageKey]
    } catch (error) {
      console.error('Error getting colors from storage', error)
    }

    return colors
  }

  async saveColor(color: string): Promise<void> {
    try {
      const colors = await this.getStoredColors()
      colors.push(color)

      await this.storage.set({ [this.colorStorageKey]: colors })
    } catch (error) {
      console.error('Error saving color to storage', error)
    }
  }

  async clearColors(): Promise<void> {
    try {
      await this.storage.remove(this.colorStorageKey)
    } catch (error) {
      console.error('Error clearing colors from storage', error)
    }
  }

  async removeColor(color: string): Promise<void> {
    try {
      const colors = await this.getStoredColors()
      const updatedColors = colors.filter(c => c !== color)

      await this.storage.set({ [this.colorStorageKey]: updatedColors })
    } catch (error) {
      console.error('Error removing color from storage', error)
    }
  }
}
