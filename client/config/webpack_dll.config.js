const path=require('path');
const webpack=require('webpack');
const root = path.resolve(__dirname, '../');

module.exports={
	entry:{
		react:['react','react-dom'],
	},
	output:{
		filename:'[name].dll.js',
		path:path.resolve(root,'lib'),
		library:'_dll_[name]'
	},
	plugins:[
		new webpack.DllPlugin({
			name:'_dll_[name]',
			path: path.join(root,'lib','[name].manifest.json')
		})
	]
}