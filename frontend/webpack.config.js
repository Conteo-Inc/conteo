module.exports = {
    entry: "./src/App.tsx",
    output: {
        filename: "./dist/bundle.js",
    },
    devtool: "source-map",
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx"],
    },
    externals: {
        "React": "react",
        "ReactDOM": "react-dom",
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    //loader: "babel-loader"
                    loader: "source-map-loader"
                }
            },
            {
                test: /\.ts|\.tsx$/,
                exclude: /node_modules/,
                use: {
                    loader: "ts-loader"
                }
            }
        ]
    },
};