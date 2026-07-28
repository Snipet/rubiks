<script lang="ts">
	import { onMount, untrack } from 'svelte';
	import { resolve } from '$app/paths';
	import CubeDiagram from '$components/cube/CubeDiagram.svelte';
	import AlgString from '$components/ui/AlgString.svelte';
	import Button from '$components/ui/Button.svelte';
	import Chip from '$components/ui/Chip.svelte';
	import Segmented from '$components/ui/Segmented.svelte';
	import { pageTitle } from '$lib/brand';
	import { ALG_SETS, casesOfSet } from '$data/algorithms';
	import { SKILL_LABELS, type AlgSetId, type ResolvedAlgCase } from '$data/types';
	import { progress } from '$state/progress.svelte';
	import { settings } from '$state/settings.svelte';
	import { puzzle } from '$cube/puzzle';
	import { caseSetupFor } from '$cube/puzzleScramble';

	type Stage = 'question' | 'answer';

	// Seeded synchronously rather than in an effect, so the prerendered page shows
	// a real case instead of an empty state that only fills in once JavaScript has
	// run. The reader's own level and a random pick are applied on mount.
	let setId = $state<AlgSetId>('pll');
	let stage = $state<Stage>('question');
	let current = $state<ResolvedAlgCase | null>(casesOfSet('pll')[0] ?? null);
	let setup = $state('');
	let startedAt = $state(0);
	let lastResult = $state<{ correct: boolean; ms: number } | null>(null);
	let sessionSeen = $state(0);
	let sessionRight = $state(0);

	// Only sets for the puzzle the site is set to. Drilling 3×3 OLL while the
	// header says 2×2 would be a quiet lie, and the trainer's whole value is that
	// what it shows you is what you are about to pick up.
	const order = $derived(settings.current.puzzle);
	const availableSets = $derived(ALG_SETS.filter((s) => (s.puzzle ?? 3) === order));
	const pool = $derived(availableSets.some((s) => s.id === setId) ? casesOfSet(setId) : []);

	// Switching puzzle usually leaves the chosen set behind, so move to one this
	// puzzle actually has and deal a case from it straight away. Clearing `current`
	// without dealing again would leave the panel empty until the reader guessed
	// that a button needed pressing.
	$effect(() => {
		if (availableSets.length === 0) return;
		if (availableSets.some((s) => s.id === setId)) return;
		untrack(() => {
			setId = availableSets[0].id;
			current = null;
			next();
		});
	});

	/** Cases whose review is due, soonest first, falling back to everything. */
	const queue = $derived.by(() => {
		const due = progress.dueCases(
			pool.map((c) => c.id),
			Date.now()
		);
		return due.length > 0 ? due : pool.map((c) => c.id);
	});

	const dueCount = $derived(
		progress.dueCases(
			pool.map((c) => c.id),
			Date.now()
		).length
	);

	function next() {
		const ids = queue;
		if (ids.length === 0) {
			current = null;
			return;
		}
		// Take from the front of the due queue, but not the case just shown.
		const candidates = ids.filter((id) => id !== current?.id);
		const pick = (candidates.length ? candidates : ids)[
			Math.floor(Math.random() * Math.min(6, (candidates.length ? candidates : ids).length))
		];
		current = pool.find((c) => c.id === pick) ?? null;
		setup = current ? caseSetupFor(puzzle(current.set_.puzzle ?? 3), current.algs[0].moves) : '';
		stage = 'question';
		startedAt = performance.now();
		lastResult = null;
	}

	function grade(correct: boolean) {
		if (!current) return;
		const ms = Math.round(performance.now() - startedAt);
		progress.record(current.id, correct, ms);
		lastResult = { correct, ms };
		sessionSeen += 1;
		if (correct) sessionRight += 1;
	}

	const stats = $derived(current ? progress.caseProgress(current.id) : undefined);

	// Once in the browser, switch to whatever set the reader's level suggests and
	// pick a case at random.
	onMount(() => {
		const tier = settings.current.skill;
		setId = tier === 'beginner' ? 'beginner-ll' : tier === 'intermediate' ? 'pll' : 'oll';
		next();
	});
</script>

<svelte:window
	onkeydown={(e) => {
		if (e.target instanceof HTMLElement && ['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
		if (e.code === 'Space') {
			e.preventDefault();
			if (stage === 'question') stage = 'answer';
			else next();
		}
		if (stage === 'answer' && !lastResult) {
			if (e.key === '1') grade(false);
			if (e.key === '2') grade(true);
		}
	}}
/>

<svelte:head>
	<title>{pageTitle('trainer')}</title>
	<meta
		name="description"
		content="Drill Rubik's Cube algorithms with a spaced-repetition schedule that remembers which ones you fumble."
	/>
</svelte:head>

<div class="page page--wide">
	<header class="head">
		<p class="eyebrow">Trainer</p>
		<h1>Drill the ones you keep fumbling</h1>
		<p class="lede">
			A case comes up, you recall the algorithm, and you say whether you got it. Cases you get wrong
			come back soon; cases you know drift into the background. Nothing to set up — the schedule
			looks after itself.
		</p>
	</header>

	<div class="controls">
		<Segmented
			label="Which set to drill"
			size="sm"
			value={setId}
			onchange={(v) => {
				setId = v;
				next();
			}}
			options={availableSets.map((s) => ({ value: s.id, label: s.shortName }))}
		/>
		<div class="controls__stats">
			<Chip tone={dueCount > 0 ? 'caution' : 'positive'}>
				{dueCount > 0 ? `${dueCount} due` : 'Nothing due'}
			</Chip>
			{#if sessionSeen > 0}
				<Chip>{sessionRight}/{sessionSeen} this session</Chip>
			{/if}
			<Chip>Streak {progress.streak}</Chip>
		</div>
	</div>

	{#if !current}
		<p class="empty">
			That set has no cases yet. Try another, or browse the
			<a href={resolve('/algorithms')}>library</a>.
		</p>
	{:else}
		<section class="card">
			<div class="card__diagram">
				<CubeDiagram
					facelets={current.caseState}
					order={current.set_.puzzle ?? 3}
					view={current.set_.view}
					size={200}
					label="The case to recall"
				/>
				{#if settings.current.trainerHints && current.recognition}
					<p class="hint">{current.recognition}</p>
				{/if}
			</div>

			<div class="card__body">
				{#if stage === 'question'}
					<p class="prompt">What is the algorithm?</p>
					<p class="prompt__sub">
						Set your cube up with the sequence below, or work it out from the picture.
					</p>
					{#if setup}
						<div class="setup scroll-x">
							<span class="setup__label">Set up with</span>
							<AlgString alg={setup} order={current.set_.puzzle ?? 3} size="sm" wrap={false} />
						</div>
					{/if}
					<Button variant="section" size="lg" onclick={() => (stage = 'answer')}>
						Show me the answer
					</Button>
					<p class="keys">Space reveals it.</p>
				{:else}
					<div class="reveal">
						<div class="reveal__head">
							<h2 class="reveal__name">{current.name}</h2>
							<Chip tone="section">{current.shortName}</Chip>
							<Chip>{SKILL_LABELS[current.tier]}</Chip>
						</div>
						<div class="reveal__alg scroll-x">
							<AlgString
								alg={current.algs[0].moves}
								order={current.set_.puzzle ?? 3}
								size="lg"
								count
								wrap={false}
							/>
						</div>
						{#if current.algs.length > 1}
							<details class="others">
								<summary
									>{current.algs.length - 1} other way{current.algs.length > 2 ? 's' : ''}</summary
								>
								<ul>
									{#each current.algs.slice(1) as variant (variant.moves)}
										<li>
											{#if variant.label}<Chip>{variant.label}</Chip>{/if}
											<AlgString alg={variant.moves} order={current.set_.puzzle ?? 3} size="sm" />
										</li>
									{/each}
								</ul>
							</details>
						{/if}
						{#if current.notes}<p class="reveal__notes">{current.notes}</p>{/if}
					</div>

					{#if lastResult}
						<div class="result" class:result--good={lastResult.correct}>
							<strong>{lastResult.correct ? 'Marked as known' : 'Back in the pile'}</strong>
							<span>
								{#if stats}
									Box {stats.box} of 5 · {stats.correct}/{stats.attempts} correct
								{/if}
							</span>
						</div>
						<Button variant="section" size="lg" onclick={next}>Next case</Button>
						<p class="keys">Space for the next one.</p>
					{:else}
						<p class="prompt">Did you get it?</p>
						<div class="grade">
							<Button variant="secondary" size="lg" onclick={() => grade(false)}>
								No — show me again soon
							</Button>
							<Button variant="primary" size="lg" onclick={() => grade(true)}>Yes</Button>
						</div>
						<p class="keys">Press 1 for no, 2 for yes.</p>
					{/if}
				{/if}
			</div>
		</section>

		<section class="board" aria-label="Progress through this set">
			<h2 class="board__heading">
				{availableSets.find((s) => s.id === setId)?.name}
				<span class="board__count">
					{pool.filter((c) => progress.confidence(c.id) === 'solid').length} of {pool.length} solid
				</span>
			</h2>
			<ul class="chips">
				{#each pool as c (c.id)}
					{@const confidence = progress.confidence(c.id)}
					<li>
						<button
							type="button"
							class="mini mini--{confidence}"
							class:mini--current={current?.id === c.id}
							title="{c.name} — {confidence}"
							onclick={() => {
								current = c;
								setup = caseSetupFor(puzzle(c.set_.puzzle ?? 3), c.algs[0].moves);
								stage = 'question';
								startedAt = performance.now();
								lastResult = null;
							}}
						>
							{c.shortName}
						</button>
					</li>
				{/each}
			</ul>
		</section>
	{/if}
</div>

<style>
	.head {
		max-width: var(--measure);
		margin-block-end: var(--space-5);
	}

	.head h1 {
		margin-block: var(--space-2) var(--space-3);
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
		justify-content: space-between;
		gap: var(--space-3);
		margin-block-end: var(--space-5);
	}

	.controls__stats {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
	}

	.card {
		display: grid;
		grid-template-columns: auto minmax(0, 1fr);
		gap: var(--space-6);
		padding: var(--space-6);
		background: var(--surface-1);
		border: var(--border);
		border-radius: var(--radius-4);
	}

	.card__diagram {
		display: grid;
		justify-items: center;
		gap: var(--space-3);
		align-content: start;
	}

	.hint {
		max-width: 22ch;
		color: var(--text-muted);
		font-size: var(--step--1);
		text-align: center;
		line-height: var(--leading-snug);
	}

	.card__body {
		display: grid;
		gap: var(--space-4);
		align-content: start;
		justify-items: start;
		min-width: 0;
	}

	.prompt {
		font-size: var(--step-2);
		font-weight: 620;
	}

	.prompt__sub {
		color: var(--text-muted);
		font-size: var(--step--1);
	}

	.setup {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		width: 100%;
		padding: var(--space-3);
		background: var(--surface-2);
		border-radius: var(--radius-2);
	}

	.setup__label {
		flex-shrink: 0;
		color: var(--text-faint);
		font-size: var(--step--2);
		letter-spacing: var(--tracking-caps);
		text-transform: uppercase;
	}

	.keys {
		color: var(--text-faint);
		font-size: var(--step--2);
	}

	.reveal {
		display: grid;
		gap: var(--space-3);
		width: 100%;
	}

	.reveal__head {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--space-2);
	}

	.reveal__name {
		font-size: var(--step-2);
	}

	.reveal__alg {
		padding: var(--space-3);
		background: var(--surface-2);
		border-radius: var(--radius-2);
	}

	.reveal__notes {
		color: var(--text-muted);
		font-size: var(--step--1);
		line-height: var(--leading-normal);
	}

	.others summary {
		color: var(--text-muted);
		font-size: var(--step--1);
		cursor: pointer;
	}

	.others ul {
		display: grid;
		gap: var(--space-2);
		margin-block-start: var(--space-2);
		padding-inline-start: var(--space-4);
	}

	.grade {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-3);
	}

	.result {
		display: grid;
		gap: 2px;
		width: 100%;
		padding: var(--space-3);
		border-inline-start: 3px solid var(--caution);
		background: color-mix(in oklab, var(--caution) 10%, transparent);
		border-radius: var(--radius-2);
		font-size: var(--step--1);
	}

	.result--good {
		border-inline-start-color: var(--positive);
		background: color-mix(in oklab, var(--positive) 10%, transparent);
	}

	.result span {
		color: var(--text-muted);
	}

	.board {
		margin-block-start: var(--space-6);
	}

	.board__heading {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: var(--space-3);
		margin-block-end: var(--space-3);
		font-size: var(--step-1);
	}

	.board__count {
		color: var(--text-faint);
		font-size: var(--step--1);
		font-weight: 400;
	}

	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.mini {
		padding: 0.3em 0.6em;
		border: 1px solid var(--hairline-strong);
		border-radius: var(--radius-1);
		color: var(--text-muted);
		font-family: var(--font-mono);
		font-size: var(--step--2);
		transition:
			border-color var(--dur-fast) var(--ease-out),
			background var(--dur-fast) var(--ease-out);
	}

	.mini:hover {
		border-color: var(--section);
		color: var(--text);
	}

	.mini--learning {
		border-color: color-mix(in oklab, var(--caution) 55%, transparent);
		color: var(--caution);
	}

	.mini--known {
		border-color: color-mix(in oklab, var(--accent) 55%, transparent);
		color: var(--accent-strong);
	}

	.mini--solid {
		background: color-mix(in oklab, var(--positive) 16%, transparent);
		border-color: color-mix(in oklab, var(--positive) 55%, transparent);
		color: var(--positive);
	}

	.mini--current {
		outline: 2px solid var(--section);
		outline-offset: 1px;
	}

	.empty {
		padding: var(--space-7);
		text-align: center;
		color: var(--text-muted);
	}

	@media (max-width: 56rem) {
		.card {
			grid-template-columns: minmax(0, 1fr);
			padding: var(--space-4);
			gap: var(--space-4);
		}
	}
</style>
