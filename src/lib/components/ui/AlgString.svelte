<!--
	An algorithm, set as notation.

	Every move is its own token so that turn direction reads at a glance: the
	prime mark is superscripted and tinted, half turns are marked, and wide turns
	and rotations are toned differently from plain face turns because they mean
	something different for your hands. Invalid notation degrades to plain text
	rather than throwing — a case with a typo should still render, and the test
	suite is what catches the typo.

	**Big-cube notation is printed exactly as written.** The 3×3 parser
	canonicalises names, and one of its aliases is `2R → Rw`, which is harmless on
	a cube with a single inner layer and catastrophic on a 4×4: `2R` is the slice
	on its own and `Rw` drags the face with it, so rewriting one as the other turns
	a parity algorithm into a scramble. Anything that is not a 3×3 therefore skips
	the canonicaliser altogether and renders its own tokens, classified by the N×N
	parser purely for colour.

	For the same reason the `Rw` versus `r` preference applies only to the 3×3.
	Lowercase `r` means the slice in some big-cube sources and the wide turn in
	others; on a puzzle where those differ, the site does not introduce the
	ambiguity into notation a reader is about to copy.
-->
<script lang="ts">
	import { formatAlg, htmLength, parseAlg, type Move } from '$cube/moves';
	import { puzzle, type PuzzleSize } from '$cube/puzzle';
	import { tokenise } from '$cube/puzzleState';
	import { settings } from '$state/settings.svelte';

	interface Props {
		alg: string;
		/** Which puzzle the notation is for. Defaults to the 3×3. */
		order?: PuzzleSize;
		/** Show the move count after the notation. */
		count?: boolean;
		size?: 'sm' | 'md' | 'lg';
		/** Highlight the move at this position, for step-by-step playback. */
		active?: number;
		/** Called when a move token is clicked. */
		onmove?: (index: number) => void;
		/** Wrap onto several lines rather than scrolling sideways. */
		wrap?: boolean;
		class?: string;
	}

	let {
		alg,
		order = 3,
		count = false,
		size = 'md',
		active,
		onmove,
		wrap = true,
		class: className = ''
	}: Props = $props();

	/** One rendered token: the text to print and what to colour it. */
	interface Token {
		text: string;
		kind: 'face' | 'wide' | 'slice' | 'rotation';
	}

	function kindOfMove(move: Move): Token['kind'] {
		if ('xyz'.includes(move.base)) return 'rotation';
		if (move.base.endsWith('w')) return 'wide';
		if ('MES'.includes(move.base)) return 'slice';
		return 'face';
	}

	/** Respect the reader's preference for `Rw` versus `r`. 3×3 only. */
	function display(move: Move): string {
		if (settings.current.wideNotation === 'r' && move.base.endsWith('w')) {
			return move.base[0].toLowerCase() + move.name.slice(move.base.length);
		}
		return move.name;
	}

	/** Classify a big-cube token without changing a character of it. */
	function kindOfToken(name: string): Token['kind'] {
		if (/^[xyz]/.test(name)) return 'rotation';
		if (/w/i.test(name)) return 'wide';
		// A bare depth prefix names one inner layer: `2R` is a slice, `R` is a face.
		if (/^\d/.test(name)) return 'slice';
		if (/^[MES]/.test(name)) return 'slice';
		if (/^[a-z]/.test(name)) return 'wide';
		return 'face';
	}

	const tokens = $derived.by((): Token[] | null => {
		if (order === 3) {
			try {
				return parseAlg(alg).map((move) => ({ text: display(move), kind: kindOfMove(move) }));
			} catch {
				return null;
			}
		}
		const engine = puzzle(order);
		const names = tokenise(alg);
		if (names.length === 0 || names.some((name) => engine.parse(name) === null)) return null;
		return names.map((name) => ({ text: name, kind: kindOfToken(name) }));
	});

	/** Move count. The 3×3 metric knows about rotations; elsewhere, count turns. */
	const length = $derived.by(() => {
		if (!tokens) return 0;
		if (order === 3) {
			try {
				return htmLength(parseAlg(alg));
			} catch {
				return 0;
			}
		}
		return tokens.filter((t) => t.kind !== 'rotation').length;
	});

	const label = $derived.by(() => {
		if (!tokens) return alg;
		if (order === 3) {
			try {
				return formatAlg(parseAlg(alg));
			} catch {
				return alg;
			}
		}
		return tokens.map((t) => t.text).join(' ');
	});
</script>

{#if tokens === null}
	<code class="alg alg--{size} alg--broken {className}" title="This notation could not be read">
		{alg}
	</code>
{:else}
	<span
		class="alg alg--{size} {className}"
		class:alg--wrap={wrap}
		class:alg--scroll={!wrap}
		aria-label={label}
	>
		{#each tokens as token, i (i)}
			{@const base = token.text.replace(/['2]+$/, '')}
			{@const suffix = token.text.slice(base.length)}
			<svelte:element
				this={onmove ? 'button' : 'span'}
				role={onmove ? 'button' : undefined}
				type={onmove ? 'button' : undefined}
				class="move move--{token.kind}"
				class:move--active={active === i}
				class:move--clickable={onmove !== undefined}
				onclick={onmove ? () => onmove(i) : undefined}
			>
				{base}{#if suffix}<sup class="suffix">{suffix}</sup>{/if}
			</svelte:element>
		{/each}
		{#if count && settings.current.showMoveCounts}
			<span class="count" title="Moves, half-turn metric">{length}</span>
		{/if}
	</span>
{/if}

<style>
	.alg {
		display: inline-flex;
		align-items: center;
		gap: 0.28em;
		font-family: var(--font-mono);
		font-variant-ligatures: none;
		line-height: 1.5;
		vertical-align: middle;
	}

	.alg--wrap {
		flex-wrap: wrap;
	}

	.alg--scroll {
		flex-wrap: nowrap;
		overflow-x: auto;
		overscroll-behavior-x: contain;
		scrollbar-width: thin;
		max-width: 100%;
	}

	.alg--sm {
		font-size: var(--step--1);
	}
	.alg--md {
		font-size: var(--step-0);
	}
	.alg--lg {
		font-size: var(--step-1);
	}

	.alg--broken {
		color: var(--danger);
		text-decoration: underline wavy;
		text-underline-offset: 3px;
	}

	.move {
		display: inline-flex;
		align-items: flex-start;
		padding: 0.1em 0.34em;
		border: 1px solid transparent;
		border-radius: var(--radius-1);
		background: var(--surface-3);
		color: var(--text);
		font-weight: 550;
		white-space: nowrap;
		transition:
			background var(--dur-fast) var(--ease-out),
			border-color var(--dur-fast) var(--ease-out),
			transform var(--dur-fast) var(--ease-out);
	}

	/* Wide turns and rotations move more of the cube, so they read differently. */
	.move--wide {
		background: color-mix(in oklab, var(--section) 16%, var(--surface-3));
		border-color: color-mix(in oklab, var(--section) 28%, transparent);
	}

	.move--slice {
		background: color-mix(in oklab, var(--accent) 14%, var(--surface-3));
		border-color: color-mix(in oklab, var(--accent) 26%, transparent);
	}

	.move--rotation {
		background: transparent;
		border-color: var(--hairline-strong);
		color: var(--text-muted);
		font-style: italic;
	}

	.move--clickable {
		cursor: pointer;
	}

	.move--clickable:hover {
		background: var(--surface-raised);
		border-color: var(--hairline-strong);
	}

	.move--active {
		background: var(--accent);
		border-color: var(--accent);
		color: var(--accent-contrast);
		transform: translateY(-1px);
	}

	.suffix {
		font-size: 0.72em;
		line-height: 1;
		margin-left: 0.04em;
		color: color-mix(in oklab, currentColor 75%, transparent);
	}

	.move--active .suffix {
		color: currentColor;
	}

	.count {
		margin-left: 0.2em;
		padding: 0.08em 0.42em;
		border-radius: var(--radius-pill);
		background: transparent;
		border: 1px solid var(--hairline);
		color: var(--text-faint);
		font-size: 0.78em;
		font-variant-numeric: tabular-nums;
	}
</style>
