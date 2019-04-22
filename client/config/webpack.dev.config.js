const path = require('path');
const webpack = require('webpack');
const merge=require('webpack-merge');
const base=require('./webpack.base.config')

module.exports = merge(base,{
    mode:'development',
    devServer: {
        contentBase: path.resolve(__dirname,".."),
        inline: true,
        hot: true,
        progress:true,
        proxy:[{
            context:["/login","/update","/register","/user","/userlist","/msglist","/readmsg"],
            target:"http://localhost:3000/",
        }]
    },
    devtool:'eval-source-map',
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
    ]
})