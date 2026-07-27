<script lang="ts">
	import Wordmark from '$components/layout/Wordmark.svelte';
	import { BRAND, TAGLINE } from '$lib/brand';
	// Placeholder home page. The full landing experience arrives in a later commit.
</script>

<svelte:head>
	<title>{BRAND}</title>
	<meta name="description" content={TAGLINE} />
</svelte:head>

<main class="page">
	<h1><Wordmark size="lg" sectioned /></h1>
	<p>{TAGLINE}</p>
</main>
