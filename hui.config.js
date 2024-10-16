module.exports = {
  // 应用 id
  id: "1d574a70-540e-11ef-8712-4f7d9b7e76c0",
  // 应用类型
  type: "app",
  // 打开之后将使用内置的路由引擎，自动处理路由关系，否则需要手动设置路由
  autoRouting: true,
  // 设置路由前缀，通常用于部署到非根目录
  base: "/",
  // 配置路由模式
  mode: "hash",
  // 插件
  plugins: [
    "@hsui/plugin-micro-app",
    "@hsui/plugin-lint",
    "@hsui/plugin-sass"
  ],
  // 代理
  proxy: {"/testapi": {
            target: "http://127.0.0.1:2022/",
            changeOrigin: true,
            pathRewrite: {
                "^/testapi": "/api"
            }
        },
        "/api": {
            target: "http://127.0.0.1:9090",
            changeOrigin: true,
            pathRewrite: {
              "^/api": ""
          }
        },
      },
  // 设置静态资源文件打包时的相对路径
  publicPath: "/",
  // 部署配置
  see: {
    // 系统类型
    systemType: "HUI",
  },
  // 使用 Vuex 进行状态管理
  vuex: false
};
