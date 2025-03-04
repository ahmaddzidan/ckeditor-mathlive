'use strict';

const path = require('path');
const { styles } = require('@ckeditor/ckeditor5-dev-utils');

module.exports = {
    mode: 'production',
    devtool: "source-map",
    performance: { hints: false },
    entry: './app.js',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'ckeditor_classic.js',
        library: 'ClassicEditor',
        libraryTarget: 'umd',
        libraryExport: 'default', // Tambahkan ini
        clean: true
    },
    module: {
        rules: [
            {
                test: /\.svg$/,

                use: ["raw-loader"],
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: styles.getPostCssConfig({
                                themeImporter: {
                                    themePath: require.resolve('@ckeditor/ckeditor5-theme-lark'),
                                },
                                minify: true
                            })
                        }
                    }
                ]
            }
        ]
    }
};