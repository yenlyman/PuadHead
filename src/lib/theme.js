const STORAGE_KEY = 'puadhead-theme-mode'

export function getStoredThemeMode() {
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored === 'light' || stored === 'dark' ? stored : 'system'
}

// mode 'system' removes the override so prefers-color-scheme takes over again.
export function applyThemeMode(mode) {
  const root = document.documentElement
  if (mode === 'system') {
    root.removeAttribute('data-theme')
  } else {
    root.setAttribute('data-theme', mode)
  }
}

export function setStoredThemeMode(mode) {
  localStorage.setItem(STORAGE_KEY, mode)
}

// Called once at boot (before React renders) to avoid a flash of the wrong theme.
export function initTheme() {
  applyThemeMode(getStoredThemeMode())
}
