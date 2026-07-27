<script lang="ts">
	import { pageTitle } from '$lib/brand';
</script>

<svelte:head>
	<title>{pageTitle('notation')}</title>
	<meta name="description" content="What every letter, prime mark and lowercase turn means." />
</svelte:head>

<div class="page">
	<p class="eyebrow">reference</p>
	<h1>Notation</h1>
	<p class="lede">What every letter, prime mark and lowercase turn means.</p>
</div>

<style>
	.lede {
		margin-block-start: var(--space-4);
		max-width: var(--measure);
		color: var(--text-muted);
		font-size: var(--step-1);
	}
</style>
