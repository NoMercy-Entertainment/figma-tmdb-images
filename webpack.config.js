const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = (env, argv) => ({
    mode: argv.mode === 'production' ? 'production' : 'development',

    // This is necessary because Figma's 'eval' works differently than normal eval
    devtool: argv.mode === 'production' ? false : 'inline-source-map',
    entry: {
        code: './src/code.ts'
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.[s]?css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'style-loader',
                        options: { 
                            insert: 'head',
                            injectType: "styleTag",
                        },
                    },
                    { 
                        loader: 'css-loader', 
                        options: { 
                            importLoaders: 2, 
                        } 
                    },
                    { loader: 'postcss-loader' },
                    { loader: 'sass-loader' },
                ]
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    output: {
        filename: 'code.js',
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html',
            inject: 'body',
            chunks: ['index'],
            filename: 'index.html'
        }),
        new MiniCssExtractPlugin({
            filename: "./styles.css",
            chunkFilename: "[id].[contenthash].css"
        })
    ],
    devServer: {
        
    }
});