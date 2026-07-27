<script lang="ts">
	import { pageTitle } from '$lib/brand';
</script>

<svelte:head>
	<title>{pageTitle('algorithms')}</title>
	<meta
		name="description"
		content="Every case worth knowing, searchable, with diagrams generated from the moves."
	/>
</svelte:head>

<div class="page">
	<p class="eyebrow">algorithms</p>
	<h1>Algorithms</h1>
	<p class="lede">Every case worth knowing, searchable, with diagrams generated from the moves.</p>
</div>

<style>
	.lede {
		margin-block-start: var(--space-4);
		max-width: var(--measure);
		color: var(--text-muted);
		font-size: var(--step-1);
	}
</style>
