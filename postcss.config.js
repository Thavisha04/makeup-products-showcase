
const autoprefixer = require('autoprefixer');
const postcssPresetEnv = require('postcss-preset-env');

module.exports = {
    plugins: {
        'postcss-preset-env': {
            stage: 2,
            features: {
                'nesting-rules': true,
            }
        },
        autoprefixer: {}
    }
};
