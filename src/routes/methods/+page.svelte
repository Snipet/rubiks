<script lang="ts">
	import { pageTitle } from '$lib/brand';
</script>

<svelte:head>
	<title>{pageTitle('methods')}</title>
	<meta name="description" content="CFOP, Roux, ZZ, Petrus and friends, compared honestly." />
</svelte:head>

<div class="page">
	<p class="eyebrow">reference</p>
	<h1>Methods</h1>
	<p class="lede">CFOP, Roux, ZZ, Petrus and friends, compared honestly.</p>
</div>

<style>
	.lede {
		margin-block-start: var(--space-4);
		max-width: var(--measure);
		color: var(--text-muted);
		font-size: var(--step-1);
	}
</style>
