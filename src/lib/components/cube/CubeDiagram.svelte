<!--
	A still picture of a cube state.

	Two layouts, both drawn as SVG so they stay crisp at any size and print well:

	- **flat** — the last layer seen from above with the top row of each side face
	  folded outwards. This is the diagram every OLL and PLL chart uses, and it is
	  the only view that shows all the information a last-layer case contains.
	- **iso** — an isometric projection showing the U, F and R faces, which is what
	  you want for F2L, the cross, and anything involving the lower two layers.

	The `view` prop also decides how stickers are coloured: an `oll` view shows
	orientation only (top colour versus not), everything else shows real colours.
-->
<script lang="ts">
	import { caseArrows, flatLayout, paintSticker, type DiagramView } from '$cube/mask';
	import { UNSET } from '$cube/facelets';
	import type { PuzzleSize } from '$cube/puzzle';
	import { FACE_NAMES, type Face, type Facelets } from '$cube/types';
	import { settings } from '$state/settings.svelte';

	interface Props {
		facelets: Facelets;
		view?: DiagramView;
		/** How many layers a side. Defaults to the 3×3. */
		order?: PuzzleSize;
		/** Pixel size of the rendered square. */
		size?: number;
		/** Draw permutation arrows. Defaults to on for the `pll` view. */
		arrows?: boolean;
		/** Accessible description. A sensible one is generated when omitted. */
		label?: string;
		/** Called with a facelet index when a sticker is clicked, if provided. */
		onsticker?: (index: number) => void;
		/** Facelet indices to draw with a highlight ring. */
		highlight?: readonly number[];
		class?: string;
	}

	let {
		facelets,
		view = 'last-layer',
		order = 3,
		size = 132,
		arrows,
		label,
		onsticker,
		highlight = [],
		class: className = ''
	}: Props = $props();

	const isFlat = $derived(view === 'oll' || view === 'pll' || view === 'last-layer');
	// Arrows are worked out from the 3×3 piece model, so they are offered only
	// there. A 2×2 PBL diagram reads perfectly well from its colours alone.
	const showArrows = $derived((arrows ?? view === 'pll') && order === 3);
	const stride = $derived(order * order);
	const layout = $derived(flatLayout(order));
	const interactive = $derived(onsticker !== undefined);
	const highlighted = $derived(new Set(highlight));

	// --- flat geometry ------------------------------------------------------
	// The drawing keeps a fixed extent whatever the size, so a 2×2 and a 3×3
	// diagram sit at the same weight on the page; only the stickers get finer.
	// At size 3 the numbers come out at exactly the 20/8/2 they were written as.
	const SIDE = 8;
	const GAP = 2;
	const ORIGIN = SIDE + GAP * 2;
	const EXTENT = 88;
	const TOP = $derived((EXTENT - ORIGIN * 2 - GAP * (order - 1)) / order);
	const PITCH = $derived(TOP + GAP);

	/** Where a flat-layout cell sits, given its grid column and row. */
	function flatRect(col: number, row: number) {
		const outer = order + 1;
		const axis = (n: number) =>
			n === 0 ? 0 : n === outer ? EXTENT - SIDE : ORIGIN + (n - 1) * PITCH;
		const span = (n: number) => (n === 0 || n === outer ? SIDE : TOP);
		return { x: axis(col), y: axis(row), width: span(col), height: span(row) };
	}

	/** Centre of a facelet in flat coordinates, for anchoring arrows. */
	function flatCentre(index: number) {
		const cell = layout.find((s) => s.index === index);
		if (!cell) return { x: EXTENT / 2, y: EXTENT / 2 };
		const r = flatRect(cell.col, cell.row);
		return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
	}

	// --- isometric geometry -------------------------------------------------
	// Project a unit-cube point with y up, x right, z towards the viewer.
	const ISO_SCALE = 30;
	function project(x: number, y: number, z: number) {
		return {
			x: (x - z) * 0.866 * ISO_SCALE + EXTENT / 2,
			y: ((x + z) * 0.5 - y) * ISO_SCALE + EXTENT * 0.34
		};
	}

	/** The four corners of one sticker on one of the three visible faces. */
	function isoQuad(face: Face, row: number, col: number) {
		const lo = (n: number) => n / order;
		const hi = (n: number) => (n + 1) / order;
		let corners: [number, number, number][];
		if (face === 0) {
			// U: rows run back to front, columns left to right.
			corners = [
				[lo(col), 1, lo(row)],
				[hi(col), 1, lo(row)],
				[hi(col), 1, hi(row)],
				[lo(col), 1, hi(row)]
			];
		} else if (face === 2) {
			// F: rows run top to bottom, columns left to right.
			corners = [
				[lo(col), 1 - lo(row), 1],
				[hi(col), 1 - lo(row), 1],
				[hi(col), 1 - hi(row), 1],
				[lo(col), 1 - hi(row), 1]
			];
		} else {
			// R: columns run from the front edge backwards.
			corners = [
				[1, 1 - lo(row), 1 - lo(col)],
				[1, 1 - lo(row), 1 - hi(col)],
				[1, 1 - hi(row), 1 - hi(col)],
				[1, 1 - hi(row), 1 - lo(col)]
			];
		}
		return corners
			.map(([x, y, z]) => project(x, y, z))
			.map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`)
			.join(' ');
	}

	const ISO_CELLS = $derived(
		([0, 2, 1] as Face[]).flatMap((face) =>
			Array.from({ length: stride }, (_, i) => ({
				face,
				index: face * stride + i,
				points: isoQuad(face, Math.floor(i / order), i % order)
			}))
		)
	);

	// --- painting -----------------------------------------------------------
	const FILL: Record<number, string> = {
		0: 'var(--sticker-u)',
		1: 'var(--sticker-r)',
		2: 'var(--sticker-f)',
		3: 'var(--sticker-d)',
		4: 'var(--sticker-l)',
		5: 'var(--sticker-b)'
	};
	const STROKE: Record<number, string> = {
		0: 'var(--sticker-u-edge)',
		1: 'var(--sticker-r-edge)',
		2: 'var(--sticker-f-edge)',
		3: 'var(--sticker-d-edge)',
		4: 'var(--sticker-l-edge)',
		5: 'var(--sticker-b-edge)'
	};

	function fillFor(index: number): string {
		const colour = facelets[index];
		if (colour === UNSET) return 'var(--sticker-none)';
		if (view === 'oll') return colour === 0 ? 'var(--sticker-d)' : 'var(--sticker-ignored)';
		return FILL[colour] ?? 'var(--sticker-none)';
	}

	function strokeFor(index: number): string {
		const colour = facelets[index];
		if (colour === UNSET) return 'var(--hairline-strong)';
		if (view === 'oll') return colour === 0 ? 'var(--sticker-d-edge)' : 'var(--hairline-strong)';
		return STROKE[colour] ?? 'var(--hairline-strong)';
	}

	function letterFor(index: number): string {
		if (!settings.current.stickerLetters || view === 'oll') return '';
		const colour = facelets[index];
		return colour === UNSET ? '' : FACE_NAMES[colour as Face];
	}

	const arrowList = $derived(showArrows ? caseArrows(facelets) : []);

	const description = $derived(
		label ??
			(view === 'oll'
				? 'Orientation of the last layer: shaded squares already show the top colour.'
				: view === 'pll'
					? 'Permutation of the last layer, with arrows showing where each piece must travel.'
					: 'A cube state.')
	);
</script>

<svg
	class="diagram {className}"
	class:diagram--interactive={interactive}
	viewBox="0 0 {EXTENT} {EXTENT}"
	width={size}
	height={size}
	role="img"
	aria-label={description}
>
	<defs>
		<marker
			id="cube-arrowhead"
			viewBox="0 0 10 10"
			refX="8"
			refY="5"
			markerWidth="5"
			markerHeight="5"
			orient="auto-start-reverse"
		>
			<path d="M 0 0 L 10 5 L 0 10 z" fill="var(--text)" />
		</marker>
	</defs>

	{#if isFlat}
		{#each layout as cell (cell.index)}
			{@const r = flatRect(cell.col, cell.row)}
			{@const paint = paintSticker(facelets, cell, view)}
			<g class="cell" class:cell--side={cell.kind === 'side'}>
				{#if interactive}
					<rect
						x={r.x}
						y={r.y}
						width={r.width}
						height={r.height}
						rx={cell.kind === 'top' ? Math.min(3, TOP * 0.15) : 2}
						fill={fillFor(cell.index)}
						stroke={strokeFor(cell.index)}
						stroke-width="1"
						class="sticker sticker--button"
						class:sticker--blank={paint.kind === 'blank'}
						class:sticker--highlight={highlighted.has(cell.index)}
						role="button"
						tabindex="0"
						aria-label="{FACE_NAMES[cell.face]} face sticker"
						onclick={() => onsticker?.(cell.index)}
						onkeydown={(e) => {
							if (e.key === 'Enter' || e.key === ' ') {
								e.preventDefault();
								onsticker?.(cell.index);
							}
						}}
					/>
				{:else}
					<rect
						x={r.x}
						y={r.y}
						width={r.width}
						height={r.height}
						rx={cell.kind === 'top' ? Math.min(3, TOP * 0.15) : 2}
						fill={fillFor(cell.index)}
						stroke={strokeFor(cell.index)}
						stroke-width="1"
						class="sticker"
						class:sticker--highlight={highlighted.has(cell.index)}
					/>
				{/if}
				{#if cell.kind === 'top' && letterFor(cell.index)}
					<text
						x={r.x + r.width / 2}
						y={r.y + r.height / 2}
						class="letter"
						class:letter--dark={facelets[cell.index] === 0 || facelets[cell.index] === 3}
					>
						{letterFor(cell.index)}
					</text>
				{/if}
			</g>
		{/each}

		{#each arrowList as arrow, i (i)}
			{@const from = flatCentre(arrow.from)}
			{@const to = flatCentre(arrow.to)}
			<line
				x1={from.x}
				y1={from.y}
				x2={to.x}
				y2={to.y}
				class="arrow"
				class:arrow--edge={arrow.kind === 'edge'}
				marker-end="url(#cube-arrowhead)"
				marker-start={arrow.swap ? 'url(#cube-arrowhead)' : undefined}
			/>
		{/each}
	{:else}
		{#each ISO_CELLS as cell (cell.index)}
			{#if interactive}
				<polygon
					points={cell.points}
					fill={fillFor(cell.index)}
					stroke="var(--bg-deep)"
					stroke-width="1.2"
					stroke-linejoin="round"
					class="sticker sticker--button"
					class:sticker--highlight={highlighted.has(cell.index)}
					role="button"
					tabindex="0"
					aria-label="{FACE_NAMES[cell.face]} face sticker"
					onclick={() => onsticker?.(cell.index)}
					onkeydown={(e) => {
						if (e.key === 'Enter' || e.key === ' ') {
							e.preventDefault();
							onsticker?.(cell.index);
						}
					}}
				/>
			{:else}
				<polygon
					points={cell.points}
					fill={fillFor(cell.index)}
					stroke="var(--bg-deep)"
					stroke-width="1.2"
					stroke-linejoin="round"
					class="sticker"
					class:sticker--highlight={highlighted.has(cell.index)}
				/>
			{/if}
		{/each}
	{/if}
</svg>

<style>
	.diagram {
		display: block;
		max-width: 100%;
		height: auto;
		overflow: visible;
	}

	.sticker {
		transition:
			fill var(--dur-fast) var(--ease-out),
			stroke var(--dur-fast) var(--ease-out);
	}

	.sticker--button {
		cursor: pointer;
	}

	.diagram--interactive .sticker--button:hover {
		stroke: var(--accent);
		stroke-width: 2;
	}

	.sticker--blank {
		stroke-dasharray: 3 2;
	}

	.sticker--highlight {
		stroke: var(--accent);
		stroke-width: 2.5;
	}

	.letter {
		font-family: var(--font-mono);
		font-size: 11px;
		font-weight: 600;
		text-anchor: middle;
		dominant-baseline: central;
		fill: color-mix(in oklab, var(--text-inverse) 70%, transparent);
		pointer-events: none;
	}

	.letter--dark {
		fill: color-mix(in oklab, #000 60%, transparent);
	}

	.arrow {
		stroke: var(--text);
		stroke-width: 2.5;
		stroke-linecap: round;
		opacity: 0.85;
	}

	.arrow--edge {
		stroke-dasharray: 5 3;
	}
</style>
