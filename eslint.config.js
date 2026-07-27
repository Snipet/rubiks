import js from '@eslint/js';
import svelte from 'eslint-plugin-svelte';
import svelteParser from 'svelte-eslint-parser';
import ts from 'typescript-eslint';
import svelteConfig from './svelte.config.js';

const browserGlobals = Object.fromEntries(
	[
		'window',
		'document',
		'localStorage',
		'navigator',
		'requestAnimationFrame',
		'cancelAnimationFrame',
		'setTimeout',
		'clearTimeout',
		'setInterval',
		'clearInterval',
		'performance',
		'console',
		'structuredClone',
		'ResizeObserver',
		'matchMedia',
		'HTMLElement',
		'SVGElement',
		'Event',
		'KeyboardEvent',
		'PointerEvent',
		'CustomEvent',
		'Blob',
		'URL',
		'FileReader',
		'process'
	].map((k) => [k, 'readonly'])
);

export default ts.config(
	js.configs.recommended,
	...ts.configs.recommended,
	...svelte.configs.recommended,
	{
		languageOptions: { globals: browserGlobals },
		rules: {
			'@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
			'no-undef': 'off'
		}
	},
	{
		// Rune-carrying modules are parsed by the Svelte parser, not plain TS.
		files: ['**/*.svelte.ts', '**/*.svelte.js'],
		languageOptions: {
			parser: svelteParser,
			parserOptions: { parser: ts.parser, svelteConfig, svelteFeatures: { runes: true } }
		}
	},
	{
		files: ['**/*.svelte'],
		languageOptions: {
			parserOptions: { parser: ts.parser, extraFileExtensions: ['.svelte'], svelteConfig }
		}
	},
	{ ignores: ['build/', '.svelte-kit/', 'node_modules/', 'static/'] }
);
