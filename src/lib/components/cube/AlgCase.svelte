<!--
	One case in the algorithm library.

	Collapsed it is a diagram, a name and the recommended algorithm. Expanded it
	adds every alternative, the recognition note, the fingertrick notes and a
	button to watch the algorithm run. The diagram is generated from the case's own
	first algorithm, so it always shows exactly what that algorithm solves.
-->
<script lang="ts">
	import CubeDiagram from './CubeDiagram.svelte';
	import Cube3D from './Cube3D.svelte';
	import AlgString from '../ui/AlgString.svelte';
	import Chip from '../ui/Chip.svelte';
	import Button from '../ui/Button.svelte';
	import { untrack } from 'svelte';
	import { caseFromAlg, cloneFacelets } from '$cube/facelets';
	import { htmLength, parseAlg } from '$cube/moves';
	import { settings } from '$state/settings.svelte';
	import { progress } from '$state/progress.svelte';
	import { SKILL_LABELS, type ResolvedAlgCase } from '$data/types';

	interface Props {
		entry: ResolvedAlgCase;
		/** Start expanded. */
		open?: boolean;
		diagramSize?: number;
	}

	let { entry, open = false, diagramSize = 108 }: Props = $props();

	// Both read their prop once, at construction: they seed the component rather
	// than tracking it.
	let expanded = $state(untrack(() => open));
	let demo = $state(untrack(() => cloneFacelets(entry.caseState)));
	let cube = $state<{ play: (alg: string) => Promise<void> } | null>(null);
	let running = $state(false);

	const confidence = $derived(progress.confidence(entry.id));
	const tone = $derived(
		confidence === 'solid'
			? ('positive' as const)
			: confidence === 'known'
				? ('accent' as const)
				: confidence === 'learning'
					? ('caution' as const)
					: ('neutral' as const)
	);

	/** Put the variant matching the reader's handedness preference first. */
	const algs = $derived.by(() => {
		const hand = settings.current.hand;
		const wanted = hand === 'left' ? 'left-hand' : 'right-hand';
		const list = [...entry.algs];
		const preferred = list.findIndex((a) => a.label === wanted);
		if (preferred > 0) list.unshift(...list.splice(preferred, 1));
		return list;
	});

	async function run(moves: string) {
		if (running) return;
		running = true;
		demo = caseFromAlg(moves);
		// Let the reset paint before the algorithm starts.
		await new Promise((r) => requestAnimationFrame(() => r(null)));
		await cube?.play(moves);
		running = false;
	}

	function reset() {
		demo = cloneFacelets(entry.caseState);
	}
</script>

<article class="case" class:case--open={expanded} id={entry.id}>
	<header class="case__head">
		<div class="case__diagram">
			<CubeDiagram
				facelets={entry.caseState}
				view={entry.set_.view}
				size={diagramSize}
				label="{entry.name}: the case this algorithm solves"
			/>
		</div>

		<div class="case__summary">
			<div class="case__titles">
				<h3 class="case__name">{entry.name}</h3>
				<span class="case__short">{entry.shortName}</span>
			</div>

			<div class="case__meta">
				<Chip {tone}>
					{confidence === 'unseen' ? 'Not started' : confidence}
				</Chip>
				<Chip>{SKILL_LABELS[entry.tier]}</Chip>
				{#if entry.probability}<Chip title="How often this case comes up">{entry.probability}</Chip
					>{/if}
				{#if settings.current.showMoveCounts}
					<Chip title="Moves, half-turn metric">{entry.moveCount} moves</Chip>
				{/if}
			</div>

			<div class="case__alg scroll-x">
				<AlgString alg={algs[0].moves} size="md" wrap={false} />
			</div>

			{#if entry.recognition}
				<p class="case__recognition">{entry.recognition}</p>
			{/if}
		</div>

		<button
			type="button"
			class="case__toggle"
			aria-expanded={expanded}
			aria-controls="{entry.id}-detail"
			onclick={() => (expanded = !expanded)}
		>
			<span class="visually-hidden">
				{expanded ? 'Hide details for' : 'Show details for'}
				{entry.name}
			</span>
			<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
				<path
					d="M6 9l6 6 6-6"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
		</button>
	</header>

	{#if expanded}
		<div class="case__detail" id="{entry.id}-detail">
			<div class="case__demo">
				<Cube3D
					bind:this={cube}
					bind:facelets={demo}
					size={190}
					label="{entry.name} demonstration"
				/>
				<div class="case__demo-tools">
					<Button size="sm" variant="section" onclick={() => run(algs[0].moves)} disabled={running}>
						{running ? 'Running…' : 'Watch it'}
					</Button>
					<Button size="sm" variant="ghost" onclick={reset}>Reset</Button>
				</div>
			</div>

			<div class="case__body">
				<h4 class="case__subhead">
					{algs.length === 1 ? 'The algorithm' : `${algs.length} ways to solve it`}
				</h4>
				<ul class="variants">
					{#each algs as variant, i (variant.moves)}
						<li class="variant" class:variant--primary={i === 0}>
							<div class="variant__head">
								{#if variant.label}<Chip tone={i === 0 ? 'section' : 'neutral'}
										>{variant.label}</Chip
									>{/if}
								{#if i === 0 && !variant.label}<Chip tone="section">Recommended</Chip>{/if}
								<span class="variant__count">{htmLength(parseAlg(variant.moves))} moves</span>
							</div>
							<div class="variant__alg scroll-x">
								<AlgString alg={variant.moves} size="sm" wrap={false} />
							</div>
							{#if variant.note}<p class="variant__note">{variant.note}</p>{/if}
							<Button
								size="sm"
								variant="ghost"
								onclick={() => run(variant.moves)}
								disabled={running}
							>
								Watch this one
							</Button>
						</li>
					{/each}
				</ul>

				{#if entry.notes}
					<h4 class="case__subhead">Worth knowing</h4>
					<p class="case__notes">{entry.notes}</p>
				{/if}

				{#if entry.triggers?.length}
					<h4 class="case__subhead">Triggers inside it</h4>
					<div class="tags">
						{#each entry.triggers as trigger (trigger)}
							<Chip tone="accent">{trigger}</Chip>
						{/each}
					</div>
				{/if}

				<div class="case__foot">
					{#if entry.tags?.length}
						<div class="tags">
							{#each entry.tags as tag (tag)}
								<Chip>{tag}</Chip>
							{/each}
						</div>
					{/if}
					<label class="learned">
						<input
							type="checkbox"
							checked={progress.caseProgress(entry.id)?.pinned ?? false}
							onchange={(e) => progress.setPinned(entry.id, e.currentTarget.checked)}
						/>
						I know this one
					</label>
				</div>
			</div>
		</div>
	{/if}
</article>

<style>
	.case {
		/*
		 * A full set page carries 57 case diagrams, which is about 1,200 SVG
		 * rectangles. The markup compresses to a few kilobytes, so transfer is not
		 * the problem — laying it all out is. `content-visibility` lets the browser
		 * skip that work for cards that are off screen, while keeping the markup
		 * complete for search engines and for readers without JavaScript.
		 */
		content-visibility: auto;
		contain-intrinsic-size: auto 9rem;
		background: var(--surface-1);
		border: var(--border);
		border-radius: var(--radius-3);
		overflow: hidden;
		transition: border-color var(--dur-fast) var(--ease-out);
		scroll-margin-block-start: calc(var(--header-height) + var(--space-4));
	}

	.case--open {
		border-color: var(--section-edge);
	}

	.case__head {
		display: grid;
		grid-template-columns: auto minmax(0, 1fr) auto;
		gap: var(--space-4);
		align-items: start;
		padding: var(--space-4);
	}

	.case__diagram {
		display: grid;
		place-items: center;
	}

	.case__summary {
		display: grid;
		gap: var(--space-2);
		min-width: 0;
	}

	.case__titles {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: var(--space-2);
	}

	.case__name {
		font-size: var(--step-1);
		font-weight: 640;
	}

	.case__short {
		color: var(--text-faint);
		font-family: var(--font-mono);
		font-size: var(--step--1);
	}

	.case__meta {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
	}

	.case__alg {
		padding: var(--space-2) var(--space-3);
		background: var(--surface-2);
		border-radius: var(--radius-2);
	}

	.case__recognition {
		color: var(--text-muted);
		font-size: var(--step--1);
		line-height: var(--leading-snug);
	}

	.case__toggle {
		display: grid;
		place-items: center;
		padding: var(--space-2);
		border-radius: var(--radius-2);
		color: var(--text-muted);
		transition:
			transform var(--dur-fast) var(--ease-out),
			background var(--dur-fast) var(--ease-out);
	}

	.case__toggle:hover {
		background: var(--surface-2);
		color: var(--text);
	}

	.case--open .case__toggle {
		transform: rotate(180deg);
	}

	.case__detail {
		display: grid;
		grid-template-columns: auto minmax(0, 1fr);
		gap: var(--space-5);
		padding: var(--space-5);
		border-top: var(--border);
		background: var(--surface-2);
	}

	.case__demo {
		display: grid;
		justify-items: center;
		gap: var(--space-3);
		align-content: start;
	}

	.case__demo-tools {
		display: flex;
		gap: var(--space-2);
	}

	.case__body {
		display: grid;
		gap: var(--space-3);
		min-width: 0;
		align-content: start;
	}

	.case__subhead {
		color: var(--text-faint);
		font-size: var(--step--2);
		font-weight: 600;
		letter-spacing: var(--tracking-caps);
		text-transform: uppercase;
	}

	.variants {
		display: grid;
		gap: var(--space-3);
		padding: 0;
		list-style: none;
	}

	.variant {
		display: grid;
		gap: var(--space-2);
		justify-items: start;
		padding: var(--space-3);
		background: var(--surface-1);
		border: var(--border);
		border-radius: var(--radius-2);
		min-width: 0;
	}

	.variant--primary {
		border-color: var(--section-edge);
	}

	.variant__head {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--space-2);
	}

	.variant__count {
		color: var(--text-faint);
		font-size: var(--step--2);
		font-variant-numeric: tabular-nums;
	}

	.variant__alg {
		width: 100%;
	}

	.variant__note {
		color: var(--text-muted);
		font-size: var(--step--1);
	}

	.case__notes {
		color: var(--text-muted);
		font-size: var(--step--1);
		line-height: var(--leading-normal);
	}

	.tags {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
	}

	.case__foot {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-3);
		padding-block-start: var(--space-3);
		border-top: var(--border);
	}

	.learned {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		color: var(--text-muted);
		font-size: var(--step--1);
		cursor: pointer;
	}

	.learned input {
		accent-color: var(--section);
	}

	@media (max-width: 48rem) {
		.case__head {
			grid-template-columns: auto minmax(0, 1fr);
			grid-template-areas: 'diagram toggle' 'summary summary';
		}
		.case__diagram {
			grid-area: diagram;
		}
		.case__toggle {
			grid-area: toggle;
			justify-self: end;
		}
		.case__summary {
			grid-area: summary;
		}
		.case__detail {
			grid-template-columns: minmax(0, 1fr);
		}
	}
</style>
