import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}'],
		environment: 'node',
		// Several suites solve hundreds of cubes; the default five seconds is not a
		// meaningful budget for them.
		testTimeout: 60_000
	}
});
