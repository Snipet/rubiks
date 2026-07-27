<!--
	The cube unfolded flat.

	Laid out as the usual cross — up above the front, down below it, and left,
	front, right, back in a row — which happens to mean every face renders as a
	plain row-major 3×3 with no index gymnastics. That is not a coincidence: the
	facelet numbering was chosen to make this the natural layout.

	Doubles as the sticker editor. Pass `onpaint` and every sticker becomes a
	button; centres are never editable, because they are what define the colour
	scheme.
-->
<script lang="ts">
	import { UNSET } from '$cube/facelets';
	import { CENTER_FACELETS, FACE_NAMES, type Face, type Facelets } from '$cube/types';
	import { settings } from '$state/settings.svelte';

	interface Props {
		facelets: Facelets;
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
		onpaint,
		highlight = [],
		cursor,
		size = 300,
		labels = true,
		class: className = ''
	}: Props = $props();

	/** Face, and where its 3×3 sits in the 4×3 grid of faces. */
	const LAYOUT: { face: Face; col: number; row: number }[] = [
		{ face: 0, col: 1, row: 0 }, // U
		{ face: 4, col: 0, row: 1 }, // L
		{ face: 2, col: 1, row: 1 }, // F
		{ face: 1, col: 2, row: 1 }, // R
		{ face: 5, col: 3, row: 1 }, // B
		{ face: 3, col: 1, row: 2 } // D
	];

	const CELL = 16;
	const GAP = 1.5;
	const FACE_SPAN = CELL * 3 + GAP * 2;
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

	const CENTRES = new Set(CENTER_FACELETS);
	const highlighted = $derived(new Set(highlight));

	function cellPosition(face: Face, i: number) {
		const spot = LAYOUT.find((l) => l.face === face)!;
		const originX = spot.col * (FACE_SPAN + FACE_GAP);
		const originY = spot.row * (FACE_SPAN + FACE_GAP);
		return {
			x: originX + (i % 3) * (CELL + GAP),
			y: originY + Math.floor(i / 3) * (CELL + GAP)
		};
	}

	/** Painting drag: hold the pointer down and sweep across several stickers. */
	let painting = $state(false);

	function paint(index: number) {
		if (!onpaint || CENTRES.has(index)) return;
		onpaint(index);
	}
</script>

<!--
	The analyser cannot follow the conditional: `tabindex` is only set on stickers
	that also carry `role="button"`, and centres get neither.
-->
<!-- svelte-ignore a11y_no_static_element_interactions -->
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

		{#each Array(9) as _, i (i)}
			{@const index = spot.face * 9 + i}
			{@const pos = cellPosition(spot.face, i)}
			{@const colour = facelets[index]}
			{@const isCentre = CENTRES.has(index)}
			<g>
				<rect
					x={pos.x}
					y={pos.y}
					width={CELL}
					height={CELL}
					rx="2.5"
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
						? `${FACE_NAMES[spot.face]} face, row ${Math.floor(i / 3) + 1}, column ${(i % 3) + 1}${colour === UNSET ? ', not set' : `, ${FACE_NAMES[colour as Face]}`}`
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
					<text x={pos.x + CELL / 2} y={pos.y + CELL / 2} class="centre-mark">
						{FACE_NAMES[spot.face]}
					</text>
				{:else if settings.current.stickerLetters && colour !== UNSET}
					<text
						x={pos.x + CELL / 2}
						y={pos.y + CELL / 2}
						class="letter"
						class:letter--dark={colour === 0 || colour === 3}
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
		/* Centres define the colour scheme, so they are never editable. */
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
		font-size: 8px;
		font-weight: 700;
		text-anchor: middle;
		dominant-baseline: central;
		fill: rgb(0 0 0 / 0.4);
		pointer-events: none;
	}

	.letter {
		font-family: var(--font-mono);
		font-size: 8px;
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
