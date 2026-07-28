<!--
	The puzzle switch.

	Wider-reaching than the skill picker next to it: it changes the cube you are
	looking at, the algorithms the library lists, the length of a scramble and
	which lessons apply. So it says the size on its face at every breakpoint —
	unlike the skill label, which folds away on narrow screens — and it draws each
	option as the grid it stands for, because "2×2" and "4×4" look far too alike
	in a menu you are scanning at a glance.
-->
<script lang="ts">
	import type { PuzzleSize } from '$cube/puzzle';
	import {
		AVAILABLE_PUZZLES,
		PUZZLE_BLURBS,
		PUZZLE_FULL_NAMES,
		PUZZLE_LABELS,
		settings
	} from '$state/settings.svelte';

	interface Props {
		/** Header form: a compact popover rather than a row of cards. */
		compact?: boolean;
	}

	let { compact = false }: Props = $props();
	let open = $state(false);
	const current = $derived(settings.current.puzzle);

	function choose(size: PuzzleSize) {
		settings.set('puzzle', size);
		open = false;
	}
</script>

{#snippet grid(size: PuzzleSize, active: boolean)}
	<!--
		A flat n×n of squares. Not the cube logo — just the face you are about to
		be looking at, which is also the fastest way to tell 2×2 from 4×4.
	-->
	<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" class="grid">
		{#each { length: size * size } as _, i (i)}
			{@const cellSize = 24 / size}
			{@const pad = Math.max(0.6, cellSize * 0.09)}
			<rect
				x={(i % size) * cellSize + pad}
				y={Math.floor(i / size) * cellSize + pad}
				width={cellSize - pad * 2}
				height={cellSize - pad * 2}
				rx={Math.max(1, cellSize * 0.16)}
				fill={active ? 'var(--section)' : 'currentColor'}
				opacity={active ? 1 : 0.55}
			/>
		{/each}
	</svg>
{/snippet}

<svelte:window
	onkeydown={(e) => {
		if (e.key === 'Escape') open = false;
	}}
/>

{#if compact}
	<div class="picker">
		<button
			type="button"
			class="trigger"
			aria-expanded={open}
			aria-haspopup="true"
			onclick={() => (open = !open)}
		>
			{@render grid(current, true)}
			<span class="trigger__label">{PUZZLE_LABELS[current]}</span>
			<svg viewBox="0 0 24 24" width="12" height="12" aria-hidden="true" class="caret">
				<path
					d="M6 9l6 6 6-6"
					fill="none"
					stroke="currentColor"
					stroke-width="2.5"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
			<span class="visually-hidden">
				Puzzle: {PUZZLE_FULL_NAMES[current]}. Change which puzzle the site is about.
			</span>
		</button>

		{#if open}
			<button type="button" class="scrim" aria-label="Close menu" onclick={() => (open = false)}
			></button>
			<div class="menu" role="menu">
				<p class="menu__title">I'm solving a</p>
				{#each AVAILABLE_PUZZLES as size (size)}
					<button
						type="button"
						role="menuitemradio"
						aria-checked={current === size}
						class="option"
						class:option--on={current === size}
						onclick={() => choose(size)}
					>
						<span class="option__mark">{@render grid(size, current === size)}</span>
						<span class="option__text">
							<span class="option__label">{PUZZLE_FULL_NAMES[size]}</span>
							<span class="option__blurb">{PUZZLE_BLURBS[size]}</span>
						</span>
					</button>
				{/each}
				<p class="menu__foot">5×5 turns correctly already, but has no lessons yet.</p>
			</div>
		{/if}
	</div>
{:else}
	<div class="cards">
		{#each AVAILABLE_PUZZLES as size (size)}
			<button
				type="button"
				class="card"
				class:card--on={current === size}
				aria-pressed={current === size}
				onclick={() => choose(size)}
			>
				<span class="card__mark">{@render grid(size, current === size)}</span>
				<span class="card__label">{PUZZLE_FULL_NAMES[size]}</span>
				<span class="card__blurb">{PUZZLE_BLURBS[size]}</span>
			</button>
		{/each}
	</div>
{/if}

<style>
	.picker {
		position: relative;
	}

	.trigger {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-2) var(--space-3);
		border: var(--border);
		border-radius: var(--radius-2);
		color: var(--text-muted);
		font-size: var(--step--1);
		font-weight: 560;
		font-variant-numeric: tabular-nums;
	}

	.trigger:hover {
		color: var(--text);
		border-color: var(--hairline-strong);
	}

	.trigger__label {
		/* Deliberately never hidden: this is the one control whose current value
		   you need to see before you trust anything else on the page. */
		white-space: nowrap;
	}

	.caret {
		color: var(--text-faint);
		transition: transform var(--dur-fast) var(--ease-out);
	}

	.trigger[aria-expanded='true'] .caret {
		transform: rotate(180deg);
	}

	.grid {
		display: block;
		flex-shrink: 0;
	}

	.scrim {
		position: fixed;
		inset: 0;
		z-index: 45;
	}

	.menu {
		position: absolute;
		inset-inline-end: 0;
		top: calc(100% + var(--space-2));
		z-index: 50;
		width: min(24rem, calc(100vw - 2rem));
		padding: var(--space-2);
		background: var(--surface-raised);
		border: var(--border-strong);
		border-radius: var(--radius-3);
		box-shadow: var(--shadow-4);
	}

	.menu__title {
		padding: var(--space-2) var(--space-3);
		color: var(--text-faint);
		font-size: var(--step--2);
		letter-spacing: var(--tracking-caps);
		text-transform: uppercase;
	}

	.menu__foot {
		padding: var(--space-2) var(--space-3) var(--space-1);
		color: var(--text-faint);
		font-size: var(--step--2);
		border-top: var(--border);
		margin-top: var(--space-2);
	}

	.option {
		display: grid;
		grid-template-columns: auto 1fr;
		align-items: start;
		gap: var(--space-3);
		width: 100%;
		padding: var(--space-3);
		border: 1px solid transparent;
		border-radius: var(--radius-2);
		text-align: start;
	}

	.option:hover {
		background: var(--surface-2);
	}

	.option--on {
		background: var(--section-wash);
		border-color: var(--section-edge);
	}

	.option__mark {
		display: grid;
		place-items: center;
		width: 1.75rem;
		height: 1.75rem;
		color: var(--text-faint);
	}

	.option__text {
		display: grid;
		gap: 2px;
	}

	.option__label,
	.card__label {
		color: var(--text);
		font-weight: 600;
	}

	.option__blurb,
	.card__blurb {
		color: var(--text-muted);
		font-size: var(--step--1);
		line-height: var(--leading-snug);
	}

	.cards {
		display: grid;
		gap: var(--space-3);
		grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
	}

	.card {
		display: grid;
		gap: var(--space-1);
		padding: var(--space-4);
		border: var(--border);
		border-radius: var(--radius-3);
		background: var(--surface-1);
		text-align: start;
	}

	.card:hover {
		background: var(--surface-2);
	}

	.card--on {
		background: var(--section-wash);
		border-color: var(--section-edge);
	}

	.card__mark {
		color: var(--text-faint);
		margin-bottom: var(--space-1);
	}
</style>
