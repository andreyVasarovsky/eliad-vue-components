import vue from 'rollup-plugin-vue'
import css from 'rollup-plugin-css-only'
import {terser} from 'rollup-plugin-terser';
import peerDepsExternal from 'rollup-plugin-peer-deps-external'

export default [
    {
        input: 'src/index.js',
        output: [
            {
                format: 'esm',
                file: 'dist/library.mjs'
            },
            {
                format: 'cjs',
                file: 'dist/library.js'
            }
        ],
        plugins: [
            vue(), css({output: 'css/av.css', outputStyle: "compressed", minify: true}), terser(), peerDepsExternal(),
        ]
    }
]