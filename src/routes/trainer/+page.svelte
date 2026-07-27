<script lang="ts">
	import { pageTitle } from '$lib/brand';
</script>

<svelte:head>
	<title>{pageTitle('trainer')}</title>
	<meta
		name="description"
		content="Drill the cases you keep fumbling, on a schedule that remembers which ones."
	/>
</svelte:head>

<div class="page">
	<p class="eyebrow">trainer</p>
	<h1>Trainer</h1>
	<p class="lede">Drill the cases you keep fumbling, on a schedule that remembers which ones.</p>
</div>

<style>
	.lede {
		margin-block-start: var(--space-4);
		max-width: var(--measure);
		color: var(--text-muted);
		font-size: var(--step-1);
	}
</style>
