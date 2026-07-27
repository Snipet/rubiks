import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/**
 * GitHub Pages serves this project from a sub-path (`/<repo>`), while Cloudflare
 * Pages serves it from the domain root. The deploy workflow sets BASE_PATH so the
 * same source tree produces correct asset URLs on both hosts.
 */
const base = process.env.BASE_PATH ?? '';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			// GitHub Pages has no SPA rewrite, so emit a 404.html that boots the router.
			fallback: '404.html',
			precompress: false,
			strict: true
		}),
		paths: { base, relative: true },
		prerender: {
			handleHttpError: 'fail',
			handleMissingId: 'fail'
		},
		alias: {
			$cube: 'src/lib/cube',
			$data: 'src/lib/data',
			$components: 'src/lib/components',
			$state: 'src/lib/state'
		}
	}
};

export default config;
