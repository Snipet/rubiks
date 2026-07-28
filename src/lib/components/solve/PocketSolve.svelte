<!--
	The 2×2 solver.

	A 2×2 is small enough that the shortest possible solution can always be found,
	so this page can do something the 3×3 page cannot: show you the floor. Every
	tier gets its own answer — the beginner route, the Ortega route, and the
	shortest sequence that exists — and each one is checked against the actual
	state before it is printed.
-->
<script lang="ts">
	import { resolve } from '$app/paths';
	import Cube3D from '$components/cube/Cube3D.svelte';
	import CubeNet from '$components/cube/CubeNet.svelte';
	import AlgString from '$components/ui/AlgString.svelte';
	import Button from '$components/ui/Button.svelte';
	import Chip from '$components/ui/Chip.svelte';
	import Segmented from '$components/ui/Segmented.svelte';
	import { puzzle } from '$cube/puzzle';
	import { faceletsToPocket, PocketDecodeError } from '$cube/pocket';
	import { scrambleFor } from '$cube/puzzleScramble';
	import {
		anchors,
		apply,
		blank,
		clone,
		countUnset,
		colorCounts,
		reorientToStandard,
		tokenise
	} from '$cube/puzzleState';
	import { planPocket } from '$cube/solver/pocketPlan';
	import { settings } from '$state/settings.svelte';
	import { SKILL_LABELS, SKILL_TIERS, type SkillTier } from '$data/types';
	import type { Facelets } from '$cube/types';

	const cube = puzzle(2);

	let facelets = $state<Facelets>(cube.solved());
	let mode = $state<'scramble' | 'paint'>('scramble');
	let view = $state<'cube' | 'net'>('cube');
	let brush = $state(0);
	let scrambleText = $state('');
	let scrambleError = $state('');
	let player = $state<{ play: (alg: string) => Promise<void> } | null>(null);
	let playing = $state(false);

	const fixed = anchors(cube);
	const tier = $derived(settings.current.skill);

	/**
	 * The reading, or the reason there isn't one.
	 *
	 * A half-painted puzzle is not an error, it is an unfinished job, so those two
	 * are reported differently: one asks you to keep going, the other says what
	 * you have described could not be assembled.
	 */
	const reading = $derived.by(() => {
		const unset = countUnset(cube, facelets);
		if (unset > 0) return { kind: 'incomplete' as const, unset };
		const counts = colorCounts(cube, facelets);
		const wrong = counts.findIndex((n) => n !== 4);
		if (wrong >= 0) {
			return {
				kind: 'invalid' as const,
				message: `Every colour needs exactly four stickers, and one of them has ${counts[wrong]}.`
			};
		}
		const home = reorientToStandard(cube, facelets);
		if (!home) {
			return {
				kind: 'invalid' as const,
				message:
					'The corner at the back-bottom-left has to stay where it is; nothing lines up against it.'
			};
		}
		try {
			return { kind: 'ok' as const, plan: planPocket(faceletsToPocket(home)) };
		} catch (error) {
			return {
				kind: 'invalid' as const,
				message:
					error instanceof PocketDecodeError
						? error.message
						: 'That is not a puzzle that could be put together.'
			};
		}
	});

	/** Recommendations with the reader's own level first. */
	const ordered = $derived.by(() => {
		if (reading.kind !== 'ok') return [];
		const rank = (t: SkillTier) => Math.abs(SKILL_TIERS.indexOf(t) - SKILL_TIERS.indexOf(tier));
		return [...reading.plan.recommendations].sort((a, b) => rank(a.tier) - rank(b.tier));
	});

	function paint(index: number) {
		if (fixed.has(index)) return;
		const next = clone(facelets);
		next[index] = brush;
		facelets = next;
	}

	function newScramble() {
		const alg = scrambleFor(cube);
		scrambleText = alg;
		scrambleError = '';
		facelets = apply(cube, cube.solved(), tokenise(alg));
	}

	function applyTyped() {
		const names = tokenise(scrambleText);
		const bad = names.find((n) => cube.parse(n) === null);
		if (bad) {
			scrambleError = `A 2×2 has no move called ${bad}. It turns U, R and F — and D, L and B, which do the same thing from the other side.`;
			return;
		}
		scrambleError = '';
		facelets = apply(cube, cube.solved(), names);
	}

	async function run(moves: string) {
		if (playing || !player) return;
		playing = true;
		await player.play(moves);
		playing = false;
	}

	const PALETTE = [
		{ value: 0, name: 'Up' },
		{ value: 1, name: 'Right' },
		{ value: 2, name: 'Front' },
		{ value: 3, name: 'Down' },
		{ value: 4, name: 'Left' },
		{ value: 5, name: 'Back' }
	];
	const SWATCH = [
		'var(--sticker-u)',
		'var(--sticker-r)',
		'var(--sticker-f)',
		'var(--sticker-d)',
		'var(--sticker-l)',
		'var(--sticker-b)'
	];
</script>

<div class="layout">
	<section class="stage-panel" aria-label="Your 2×2">
		<div class="toolbar">
			<Segmented
				label="What to do"
				size="sm"
				value={mode}
				onchange={(v) => (mode = v)}
				options={[
					{ value: 'scramble' as const, label: 'Scramble' },
					{ value: 'paint' as const, label: 'Paint stickers' }
				]}
			/>
			<Segmented
				label="View"
				size="sm"
				value={view}
				onchange={(v) => (view = v)}
				options={[
					{ value: 'cube' as const, label: '3D' },
					{ value: 'net' as const, label: 'Flat' }
				]}
			/>
		</div>

		<div class="stage">
			{#if view === 'cube'}
				<Cube3D
					bind:this={player}
					bind:facelets
					order={2}
					size={300}
					onsticker={mode === 'paint' ? paint : undefined}
					label="Your 2×2"
				/>
			{:else}
				<CubeNet {facelets} order={2} onpaint={mode === 'paint' ? paint : undefined} size={360} />
			{/if}
		</div>

		{#if mode === 'paint'}
			<div class="palette" role="radiogroup" aria-label="Sticker colour">
				{#each PALETTE as swatch (swatch.value)}
					<button
						type="button"
						role="radio"
						aria-checked={brush === swatch.value}
						class="swatch"
						class:swatch--on={brush === swatch.value}
						style:background={SWATCH[swatch.value]}
						onclick={() => (brush = swatch.value)}
					>
						<span class="visually-hidden">{swatch.name} colour</span>
					</button>
				{/each}
				<Button size="sm" variant="ghost" onclick={() => (facelets = blank(cube))}>Clear</Button>
				<Button size="sm" variant="ghost" onclick={() => (facelets = cube.solved())}>Solved</Button>
			</div>
			<p class="hint">
				The three stickers of the back-bottom-left corner are fixed. A 2×2 has no centres, so
				something has to stand still or there is no way to say which colour belongs where.
			</p>
		{:else}
			<div class="scramble">
				<label class="scramble__field">
					<span class="visually-hidden">Scramble to apply</span>
					<input
						type="text"
						bind:value={scrambleText}
						placeholder="R U2 F' R2 U…"
						spellcheck="false"
						onkeydown={(e) => e.key === 'Enter' && applyTyped()}
					/>
				</label>
				<Button size="sm" variant="section" onclick={applyTyped}>Apply</Button>
				<Button size="sm" variant="ghost" onclick={newScramble}>Random</Button>
			</div>
			{#if scrambleError}
				<p class="error">{scrambleError}</p>
			{/if}
		{/if}
	</section>

	<section class="advice" aria-label="What to do next">
		{#if reading.kind === 'incomplete'}
			<div class="note">
				<h2>Keep going</h2>
				<p>
					{reading.unset}
					{reading.unset === 1 ? 'sticker' : 'stickers'} still to colour in. Pick a colour and click the
					stickers that match your real puzzle.
				</p>
			</div>
		{:else if reading.kind === 'invalid'}
			<div class="note note--bad">
				<h2>That puzzle could not exist</h2>
				<p>{reading.message}</p>
			</div>
		{:else if reading.plan.stage === 'solved'}
			<div class="note note--good">
				<h2>Solved</h2>
				<p>Nothing left to do. Scramble it and go again.</p>
			</div>
		{:else}
			{@const plan = reading.plan}
			<header class="advice__head">
				<div class="advice__titles">
					<p class="eyebrow">{plan.stepName}</p>
					<h2>{plan.stepDescription}</h2>
				</div>
				<Chip tone="section" size="md">{plan.optimalLength} moves from solved</Chip>
			</header>

			<div class="bar" aria-hidden="true">
				<div class="bar__fill" style:width="{Math.round(plan.progress * 100)}%"></div>
			</div>

			<ol class="recs">
				{#each ordered as rec, i (rec.tier + rec.title + i)}
					<li class="rec" class:rec--lead={i === 0}>
						<div class="rec__head">
							<Chip tone={rec.tier === tier ? 'section' : 'neutral'} size="sm">
								{SKILL_LABELS[rec.tier]}
							</Chip>
							<h3>{rec.title}</h3>
						</div>
						<p class="rec__detail">{rec.detail}</p>
						{#if rec.moves}
							<div class="rec__moves scroll-x">
								<AlgString alg={rec.moves} order={2} size="md" wrap />
							</div>
							<div class="rec__tools">
								{#if view === 'cube'}
									<Button
										size="sm"
										variant="ghost"
										onclick={() => run(rec.moves!)}
										disabled={playing}
									>
										{playing ? 'Running…' : 'Watch it'}
									</Button>
								{/if}
								{#if rec.caseId}
									<a
										class="link"
										href={resolve('/algorithms/[set]', { set: rec.setId ?? 'pocket-oll' })}
									>
										See the full entry
									</a>
								{:else if rec.setId}
									<a class="link" href={resolve('/algorithms/[set]', { set: rec.setId })}>
										See the set
									</a>
								{/if}
							</div>
						{/if}
					</li>
				{/each}
			</ol>
		{/if}
	</section>
</div>

<style>
	.layout {
		display: grid;
		gap: var(--space-6);
		grid-template-columns: minmax(0, 1fr);
		align-items: start;
	}

	@media (min-width: 60rem) {
		.layout {
			grid-template-columns: minmax(0, 22rem) minmax(0, 1fr);
		}
	}

	.stage-panel {
		display: grid;
		gap: var(--space-4);
		justify-items: center;
		padding: var(--space-5);
		border: var(--border);
		border-radius: var(--radius-4);
		background: var(--surface-1);
	}

	.toolbar {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-3);
		justify-content: center;
	}

	.stage {
		display: grid;
		place-items: center;
		min-height: 20rem;
	}

	.palette {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
		align-items: center;
		justify-content: center;
	}

	.swatch {
		width: 2rem;
		height: 2rem;
		border-radius: var(--radius-1);
		border: 2px solid transparent;
		box-shadow: inset 0 0 0 1px rgb(0 0 0 / 0.3);
	}

	.swatch--on {
		border-color: var(--accent);
		transform: scale(1.1);
	}

	.hint,
	.error {
		max-width: 26rem;
		color: var(--text-muted);
		font-size: var(--step--1);
		line-height: var(--leading-snug);
		text-align: center;
	}

	.error {
		color: var(--danger);
	}

	.scramble {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
		align-items: center;
		justify-content: center;
		width: 100%;
	}

	.scramble__field {
		flex: 1 1 12rem;
	}

	.scramble__field input {
		width: 100%;
		padding: var(--space-2) var(--space-3);
		border: var(--border);
		border-radius: var(--radius-2);
		background: var(--surface-2);
		color: var(--text);
		font-family: var(--font-mono);
		font-size: var(--step--1);
	}

	.advice {
		display: grid;
		gap: var(--space-4);
	}

	.advice__head {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-3);
		align-items: start;
		justify-content: space-between;
	}

	.advice__titles h2 {
		font-size: var(--step-1);
		line-height: var(--leading-snug);
		max-width: 40ch;
	}

	.eyebrow {
		color: var(--section);
		font-size: var(--step--2);
		font-weight: 700;
		letter-spacing: var(--tracking-caps);
		text-transform: uppercase;
	}

	.bar {
		height: 4px;
		border-radius: 2px;
		background: var(--surface-3);
		overflow: hidden;
	}

	.bar__fill {
		height: 100%;
		background: var(--section);
		transition: width var(--dur-mid) var(--ease-out);
	}

	.recs {
		display: grid;
		gap: var(--space-3);
		list-style: none;
	}

	.rec {
		display: grid;
		gap: var(--space-2);
		padding: var(--space-4);
		border: var(--border);
		border-radius: var(--radius-3);
		background: var(--surface-1);
	}

	.rec--lead {
		border-color: var(--section-edge);
		background: var(--section-wash);
	}

	.rec__head {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
		align-items: center;
	}

	.rec__head h3 {
		font-size: var(--step-0);
	}

	.rec__detail {
		color: var(--text-muted);
		line-height: var(--leading-normal);
		max-width: var(--measure);
	}

	.rec__tools {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-3);
		align-items: center;
	}

	.link {
		color: var(--section);
		font-size: var(--step--1);
		font-weight: 600;
	}

	.note {
		padding: var(--space-5);
		border: var(--border);
		border-radius: var(--radius-3);
		background: var(--surface-1);
	}

	.note h2 {
		font-size: var(--step-1);
		margin-block-end: var(--space-2);
	}

	.note p {
		color: var(--text-muted);
		line-height: var(--leading-normal);
		max-width: var(--measure);
	}

	.note--bad {
		border-inline-start: 3px solid var(--danger);
	}

	.note--good {
		border-inline-start: 3px solid var(--positive);
	}
</style>
