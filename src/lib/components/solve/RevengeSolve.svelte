<!--
	The 4×4 page.

	There is no 4×4 solver here, and that is deliberate rather than unfinished: a
	4×4 is solved by *reduction*, and the interesting thing a page can do is tell
	you how far that has got and hand you over to the 3×3 machinery the moment it
	is done. So this reads your puzzle, says which of the three stages it is at,
	and — once the centres are built and the wings paired — reduces it to the
	actual 3×3 it has become and runs the ordinary advice engine on that.

	It also detects parity, and it does so honestly: it reduces the puzzle and
	asks the 3×3 validator whether the result is a cube that could be assembled.
	If the answer is no, that is parity, by definition rather than by guesswork.
-->
<script lang="ts">
	import { resolve } from '$app/paths';
	import Cube3D from '$components/cube/Cube3D.svelte';
	import CubeDiagram from '$components/cube/CubeDiagram.svelte';
	import AlgString from '$components/ui/AlgString.svelte';
	import Button from '$components/ui/Button.svelte';
	import Chip from '$components/ui/Chip.svelte';
	import { puzzle } from '$cube/puzzle';
	import { scrambleFor } from '$cube/puzzleScramble';
	import { apply, tokenise } from '$cube/puzzleState';
	import { readRevenge } from '$cube/revenge';
	import { planSolve } from '$cube/solver/plan';
	import { caseById } from '$data/algorithms';
	import { settings } from '$state/settings.svelte';
	import { SKILL_LABELS, SKILL_TIERS, type SkillTier } from '$data/types';
	import type { Facelets } from '$cube/types';

	const cube = puzzle(4);

	let facelets = $state<Facelets>(cube.solved());
	let scrambleText = $state('');
	let scrambleError = $state('');
	let player = $state<{ play: (alg: string) => Promise<void> } | null>(null);
	let playing = $state(false);

	const tier = $derived(settings.current.skill);
	const reading = $derived(readRevenge(facelets));
	const parityCase = $derived(caseById('revenge-parity-swap'));

	/** Once reduced and legal, the ordinary 3×3 planner takes over. */
	const cubePlan = $derived(
		reading.stage === 'as-a-cube' && reading.cube ? planSolve(reading.cube) : null
	);

	const ordered = $derived.by(() => {
		if (!cubePlan) return [];
		const rank = (t: SkillTier) => Math.abs(SKILL_TIERS.indexOf(t) - SKILL_TIERS.indexOf(tier));
		return [...cubePlan.recommendations].sort((a, b) => rank(a.tier) - rank(b.tier));
	});

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
			scrambleError = `A 4×4 has no move called ${bad}. It has no true middle, so M, E and S mean nothing here — use 2R, 2L and so on for the inner slices.`;
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

	const STAGES = [
		{ id: 'centres', label: 'Build the centres' },
		{ id: 'pairing', label: 'Pair the wings' },
		{ id: 'as-a-cube', label: 'Solve as a 3×3' }
	] as const;

	const stageIndex = $derived(
		reading.stage === 'centres'
			? 0
			: reading.stage === 'pairing'
				? 1
				: reading.stage === 'solved'
					? 3
					: 2
	);
</script>

<div class="layout">
	<section class="stage-panel" aria-label="Your 4×4">
		<Cube3D bind:this={player} bind:facelets order={4} size={300} label="Your 4×4" />

		<div class="scramble">
			<label class="scramble__field">
				<span class="visually-hidden">Scramble to apply</span>
				<input
					type="text"
					bind:value={scrambleText}
					placeholder="Rw U2 2R F' Uw2…"
					spellcheck="false"
					onkeydown={(e) => e.key === 'Enter' && applyTyped()}
				/>
			</label>
			<Button size="sm" variant="section" onclick={applyTyped}>Apply</Button>
			<Button size="sm" variant="ghost" onclick={newScramble}>Random</Button>
			<Button size="sm" variant="ghost" onclick={() => (facelets = cube.solved())}>Reset</Button>
		</div>
		{#if scrambleError}
			<p class="error">{scrambleError}</p>
		{/if}

		<ol class="steps">
			{#each STAGES as step, i (step.id)}
				<li class="step" class:step--done={i < stageIndex} class:step--now={i === stageIndex}>
					<span class="step__dot" aria-hidden="true"></span>
					<span class="step__label">{step.label}</span>
				</li>
			{/each}
		</ol>
	</section>

	<section class="advice" aria-label="What to do next">
		{#if reading.stage === 'solved'}
			<div class="note note--good">
				<h2>Solved</h2>
				<p>Every face one colour. Scramble it and go again.</p>
			</div>
		{:else if reading.stage === 'centres'}
			<div class="note">
				<h2>Build the centres first</h2>
				<p>
					Each face of a 4×4 has four loose middle pieces, and none of them is fixed — there is no
					centre to measure from, so you choose. Pick white for the top and yellow for the bottom,
					build those two blocks, then the other four in pairs of opposite colours.
				</p>
				<p>
					This step has no algorithms worth the name. It is done with wide turns and a slice: bring
					a piece to where you want it, turn the slice to park it, and turn the face back so nothing
					you already built comes apart. Everything you learn here you will use again on a 5×5.
				</p>
			</div>
		{:else if reading.stage === 'pairing'}
			<div class="note">
				<h2>Centres done. Now pair the wings.</h2>
				<p>
					Every edge of a 4×4 is two pieces that want to sit side by side. Bring a matching pair to
					the front-left and front-right, join them with a slice turn, and turn the front face away
					so the joined pair is stored out of harm's way while you fetch the next one.
				</p>
				<p>
					The last two pairs are the awkward ones — there is nowhere left to store anything — and
					that is where the one algorithm of this step comes in. Work the first eight or ten pairs
					by eye first; the pattern becomes obvious well before the theory does.
				</p>
			</div>
		{:else if reading.stage === 'parity'}
			<div class="note note--bad">
				<h2>Parity</h2>
				<p>
					Your puzzle is properly reduced — centres solid, wings paired — but the 3×3 it reduces to
					is not a cube that could be assembled. {reading.parityReason}
				</p>
				<p>
					That is not a mistake you made. A 4×4 has two of each wing piece, so it can finish in
					positions a 3×3 has no way to reach, and no amount of 3×3 technique will get you out. This
					algorithm will, and it leaves your reduction intact.
				</p>
				{#if parityCase}
					<div class="parity">
						<div class="parity__moves scroll-x">
							<AlgString alg={parityCase.algs[0].moves} order={4} size="md" wrap />
						</div>
						<div class="rec__tools">
							<Button
								size="sm"
								variant="ghost"
								onclick={() => run(parityCase.algs[0].moves)}
								disabled={playing}
							>
								{playing ? 'Running…' : 'Watch it'}
							</Button>
							<a class="link" href={resolve('/algorithms/[set]', { set: 'revenge-parity' })}>
								Both versions, and why it happens
							</a>
						</div>
						<p class="parity__note">
							<strong>2R</strong> is the slice one layer in, turned on its own — not
							<strong>Rw</strong>, which drags the face along with it.
						</p>
					</div>
				{/if}
			</div>
		{:else if cubePlan && reading.cube}
			<header class="advice__head">
				<div class="advice__titles">
					<p class="eyebrow">Reduced · {cubePlan.stepName}</p>
					<h2>{cubePlan.stepDescription}</h2>
				</div>
				<CubeDiagram
					facelets={reading.cube}
					view="full"
					size={110}
					label="The 3×3 your 4×4 has become"
				/>
			</header>
			<p class="reduced-note">
				Centres built and wings paired, so from here it is an ordinary 3×3 — and the advice below is
				the ordinary 3×3 advice, worked out on the cube shown above. Wide turns are what you would
				normally think of as slice moves; everything else you already know.
			</p>

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
								<AlgString alg={rec.moves} size="md" wrap />
							</div>
							<div class="rec__tools">
								<Button
									size="sm"
									variant="ghost"
									onclick={() => run(rec.moves!)}
									disabled={playing}
								>
									{playing ? 'Running…' : 'Watch it'}
								</Button>
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

	.error {
		color: var(--danger);
		font-size: var(--step--1);
		max-width: 26rem;
		text-align: center;
	}

	.steps {
		display: grid;
		gap: var(--space-2);
		width: 100%;
		list-style: none;
	}

	.step {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		color: var(--text-faint);
		font-size: var(--step--1);
	}

	.step__dot {
		width: 10px;
		height: 10px;
		border-radius: 50%;
		border: 2px solid var(--hairline-strong);
		flex-shrink: 0;
	}

	.step--done {
		color: var(--text-muted);
	}

	.step--done .step__dot {
		background: var(--positive);
		border-color: var(--positive);
	}

	.step--now {
		color: var(--text);
		font-weight: 600;
	}

	.step--now .step__dot {
		background: var(--section);
		border-color: var(--section);
	}

	.advice {
		display: grid;
		gap: var(--space-4);
	}

	.advice__head {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-4);
		align-items: start;
		justify-content: space-between;
	}

	.advice__titles h2 {
		font-size: var(--step-1);
		line-height: var(--leading-snug);
		max-width: 36ch;
	}

	.eyebrow {
		color: var(--section);
		font-size: var(--step--2);
		font-weight: 700;
		letter-spacing: var(--tracking-caps);
		text-transform: uppercase;
	}

	.reduced-note {
		color: var(--text-muted);
		line-height: var(--leading-normal);
		max-width: var(--measure);
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
		display: grid;
		gap: var(--space-3);
		padding: var(--space-5);
		border: var(--border);
		border-radius: var(--radius-3);
		background: var(--surface-1);
	}

	.note h2 {
		font-size: var(--step-1);
	}

	.note p {
		color: var(--text-muted);
		line-height: var(--leading-normal);
		max-width: var(--measure);
	}

	.note--bad {
		border-inline-start: 3px solid var(--caution);
	}

	.note--good {
		border-inline-start: 3px solid var(--positive);
	}

	.parity {
		display: grid;
		gap: var(--space-3);
		padding: var(--space-4);
		border-radius: var(--radius-2);
		background: var(--surface-2);
	}

	.parity__note {
		font-size: var(--step--1);
	}
</style>
