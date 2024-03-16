;(() => {
  'use strict'

  const lsKey = 'themeMode'

  const getStoredTheme = (): string | null => localStorage.getItem(lsKey)
  const setStoredTheme = (theme: string): void => {
    localStorage.setItem(lsKey, theme)
  }

  const getPreferredTheme = (): string => {
    const storedTheme = getStoredTheme()
    if (storedTheme !== null) return storedTheme

    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
  }

  const setTheme = (theme: string): void => {
    if (theme === 'auto') {
      document.documentElement.className = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches
        ? 'dark'
        : 'light'
    } else {
      document.documentElement.className = theme
    }
  }

  setTheme(getPreferredTheme())

  const showActiveTheme = (theme: string): void => {
    const btnToActive = document.querySelector(`[data-theme-value="${theme}"]`)

    document.querySelectorAll('[data-theme-value]').forEach(element => {
      element.classList.remove('active-theme')
    })

    btnToActive?.classList.add('active-theme')
  }

  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', () => {
      const storedTheme = getStoredTheme()
      if (storedTheme !== 'light' && storedTheme !== 'dark') {
        setTheme(getPreferredTheme())
      }
    })

  window.addEventListener('DOMContentLoaded', () => {
    showActiveTheme(getPreferredTheme())

    document.querySelectorAll('[data-theme-value]').forEach(toggle => {
      toggle.addEventListener('click', () => {
        const theme = toggle?.getAttribute('data-theme-value') ?? 'auto'

        setStoredTheme(theme)
        setTheme(theme)
        showActiveTheme(theme)
      })
    })
  })
})()
