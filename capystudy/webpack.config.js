module.exports = {
    devtool: 'source-map', // ou false, se não quiser source maps
    ignoreWarnings: [/Failed to parse source map/], // Ignora esses avisos
    module: {
        rules: [
            {
                test: /\.js$/,
                enforce: 'pre',
                use: ['source-map-loader'],
                exclude: /node_modules/, // Ignora os source maps de node_modules
            },
        ],
    },
};
