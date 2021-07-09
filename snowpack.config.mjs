/** @type {import("snowpack").SnowpackUserConfig } */

const nonRouteExtensions = 'js|css|ico|png|jpg|svg|json|map|txt|woff|woff2|tff|pdf'

const isProd = process.env.NODE_ENV === 'production'

export default {
	mount: {
		public: { url: '/', static: true },
		src: { url: '/dist' },
	},
	plugins: [
		'@snowpack/plugin-react-refresh',
		'@snowpack/plugin-dotenv',
		[
			'@snowpack/plugin-typescript',
			{
				/* Yarn PnP workaround: see https://www.npmjs.com/package/@snowpack/plugin-typescript */
				...(process.versions.pnp ? { tsc: 'yarn pnpify tsc' } : {}),
			},
		],
	],
	routes: [
		/* Enable an SPA Fallback in development: */
		// {"match": "routes", "src": ".*", "dest": "/index.html"},
		/* Enable an SPA Fallback in development: */
		// {"match": "routes", "src": ".*", "dest": "/index.html"},
		// The recommend approach (above) doesn't work for deep routes for some reason
		// eslint-disable-next-line no-useless-escape
		{'match': 'all', 'src': `^(.(?!\.(${nonRouteExtensions})$))+$`, 'dest': '/index.html'},
	],
	optimize: {
		"bundle": isProd,
		// minify: true, // sourcemaps dont work in minify yet :-(
		// splitting: true, // app breaks with splitting
		manifest: true,
	},
	packageOptions: {
		/* ... */
	},
	devOptions: {
		/* ... */
	},
	buildOptions: {
		/* ... */
		sourcemap: true,
	},
	alias: {
		'#src': './src',
		'#lib': './src/lib',
		'#api': './src/api',
		'#services': './src/services',
	}
}
