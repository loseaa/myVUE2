import copy from 'rollup-plugin-copy';
import babel from '@rollup/plugin-babel';
import serve from 'rollup-plugin-serve';
import chokidar from 'chokidar';

export default {
        //打包为umd

  // 核心配置
  input: 'src/index.js',          // 入口文件
  output: {                      // 输出配置
    file: 'dist/myVue.js',      // 输出文件
    format: 'umd',              // 修改为umd格式
    name: 'MyVue',              // UMD格式需要指定全局变量名
    sourcemap: true              // 生成sourcemap


  },
  
  // 插件配置
  plugins: [
    copy({
      targets: [
        { src: 'src/*.html', dest: 'dist' }
      ]
    }),
    babel({                      // 使用Babel转译代码
      babelHelpers: 'bundled',
      exclude: 'node_modules/**'
    }),
    serve({
      open: true,
      contentBase: 'dist',
      port: 8080,
      onListening: function (server) {
        const { ws } = server;
        chokidar.watch('src/**/*.html').on('change', () => {
          copy({
            targets: [{ src: 'src/*.html', dest: 'dist' }]
          }).writeBundle();
          ws.send({ type: 'reload' });
        });
      }
    }),
  ],
  
  // 监听模式配置
  watch: {
    include: ['src/**/*.js', 'src/*.html'],
    exclude: 'node_modules/**'
  }
};