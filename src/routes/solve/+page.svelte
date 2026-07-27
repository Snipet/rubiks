<script lang="ts">
	import { pageTitle } from '$lib/brand';
</script>

<svelte:head>
	<title>{pageTitle('solve')}</title>
	<meta name="description" content="Type in the cube in your hands and get advice pitched at your level." />
</svelte:head>

<div class="page">
	<p class="eyebrow">solve</p>
	<h1>Solve</h1>
	<p class="lede">Type in the cube in your hands and get advice pitched at your level.</p>
</div>

<style>
	.lede {
		margin-block-start: var(--space-4);
		max-width: var(--measure);
		color: var(--text-muted);
		font-size: var(--step-1);
	}
</style>
