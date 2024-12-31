import { defineConfig, presetUno, presetIcons } from 'unocss'

export default defineConfig({
  presets: [presetUno(), presetIcons()],
  content: [
    // 扫描包含类名的文件路径，对于Vue3项目通常是以下这些文件类型
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  shortcuts: {},
})
