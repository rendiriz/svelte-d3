import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import sveltePreprocess from 'svelte-preprocess';
import typescript from '@rollup/plugin-typescript';
import scss from 'rollup-plugin-scss';

const production = !process.env.ROLLUP_WATCH;

function serve() {
	let server;

	function toExit() {
		if (server) server.kill(0);
	}

	return {
		writeBundle() {
			if (server) return;
			server = require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
				stdio: ['ignore', 'inherit', 'inherit'],
				shell: true
			});

			process.on('SIGTERM', toExit);
			process.on('exit', toExit);
		}
	};
}

export default {
	input: 'src/main.ts',
	output: [
		// {
		// 	sourcemap: true,
		// 	format: 'cjs',
		// 	file: 'public/build/d3.cjs.js'
		// },
		// {
		// 	sourcemap: true,
		// 	format: 'esm',
		// 	file: 'public/build/d3.esm.js'
		// },
		{
			sourcemap: true,
			format: 'umd',
			name: 'svelte-d3',
			file: 'public/build/d3.umd.js',
			globals: {
        d3: 'd3'
    	},
		}
	],
	plugins: [
		svelte({
			preprocess: sveltePreprocess({
				sourceMap: !production,
				postcss: true,
			}),
			compilerOptions: {
				// enable run-time checks when not in production
				dev: !production,
				customElement: true
			}
		}),
		// we'll extract any component CSS out into
		// a separate file - better for performance
		scss({
			output: 'd3.css',
			include: ['/**/*.scss']
		}),

		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration -
		// consult the documentation for details:
		// https://github.com/rollup/plugins/tree/master/packages/commonjs
		resolve({
			browser: true,
			dedupe: ['svelte'],
			jsnext: true
		}),
		commonjs({
			include: 'node_modules/**',
			extensions: [ '.js', '.coffee' ],
			namedExports: {
        'node_modules/d3/dist/d3.node.js': [
          'selection', 'mouse', 'select', 'interpolateRgbBasis',
          'median', 'min', 'max', 'scaleLinear', 'easeExp', 'extent', 'event',
          'easeSin', 'selectAll', 'keys', 'interpolateRgb', 'descending', 'line',
          'curveBasis', 'histogram', 'ascending', 'sourceEvent'
        ],
			},
			ignore: [ 'conditional-runtime-dependency' ]
		}),
		typescript({
			// sourceMap: !production,
			// inlineSources: !production,
			tsconfig: 'tsconfig.json',
		}),

		// In dev mode, call `npm run start` once
		// the bundle has been generated
		!production && serve(),

		// Watch the `public` directory and refresh the
		// browser on changes when not in production
		!production && livereload('public'),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser()
	],
	watch: {
		clearScreen: false
	}
};
