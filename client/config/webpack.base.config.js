const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin')
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
const root = path.resolve(__dirname, '../');

module.exports = {
    entry: path.resolve(root,'src'),
    output: {
        path: path.resolve(root, 'build'), //打包文件的输出路径
        filename: 'bundle.js', //打包文件名
    },
    resolve:{
        alias:{},
        mainFields:['jsnext:main', 'browser', 'main']
    },
    module: {
        rules: [ //配置加载器
            {
                test: /\.js$/, //配置要处理的文件格式，一般使用正则表达式匹配
                loaders:'babel-loader', //使用的加载器名称
                include: path.resolve(__dirname, '../src'),
            },
            {
                test:/\.css$/,
                use:ExtractTextWebpackPlugin.extract({
                    fallback:"style-loader",
                    use:"css-loader"
                })
            },
            {
                test: /\.less$/,
                exclude:[/node_modules/],
                use: ExtractTextWebpackPlugin.extract({
                    fallback: 'style-loader',
                    use: [{
                            loader: 'css-loader',
                            options: {
                                modules: true,
                                importLoaders: 2,
                                localIdentName: '[name]-[local]-[hash:base64:5]'
                            }
                        }, {
                            loader: 'postcss-loader',
                            options: {
                                plugins: () => [
                                    require('autoprefixer'),
                                    require('postcss-flexbugs-fixes')
                                ],
                            }
                        },
                        {
                            loader:"less-loader"
                        }
                    ]
                }),
            }, 
            {
                test: [/\.gif$/, /\.jpe?g$/, /\.png$/],
                loader: 'url-loader',
                options: {
                    limit: 10000, //1w字节以下大小的图片会自动转成base64
                },
            }
        ]
    },
    plugins: [
        new webpack.DllReferencePlugin({
          manifest: require('../lib/react.manifest.json')
        }),
        new HtmlWebpackPlugin({
            template:  path.resolve(root,'public/index.html'), //指定模板路径
            filename: 'index.html', //指定文件名
        }),
       new ExtractTextWebpackPlugin({
            filename:'[name]-[contenthash:base64].css'
        }),
        new CleanWebpackPlugin(),
    ]
}