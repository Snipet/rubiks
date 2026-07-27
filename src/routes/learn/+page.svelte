<script lang="ts">
	import { pageTitle } from '$lib/brand';
</script>

<svelte:head>
	<title>{pageTitle('learn')}</title>
	<meta
		name="description"
		content="Four tracks, from your very first solve to full CFOP and beyond."
	/>
</svelte:head>

<div class="page">
	<p class="eyebrow">learn</p>
	<h1>Learn</h1>
	<p class="lede">Four tracks, from your very first solve to full CFOP and beyond.</p>
</div>

<style>
	.lede {
		margin-block-start: var(--space-4);
		max-width: var(--measure);
		color: var(--text-muted);
		font-size: var(--step-1);
	}
</style>
