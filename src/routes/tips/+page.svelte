<script lang="ts">
	import { pageTitle } from '$lib/brand';
</script>

<svelte:head>
	<title>{pageTitle('tips')}</title>
	<meta name="description" content="Lookahead, finger tricks, practice habits and hardware." />
</svelte:head>

<div class="page">
	<p class="eyebrow">reference</p>
	<h1>Tips</h1>
	<p class="lede">Lookahead, finger tricks, practice habits and hardware.</p>
</div>

<style>
	.lede {
		margin-block-start: var(--space-4);
		max-width: var(--measure);
		color: var(--text-muted);
		font-size: var(--step-1);
	}
</style>
