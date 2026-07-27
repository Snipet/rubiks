<script lang="ts">
	import { onDestroy } from 'svelte';
	import AlgString from '$components/ui/AlgString.svelte';
	import Button from '$components/ui/Button.svelte';
	import CubeDiagram from '$components/cube/CubeDiagram.svelte';
	import { pageTitle } from '$lib/brand';
	import { randomScramble } from '$cube/scramble';
	import { stateFromAlg } from '$cube/facelets';
	import { formatTime, progress, solveStats, type SolveRecord } from '$state/progress.svelte';

	/**
	 * Timer states follow the competition sequence: you hold to arm, release to
	 * start, and press anything to stop. `holding` and `ready` are separate so the
	 * display can tell you the difference between "keep holding" and "let go now".
	 */
	type Phase = 'idle' | 'holding' | 'ready' | 'running' | 'stopped';

	const HOLD_MS = 400;

	let phase = $state<Phase>('idle');
	let elapsed = $state(0);
	let scramble = $state(randomScramble({ length: 20 }));
	let inspection = $state(false);
	let inspectionLeft = $state(15);

	let startedAt = 0;
	let holdTimer: ReturnType<typeof setTimeout> | undefined;
	let frame: number | undefined;
	let inspectionTimer: ReturnType<typeof setInterval> | undefined;

	const solves = $derived(progress.current.solves);
	const stats = $derived(solveStats(solves));
	const preview = $derived(stateFromAlg(scramble));

	function tick() {
		elapsed = performance.now() - startedAt;
		frame = requestAnimationFrame(tick);
	}

	function beginHold() {
		if (phase === 'running') {
			stop();
			return;
		}
		if (phase !== 'idle' && phase !== 'stopped') return;
		phase = 'holding';
		holdTimer = setTimeout(() => (phase = 'ready'), HOLD_MS);
	}

	function releaseHold() {
		clearTimeout(holdTimer);
		if (phase === 'ready') start();
		else if (phase === 'holding') phase = 'idle';
	}

	function start() {
		stopInspection();
		phase = 'running';
		elapsed = 0;
		startedAt = performance.now();
		frame = requestAnimationFrame(tick);
	}

	function stop() {
		if (phase !== 'running') return;
		if (frame) cancelAnimationFrame(frame);
		phase = 'stopped';
		elapsed = performance.now() - startedAt;
		progress.addSolve({ at: Date.now(), ms: Math.round(elapsed), scramble });
		scramble = randomScramble({ length: 20 });
	}

	function startInspection() {
		if (phase === 'running') return;
		stopInspection();
		inspection = true;
		inspectionLeft = 15;
		inspectionTimer = setInterval(() => {
			inspectionLeft -= 1;
			if (inspectionLeft <= 0) stopInspection();
		}, 1000);
	}

	function stopInspection() {
		clearInterval(inspectionTimer);
		inspectionTimer = undefined;
		inspection = false;
	}

	function onkeydown(event: KeyboardEvent) {
		const target = event.target as HTMLElement | null;
		if (target && ['INPUT', 'TEXTAREA', 'BUTTON', 'A'].includes(target.tagName)) return;
		if (event.code !== 'Space') return;
		event.preventDefault();
		if (!event.repeat) beginHold();
	}

	function onkeyup(event: KeyboardEvent) {
		if (event.code !== 'Space') return;
		event.preventDefault();
		releaseHold();
	}

	function penalise(record: SolveRecord, penalty: SolveRecord['penalty']) {
		progress.updateSolve(record.at, { penalty: record.penalty === penalty ? undefined : penalty });
	}

	onDestroy(() => {
		clearTimeout(holdTimer);
		clearInterval(inspectionTimer);
		if (frame) cancelAnimationFrame(frame);
	});

	const display = $derived(
		phase === 'running' || phase === 'stopped' ? formatTime(elapsed) : formatTime(0)
	);
</script>

<svelte:window {onkeydown} {onkeyup} />

<svelte:head>
	<title>{pageTitle('timer')}</title>
	<meta
		name="description"
		content="A speedcubing timer with scrambles, inspection and WCA-style averages."
	/>
</svelte:head>

<div class="page page--wide">
	<header class="head">
		<p class="eyebrow">Timer</p>
		<h1>Time a solve</h1>
		<p class="lede">
			Hold the space bar until it turns green, let go to start, press anything to stop. Everything
			stays in this browser.
		</p>
	</header>

	<div class="layout">
		<section class="stage" aria-label="Timer">
			<div class="scramble">
				<div class="scramble__moves scroll-x">
					<AlgString alg={scramble} size="lg" wrap={false} />
				</div>
				<div class="scramble__tools">
					<Button
						size="sm"
						variant="ghost"
						onclick={() => (scramble = randomScramble({ length: 20 }))}
					>
						New scramble
					</Button>
					<Button
						size="sm"
						variant="ghost"
						onclick={startInspection}
						disabled={phase === 'running'}
					>
						{inspection ? `Inspection ${inspectionLeft}s` : 'Start 15s inspection'}
					</Button>
				</div>
			</div>

			<button
				type="button"
				class="pad"
				class:pad--holding={phase === 'holding'}
				class:pad--ready={phase === 'ready'}
				class:pad--running={phase === 'running'}
				onpointerdown={beginHold}
				onpointerup={releaseHold}
				onpointerleave={() => phase === 'holding' && releaseHold()}
				aria-label="Timer. Hold to arm, release to start, press to stop."
			>
				<span class="pad__time">{display}</span>
				<span class="pad__hint">
					{#if phase === 'holding'}Keep holding…
					{:else if phase === 'ready'}Let go
					{:else if phase === 'running'}Press anything to stop
					{:else}Hold space, or press and hold here{/if}
				</span>
			</button>

			<div class="preview">
				<CubeDiagram facelets={preview} view="full" size={160} label="The scrambled cube" />
				<p class="preview__note">The cube after this scramble, seen from the top-front-right.</p>
			</div>
		</section>

		<section class="side" aria-label="Statistics and history">
			<div class="stats">
				<h2 class="side__heading">Statistics</h2>
				<dl class="stats__grid">
					<div>
						<dt>Solves</dt>
						<dd>{stats.count}</dd>
					</div>
					<div>
						<dt>Best</dt>
						<dd>{formatTime(stats.best)}</dd>
					</div>
					<div>
						<dt>Mean</dt>
						<dd>{formatTime(stats.mean)}</dd>
					</div>
					<div>
						<dt>ao5</dt>
						<dd>{formatTime(stats.ao5)}</dd>
					</div>
					<div>
						<dt>ao12</dt>
						<dd>{formatTime(stats.ao12)}</dd>
					</div>
					<div>
						<dt>Best ao5</dt>
						<dd>{formatTime(stats.bestAo5)}</dd>
					</div>
				</dl>
				<p class="stats__note">
					Averages drop the best and worst solve and mean the rest, the way competitions do — so one
					lucky solve and one disaster both stop counting.
				</p>
			</div>

			<div class="history">
				<div class="history__bar">
					<h2 class="side__heading">Recent solves</h2>
					{#if solves.length > 0}
						<button class="clear" type="button" onclick={() => progress.clearAll()}
							>Clear all</button
						>
					{/if}
				</div>

				{#if solves.length === 0}
					<p class="empty">No solves yet. The first one always feels slow.</p>
				{:else}
					<ol class="solves">
						{#each solves.slice(0, 24) as record (record.at)}
							<li class="solve">
								<span class="solve__time" class:solve__time--dnf={record.penalty === 'dnf'}>
									{formatTime(record.ms, record.penalty)}
								</span>
								<span class="solve__scramble scroll-x">
									<AlgString alg={record.scramble} size="sm" wrap={false} />
								</span>
								<span class="solve__actions">
									<button
										type="button"
										class="pill"
										class:pill--on={record.penalty === 'plus2'}
										onclick={() => penalise(record, 'plus2')}
										title="Two-second penalty"
									>
										+2
									</button>
									<button
										type="button"
										class="pill"
										class:pill--on={record.penalty === 'dnf'}
										onclick={() => penalise(record, 'dnf')}
										title="Did not finish"
									>
										DNF
									</button>
									<button
										type="button"
										class="pill"
										onclick={() => progress.removeSolve(record.at)}
										title="Delete this solve"
									>
										×
									</button>
								</span>
							</li>
						{/each}
					</ol>
				{/if}
			</div>
		</section>
	</div>
</div>

<style>
	.head {
		max-width: var(--measure);
		margin-block-end: var(--space-6);
	}

	.head h1 {
		margin-block: var(--space-2) var(--space-3);
	}

	.lede {
		color: var(--text-muted);
		font-size: var(--step-1);
	}

	.layout {
		display: grid;
		gap: var(--space-5);
		grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
		align-items: start;
	}

	.stage {
		display: grid;
		gap: var(--space-4);
	}

	.scramble {
		display: grid;
		gap: var(--space-3);
		padding: var(--space-4);
		background: var(--surface-1);
		border: var(--border);
		border-radius: var(--radius-3);
	}

	.scramble__tools {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
	}

	.pad {
		display: grid;
		place-items: center;
		gap: var(--space-2);
		min-height: 15rem;
		padding: var(--space-6);
		background: var(--surface-1);
		border: 2px solid var(--hairline);
		border-radius: var(--radius-4);
		transition:
			background var(--dur-fast) var(--ease-out),
			border-color var(--dur-fast) var(--ease-out);
	}

	.pad--holding {
		border-color: var(--caution);
		background: color-mix(in oklab, var(--caution) 8%, var(--surface-1));
	}

	.pad--ready {
		border-color: var(--positive);
		background: color-mix(in oklab, var(--positive) 12%, var(--surface-1));
	}

	.pad--running {
		border-color: var(--section);
	}

	.pad__time {
		font-family: var(--font-mono);
		font-size: clamp(3rem, 12vw, 6rem);
		font-weight: 600;
		font-variant-numeric: tabular-nums;
		line-height: 1;
		letter-spacing: -0.03em;
	}

	.pad__hint {
		color: var(--text-faint);
		font-size: var(--step--1);
	}

	.preview {
		display: flex;
		align-items: center;
		gap: var(--space-4);
		padding: var(--space-4);
		background: var(--surface-1);
		border: var(--border);
		border-radius: var(--radius-3);
	}

	.preview__note {
		color: var(--text-muted);
		font-size: var(--step--1);
	}

	.side {
		display: grid;
		gap: var(--space-4);
	}

	.side__heading {
		font-size: var(--step-1);
	}

	.stats,
	.history {
		display: grid;
		gap: var(--space-3);
		padding: var(--space-4);
		background: var(--surface-1);
		border: var(--border);
		border-radius: var(--radius-3);
	}

	.stats__grid {
		display: grid;
		gap: var(--space-3);
		grid-template-columns: repeat(auto-fit, minmax(6rem, 1fr));
	}

	.stats__grid dt {
		color: var(--text-faint);
		font-size: var(--step--2);
		letter-spacing: var(--tracking-caps);
		text-transform: uppercase;
	}

	.stats__grid dd {
		font-family: var(--font-mono);
		font-size: var(--step-1);
		font-weight: 600;
		font-variant-numeric: tabular-nums;
	}

	.stats__note {
		color: var(--text-faint);
		font-size: var(--step--2);
		line-height: var(--leading-snug);
	}

	.history__bar {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: var(--space-3);
	}

	.clear {
		color: var(--text-faint);
		font-size: var(--step--2);
		text-decoration: underline;
		text-underline-offset: 3px;
	}

	.clear:hover {
		color: var(--danger);
	}

	.solves {
		display: grid;
		gap: var(--space-2);
		margin: 0;
		padding: 0;
		list-style: none;
		max-height: 30rem;
		overflow-y: auto;
	}

	.solve {
		display: grid;
		grid-template-columns: auto minmax(0, 1fr) auto;
		gap: var(--space-3);
		align-items: center;
		padding: var(--space-2) var(--space-3);
		background: var(--surface-2);
		border-radius: var(--radius-2);
	}

	.solve__time {
		font-family: var(--font-mono);
		font-weight: 600;
		font-variant-numeric: tabular-nums;
	}

	.solve__time--dnf {
		color: var(--danger);
	}

	.solve__actions {
		display: flex;
		gap: var(--space-1);
	}

	.pill {
		padding: 0.15em 0.45em;
		border: 1px solid var(--hairline-strong);
		border-radius: var(--radius-1);
		color: var(--text-faint);
		font-size: var(--step--2);
		line-height: 1.4;
	}

	.pill:hover {
		color: var(--text);
		border-color: var(--section);
	}

	.pill--on {
		background: var(--caution);
		border-color: var(--caution);
		color: var(--text-inverse);
	}

	.empty {
		color: var(--text-muted);
		font-size: var(--step--1);
	}

	@media (max-width: 64rem) {
		.layout {
			grid-template-columns: minmax(0, 1fr);
		}
	}
</style>
