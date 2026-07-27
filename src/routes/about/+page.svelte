<script lang="ts">
	import { pageTitle } from '$lib/brand';
</script>

<svelte:head>
	<title>{pageTitle('about')}</title>
	<meta name="description" content="What this site is, and how it checks its own work." />
</svelte:head>

<div class="page">
	<p class="eyebrow">reference</p>
	<h1>About</h1>
	<p class="lede">What this site is, and how it checks its own work.</p>
</div>

<style>
	.lede {
		margin-block-start: var(--space-4);
		max-width: var(--measure);
		color: var(--text-muted);
		font-size: var(--step-1);
	}
</style>
