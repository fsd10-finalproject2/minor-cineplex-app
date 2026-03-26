import { ref, watch } from 'vue'

const isDark = ref(false)

if (typeof window !== 'undefined') {
  const stored = localStorage.getItem('theme')
  const system = window.matchMedia('(prefers-color-scheme: dark)').matches

  isDark.value = stored ? stored === 'dark' : system
}

watch(
  isDark,
  (val) => {
    document.documentElement.classList.toggle('dark', val)
    localStorage.setItem('theme', val ? 'dark' : 'light')
  },
  { immediate: true },
)

export function useTheme() {
  const toggleTheme = () => {
    isDark.value = !isDark.value
  }

  return { isDark, toggleTheme }
}
