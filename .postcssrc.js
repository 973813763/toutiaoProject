// postCSS 配置文件

module.exports = {
  // 配置要使用的 PostCss 插件
  plugins: {
    // 配置使用的 autoprefixer 插件
    // 作用：生成浏览器CSS 样式规则前缀
    // VueCLI 内部已经配置了 autoprefixer 插件
    // 所以又配置了一次，就会产生冲突了
    // 'autoprefixer': {//autoprefixer 插件的配置
    //  配置要兼容到的环境信息
    // browsers: ['Android >= 4.0', 'iOS >= 8']
    // },

    // 配置使用 postcss-pxtorem 插件
    // 作用 ：把px转换为 rem
    'postcss-pxtorem': {
      // lib-flexible 的REM 适配方案：把一行分为 10 份 ，每份就是十分之一
      // 所以 rootValue 应该设置为你的设计稿宽度的十分之一
      //  如果我们的设计稿是750 ，就应该设置为 750 /10 =75
      // 但是 Vant 建议设置为37.5 ，为什么 ？因为Vant 是基于375 写的
      // 所以必须设置为37.5，唯一的缺点就是使用我们的设计稿的尺寸都必须 /2
      // 有没有更好的方法？
      //  如果是 Vant 的样式，就按照 37.5 来转换
      //  如果是 我们的自己 的样式，就按照 75 来转换

      // 通过查阅文档，我们发现 rootValue 支持两种类型：
      //    数字：固定的数值
      //      函数：可以动态处理返回
      //      PostCSS 处理每个 css 文件的时候都会来调用这个函数
      //       它会把被处理的 css 文件相关的信息通过参数传递给该函数
      rootValue ({ file }) {
        // console.log('被处理的css文件',file)
        return file.indexOf('vant') !== -1 ? 37.5 : 75
      },

      // rootValue: 37.5,

      // 要配置要转换的 css 属性
      // / *表示所有
      propList: ['*'],

      // 配置不要转换的资源 (排除) 保留原来的样式
      exclude: 'github-markdown'
    }
  }
}
