const merge = require('webpack-merge');
const base = require('./webpack.base.config')
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = merge(base, {
    mode: 'production',
    devtool: 'hidden-source-map',
    plugins: [
        new UglifyJsPlugin({
            uglifyOptions: {
                compress: {
                    // 在UglifyJs删除没有用到的代码时不输出警告
                    warnings: false,
                    // 删除所有的 `console` 语句，可以兼容ie浏览器
                    drop_console: true,
                    // 内嵌定义了但是只用到一次的变量
                    collapse_vars: true,
                    // 提取出出现多次但是没有定义成变量去引用的静态值
                    reduce_vars: true,
                },
                output: {
                    // 最紧凑的输出
                    beautify: false,
                    // 删除所有的注释
                    comments: false,
                }
            }
        }),
        new ExtractTextWebpackPlugin({
            filename: '[name]-[contenthash:base64].css'
        }),
    ]
})