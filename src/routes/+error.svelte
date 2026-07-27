<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import Button from '$components/ui/Button.svelte';
	import CubeDiagram from '$components/cube/CubeDiagram.svelte';
	import { stateFromAlg } from '$cube/facelets';
	import { BRAND } from '$lib/brand';

	// A cube one move from solved: the page is nearly right, but not quite.
	const nearly = stateFromAlg("R U R' U'");
</script>

<svelte:head>
	<title>{page.status} · {BRAND}</title>
</svelte:head>

<div class="page error">
	<CubeDiagram facelets={nearly} view="full" size={180} label="A cube that is nearly solved" />
	<p class="eyebrow">Error {page.status}</p>
	<h1>{page.status === 404 ? 'There is nothing at this address' : 'Something went wrong'}</h1>
	<p class="detail">
		{page.error?.message ??
			'The page could not be loaded. Going back to the start is usually the quickest fix.'}
	</p>
	<div class="actions">
		<Button variant="primary" href={resolve('/')}>Back to the start</Button>
		<Button variant="secondary" href={resolve('/algorithms/')}>Browse the algorithms</Button>
	</div>
</div>

<style>
	.error {
		display: grid;
		justify-items: center;
		gap: var(--space-4);
		padding-block: var(--space-9);
		text-align: center;
	}

	.detail {
		max-width: 46ch;
		color: var(--text-muted);
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-3);
		justify-content: center;
	}
</style>
