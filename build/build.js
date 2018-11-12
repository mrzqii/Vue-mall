'use strict'
require('./check-versions')() //检查版本规则 引入这个函数然后执行这个函数

process.env.NODE_ENV = 'production'

const ora = require('ora')
const rm = require('rimraf') 
const path = require('path')
const chalk = require('chalk')
const webpack = require('webpack')
const config = require('../config') //默认加载config下面的index.js文件
const webpackConfig = require('./webpack.prod.conf')

const spinner = ora('building for production...')
spinner.start()

rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => { //删除以前打包的文件
  if (err) throw err
  webpack(webpackConfig, (err, stats) => { //通过调用接口的方式进行打包 还可以在命令行执行webpack进行打包
    spinner.stop()
    if (err) throw err
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false, // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
      chunks: false,
      chunkModules: false
    }) + '\n\n')

    if (stats.hasErrors()) {
      console.log(chalk.red('  Build failed with errors.\n'))
      process.exit(1)
    }

    console.log(chalk.cyan('  Build complete.\n'))
    console.log(chalk.yellow(
      '  Tip: built files are meant to be served over an HTTP server.\n' +
      '  Opening index.html over file:// won\'t work.\n'
    ))
  })
})
