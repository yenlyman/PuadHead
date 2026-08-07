import { create } from 'zustand'
import { getStoredThemeMode, applyThemeMode, setStoredThemeMode } from '../lib/theme'

export const useThemeStore = create((set) => ({
  mode: getStoredThemeMode(),

  setMode(mode) {
    setStoredThemeMode(mode)
    applyThemeMode(mode)
    set({ mode })
  },
}))
