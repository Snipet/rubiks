<script lang="ts">
	import { base } from '$app/paths';
	import AlgCase from '$components/cube/AlgCase.svelte';
	import Chip from '$components/ui/Chip.svelte';
	import Button from '$components/ui/Button.svelte';
	import Segmented from '$components/ui/Segmented.svelte';
	import { pageTitle } from '$lib/brand';
	import { settings } from '$state/settings.svelte';
	import { progress } from '$state/progress.svelte';
	import { SKILL_LABELS, SKILL_TIERS, type SkillTier } from '$data/types';

	let { data } = $props();

	let query = $state('');
	let tierFilter = $state<SkillTier | 'all'>('all');
	let onlyUnlearned = $state(false);

	const normalise = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

	const visible = $derived(
		data.cases.filter((c) => {
			if (tierFilter !== 'all' && c.tier !== tierFilter) return false;
			if (onlyUnlearned && progress.confidence(c.id) === 'solid') return false;
			if (!query.trim()) return true;
			const needle = normalise(query);
			return normalise(
				[
					c.id,
					c.name,
					c.shortName,
					c.group ?? '',
					...(c.tags ?? []),
					...c.algs.map((a) => a.moves)
				].join(' ')
			).includes(needle);
		})
	);

	/** Group the visible cases into the set's declared sections. */
	const grouped = $derived.by(() => {
		const groups = data.set.groups ?? [];
		const buckets = groups.map((name) => ({
			name,
			cases: visible.filter((c) => c.group === name)
		}));
		const ungrouped = visible.filter((c) => !c.group || !groups.includes(c.group));
		if (ungrouped.length)
			buckets.push({ name: groups.length ? 'Everything else' : '', cases: ungrouped });
		return buckets.filter((b) => b.cases.length > 0);
	});

	const learned = $derived(data.cases.filter((c) => progress.confidence(c.id) === 'solid').length);
</script>

<svelte:head>
	<title>{pageTitle(data.set.shortName.toLowerCase())}</title>
	<meta name="description" content={data.set.summary} />
</svelte:head>

<div class="page page--wide">
	<nav class="crumbs" aria-label="Breadcrumb">
		<a href="{base}/algorithms">All algorithms</a>
		<span aria-hidden="true">/</span>
		<span>{data.set.shortName}</span>
	</nav>

	<header class="head">
		<div class="head__main">
			<p class="eyebrow">{data.cases.length} cases</p>
			<h1>{data.set.name}</h1>
			<p class="lede">{data.set.summary}</p>
			<p class="desc">{data.set.description}</p>
			<div class="head__chips">
				<Chip tone="section" size="md">From {SKILL_LABELS[data.set.tier].toLowerCase()}</Chip>
				{#if learned > 0}
					<Chip tone="positive" size="md">{learned} of {data.cases.length} marked known</Chip>
				{/if}
			</div>
		</div>
		<aside class="head__aside">
			<Button variant="secondary" href="{base}/trainer">Drill this set</Button>
			<Button variant="ghost" href="{base}/solve">Find my case</Button>
		</aside>
	</header>

	<div class="controls">
		<label class="search">
			<span class="visually-hidden">Search this set</span>
			<input
				type="search"
				placeholder="Search by name, moves or tag…"
				bind:value={query}
				spellcheck="false"
			/>
		</label>

		<Segmented
			label="Filter by level"
			size="sm"
			value={tierFilter}
			onchange={(v) => (tierFilter = v)}
			options={[
				{ value: 'all' as const, label: 'All levels' },
				...SKILL_TIERS.map((t) => ({ value: t, label: SKILL_LABELS[t] }))
			]}
		/>

		<label class="toggle">
			<input type="checkbox" bind:checked={onlyUnlearned} />
			Hide the ones I know
		</label>
	</div>

	{#if visible.length === 0}
		<p class="empty">
			Nothing matches that. {#if query}Try a shorter search{:else}Try widening the filters{/if}.
		</p>
	{:else}
		{#each grouped as group (group.name)}
			<section class="group">
				{#if group.name}
					<h2 class="group__name">
						{group.name}
						<span class="group__count">{group.cases.length}</span>
					</h2>
				{/if}
				<div class="cases">
					{#each group.cases as entry (entry.id)}
						<AlgCase {entry} />
					{/each}
				</div>
			</section>
		{/each}
	{/if}
</div>

<style>
	.crumbs {
		display: flex;
		gap: var(--space-2);
		margin-block-end: var(--space-4);
		color: var(--text-faint);
		font-size: var(--step--1);
	}

	.crumbs a {
		color: var(--text-muted);
		text-decoration: none;
	}

	.crumbs a:hover {
		color: var(--section);
	}

	.head {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		gap: var(--space-5);
		align-items: start;
		padding-block-end: var(--space-6);
		border-bottom: var(--border);
	}

	.head h1 {
		margin-block: var(--space-2) var(--space-3);
	}

	.lede {
		max-width: var(--measure);
		color: var(--text);
		font-size: var(--step-1);
		line-height: var(--leading-snug);
	}

	.desc {
		max-width: var(--measure);
		margin-block-start: var(--space-3);
		color: var(--text-muted);
	}

	.head__chips {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
		margin-block-start: var(--space-4);
	}

	.head__aside {
		display: grid;
		gap: var(--space-2);
	}

	.controls {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--space-3);
		position: sticky;
		top: var(--header-height);
		z-index: 20;
		margin-block: var(--space-4);
		padding-block: var(--space-3);
		background: color-mix(in oklab, var(--bg) 92%, transparent);
		backdrop-filter: blur(10px);
	}

	.search {
		flex: 1 1 16rem;
	}

	.search input {
		width: 100%;
		padding: 0.55em 0.8em;
		background: var(--surface-1);
		border: var(--border-strong);
		border-radius: var(--radius-2);
		font-size: var(--step--1);
	}

	.search input:focus-visible {
		border-color: var(--accent);
	}

	.toggle {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		color: var(--text-muted);
		font-size: var(--step--1);
		cursor: pointer;
	}

	.toggle input {
		accent-color: var(--section);
	}

	.group {
		margin-block-end: var(--space-7);
	}

	.group__name {
		display: flex;
		align-items: baseline;
		gap: var(--space-3);
		margin-block-end: var(--space-4);
		padding-block-end: var(--space-2);
		border-bottom: 2px solid var(--section-edge);
		font-size: var(--step-1);
	}

	.group__count {
		color: var(--text-faint);
		font-size: var(--step--1);
		font-weight: 400;
		font-variant-numeric: tabular-nums;
	}

	.cases {
		display: grid;
		gap: var(--space-3);
	}

	.empty {
		padding: var(--space-7);
		text-align: center;
		color: var(--text-muted);
	}

	@media (max-width: 52rem) {
		.head {
			grid-template-columns: minmax(0, 1fr);
		}
		.head__aside {
			grid-auto-flow: column;
			justify-content: start;
		}
	}
</style>
