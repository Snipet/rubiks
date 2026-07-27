<script lang="ts">
	import { pageTitle } from '$lib/brand';
</script>

<svelte:head>
	<title>{pageTitle('glossary')}</title>
	<meta name="description" content="The vocabulary, from AUF to ZBLL." />
</svelte:head>

<div class="page">
	<p class="eyebrow">reference</p>
	<h1>Glossary</h1>
	<p class="lede">The vocabulary, from AUF to ZBLL.</p>
</div>

<style>
	.lede {
		margin-block-start: var(--space-4);
		max-width: var(--measure);
		color: var(--text-muted);
		font-size: var(--step-1);
	}
</style>
