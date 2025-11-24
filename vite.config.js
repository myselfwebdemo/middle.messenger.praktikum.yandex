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
      'services': path.resolve(__dirname, 'src/services'),
      'utils': path.resolve(__dirname, 'src/utils'),
      'main': path.resolve(__dirname, 'src/main.ts')
    }
  },
  server: {
    proxy: {
      '/online': {
        target: 'https://ya-praktikum.tech/api/v2',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/online/, ''),
        configure: (proxy) => {
          proxy.on('proxyRes', (proxyRes) => {
            const cookies = proxyRes.headers['set-cookie'];
            if (cookies) {
              proxyRes.headers['set-cookie'] = cookies.map(cookie =>
                cookie
                .replace(/Domain=ya-praktikum\.tech/i, 'Domain=localhost')
                .replace(/; Secure/, '')
                
                // For deployed website
                // .replace(/Domain=ya-praktikum\.tech/i, 'Domain=middle-messenger-yandex-praktikum.netlify.app')
                //                                         Domain=your-domain.name
              );
            }
          });
        },
      },
    },
  },
});
