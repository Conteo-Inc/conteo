const path = require("path");

module.exports = {
    entry: "./src/App.tsx",
    output: {
        filename: "main.js",
        path: path.resolve(__dirname, "static", "frontend"),
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
