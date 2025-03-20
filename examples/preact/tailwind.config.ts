import type { Config } from 'tailwindcss'

/**
 * @see https://tailwindcss.com/docs/customizing-spacing#default-spacing-scale
 */
function genSpacing(max: number, step: number) {
  const remRatio = 0.25 // 1 = 0.25rem = 4px
  const spacing: Record<string, string> = {}
  let n = 1
  while (n <= max) {
    spacing[n.toString()] = `${n * remRatio}rem`
    n += step
  }
  return spacing
}

/** @type {import('tailwindcss').Config} */
const config: Config = {
  content: ['./src/**/*.{tsx,svelte}'],
  theme: {
    extend: {
      spacing: genSpacing(100, 0.25),
    },
  },
}

export default config
