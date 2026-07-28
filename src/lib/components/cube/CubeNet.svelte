<!--
	The cube unfolded flat.

	Laid out as the usual cross — up above the front, down below it, and left,
	front, right, back in a row — which happens to mean every face renders as a
	plain row-major grid with no index gymnastics. That is not a coincidence: the
	sticker numbering was chosen to make this the natural layout, and it holds at
	every size.

	Doubles as the sticker editor. Pass `onpaint` and every sticker becomes a
	button; anchors are never editable, because they are what define the colour
	scheme. On a 3×3 or 5×5 that means the centres, on a 2×2 the reference corner,
	and on a 4×4 nothing at all — see `puzzleState.anchors`.
-->
<script lang="ts">
	import { UNSET } from '$cube/facelets';
	import { puzzle, type PuzzleSize } from '$cube/puzzle';
	import { anchors } from '$cube/puzzleState';
	import { FACE_NAMES, type Face, type Facelets } from '$cube/types';
	import { settings } from '$state/settings.svelte';

	interface Props {
		facelets: Facelets;
		/** How many layers a side. Defaults to the 3×3. */
		order?: PuzzleSize;
		/** Called with the facelet index when a sticker is activated. */
		onpaint?: (index: number) => void;
		/** Stickers to ring, e.g. the ones a validation error points at. */
		highlight?: readonly number[];
		/** The sticker the keyboard is currently on, for guided entry. */
		cursor?: number;
		size?: number;
		/** Show the face letter under each face. */
		labels?: boolean;
		class?: string;
	}

	let {
		facelets,
		order = 3,
		onpaint,
		highlight = [],
		cursor,
		size = 300,
		labels = true,
		class: className = ''
	}: Props = $props();

	const cube = $derived(puzzle(order));

	/** Face, and where its grid sits in the 4×3 arrangement of faces. */
	const LAYOUT: { face: Face; col: number; row: number }[] = [
		{ face: 0, col: 1, row: 0 }, // U
		{ face: 4, col: 0, row: 1 }, // L
		{ face: 2, col: 1, row: 1 }, // F
		{ face: 1, col: 2, row: 1 }, // R
		{ face: 5, col: 3, row: 1 }, // B
		{ face: 3, col: 1, row: 2 } // D
	];

	// A face keeps the same drawn width whatever the size, so the net stays the
	// same shape on the page and only the stickers inside it get finer.
	const FACE_SPAN = 51;
	const GAP = $derived(order > 3 ? 1 : 1.5);
	const CELL = $derived((FACE_SPAN - GAP * (order - 1)) / order);
	const RADIUS = $derived(Math.max(1, CELL * 0.16));
	const FACE_GAP = 6;
	const WIDTH = FACE_SPAN * 4 + FACE_GAP * 3;
	const HEIGHT = $derived(FACE_SPAN * 3 + FACE_GAP * 2 + (labels ? 8 : 0));

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

	const fixed = $derived(anchors(cube));
	const highlighted = $derived(new Set(highlight));

	function cellPosition(spot: { col: number; row: number }, i: number) {
		const originX = spot.col * (FACE_SPAN + FACE_GAP);
		const originY = spot.row * (FACE_SPAN + FACE_GAP);
		return {
			x: originX + (i % order) * (CELL + GAP),
			y: originY + Math.floor(i / order) * (CELL + GAP)
		};
	}

	/** Painting drag: hold the pointer down and sweep across several stickers. */
	let painting = $state(false);

	function paint(index: number) {
		if (!onpaint || fixed.has(index)) return;
		onpaint(index);
	}
</script>

<!--
	The analyser cannot follow the conditional: `tabindex` is only set on stickers
	that also carry `role="button"`, and centres get neither.
-->
<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<svg
	class="net {className}"
	class:net--editable={onpaint !== undefined}
	viewBox="0 0 {WIDTH} {HEIGHT}"
	width={size}
	height={(size * HEIGHT) / WIDTH}
	role={onpaint ? 'group' : 'img'}
	aria-label={onpaint ? 'Sticker editor: the cube unfolded flat' : 'The cube unfolded flat'}
	onpointerup={() => (painting = false)}
	onpointerleave={() => (painting = false)}
>
	{#each LAYOUT as spot (spot.face)}
		{@const originX = spot.col * (FACE_SPAN + FACE_GAP)}
		{@const originY = spot.row * (FACE_SPAN + FACE_GAP)}

		<rect
			x={originX - 2}
			y={originY - 2}
			width={FACE_SPAN + 4}
			height={FACE_SPAN + 4}
			rx="4"
			class="face-plate"
		/>

		{#each { length: cube.faceStride } as _, i (i)}
			{@const index = spot.face * cube.faceStride + i}
			{@const pos = cellPosition(spot, i)}
			{@const colour = facelets[index]}
			{@const isCentre = fixed.has(index)}
			<g>
				<rect
					x={pos.x}
					y={pos.y}
					width={CELL}
					height={CELL}
					rx={RADIUS}
					fill={colour === UNSET ? 'var(--sticker-none)' : FILL[colour]}
					stroke={colour === UNSET ? 'var(--hairline-strong)' : STROKE[colour]}
					stroke-width="0.8"
					class="sticker"
					class:sticker--blank={colour === UNSET}
					class:sticker--centre={isCentre}
					class:sticker--editable={onpaint && !isCentre}
					class:sticker--highlight={highlighted.has(index)}
					class:sticker--cursor={cursor === index}
					role={onpaint && !isCentre ? 'button' : undefined}
					tabindex={onpaint && !isCentre ? 0 : undefined}
					aria-label={onpaint && !isCentre
						? `${FACE_NAMES[spot.face]} face, row ${Math.floor(i / order) + 1}, column ${(i % order) + 1}${colour === UNSET ? ', not set' : `, ${FACE_NAMES[colour as Face]}`}`
						: undefined}
					onpointerdown={onpaint && !isCentre
						? () => {
								painting = true;
								paint(index);
							}
						: undefined}
					onpointerenter={onpaint && !isCentre ? () => painting && paint(index) : undefined}
					onkeydown={onpaint && !isCentre
						? (e: KeyboardEvent) => {
								if (e.key === 'Enter' || e.key === ' ') {
									e.preventDefault();
									paint(index);
								}
							}
						: undefined}
				/>
				{#if isCentre}
					<text
						x={pos.x + CELL / 2}
						y={pos.y + CELL / 2}
						class="centre-mark"
						style:font-size="{CELL * 0.5}px"
					>
						{FACE_NAMES[fixed.get(index) as Face]}
					</text>
				{:else if settings.current.stickerLetters && colour !== UNSET}
					<text
						x={pos.x + CELL / 2}
						y={pos.y + CELL / 2}
						class="letter"
						class:letter--dark={colour === 0 || colour === 3}
						style:font-size="{CELL * 0.5}px"
					>
						{FACE_NAMES[colour as Face]}
					</text>
				{/if}
			</g>
		{/each}
	{/each}
</svg>

<style>
	.net {
		display: block;
		max-width: 100%;
		height: auto;
		touch-action: none;
	}

	.face-plate {
		fill: color-mix(in oklab, var(--surface-3) 60%, transparent);
		stroke: var(--hairline);
		stroke-width: 0.5;
	}

	.sticker {
		transition:
			fill var(--dur-fast) var(--ease-out),
			stroke var(--dur-fast) var(--ease-out);
	}

	.sticker--editable {
		cursor: pointer;
	}

	.sticker--editable:hover {
		stroke: var(--accent);
		stroke-width: 1.6;
	}

	.sticker--blank {
		stroke-dasharray: 2 1.5;
	}

	.sticker--centre {
		/* Anchors define the colour scheme, so they are never editable. */
		opacity: 0.92;
	}

	.sticker--highlight {
		stroke: var(--danger);
		stroke-width: 2;
	}

	.sticker--cursor {
		stroke: var(--accent);
		stroke-width: 2;
	}

	.centre-mark {
		font-family: var(--font-mono);
		font-weight: 700;
		text-anchor: middle;
		dominant-baseline: central;
		fill: rgb(0 0 0 / 0.4);
		pointer-events: none;
	}

	.letter {
		font-family: var(--font-mono);
		font-weight: 600;
		text-anchor: middle;
		dominant-baseline: central;
		fill: rgb(255 255 255 / 0.7);
		pointer-events: none;
	}

	.letter--dark {
		fill: rgb(0 0 0 / 0.5);
	}
</style>
