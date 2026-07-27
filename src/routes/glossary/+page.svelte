<!--
	The glossary.

	Search matches terms, aliases and definitions, because someone who half
	remembers "the one that looks like headlights" needs the definition searched
	too. Every entry carries a stable anchor so a term can be linked to from a
	lesson, and cross-references jump straight there — clearing the filters on the
	way, since a link that lands on a hidden entry is worse than no link.
-->
<script lang="ts">
	import { tick } from 'svelte';
	import { resolve } from '$app/paths';
	import Chip from '$components/ui/Chip.svelte';
	import Segmented from '$components/ui/Segmented.svelte';
	import Prose from '$components/lesson/Prose.svelte';
	import { pageTitle } from '$lib/brand';
	import { GLOSSARY } from '$data/glossary';
	import type { GlossaryEntry } from '$data/types';

	type Category = GlossaryEntry['category'];

	const CATEGORIES: readonly Category[] = [
		'notation',
		'method',
		'technique',
		'theory',
		'hardware',
		'community'
	];

	const CATEGORY_LABELS: Record<Category, string> = {
		notation: 'Notation',
		method: 'Methods',
		technique: 'Technique',
		theory: 'Theory',
		hardware: 'Hardware',
		community: 'Competing'
	};

	const CATEGORY_TONES: Record<
		Category,
		'neutral' | 'section' | 'accent' | 'positive' | 'caution'
	> = {
		notation: 'accent',
		method: 'section',
		technique: 'positive',
		theory: 'neutral',
		hardware: 'caution',
		community: 'neutral'
	};

	/** Alphabetical once, here, rather than on every keystroke. */
	const ENTRIES = [...GLOSSARY].sort((a, b) => a.term.localeCompare(b.term, 'en'));

	/** A stable anchor, so lessons can link to `/glossary/#term-sexy-move`. */
	function anchorFor(term: string): string {
		return `term-${term
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/^-|-$/g, '')}`;
	}

	const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

	let query = $state('');
	let category = $state<Category | 'all'>('all');

	const needle = $derived(query.trim().toLowerCase());
	const filtering = $derived(needle.length > 0 || category !== 'all');

	const results = $derived(
		ENTRIES.filter((entry) => {
			if (category !== 'all' && entry.category !== category) return false;
			if (!needle) return true;
			return (
				entry.term.toLowerCase().includes(needle) ||
				entry.definition.toLowerCase().includes(needle) ||
				(entry.aliases ?? []).some((alias) => alias.toLowerCase().includes(needle))
			);
		})
	);

	/** Results grouped under their initial letter. Sorted already, so one pass does it. */
	const groups = $derived.by(() => {
		const out: { letter: string; entries: GlossaryEntry[] }[] = [];
		for (const entry of results) {
			const letter = entry.term[0].toUpperCase();
			const open = out[out.length - 1];
			if (open?.letter === letter) open.entries.push(entry);
			else out.push({ letter, entries: [entry] });
		}
		return out;
	});

	const present = $derived(groups.map((group) => group.letter));

	function clear() {
		query = '';
		category = 'all';
	}

	/**
	 * Follow a cross-reference. The target may be filtered out of the page, so the
	 * filters come off first and the scroll waits for the entry to exist.
	 */
	async function follow(event: MouseEvent, term: string) {
		event.preventDefault();
		clear();
		await tick();
		const id = anchorFor(term);
		document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
		window.history.replaceState(null, '', `#${id}`);
	}
</script>

<svelte:head>
	<title>{pageTitle('glossary')}</title>
	<meta
		name="description"
		content="Sixty cubing terms defined plainly, from AUF and F2L to lookahead, parity and ao5."
	/>
</svelte:head>

<div class="page">
	<header class="head">
		<p class="eyebrow">Glossary</p>
		<h1>The vocabulary, from AUF to ZBLL.</h1>
		<p class="lede">
			Cubing has a large private language and very little of it is written down in one place. These
			are the {ENTRIES.length} words you will meet in a forum thread, a tutorial or a competition hall,
			each with the thing people usually get wrong about it. The letters and marks themselves live on
			the
			<a href={resolve('/notation/')}>notation page</a>.
		</p>
	</header>

	<div class="controls">
		<label class="search">
			<span class="visually-hidden">Search the glossary</span>
			<input
				type="search"
				placeholder="Search 'auf', 'sledgehammer', 'ao5', 'parity'…"
				bind:value={query}
				spellcheck="false"
			/>
		</label>

		<div class="scroll-x">
			<Segmented
				label="Filter by category"
				size="sm"
				value={category}
				onchange={(v) => (category = v)}
				options={[
					{ value: 'all' as const, label: 'Everything' },
					...CATEGORIES.map((c) => ({ value: c, label: CATEGORY_LABELS[c] }))
				]}
			/>
		</div>
	</div>

	<div class="bar">
		<p class="count" aria-live="polite">
			{results.length}
			{results.length === 1 ? 'term' : 'terms'}
			{#if filtering}of {ENTRIES.length}{/if}
		</p>
		{#if filtering}
			<button class="clear" type="button" onclick={clear}>Clear</button>
		{/if}
	</div>

	<nav class="rail" aria-label="Jump to a letter">
		{#each ALPHABET as letter (letter)}
			{#if present.includes(letter)}
				<a class="rail__link" href="#letter-{letter.toLowerCase()}">{letter}</a>
			{:else}
				<span class="rail__link rail__link--off" aria-hidden="true">{letter}</span>
			{/if}
		{/each}
	</nav>

	{#if results.length === 0}
		<p class="empty">
			Nothing matches that. Search looks at terms, alternative spellings and the definitions
			themselves, so a shorter query usually finds it — try "slice" rather than "slice turn".
		</p>
	{:else}
		{#each groups as group (group.letter)}
			<section class="group" aria-labelledby="letter-{group.letter.toLowerCase()}">
				<h2 class="group__letter" id="letter-{group.letter.toLowerCase()}">{group.letter}</h2>
				<dl class="entries">
					{#each group.entries as entry (entry.term)}
						<div class="entry" id={anchorFor(entry.term)}>
							<dt class="entry__head">
								<a class="entry__term" href="#{anchorFor(entry.term)}">{entry.term}</a>
								<Chip tone={CATEGORY_TONES[entry.category]}>
									{CATEGORY_LABELS[entry.category]}
								</Chip>
							</dt>
							<dd class="entry__body">
								{#if entry.aliases?.length}
									<p class="entry__aliases">Also {entry.aliases.join(', ')}</p>
								{/if}
								<Prose text={entry.definition} class="entry__def" />
								{#if entry.see?.length}
									<p class="entry__see">
										<span class="entry__see-label">See also</span>
										{#each entry.see as term (term)}
											<a
												class="entry__ref"
												href="#{anchorFor(term)}"
												onclick={(event) => follow(event, term)}
											>
												{term}
											</a>
										{/each}
									</p>
								{/if}
							</dd>
						</div>
					{/each}
				</dl>
			</section>
		{/each}
	{/if}

	<nav class="jumps" aria-label="Where to next">
		<a class="jump" href={resolve('/notation/')}>
			<span class="jump__label">Notation</span>
			<span class="jump__blurb">
				Every letter, prime and slice, with a picture of what it does to a solved cube.
			</span>
			<span class="jump__go" aria-hidden="true">→</span>
		</a>
		<a class="jump" href={resolve('/methods/')}>
			<span class="jump__label">Methods</span>
			<span class="jump__blurb">CFOP, Roux, ZZ and friends, compared honestly.</span>
			<span class="jump__go" aria-hidden="true">→</span>
		</a>
		<a class="jump" href={resolve('/algorithms/')}>
			<span class="jump__label">Algorithms</span>
			<span class="jump__blurb">
				Every case worth knowing, searchable, with diagrams generated from the moves.
			</span>
			<span class="jump__go" aria-hidden="true">→</span>
		</a>
	</nav>
</div>

<style>
	.head {
		max-width: var(--measure);
	}

	.head h1 {
		margin-block: var(--space-2) var(--space-4);
	}

	.lede {
		color: var(--text-muted);
		font-size: var(--step-1);
		line-height: var(--leading-snug);
	}

	.controls {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--space-3);
		position: sticky;
		top: var(--header-height);
		z-index: 20;
		margin-block-start: var(--space-5);
		padding-block: var(--space-3);
		background: color-mix(in oklab, var(--bg) 92%, transparent);
		backdrop-filter: blur(10px);
	}

	.search {
		flex: 1 1 20rem;
	}

	.search input {
		width: 100%;
		padding: 0.65em 0.9em;
		background: var(--surface-1);
		border: var(--border-strong);
		border-radius: var(--radius-2);
		font-size: var(--step-0);
	}

	.search input:focus-visible {
		border-color: var(--accent);
	}

	.bar {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: var(--space-3);
	}

	.count {
		color: var(--text-faint);
		font-size: var(--step--1);
	}

	.clear {
		color: var(--text-muted);
		font-size: var(--step--1);
		text-decoration: underline;
		text-underline-offset: 3px;
	}

	.clear:hover {
		color: var(--text);
	}

	.rail {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-1);
		margin-block: var(--space-3) var(--space-6);
		padding-block: var(--space-3);
		border-block: var(--border);
	}

	.rail__link {
		min-width: 1.75rem;
		padding: 0.2em 0.35em;
		border-radius: var(--radius-1);
		color: var(--text-muted);
		font-family: var(--font-mono);
		font-size: var(--step--1);
		text-align: center;
		text-decoration: none;
	}

	.rail__link:hover {
		background: var(--surface-2);
		color: var(--text);
	}

	.rail__link--off {
		color: var(--text-faint);
		opacity: 0.4;
	}

	.empty {
		max-width: var(--measure);
		margin-block: var(--space-7);
		color: var(--text-muted);
		line-height: var(--leading-loose);
	}

	.group {
		margin-block-end: var(--space-6);
	}

	.group__letter {
		margin-block-end: var(--space-4);
		padding-block-end: var(--space-2);
		border-bottom: 2px solid var(--section-edge);
		font-family: var(--font-mono);
		font-size: var(--step-2);
		scroll-margin-block-start: calc(var(--header-height) + var(--space-6));
	}

	.entries {
		display: grid;
		gap: var(--space-4);
		grid-template-columns: repeat(auto-fill, minmax(21rem, 1fr));
		margin: 0;
	}

	.entry {
		display: grid;
		gap: var(--space-3);
		align-content: start;
		padding: var(--space-4);
		background: var(--surface-1);
		border: var(--border);
		border-radius: var(--radius-3);
		scroll-margin-block-start: calc(var(--header-height) + var(--space-6));
	}

	.entry:target {
		border-color: var(--section);
		box-shadow: var(--shadow-glow);
	}

	.entry__head {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--space-3);
	}

	.entry__term {
		color: var(--text);
		font-size: var(--step-1);
		font-weight: 640;
		text-decoration: none;
	}

	.entry__term:hover {
		color: var(--accent-strong);
		text-decoration: underline;
		text-underline-offset: 0.18em;
	}

	.entry__body {
		display: grid;
		gap: var(--space-3);
		margin: 0;
	}

	.entry__aliases {
		color: var(--text-faint);
		font-size: var(--step--2);
		font-style: italic;
	}

	.entry__body :global(.entry__def) {
		color: var(--text-muted);
		font-size: var(--step--1);
		line-height: var(--leading-loose);
	}

	.entry__see {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: var(--space-2);
		padding-block-start: var(--space-3);
		border-top: var(--border);
	}

	.entry__see-label {
		color: var(--text-faint);
		font-size: var(--step--2);
		font-weight: 700;
		letter-spacing: var(--tracking-caps);
		text-transform: uppercase;
	}

	.entry__ref {
		padding: 0.2em 0.55em;
		border: 1px solid var(--hairline);
		border-radius: var(--radius-pill);
		color: var(--text-muted);
		font-size: var(--step--2);
		text-decoration: none;
	}

	.entry__ref:hover {
		border-color: var(--section);
		color: var(--text);
	}

	.jumps {
		display: grid;
		gap: var(--space-4);
		grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
		margin-block: var(--space-7) var(--space-8);
	}

	.jump {
		position: relative;
		display: grid;
		gap: var(--space-1);
		align-content: start;
		padding: var(--space-4) var(--space-6) var(--space-4) var(--space-4);
		background: var(--section-wash);
		border: 1px solid var(--section-edge);
		border-radius: var(--radius-3);
		text-decoration: none;
		color: inherit;
	}

	.jump:hover {
		border-color: var(--section);
	}

	.jump__label {
		font-weight: 620;
	}

	.jump__blurb {
		color: var(--text-muted);
		font-size: var(--step--1);
		line-height: var(--leading-snug);
	}

	.jump__go {
		position: absolute;
		top: var(--space-4);
		inset-inline-end: var(--space-4);
		color: var(--section);
	}
</style>
