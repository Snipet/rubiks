<script lang="ts">
	import { resolve } from '$app/paths';
	import { untrack } from 'svelte';
	import Wordmark from '$components/layout/Wordmark.svelte';
	import SkillPicker from '$components/layout/SkillPicker.svelte';
	import Cube3D from '$components/cube/Cube3D.svelte';
	import CubeDiagram from '$components/cube/CubeDiagram.svelte';
	import Button from '$components/ui/Button.svelte';
	import Chip from '$components/ui/Chip.svelte';
	import AlgString from '$components/ui/AlgString.svelte';
	import { BRAND, TAGLINE } from '$lib/brand';
	import { NAV } from '$lib/nav';
	import { puzzle, type PuzzleSize } from '$cube/puzzle';
	import { scrambleFor } from '$cube/puzzleScramble';
	import { apply, tokenise } from '$cube/puzzleState';
	import { ALG_SETS, RESOLVED_CASES } from '$data/algorithms';
	import { PUZZLE_LABELS, settings } from '$state/settings.svelte';
	import { SKILL_LABELS, type ResolvedAlgCase } from '$data/types';
	import type { Facelets } from '$cube/types';

	const order = $derived(settings.current.puzzle);

	// Everything counted and shown on this page is the current puzzle's. Showing
	// a 3×3 while the header says 2×2 is the one thing the mode switch must never
	// do, so nothing here is hard-coded to three.
	const setsForPuzzle = $derived(ALG_SETS.filter((s) => (s.puzzle ?? 3) === order));
	const puzzleCases = $derived.by(() => {
		const ids = new Set(setsForPuzzle.map((s) => s.id));
		return RESOLVED_CASES.filter((c) => ids.has(c.set));
	});
	const caseCount = $derived(puzzleCases.length);
	const algCount = $derived(puzzleCases.reduce((n, c) => n + c.algs.length, 0));

	/**
	 * Hero scramble lengths.
	 *
	 * Shorter than a competition scramble on purpose: the button animates every
	 * turn, and a full 44-move 4×4 scramble would take eleven seconds to watch.
	 * The cube only has to *look* scrambled.
	 */
	const HERO_LENGTH: Record<PuzzleSize, number> = { 2: 9, 3: 20, 4: 24, 5: 30 };

	let hero = $state<Facelets>(puzzle(3).solved());
	let cube = $state<{ play: (alg: string) => Promise<void> } | null>(null);
	let scramble = $state('');
	let busy = $state(false);

	/**
	 * Land on something that looks like a cube mid-solve rather than a solved one,
	 * and start again whenever the puzzle changes.
	 *
	 * Only `order` is read reactively — `untrack` keeps the scramble it writes
	 * from feeding back in — and the server renders a solved 3×3 with no scramble
	 * text, so the prerendered HTML is stable.
	 */
	$effect(() => {
		const size = order;
		untrack(() => {
			const p = puzzle(size);
			const alg = scrambleFor(p, { length: HERO_LENGTH[size] });
			scramble = alg;
			hero = apply(p, p.solved(), tokenise(alg));
		});
	});

	/**
	 * Cases grouped by set, best-looking sets first.
	 *
	 * The flat last-layer diagram is the one that reads at ninety-two pixels: it
	 * fills its square and the case is legible. The isometric views used for F2L
	 * and cross cases shrink to a thumbnail of a whole cube, which next to a flat
	 * one looks like a mistake. So the shop window prefers flat sets, and falls
	 * back to the rest only when a puzzle has nothing else — which is the 4×4,
	 * whose one set is drawn in full colour.
	 */
	const FLAT_VIEWS = ['oll', 'pll', 'last-layer'];
	const groupedSets = $derived(
		setsForPuzzle
			.map((set) => ({ set, cases: puzzleCases.filter((c) => c.set === set.id) }))
			.filter((group) => group.cases.length > 0)
			.sort(
				(a, b) => Number(FLAT_VIEWS.includes(b.set.view)) - Number(FLAT_VIEWS.includes(a.set.view))
			)
	);

	/** A short parade of cases for the strip beneath the hero, one per set. */
	const showcase = $derived.by(() => {
		const out: ResolvedAlgCase[] = [];
		// Sets legitimately share algorithms — a 2×2 PBL case with the bottom layer
		// already done *is* the 2×2 PLL case — but the same moves printed twice in
		// a four-item row reads as a bug rather than as a connection. A plain array
		// rather than a Set: this one is scratch state inside a derivation, never
		// read reactively, and the lint rule cannot tell the difference.
		const seen: string[] = [];
		// Round-robin, so a set with fifty-seven cases cannot crowd out the rest.
		for (let depth = 0; out.length < 4; depth++) {
			const before = out.length;
			for (const group of groupedSets) {
				if (out.length >= 4) break;
				const entry = group.cases[depth];
				if (!entry || seen.includes(entry.algs[0].moves)) continue;
				seen.push(entry.algs[0].moves);
				out.push(entry);
			}
			if (out.length === before) break;
		}
		return out;
	});

	/** Three more from the biggest of those sets, beside the promise. */
	const featured = $derived.by(() => {
		const shown = new Set(showcase.map((c) => c.id));
		const biggest = [...groupedSets].sort((a, b) => b.cases.length - a.cases.length)[0];
		return (biggest?.cases ?? []).filter((c) => !shown.has(c.id)).slice(0, 3);
	});

	/**
	 * What coverage means for this puzzle, stated in its own numbers rather than
	 * the 3×3's. A claim that is right for one size and wrong for another is worse
	 * than no claim at all.
	 */
	const coverage = $derived(
		order === 3
			? 'Coverage is checked against the cases the engine enumerates from first principles: 57 for OLL, 21 for PLL, 41 for F2L.'
			: order === 2
				? 'Coverage is checked against the cases the engine enumerates from first principles — all seven ways the top of a 2×2 can be twisted, each with exactly one algorithm.'
				: 'Each parity algorithm is measured sticker by sticker: it has to move wing pieces and nothing else, leave the puzzle still reduced, and produce a 3×3 that genuinely could not be assembled.'
	);

	async function shuffle() {
		if (busy) return;
		busy = true;
		const p = puzzle(order);
		scramble = scrambleFor(p, { length: HERO_LENGTH[order] });
		hero = p.solved();
		await cube?.play(scramble);
		busy = false;
	}
</script>

<svelte:head>
	<title>{BRAND}</title>
	<meta name="description" content={TAGLINE} />
</svelte:head>

<div class="page page--wide">
	<section class="hero">
		<div class="hero__copy">
			<p class="eyebrow">Rubik's Cube, properly explained</p>
			<h1 class="hero__title"><Wordmark size="lg" sectioned /></h1>
			<p class="hero__lede">{TAGLINE}</p>

			<div class="hero__actions">
				<Button variant="primary" size="lg" href={resolve('/learn')}>Start learning</Button>
				<Button variant="secondary" size="lg" href={resolve('/solve')}>
					I have a cube in front of me
				</Button>
			</div>

			<dl class="stats">
				<div>
					<dt>Cases</dt>
					<dd>{caseCount}</dd>
				</div>
				<div>
					<dt>Algorithms</dt>
					<dd>{algCount}</dd>
				</div>
				<div>
					<dt>Puzzle</dt>
					<dd>{PUZZLE_LABELS[order]}</dd>
				</div>
			</dl>
		</div>

		<div class="hero__cube">
			<Cube3D
				bind:this={cube}
				bind:facelets={hero}
				{order}
				size={340}
				label="A scrambled {PUZZLE_LABELS[order]}. Drag it to turn it round."
			/>
			<div class="hero__cube-tools">
				<Button size="sm" variant="ghost" onclick={shuffle} disabled={busy}>
					{busy ? 'Scrambling…' : 'Scramble it'}
				</Button>
				<span class="hero__hint">Drag to turn it round, or use the arrow keys.</span>
			</div>
			{#if scramble}
				<div class="hero__scramble scroll-x">
					<AlgString alg={scramble} {order} size="sm" wrap={false} />
				</div>
			{/if}
		</div>
	</section>

	{#if showcase.length > 0}
		<section class="showcase" aria-label="Example cases">
			{#each showcase as item (item.id)}
				<a class="showcase__item" href={resolve('/algorithms/[set]', { set: item.set })}>
					<CubeDiagram facelets={item.caseState} {order} view={item.set_.view} size={92} />
					<span class="showcase__label">
						<Chip tone="section">{item.set_.shortName}</Chip>
						<AlgString alg={item.algs[0].moves} {order} size="sm" />
					</span>
				</a>
			{/each}
		</section>
	{/if}

	<section class="where">
		<div class="where__intro">
			<h2>Where are you with the cube?</h2>
			<p>
				This changes what the whole site shows you — which recommendation leads on the solve page,
				which algorithm variant appears first, and how much a lesson stops to explain. You are on
				<strong>{SKILL_LABELS[settings.current.skill]}</strong> at the moment, and you can move it any
				time from the header.
			</p>
		</div>
		<SkillPicker />
	</section>

	<section class="sections" aria-label="Sections">
		{#each NAV as item (item.id)}
			<a class="section-card" data-section={item.id} href={resolve(item.href)}>
				<span class="section-card__swatch" aria-hidden="true"></span>
				<span class="section-card__label">{item.label}</span>
				<span class="section-card__blurb">{item.blurb}</span>
				<span class="section-card__go" aria-hidden="true">→</span>
			</a>
		{/each}
	</section>

	<section class="promise">
		<div class="promise__text">
			<p class="eyebrow">Why trust the algorithms here</p>
			<h2>Every algorithm is run on a real cube engine before it reaches this page.</h2>
			<p>
				Algorithm lists on the web get copied from one another, and mistakes propagate. Here, each
				of the {algCount}
				{PUZZLE_LABELS[order]} algorithms is executed and checked against what its set claims to do —
				a last-layer algorithm must permute the last layer and disturb nothing else, an F2L algorithm
				must fill its slot without breaking the cross. {coverage} A mistyped move fails the build rather
				than reaching you.
			</p>
			<p>
				Case diagrams are computed from the algorithm rather than drawn alongside it, so a picture
				cannot disagree with its moves.
			</p>
			<Button variant="secondary" href={resolve('/about')}>How the checking works</Button>
		</div>

		{#if featured.length > 0}
			<div class="promise__demo">
				{#each featured as c (c.id)}
					<figure class="demo">
						<CubeDiagram facelets={c.caseState} {order} view={c.set_.view} size={104} />
						<figcaption>
							<strong>{c.name}</strong>
							<AlgString alg={c.algs[0].moves} {order} size="sm" count />
						</figcaption>
					</figure>
				{/each}
			</div>
		{/if}
	</section>
</div>

<style>
	.hero {
		display: grid;
		gap: var(--space-7);
		align-items: center;
		padding-block: var(--space-6) var(--space-8);
		grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr);
	}

	.hero__title {
		margin-block: var(--space-3) var(--space-4);
		font-size: inherit;
	}

	.hero__lede {
		max-width: 46ch;
		color: var(--text-muted);
		font-size: var(--step-1);
		line-height: var(--leading-snug);
	}

	.hero__actions {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-3);
		margin-block-start: var(--space-6);
	}

	.stats {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-6);
		margin-block-start: var(--space-7);
		padding-block-start: var(--space-5);
		border-top: var(--border);
	}

	.stats dt {
		color: var(--text-faint);
		font-size: var(--step--2);
		letter-spacing: var(--tracking-caps);
		text-transform: uppercase;
	}

	.stats dd {
		color: var(--text);
		font-size: var(--step-2);
		font-weight: 650;
		font-variant-numeric: tabular-nums;
	}

	.hero__cube {
		--hero-cube: 340px;
		display: grid;
		justify-items: center;
		gap: var(--space-3);
		min-width: 0;
	}

	.hero__cube-tools {
		/*
		 * The cube is drawn in perspective and tilted, so it spills well outside the
		 * square its scene element reserves — measured at 90px below a 340px box at
		 * the default angle. The scene cannot know that (its contents are absolutely
		 * positioned around a zero-sized origin), so the hero reserves the room here
		 * instead. Without it the cube sits on top of these controls.
		 */
		margin-block-start: calc(var(--hero-cube) * 0.29);
		display: flex;
		align-items: center;
		gap: var(--space-3);
		flex-wrap: wrap;
		justify-content: center;
	}

	.hero__hint {
		color: var(--text-faint);
		font-size: var(--step--2);
	}

	.hero__scramble {
		max-width: 100%;
		padding: var(--space-2) var(--space-3);
		border: var(--border);
		border-radius: var(--radius-2);
		background: var(--surface-1);
	}

	.showcase {
		display: grid;
		gap: var(--space-3);
		grid-template-columns: repeat(auto-fit, minmax(11rem, 1fr));
		padding-block: var(--space-5);
		border-block: var(--border);
	}

	.showcase__item {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-3);
		border-radius: var(--radius-2);
		text-decoration: none;
		color: inherit;
		transition: background var(--dur-fast) var(--ease-out);
	}

	.showcase__item:hover {
		background: var(--surface-2);
	}

	.showcase__label {
		display: grid;
		gap: var(--space-2);
		justify-items: start;
		min-width: 0;
	}

	.where {
		display: grid;
		gap: var(--space-5);
		padding-block: var(--space-8);
	}

	.where__intro p {
		max-width: var(--measure);
		margin-block-start: var(--space-3);
		color: var(--text-muted);
	}

	.sections {
		display: grid;
		gap: var(--space-4);
		grid-template-columns: repeat(auto-fit, minmax(17rem, 1fr));
		padding-block-end: var(--space-8);
	}

	.section-card {
		position: relative;
		display: grid;
		gap: var(--space-2);
		padding: var(--space-5);
		background: var(--surface-1);
		border: var(--border);
		border-radius: var(--radius-3);
		text-decoration: none;
		color: inherit;
		overflow: hidden;
		transition:
			border-color var(--dur-fast) var(--ease-out),
			transform var(--dur-fast) var(--ease-out);
	}

	.section-card:hover {
		border-color: var(--section);
		transform: translateY(-2px);
	}

	.section-card__swatch {
		width: 2rem;
		height: 0.4rem;
		border-radius: var(--radius-pill);
		background: var(--section);
	}

	.section-card__label {
		font-size: var(--step-1);
		font-weight: 650;
	}

	.section-card__blurb {
		color: var(--text-muted);
		font-size: var(--step--1);
		line-height: var(--leading-snug);
	}

	.section-card__go {
		position: absolute;
		top: var(--space-4);
		inset-inline-end: var(--space-4);
		color: var(--section);
		opacity: 0;
		transform: translateX(-4px);
		transition:
			opacity var(--dur-fast) var(--ease-out),
			transform var(--dur-fast) var(--ease-out);
	}

	.section-card:hover .section-card__go {
		opacity: 1;
		transform: translateX(0);
	}

	.promise {
		display: grid;
		gap: var(--space-7);
		grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.8fr);
		align-items: start;
		padding: var(--space-7);
		background: var(--surface-1);
		border: var(--border);
		border-radius: var(--radius-4);
	}

	.promise__text h2 {
		margin-block: var(--space-3) var(--space-4);
		max-width: 24ch;
		font-size: var(--step-2);
	}

	.promise__text p {
		max-width: var(--measure);
		margin-block-end: var(--space-4);
		color: var(--text-muted);
	}

	.promise__demo {
		display: grid;
		gap: var(--space-4);
	}

	.demo {
		display: flex;
		align-items: center;
		gap: var(--space-4);
		padding: var(--space-3);
		background: var(--surface-2);
		border-radius: var(--radius-2);
	}

	.demo figcaption {
		display: grid;
		gap: var(--space-2);
		min-width: 0;
	}

	@media (max-width: 62rem) {
		.hero,
		.promise {
			grid-template-columns: minmax(0, 1fr);
		}

		.hero__cube {
			order: -1;
		}
	}
</style>
