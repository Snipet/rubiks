<script lang="ts">
	import { pageTitle } from '$lib/brand';
</script>

<svelte:head>
	<title>{pageTitle('timer')}</title>
	<meta name="description" content="Scrambles, inspection, and the averages competitions actually use." />
</svelte:head>

<div class="page">
	<p class="eyebrow">timer</p>
	<h1>Timer</h1>
	<p class="lede">Scrambles, inspection, and the averages competitions actually use.</p>
</div>

<style>
	.lede {
		margin-block-start: var(--space-4);
		max-width: var(--measure);
		color: var(--text-muted);
		font-size: var(--step-1);
	}
</style>
