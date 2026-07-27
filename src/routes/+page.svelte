<script lang="ts">
	import { resolve } from '$app/paths';
	import { onMount } from 'svelte';
	import Wordmark from '$components/layout/Wordmark.svelte';
	import SkillPicker from '$components/layout/SkillPicker.svelte';
	import Cube3D from '$components/cube/Cube3D.svelte';
	import CubeDiagram from '$components/cube/CubeDiagram.svelte';
	import Button from '$components/ui/Button.svelte';
	import Chip from '$components/ui/Chip.svelte';
	import AlgString from '$components/ui/AlgString.svelte';
	import { BRAND, TAGLINE } from '$lib/brand';
	import { NAV } from '$lib/nav';
	import { caseFromAlg, solvedFacelets, stateFromAlg } from '$cube/facelets';
	import { randomScramble } from '$cube/scramble';
	import { algorithmCount, ALL_CASES, casesOfSet } from '$data/algorithms';
	import { settings } from '$state/settings.svelte';
	import { SKILL_LABELS } from '$data/types';

	let hero = $state(solvedFacelets());
	let cube = $state<{ play: (alg: string) => Promise<void> } | null>(null);
	let scramble = $state('');
	let busy = $state(false);

	const caseCount = ALL_CASES.length;
	const algCount = algorithmCount();

	/** A short parade of cases for the strip beneath the hero. */
	const showcase = (
		[
			{ label: 'PLL', alg: "R U R' U' R' F R2 U' R' U' R U R' F'", view: 'pll' },
			{ label: 'OLL', alg: "R U R' U R U2 R'", view: 'oll' },
			{ label: 'OLL', alg: "R U2 R' U' R U' R'", view: 'oll' },
			{ label: 'PLL', alg: 'M2 U M2 U2 M2 U M2', view: 'pll' }
		] as const
	).map((c) => ({ ...c, state: caseFromAlg(c.alg) }));

	const featured = casesOfSet('pll').slice(0, 3);

	onMount(() => {
		// Land on something that looks like a cube mid-solve rather than a solved one.
		scramble = randomScramble({ length: 20 });
		hero = stateFromAlg(scramble);
	});

	async function shuffle() {
		if (busy) return;
		busy = true;
		scramble = randomScramble({ length: 20 });
		hero = solvedFacelets();
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
					<dt>Checked by machine</dt>
					<dd>every one</dd>
				</div>
			</dl>
		</div>

		<div class="hero__cube">
			<Cube3D
				bind:this={cube}
				bind:facelets={hero}
				size={340}
				label="A scrambled cube. Drag it to turn it round."
			/>
			<div class="hero__cube-tools">
				<Button size="sm" variant="ghost" onclick={shuffle} disabled={busy}>
					{busy ? 'Scrambling…' : 'Scramble it'}
				</Button>
				<span class="hero__hint">Drag to turn it round, or use the arrow keys.</span>
			</div>
			{#if scramble}
				<div class="hero__scramble scroll-x">
					<AlgString alg={scramble} size="sm" wrap={false} />
				</div>
			{/if}
		</div>
	</section>

	<section class="showcase" aria-label="Example cases">
		{#each showcase as item (item.alg)}
			<a class="showcase__item" href={resolve('/algorithms')}>
				<CubeDiagram facelets={item.state} view={item.view} size={92} />
				<span class="showcase__label">
					<Chip tone="section">{item.label}</Chip>
					<AlgString alg={item.alg} size="sm" />
				</span>
			</a>
		{/each}
	</section>

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
				of the {algCount} algorithms is executed and checked against what its set claims to do — a PLL
				algorithm must permute the last layer and disturb nothing else, an F2L algorithm must fill its
				slot without breaking the cross. Coverage is checked against the cases the engine enumerates from
				first principles: 57 for OLL, 21 for PLL, 41 for F2L. A mistyped move fails the build rather than
				reaching you.
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
						<CubeDiagram facelets={c.caseState} view="pll" size={104} />
						<figcaption>
							<strong>{c.name}</strong>
							<AlgString alg={c.algs[0].moves} size="sm" count />
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
		display: grid;
		justify-items: center;
		gap: var(--space-3);
		min-width: 0;
	}

	.hero__cube-tools {
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
