import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: "src/index.ts",
    react: "src/react/index.ts",
  },
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
})