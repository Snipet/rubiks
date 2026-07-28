<!--
	Your data, and getting it out.

	Everything this site remembers lives in one browser, which is the right
	default and also a trap: clear your history, switch laptop, or use a private
	window, and it is gone with no warning. A site that keeps your data locally
	owes you a way to carry it, so this page is that way.

	It is deliberately plain. Export writes a file, import reads one back, and
	clearing asks twice — because the one thing worse than losing a year of times
	is losing them to a button you meant to press once.
-->
<script lang="ts">
	import Button from '$components/ui/Button.svelte';
	import { pageTitle } from '$lib/brand';
	import { progress, solveStats } from '$state/progress.svelte';
	import { PUZZLE_LABELS, settings } from '$state/settings.svelte';
	import { PUZZLE_SIZES } from '$cube/puzzle';

	let fileInput = $state<HTMLInputElement | null>(null);
	let message = $state<{ kind: 'ok' | 'bad'; text: string } | null>(null);
	let confirming = $state(false);

	const current = $derived(progress.current);
	const caseCount = $derived(Object.keys(current.cases).length);
	const perPuzzle = $derived(
		PUZZLE_SIZES.map((size) => ({
			size,
			count: current.solves.filter((s) => (s.puzzle ?? 3) === size).length
		})).filter((row) => row.count > 0)
	);
	const stats = $derived(solveStats(current.solves));

	function download() {
		const blob = new Blob([progress.export()], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		// Dated, because the whole point is having more than one of these.
		const today = new Date().toISOString().slice(0, 10);
		link.href = url;
		link.download = `rubiks-seanfunk-${today}.json`;
		link.click();
		URL.revokeObjectURL(url);
		message = { kind: 'ok', text: 'Saved. Keep it somewhere you will find it again.' };
	}

	async function upload(event: Event) {
		const input = event.currentTarget as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;
		const text = await file.text();
		const result = progress.import(text);
		message = result.ok
			? { kind: 'ok', text: 'Loaded. Everything that was in the file is now in this browser.' }
			: { kind: 'bad', text: `That file could not be read: ${result.error}` };
		// Let the same file be chosen twice in a row.
		input.value = '';
	}

	function wipe() {
		progress.clearAll();
		confirming = false;
		message = { kind: 'ok', text: 'Cleared. Nothing is left.' };
	}
</script>

<svelte:head>
	<title>{pageTitle('data')}</title>
	<meta
		name="description"
		content="Export your solve history and learning progress, load it back, or clear it."
	/>
</svelte:head>

<div class="page">
	<header class="head">
		<p class="eyebrow">Reference</p>
		<h1>Your data</h1>
		<p class="lede">
			Everything this site remembers — your times, which cases you have marked known, which lessons
			you have finished — is stored in this browser and nowhere else. That means no account and no
			tracking. It also means clearing your history takes it with it, so here is how to keep a copy.
		</p>
	</header>

	<section class="block">
		<h2>What is stored right now</h2>
		<dl class="tally">
			<div>
				<dt>Solves</dt>
				<dd>{current.solves.length}</dd>
			</div>
			<div>
				<dt>Cases practised</dt>
				<dd>{caseCount}</dd>
			</div>
			<div>
				<dt>Lessons finished</dt>
				<dd>{current.lessons.length}</dd>
			</div>
			<div>
				<dt>Days active</dt>
				<dd>{current.activeDays.length}</dd>
			</div>
		</dl>
		{#if perPuzzle.length > 0}
			<p class="note">
				Times are kept per puzzle:
				{#each perPuzzle as row, i (row.size)}{i > 0 ? ', ' : ''}{row.count}
					on the {PUZZLE_LABELS[row.size]}{/each}. Your best is
				{stats.best === null ? 'not set yet' : `${(stats.best / 1000).toFixed(2)}s`}.
			</p>
		{:else}
			<p class="note">No solves recorded yet.</p>
		{/if}
	</section>

	<section class="block">
		<h2>Take a copy</h2>
		<p>
			One JSON file with everything in it. Readable, if you are curious what a year of practice
			looks like as text.
		</p>
		<div class="row">
			<Button variant="section" onclick={download}>Download my data</Button>
		</div>
	</section>

	<section class="block">
		<h2>Load a copy back</h2>
		<p>
			This <strong>replaces</strong> what is in this browser rather than merging with it. If you have
			practised on this device since the export, take a copy of that first.
		</p>
		<div class="row">
			<Button variant="secondary" onclick={() => fileInput?.click()}>Choose a file…</Button>
			<input
				bind:this={fileInput}
				class="visually-hidden"
				type="file"
				accept="application/json,.json"
				onchange={upload}
			/>
		</div>
	</section>

	<section class="block block--danger">
		<h2>Start again</h2>
		<p>
			Deletes every time, every case you have marked known, and every lesson you have ticked off.
			There is no undo and no copy on a server, because there is no server.
		</p>
		<div class="row">
			{#if confirming}
				<Button variant="danger" onclick={wipe}>Yes, delete everything</Button>
				<Button variant="ghost" onclick={() => (confirming = false)}>Keep it</Button>
			{:else}
				<Button variant="secondary" onclick={() => (confirming = true)}>Clear my data…</Button>
			{/if}
		</div>
	</section>

	{#if message}
		<p class="message" class:message--bad={message.kind === 'bad'} role="status">{message.text}</p>
	{/if}

	<section class="block">
		<h2>What is not stored</h2>
		<p>
			Your appearance and skill settings live under a separate key and are not in the export — they
			are preferences for a device rather than a record of anything. The current puzzle is one of
			them, which is why a fresh browser starts on the {PUZZLE_LABELS[settings.current.puzzle] ===
			'3×3'
				? '3×3'
				: '3×3, not the ' + PUZZLE_LABELS[settings.current.puzzle]}.
		</p>
	</section>
</div>

<style>
	.head {
		max-width: var(--measure);
		margin-block-end: var(--space-6);
	}

	.head h1 {
		margin-block: var(--space-2) var(--space-4);
	}

	.lede {
		color: var(--text-muted);
		font-size: var(--step-1);
		line-height: var(--leading-normal);
	}

	.eyebrow {
		color: var(--section);
		font-size: var(--step--2);
		font-weight: 700;
		letter-spacing: var(--tracking-caps);
		text-transform: uppercase;
	}

	.block {
		max-width: var(--measure);
		padding: var(--space-5);
		margin-block-end: var(--space-4);
		border: var(--border);
		border-radius: var(--radius-3);
		background: var(--surface-1);
	}

	.block h2 {
		font-size: var(--step-1);
		margin-block-end: var(--space-3);
	}

	.block p {
		color: var(--text-muted);
		line-height: var(--leading-normal);
	}

	.block--danger {
		border-inline-start: 3px solid var(--danger);
	}

	.row {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-3);
		margin-block-start: var(--space-4);
	}

	.tally {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-6);
		margin-block-end: var(--space-4);
	}

	.tally dt {
		color: var(--text-faint);
		font-size: var(--step--2);
		letter-spacing: var(--tracking-caps);
		text-transform: uppercase;
	}

	.tally dd {
		font-size: var(--step-2);
		font-variant-numeric: tabular-nums;
	}

	.note {
		color: var(--text-muted);
		font-size: var(--step--1);
	}

	.message {
		max-width: var(--measure);
		padding: var(--space-3) var(--space-4);
		border-radius: var(--radius-2);
		border-inline-start: 3px solid var(--positive);
		background: var(--surface-2);
		color: var(--text);
	}

	.message--bad {
		border-inline-start-color: var(--danger);
	}
</style>
