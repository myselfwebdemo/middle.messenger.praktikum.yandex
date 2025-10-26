import { defineConfig } from 'vite'
import handlebars from 'vite-plugin-handlebars';
import path from 'path'

export default defineConfig({
  plugins: [handlebars({
    partialDirectory: path.resolve(__dirname, 'src/components'),
  })],
  assetsInclude: ['**/*.hbs'],
  resolve: {
    alias: {
      'core': path.resolve(__dirname, 'src/core'),
      'components': path.resolve(__dirname, 'src/components'),
      'pages': path.resolve(__dirname, 'src/pages'),
      'utils': path.resolve(__dirname, 'src/utils'),
      'main': path.resolve(__dirname, 'src/main.ts')
    }
  }
});
