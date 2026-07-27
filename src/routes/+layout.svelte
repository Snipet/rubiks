<script lang="ts">
	import '$lib/styles/base.css';
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { base } from '$app/paths';
	import { settings } from '$state/settings.svelte';
	import { progress } from '$state/progress.svelte';
	import { sectionFor } from '$lib/nav';
	import Header from '$components/layout/Header.svelte';
	import Footer from '$components/layout/Footer.svelte';

	let { children } = $props();

	const section = $derived(sectionFor(page.url.pathname.replace(base, '') || '/'));

	onMount(() => {
		settings.hydrate();
		progress.hydrate();
	});

	// Keep the document element in step with the appearance settings, so the
	// palette and density apply to portals and the scrollbar too.
	$effect(() => {
		const root = document.documentElement;
		const attrs = settings.documentAttributes;
		for (const name of ['data-theme', 'data-palette', 'data-density', 'data-motion']) {
			const value = attrs[name];
			if (value) root.setAttribute(name, value);
			else root.removeAttribute(name);
		}
		root.style.setProperty('--turn-duration', `${settings.current.turnSpeed}ms`);
	});

	// The section colour drives the whole page's chrome.
	$effect(() => {
		const root = document.documentElement;
		if (section) root.setAttribute('data-section', section);
		else root.removeAttribute('data-section');
	});
</script>

<div class="shell" data-section={section}>
	<Header />
	<main id="main" class="shell__main">
		{@render children()}
	</main>
	<Footer />
</div>

<style>
	.shell {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		min-height: 100dvh;
	}

	.shell__main {
		flex: 1;
		padding-block-start: var(--space-6);
	}
</style>
