<script lang="ts">
	import '$lib/styles/base.css';
	import { onMount } from 'svelte';
	import { settings } from '$state/settings.svelte';
	import { progress } from '$state/progress.svelte';

	let { children } = $props();

	onMount(() => {
		settings.hydrate();
		progress.hydrate();
	});

	// Keep the document element in step with the appearance settings.
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
</script>

{@render children()}
