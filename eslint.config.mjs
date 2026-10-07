import coreWebVitals from 'eslint-config-next/core-web-vitals'
import typescript from 'eslint-config-next/typescript'

// eslint-config-next 16 ya exporta flat config nativo: no hace falta FlatCompat.
const config = [
  {
    ignores: ['.next/**', 'dist/**', 'node_modules/**', 'next-env.d.ts'],
  },
  ...coreWebVitals,
  ...typescript,
  {
    rules: {
      '@typescript-eslint/consistent-type-imports': 'error',
    },
  },
]

export default config
