<script lang="ts">
	import { resolve } from '$app/paths';
	import AlgString from '$components/ui/AlgString.svelte';
	import Button from '$components/ui/Button.svelte';
	import Card from '$components/ui/Card.svelte';
	import Chip from '$components/ui/Chip.svelte';
	import Segmented from '$components/ui/Segmented.svelte';
	import { pageTitle } from '$lib/brand';
	import { TIP_CATEGORIES, TIPS } from '$data/tips';
	import { SKILL_LABELS, SKILL_TIERS, type SkillTier, type Tip } from '$data/types';
	import { settings } from '$state/settings.svelte';

	type Category = Tip['category'];

	let category = $state<Category | 'all'>('all');
	let tier = $state<SkillTier | 'all'>('all');

	const counts = $derived(
		Object.fromEntries(
			TIP_CATEGORIES.map((c) => [
				c.id,
				TIPS.filter((t) => t.category === c.id && (tier === 'all' || t.tier === tier)).length
			])
		) as Record<Category, number>
	);

	const results = $derived(
		TIPS.filter(
			(t) => (category === 'all' || t.category === category) && (tier === 'all' || t.tier === tier)
		)
	);

	const filtering = $derived(category !== 'all' || tier !== 'all');

	const activeCategory = $derived(TIP_CATEGORIES.find((c) => c.id === category));

	const categoryLabel: Record<Category, string> = Object.fromEntries(
		TIP_CATEGORIES.map((c) => [c.id, c.label])
	) as Record<Category, string>;

	function clear() {
		category = 'all';
		tier = 'all';
	}
</script>

<svelte:head>
	<title>{pageTitle('tips')}</title>
	<meta
		name="description"
		content="Specific, actionable advice on lookahead, finger tricks, practice, hardware, mindset and competition — filterable by category and by level."
	/>
</svelte:head>

<div class="page page--wide">
	<header class="head">
		<p class="eyebrow">Reference</p>
		<h1>{TIPS.length} things worth trying</h1>
		<p class="lede">
			Everything here is meant to survive contact with your next practice session. Nothing says
			"practise more"; each one names a thing to do differently and something you can check
			afterwards. Most of them will cost you time before they save you any.
		</p>
		<p class="note">
			The level on a tip is the earliest point it is worth acting on, not the point it stops
			mattering. You are currently reading the site at
			<strong>{SKILL_LABELS[settings.current.skill].toLowerCase()}</strong> level, which you can change
			from the header at any time.
		</p>
	</header>

	<div class="controls">
		<div class="filter" role="group" aria-label="Filter by category">
			<Button
				size="sm"
				variant={category === 'all' ? 'section' : 'ghost'}
				aria-pressed={category === 'all'}
				onclick={() => (category = 'all')}
			>
				Everything <span class="filter__count">{TIPS.length}</span>
			</Button>
			{#each TIP_CATEGORIES as c (c.id)}
				<Button
					size="sm"
					variant={category === c.id ? 'section' : 'ghost'}
					aria-pressed={category === c.id}
					title={c.blurb}
					onclick={() => (category = c.id)}
				>
					{c.label} <span class="filter__count">{counts[c.id]}</span>
				</Button>
			{/each}
		</div>

		<Segmented
			label="Filter by level"
			size="sm"
			value={tier}
			onchange={(v) => (tier = v)}
			options={[
				{ value: 'all' as const, label: 'All levels' },
				...SKILL_TIERS.map((t) => ({ value: t, label: SKILL_LABELS[t] }))
			]}
		/>
	</div>

	<div class="bar">
		<p class="bar__count">
			{results.length}
			{results.length === 1 ? 'tip' : 'tips'}
			{#if activeCategory}<span class="bar__blurb">— {activeCategory.blurb}</span>{/if}
		</p>
		{#if filtering}
			<button class="clear" type="button" onclick={clear}>Clear filters</button>
		{/if}
	</div>

	{#if results.length === 0}
		<p class="empty">
			Nothing in that combination. Every category has beginner and intermediate advice; the advanced
			and expert tiers are thinner, because by then most of what is left is practice rather than
			information.
		</p>
	{:else}
		<div class="tips">
			{#each results as tip (tip.id)}
				<Card padding="md" class="tip">
					<div class="tip__meta">
						<Chip tone="section">{categoryLabel[tip.category]}</Chip>
						<Chip>{SKILL_LABELS[tip.tier]}</Chip>
					</div>
					<h2 class="tip__title">{tip.title}</h2>
					<p class="tip__body">{tip.body}</p>
					{#if tip.alg}
						<div class="tip__alg scroll-x">
							<AlgString alg={tip.alg} size="sm" wrap={false} />
						</div>
					{/if}
				</Card>
			{/each}
		</div>
	{/if}

	<section class="onward">
		<h2>Turning advice into practice</h2>
		<div class="onward__grid">
			<Card href={resolve('/trainer/')} accent>
				<h3>The trainer</h3>
				<p>
					Drills cases in a scrambled context rather than from a solved cube, and schedules the ones
					you keep fumbling to come round more often.
				</p>
			</Card>
			<Card href={resolve('/timer/')} accent>
				<h3>The timer</h3>
				<p>
					Fifteen-second inspection with the spoken warnings, and the averages competitions actually
					use, so an average of twelve means the same thing here as it does there.
				</p>
			</Card>
			<Card href={resolve('/methods/')} accent>
				<h3>Methods compared</h3>
				<p>
					If a plateau turns out to be the method rather than the practice, this is where to find
					out what the alternatives cost.
				</p>
			</Card>
		</div>
	</section>
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

	.note {
		margin-block-start: var(--space-4);
		color: var(--text-faint);
		font-size: var(--step--1);
		line-height: var(--leading-snug);
	}

	.controls {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-4);
		position: sticky;
		top: var(--header-height);
		z-index: 20;
		margin-block-start: var(--space-6);
		padding-block: var(--space-3);
		background: color-mix(in oklab, var(--bg) 92%, transparent);
		backdrop-filter: blur(10px);
	}

	.filter {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-1);
	}

	.filter__count {
		color: color-mix(in oklab, currentColor 65%, transparent);
		font-size: var(--step--2);
		font-variant-numeric: tabular-nums;
	}

	.bar {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		justify-content: space-between;
		gap: var(--space-3);
		margin-block: var(--space-4);
		padding-block-end: var(--space-2);
		border-bottom: var(--border);
	}

	.bar__count {
		color: var(--text);
		font-size: var(--step--1);
		font-weight: 600;
	}

	.bar__blurb {
		color: var(--text-muted);
		font-weight: 400;
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

	.empty {
		max-width: var(--measure);
		padding: var(--space-6) 0;
		color: var(--text-muted);
	}

	.tips {
		display: grid;
		gap: var(--space-4);
		grid-template-columns: repeat(auto-fill, minmax(21rem, 1fr));
		align-items: start;
	}

	.tips :global(.tip) {
		display: grid;
		gap: var(--space-3);
		align-content: start;
	}

	.tip__meta {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
	}

	.tip__title {
		font-size: var(--step-1);
		font-weight: 640;
		line-height: var(--leading-snug);
	}

	.tip__body {
		color: var(--text-muted);
		font-size: var(--step--1);
		line-height: var(--leading-normal);
	}

	.tip__alg {
		padding-block-start: var(--space-3);
		border-top: var(--border);
	}

	.onward {
		margin-block-start: var(--space-8);
	}

	.onward h2 {
		margin-block-end: var(--space-4);
		font-size: var(--step-2);
	}

	.onward__grid {
		display: grid;
		gap: var(--space-4);
		grid-template-columns: repeat(auto-fit, minmax(17rem, 1fr));
	}

	.onward__grid h3 {
		margin-block-end: var(--space-2);
		font-size: var(--step-1);
	}

	.onward__grid p {
		color: var(--text-muted);
		font-size: var(--step--1);
		line-height: var(--leading-snug);
	}
</style>
