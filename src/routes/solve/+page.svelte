<script lang="ts">
	import { resolve } from '$app/paths';
	import Cube3D from '$components/cube/Cube3D.svelte';
	import CubeNet from '$components/cube/CubeNet.svelte';
	import Button from '$components/ui/Button.svelte';
	import Chip from '$components/ui/Chip.svelte';
	import Segmented from '$components/ui/Segmented.svelte';
	import AlgString from '$components/ui/AlgString.svelte';
	import { pageTitle } from '$lib/brand';
	import {
		applyAlg,
		blankFacelets,
		cloneFacelets,
		countUnset,
		faceletsToString,
		solvedFacelets,
		stateFromAlg,
		UNSET
	} from '$cube/facelets';
	import { CENTER_FACELETS } from '$cube/types';
	import { validateFacelets } from '$cube/validate';
	import { randomScramble } from '$cube/scramble';
	import { NotationError, parseAlg } from '$cube/moves';
	import { planSolve, solveFully } from '$cube/solver/plan';
	import PocketSolve from '$components/solve/PocketSolve.svelte';
	import RevengeSolve from '$components/solve/RevengeSolve.svelte';
	import { PUZZLE_LABELS, settings } from '$state/settings.svelte';
	import { SKILL_LABELS, SKILL_TIERS, type SkillTier } from '$data/types';

	type Mode = 'paint' | 'scramble';
	type View = 'cube' | 'net';

	let facelets = $state(solvedFacelets());
	let mode = $state<Mode>('scramble');
	let view = $state<View>('cube');
	let brush = $state<number>(0);
	let cube = $state<{ play: (alg: string) => Promise<void> } | null>(null);
	let scrambleText = $state('');
	let scrambleError = $state('');
	let playing = $state(false);
	let history = $state<Uint8Array[]>([]);
	let showFullSolve = $state(false);

	const order = $derived(settings.current.puzzle);
	const validation = $derived(validateFacelets(facelets));
	const plan = $derived(validation.ok ? planSolve(facelets) : null);
	const tier = $derived(settings.current.skill);

	/** Recommendations reordered so the reader's own level comes first. */
	const ordered = $derived.by(() => {
		if (!plan) return [];
		const rank = (t: SkillTier) => Math.abs(SKILL_TIERS.indexOf(t) - SKILL_TIERS.indexOf(tier));
		return [...plan.recommendations].sort((a, b) => rank(a.tier) - rank(b.tier));
	});

	const fullSolve = $derived(
		showFullSolve && validation.ok && plan && !plan.analysis.solved
			? solveFully(facelets, tier)
			: null
	);

	const problemStickers = $derived(validation.issues.flatMap((i) => i.facelets ?? []));

	/** The next sticker awaiting a colour, for guided entry. */
	const cursor = $derived.by(() => {
		if (mode !== 'paint') return undefined;
		for (let i = 0; i < 54; i++) if (facelets[i] === UNSET) return i;
		return undefined;
	});

	function remember() {
		history = [...history.slice(-24), cloneFacelets(facelets)];
	}

	function undo() {
		const previous = history[history.length - 1];
		if (!previous) return;
		facelets = previous;
		history = history.slice(0, -1);
	}

	function paint(index: number) {
		if (CENTER_FACELETS.includes(index)) return;
		remember();
		const next = cloneFacelets(facelets);
		next[index] = brush;
		facelets = next;
	}

	function reset(to: 'solved' | 'blank') {
		remember();
		facelets = to === 'solved' ? solvedFacelets() : blankFacelets();
		scrambleText = '';
		scrambleError = '';
	}

	function randomise() {
		remember();
		scrambleText = randomScramble({ length: 20 });
		scrambleError = '';
		facelets = stateFromAlg(scrambleText);
	}

	function applyScramble() {
		scrambleError = '';
		if (!scrambleText.trim()) return;
		try {
			parseAlg(scrambleText);
		} catch (err) {
			scrambleError =
				err instanceof NotationError ? err.message : 'That does not read as a sequence of moves.';
			return;
		}
		remember();
		facelets = stateFromAlg(scrambleText);
	}

	async function perform(moves: string) {
		if (playing) return;
		playing = true;
		remember();
		if (view === 'cube' && cube) await cube.play(moves);
		else facelets = applyAlg(facelets, moves);
		playing = false;
	}

	const PALETTE: { value: number; label: string }[] = [
		{ value: 0, label: 'White' },
		{ value: 1, label: 'Red' },
		{ value: 2, label: 'Green' },
		{ value: 3, label: 'Yellow' },
		{ value: 4, label: 'Orange' },
		{ value: 5, label: 'Blue' },
		{ value: UNSET, label: 'Erase' }
	];

	const SWATCH: Record<number, string> = {
		0: 'var(--sticker-u)',
		1: 'var(--sticker-r)',
		2: 'var(--sticker-f)',
		3: 'var(--sticker-d)',
		4: 'var(--sticker-l)',
		5: 'var(--sticker-b)'
	};
</script>

<svelte:head>
	<title>{pageTitle('solve')}</title>
	<meta
		name="description"
		content="Type in the cube in your hands and get step-by-step advice pitched at your level."
	/>
</svelte:head>

<div class="page page--wide">
	<header class="head">
		<p class="eyebrow">Solve · {PUZZLE_LABELS[order]}</p>
		<h1>
			{order === 4
				? 'How far has this 4×4 got?'
				: `What should I do with this ${PUZZLE_LABELS[order]}?`}
		</h1>
		<p class="lede">
			{#if order === 4}
				Type your scramble, or turn the puzzle here, and this page will tell you which stage of the
				reduction you are at — and the moment the centres are built and the wings paired, it reads
				off the 3×3 your puzzle has become and hands you the ordinary 3×3 advice. Nothing is sent
				anywhere; all of this runs in your browser.
			{:else}
				Set the puzzle below to match the one in your hands — paint the stickers, or type the
				scramble you used — and you will get advice for where you actually are, at the level you are
				actually at. Nothing is sent anywhere; all of this runs in your browser.
			{/if}
		</p>
	</header>

	{#if order === 2}
		<PocketSolve />
	{:else if order === 4}
		<RevengeSolve />
	{:else}
		<div class="layout">
			<!-- ── input ─────────────────────────────────────────────────────── -->
			<section class="panel" aria-label="Cube input">
				<div class="panel__bar">
					<Segmented
						label="How to enter the cube"
						value={mode}
						onchange={(v) => (mode = v)}
						options={[
							{ value: 'scramble', label: 'From a scramble' },
							{ value: 'paint', label: 'Paint the stickers' }
						]}
					/>
					<Segmented
						label="View"
						size="sm"
						value={view}
						onchange={(v) => (view = v)}
						options={[
							{ value: 'cube', label: '3D' },
							{ value: 'net', label: 'Flat' }
						]}
					/>
				</div>

				<div class="stage">
					{#if view === 'cube'}
						<Cube3D
							bind:this={cube}
							bind:facelets
							size={320}
							onsticker={mode === 'paint' ? paint : undefined}
							highlight={problemStickers}
							label="Your cube"
						/>
					{:else}
						<CubeNet
							{facelets}
							onpaint={mode === 'paint' ? paint : undefined}
							highlight={problemStickers}
							{cursor}
							size={380}
						/>
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
								class:swatch--erase={swatch.value === UNSET}
								style:background={swatch.value === UNSET ? 'transparent' : SWATCH[swatch.value]}
								title={swatch.label}
								onclick={() => (brush = swatch.value)}
							>
								<span class="visually-hidden">{swatch.label}</span>
								{#if swatch.value === UNSET}
									<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
										<path
											d="M5 19 19 5M5 5l14 14"
											stroke="currentColor"
											stroke-width="2"
											stroke-linecap="round"
										/>
									</svg>
								{/if}
							</button>
						{/each}
						<p class="palette__hint">
							Pick a colour, then click stickers — or hold and sweep across several. The centres are
							fixed, because they are what define the colour scheme.
						</p>
					</div>
				{:else}
					<div class="scramble">
						<label class="scramble__label" for="scramble-input">
							Scramble applied to a solved cube
						</label>
						<div class="scramble__row">
							<input
								id="scramble-input"
								class="scramble__input"
								type="text"
								spellcheck="false"
								autocomplete="off"
								placeholder="R U R' U' F2 L D2 …"
								bind:value={scrambleText}
								onkeydown={(e) => e.key === 'Enter' && applyScramble()}
							/>
							<Button variant="primary" onclick={applyScramble}>Apply</Button>
						</div>
						{#if scrambleError}
							<p class="scramble__error">{scrambleError}</p>
						{/if}
					</div>
				{/if}

				<div class="tools">
					<Button size="sm" onclick={randomise}>Random scramble</Button>
					<Button size="sm" variant="ghost" onclick={() => reset('solved')}>Solved</Button>
					<Button size="sm" variant="ghost" onclick={() => reset('blank')}>Clear stickers</Button>
					<Button size="sm" variant="ghost" onclick={undo} disabled={history.length === 0}>
						Undo
					</Button>
				</div>
			</section>

			<!-- ── advice ────────────────────────────────────────────────────── -->
			<section class="panel" aria-label="Advice" aria-live="polite">
				{#if !validation.ok}
					<div class="status status--bad">
						<h2 class="status__title">
							{countUnset(facelets) > 0 ? 'Not finished yet' : 'That cube cannot exist'}
						</h2>
						<ul class="issues">
							{#each validation.issues as issue (issue.code)}
								<li class="issue">
									<span class="issue__message">{issue.message}</span>
									{#if issue.hint}<span class="issue__hint">{issue.hint}</span>{/if}
								</li>
							{/each}
						</ul>
						{#if countUnset(facelets) === 0}
							<p class="status__aside">
								A real cube can only be in certain states. If a single corner is twisted, a single
								edge is flipped, or exactly two pieces are swapped, no amount of turning will fix it
								— which means the cube was taken apart, or one sticker has been read wrong. It is
								nearly always the latter.
							</p>
						{/if}
					</div>
				{:else if plan}
					<div class="status">
						<div class="status__head">
							<div>
								<p class="eyebrow">You are at</p>
								<h2 class="status__title">{plan.stepName}</h2>
							</div>
							<Chip tone="section" size="md">{Math.round(plan.progress * 100)}% done</Chip>
						</div>
						<div
							class="meter"
							role="progressbar"
							aria-valuenow={Math.round(plan.progress * 100)}
							aria-valuemin="0"
							aria-valuemax="100"
						>
							<span class="meter__fill" style:width="{plan.progress * 100}%"></span>
						</div>
						<p class="status__desc">{plan.stepDescription}</p>

						<dl class="facts">
							<div>
								<dt>Cross</dt>
								<dd>{plan.analysis.crossProgress}/4</dd>
							</div>
							<div>
								<dt>Pairs</dt>
								<dd>{plan.analysis.f2lProgress}/4</dd>
							</div>
							<div>
								<dt>Top face</dt>
								<dd>{plan.analysis.lastLayerOriented ? 'oriented' : 'not yet'}</dd>
							</div>
						</dl>
					</div>

					{#if plan.analysis.solved}
						<p class="solved-note">
							Nothing left to do. Scramble it and go again — or take a look at the
							<a href={resolve('/trainer')}>trainer</a> if there is a case you keep fumbling.
						</p>
					{:else}
						<h3 class="advice-heading">
							What to do next
							<span class="advice-heading__note">
								Yours first, as a {SKILL_LABELS[tier].toLowerCase()}
							</span>
						</h3>

						<ul class="advice">
							{#each ordered as rec (rec.tier + rec.title)}
								<li class="rec" class:rec--mine={rec.tier === tier}>
									<div class="rec__head">
										<Chip tone={rec.tier === tier ? 'section' : 'neutral'}>
											{SKILL_LABELS[rec.tier]}
										</Chip>
										<h4 class="rec__title">{rec.title}</h4>
									</div>
									<p class="rec__detail">{rec.detail}</p>

									{#if rec.steps}
										<ol class="rec__steps">
											{#each rec.steps as step (step.label)}
												<li>
													<span class="rec__step-label">{step.label}</span>
													<AlgString alg={step.moves} size="sm" />
												</li>
											{/each}
										</ol>
									{/if}

									{#if rec.moves}
										<div class="rec__alg scroll-x">
											<AlgString alg={rec.moves} size="md" count wrap={false} />
										</div>
										<div class="rec__actions">
											<Button
												size="sm"
												variant="section"
												onclick={() => perform(rec.moves ?? '')}
												disabled={playing}
											>
												{playing ? 'Turning…' : 'Do it on this cube'}
											</Button>
											{#if rec.setId}
												<Button size="sm" variant="ghost" href={resolve('/algorithms')}>
													See the algorithms
												</Button>
											{/if}
										</div>
									{/if}
								</li>
							{/each}
						</ul>

						<div class="full">
							<Button
								size="sm"
								variant="ghost"
								onclick={() => (showFullSolve = !showFullSolve)}
								aria-expanded={showFullSolve}
							>
								{showFullSolve ? 'Hide the whole solution' : 'Show me the whole solution'}
							</Button>

							{#if fullSolve}
								<div class="full__body">
									<p class="full__summary">
										{fullSolve.steps.length} steps, {fullSolve.moves.split(' ').filter(Boolean)
											.length}
										moves, the way a {SKILL_LABELS[tier].toLowerCase()} would do it.
										{#if !fullSolve.solved}
											<strong>
												This route stops short of a full solve — the library does not cover the
												remaining case at this level.
											</strong>
										{/if}
									</p>
									<ol class="full__steps">
										{#each fullSolve.steps as step, i (i)}
											<li>
												<span class="full__stage">{step.stage}</span>
												<AlgString alg={step.moves} size="sm" count />
											</li>
										{/each}
									</ol>
								</div>
							{/if}
						</div>
					{/if}
				{/if}

				<details class="raw">
					<summary>Cube state as text</summary>
					<code class="raw__code">{faceletsToString(facelets)}</code>
					<p class="raw__note">
						Fifty-four letters, in the order up, right, front, down, left, back. Each letter names
						the face whose colour that sticker carries.
					</p>
				</details>
			</section>
		</div>
	{/if}
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
		line-height: var(--leading-snug);
	}

	.layout {
		display: grid;
		gap: var(--space-5);
		grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
		align-items: start;
	}

	.panel {
		display: grid;
		gap: var(--space-4);
		padding: var(--space-5);
		background: var(--surface-1);
		border: var(--border);
		border-radius: var(--radius-3);
	}

	.panel__bar {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-3);
		justify-content: space-between;
	}

	.stage {
		display: grid;
		place-items: center;
		min-height: 22rem;
		padding: var(--space-4);
		background: var(--surface-2);
		border-radius: var(--radius-3);
	}

	.palette {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
		align-items: center;
	}

	.swatch {
		width: 2.25rem;
		height: 2.25rem;
		display: grid;
		place-items: center;
		border: 2px solid var(--hairline-strong);
		border-radius: var(--radius-2);
		color: var(--text-muted);
		transition:
			border-color var(--dur-fast) var(--ease-out),
			transform var(--dur-fast) var(--ease-out);
	}

	.swatch:hover {
		transform: translateY(-2px);
	}

	.swatch--on {
		border-color: var(--accent);
		box-shadow: 0 0 0 2px var(--accent-wash);
	}

	.swatch--erase {
		border-style: dashed;
	}

	.palette__hint {
		flex: 1 1 14rem;
		color: var(--text-faint);
		font-size: var(--step--2);
		line-height: var(--leading-snug);
	}

	.scramble {
		display: grid;
		gap: var(--space-2);
	}

	.scramble__label {
		color: var(--text-faint);
		font-size: var(--step--2);
		font-weight: 600;
		letter-spacing: var(--tracking-caps);
		text-transform: uppercase;
	}

	.scramble__row {
		display: flex;
		gap: var(--space-2);
	}

	.scramble__input {
		flex: 1;
		min-width: 0;
		padding: 0.6em 0.8em;
		background: var(--surface-2);
		border: var(--border-strong);
		border-radius: var(--radius-2);
		font-family: var(--font-mono);
		font-size: var(--step--1);
	}

	.scramble__input:focus-visible {
		border-color: var(--accent);
	}

	.scramble__error {
		color: var(--danger);
		font-size: var(--step--1);
	}

	.tools {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
		padding-block-start: var(--space-3);
		border-top: var(--border);
	}

	/* --- advice ---------------------------------------------------------- */

	.status {
		display: grid;
		gap: var(--space-3);
	}

	.status__head {
		display: flex;
		align-items: start;
		justify-content: space-between;
		gap: var(--space-3);
	}

	.status__title {
		margin-block-start: var(--space-1);
		font-size: var(--step-2);
	}

	.status--bad .status__title {
		color: var(--danger);
	}

	.status__desc,
	.status__aside {
		color: var(--text-muted);
		font-size: var(--step--1);
		line-height: var(--leading-normal);
	}

	.meter {
		height: 6px;
		border-radius: var(--radius-pill);
		background: var(--surface-3);
		overflow: hidden;
	}

	.meter__fill {
		display: block;
		height: 100%;
		background: var(--section);
		transition: width var(--dur-mid) var(--ease-out);
	}

	.facts {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-5);
		padding-block-start: var(--space-3);
		border-top: var(--border);
	}

	.facts dt {
		color: var(--text-faint);
		font-size: var(--step--2);
		letter-spacing: var(--tracking-caps);
		text-transform: uppercase;
	}

	.facts dd {
		font-weight: 620;
		font-variant-numeric: tabular-nums;
	}

	.issues {
		display: grid;
		gap: var(--space-3);
		padding: 0;
		list-style: none;
	}

	.issue {
		display: grid;
		gap: 2px;
		padding: var(--space-3);
		background: color-mix(in oklab, var(--danger) 8%, transparent);
		border-inline-start: 3px solid var(--danger);
		border-radius: var(--radius-2);
	}

	.issue__message {
		font-weight: 560;
	}

	.issue__hint {
		color: var(--text-muted);
		font-size: var(--step--1);
	}

	.advice-heading {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: var(--space-3);
		margin-block-start: var(--space-2);
		padding-block-start: var(--space-4);
		border-top: var(--border);
		font-size: var(--step-1);
	}

	.advice-heading__note {
		color: var(--text-faint);
		font-size: var(--step--2);
		font-weight: 400;
	}

	.advice {
		display: grid;
		gap: var(--space-3);
		padding: 0;
		list-style: none;
	}

	.rec {
		display: grid;
		gap: var(--space-2);
		padding: var(--space-4);
		background: var(--surface-2);
		border: var(--border);
		border-radius: var(--radius-3);
	}

	.rec--mine {
		background: var(--section-wash);
		border-color: var(--section-edge);
	}

	.rec__head {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--space-2);
	}

	.rec__title {
		font-size: var(--step-0);
		font-weight: 620;
	}

	.rec__detail {
		color: var(--text-muted);
		font-size: var(--step--1);
		line-height: var(--leading-normal);
	}

	.rec__steps {
		display: grid;
		gap: var(--space-2);
		margin: 0;
		padding-inline-start: var(--space-5);
	}

	.rec__step-label {
		display: block;
		color: var(--text-faint);
		font-size: var(--step--2);
	}

	.rec__alg {
		padding: var(--space-2) var(--space-3);
		background: var(--surface-1);
		border: var(--border);
		border-radius: var(--radius-2);
	}

	.rec__actions {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
	}

	.solved-note {
		padding: var(--space-4);
		background: color-mix(in oklab, var(--positive) 10%, transparent);
		border-inline-start: 3px solid var(--positive);
		border-radius: var(--radius-2);
		color: var(--text-muted);
	}

	.full {
		display: grid;
		gap: var(--space-3);
		justify-items: start;
		padding-block-start: var(--space-4);
		border-top: var(--border);
	}

	.full__body {
		display: grid;
		gap: var(--space-3);
		width: 100%;
	}

	.full__summary {
		color: var(--text-muted);
		font-size: var(--step--1);
	}

	.full__steps {
		display: grid;
		gap: var(--space-2);
		margin: 0;
		padding-inline-start: var(--space-5);
	}

	.full__stage {
		display: block;
		color: var(--text-faint);
		font-size: var(--step--2);
		letter-spacing: var(--tracking-caps);
		text-transform: uppercase;
	}

	.raw {
		padding-block-start: var(--space-4);
		border-top: var(--border);
	}

	.raw summary {
		color: var(--text-muted);
		font-size: var(--step--1);
		cursor: pointer;
	}

	.raw__code {
		display: block;
		margin-block-start: var(--space-3);
		padding: var(--space-3);
		background: var(--surface-2);
		border-radius: var(--radius-2);
		font-size: var(--step--2);
		overflow-wrap: anywhere;
	}

	.raw__note {
		margin-block-start: var(--space-2);
		color: var(--text-faint);
		font-size: var(--step--2);
	}

	@media (max-width: 68rem) {
		.layout {
			grid-template-columns: minmax(0, 1fr);
		}
	}
</style>
