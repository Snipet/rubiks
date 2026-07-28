<!--
	An interactive cube you can turn and orbit, at any size the site supports.

	Built from positional cubies in CSS 3D rather than a canvas, so it stays sharp
	at any scale, inherits the theme's sticker colours for free, and needs no
	rendering library. Each cubie shows whatever stickers currently sit at *its
	position*, which means a turn is animated by rotating the affected cubies and
	then simply repainting from the new state — no piece identity to track.

	Where the cubies are, which sticker each one shows and which of them a turn
	carries all come from the N×N engine, so the picture and the permutation are
	reading the same table. The only thing this file decides for itself is which
	CSS axis a face spins around, and that comes from `$cube/geometry`, where the
	3×3 tests pin it down.
-->
<script lang="ts">
	import { UNSET } from '$cube/facelets';
	import { untrack } from 'svelte';
	import { FACE_NAMES, type Face, type Facelets } from '$cube/types';
	import { FACE_TRANSFORM } from '$cube/geometry';
	import { FACE_SPIN } from '$cube/geometry';
	import { applyPerm, puzzle, type Cell, type PuzzleSize } from '$cube/puzzle';
	import { tokenise } from '$cube/puzzleState';
	import { settings } from '$state/settings.svelte';

	interface Props {
		facelets: Facelets;
		/** Pixel width of the whole scene. */
		size?: number;
		/** How many layers a side. Defaults to the 3×3. */
		order?: PuzzleSize;
		/** Allow dragging and keyboard orbiting. */
		orbit?: boolean;
		/** Called after each move finishes, with the move's name. */
		onmove?: (move: string, state: Facelets) => void;
		/** Called when a sticker is clicked. Enables sticker picking. */
		onsticker?: (index: number) => void;
		/** Facelet indices to ring. */
		highlight?: readonly number[];
		/** Starting orbit angles, in degrees. */
		pitch?: number;
		yaw?: number;
		label?: string;
		class?: string;
	}

	let {
		facelets = $bindable(),
		size = 260,
		order = 3,
		orbit = true,
		onmove,
		onsticker,
		highlight = [],
		pitch: initialPitch = -25,
		yaw: initialYaw = -38,
		label = 'Interactive cube',
		class: className = ''
	}: Props = $props();

	const cube = $derived(puzzle(order));

	// --- orbit --------------------------------------------------------------
	// Read once at construction: these props seed the view, they do not drive it.
	let pitch = $state(untrack(() => initialPitch));
	let yaw = $state(untrack(() => initialYaw));
	let dragging = $state(false);

	function onpointerdown(event: PointerEvent) {
		if (!orbit || onsticker) return;
		dragging = true;
		(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
	}

	function onpointermove(event: PointerEvent) {
		if (!dragging) return;
		yaw += event.movementX * 0.45;
		// Keep the cube the right way up — past vertical the mental model breaks down.
		pitch = Math.max(-89, Math.min(89, pitch - event.movementY * 0.45));
	}

	function onpointerup(event: PointerEvent) {
		if (!dragging) return;
		dragging = false;
		(event.currentTarget as HTMLElement).releasePointerCapture(event.pointerId);
	}

	function onkeydown(event: KeyboardEvent) {
		if (!orbit) return;
		const step = event.shiftKey ? 45 : 12;
		const handlers: Record<string, () => void> = {
			ArrowLeft: () => (yaw -= step),
			ArrowRight: () => (yaw += step),
			ArrowUp: () => (pitch = Math.max(-89, pitch - step)),
			ArrowDown: () => (pitch = Math.min(89, pitch + step)),
			Home: () => {
				pitch = initialPitch;
				yaw = initialYaw;
			}
		};
		const handler = handlers[event.key];
		if (handler) {
			event.preventDefault();
			handler();
		}
	}

	/** Snap to one of the useful fixed viewpoints. */
	export function look(at: 'default' | 'top' | 'front' | 'back' | 'bottom') {
		const views = {
			default: [initialPitch, initialYaw],
			top: [-90, 0],
			front: [0, 0],
			back: [0, 180],
			bottom: [90, 0]
		} as const;
		[pitch, yaw] = views[at];
	}

	// The 0.35 is headroom for the perspective: a cube drawn edge-to-edge in its
	// box clips its own near corner when you orbit it.
	const CUBIE = $derived(size / (order + 0.35));
	const HALF = $derived(CUBIE / 2);
	const GAP = $derived(CUBIE * 0.035);

	// --- turning ------------------------------------------------------------

	let cubieEls: (HTMLElement | null)[] = $state([]);
	let busy = $state(false);

	// Changing size changes how many cubies there are, so the element list has to
	// be rebuilt rather than reused — a stale entry would animate the wrong piece.
	$effect(() => {
		const count = cube.cubies.length;
		if (cubieEls.length !== count) cubieEls = Array(count).fill(null);
	});

	/** True while an algorithm is playing, so callers can disable controls. */
	export function isBusy() {
		return busy;
	}

	function baseTransform(c: Cell): string {
		// CSS y points down, so the model's up becomes a negative offset.
		const step = CUBIE + GAP;
		return `translate3d(${c.x * step}px, ${-c.y * step}px, ${c.z * step}px)`;
	}

	/** Play a single move, animating it. Resolves once the state has been updated. */
	export function turn(move: string): Promise<void> {
		const parsed = cube.parse(move);
		// A move this size has no meaning for is skipped rather than thrown: a
		// keypad or a lesson may offer `M` while the reader is on a 4×4.
		if (!parsed) return Promise.resolve();

		const perm = cube.perm(move);
		const spec = FACE_SPIN[parsed.face];
		const duration = settings.current.turnSpeed * (parsed.amount === 2 ? 1.55 : 1);
		const finish = () => {
			facelets = applyPerm(facelets, perm);
			onmove?.(move, facelets);
		};

		if (duration <= 0) {
			// Reduced motion: apply it outright.
			finish();
			return Promise.resolve();
		}

		const degrees = spec.sign * 90 * (parsed.amount === 3 ? -1 : parsed.amount);
		const cells = cube.cubies;
		const affected = cells.map((c, i) => (cube.inLayer(parsed, c) ? i : -1)).filter((i) => i >= 0);

		busy = true;
		const animations = affected
			.map((i) => {
				const el = cubieEls[i];
				if (!el) return null;
				const base = baseTransform(cells[i]);
				return el.animate(
					[
						{ transform: `rotate${spec.axis}(0deg) ${base}` },
						{ transform: `rotate${spec.axis}(${degrees}deg) ${base}` }
					],
					{ duration, easing: 'cubic-bezier(0.3, 0, 0.2, 1)', fill: 'none' }
				);
			})
			.filter((a): a is Animation => a !== null);

		if (animations.length === 0) {
			finish();
			busy = false;
			return Promise.resolve();
		}

		return Promise.all(animations.map((a) => a.finished.catch(() => undefined))).then(() => {
			// `fill: 'none'` means the cubies snap back to their base transform, which
			// is exactly right once the repaint below has moved the colours along.
			finish();
			busy = false;
		});
	}

	/** Play a whole algorithm, one move at a time. */
	export async function play(alg: string | readonly string[]) {
		const moves = typeof alg === 'string' ? tokenise(alg) : alg;
		for (const move of moves) await turn(move);
	}

	// --- painting -----------------------------------------------------------
	const FILL: Record<number, string> = {
		0: 'var(--sticker-u)',
		1: 'var(--sticker-r)',
		2: 'var(--sticker-f)',
		3: 'var(--sticker-d)',
		4: 'var(--sticker-l)',
		5: 'var(--sticker-b)'
	};

	const highlighted = $derived(new Set(highlight));
</script>

<!--
	The analyser cannot tell that `tabindex` is only set when `role` is
	`application`; when orbiting is off the element is a plain image and takes no
	tab stop at all.
-->
<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div
	class="scene {className}"
	class:scene--grab={orbit && !onsticker}
	class:scene--dragging={dragging}
	style:width="{size}px"
	style:height="{size}px"
	style:--cubie="{CUBIE}px"
	style:--half="{HALF}px"
	role={orbit ? 'application' : 'img'}
	aria-label={label}
	tabindex={orbit ? 0 : undefined}
	{onpointerdown}
	{onpointermove}
	{onpointerup}
	onpointercancel={onpointerup}
	{onkeydown}
>
	<div class="cube" style:transform="rotateX({pitch}deg) rotateY({yaw}deg)">
		{#each cube.cubies as c, i (i)}
			<div class="cubie" bind:this={cubieEls[i]} style:transform={baseTransform(c)}>
				{#each cube.facesOf(c) as face (face)}
					{@const index = cube.stickerFacing(c, face)}
					{@const colour = facelets[index]}
					{#if onsticker}
						<button
							type="button"
							class="face face--button"
							class:face--blank={colour === UNSET}
							class:face--ringed={highlighted.has(index)}
							style:transform="{FACE_TRANSFORM[face]} translateZ({HALF}px)"
							style:background={colour === UNSET ? 'var(--sticker-none)' : FILL[colour]}
							aria-label="{FACE_NAMES[face]} face sticker"
							onclick={() => onsticker?.(index)}
						>
							{#if settings.current.stickerLetters && colour !== UNSET}
								<span class="letter" class:letter--dark={colour === 0 || colour === 3}>
									{FACE_NAMES[colour as Face]}
								</span>
							{/if}
						</button>
					{:else}
						<div
							class="face"
							class:face--blank={colour === UNSET}
							class:face--ringed={highlighted.has(index)}
							style:transform="{FACE_TRANSFORM[face]} translateZ({HALF}px)"
							style:background={colour === UNSET ? 'var(--sticker-none)' : FILL[colour]}
						>
							{#if settings.current.stickerLetters && colour !== UNSET}
								<span class="letter" class:letter--dark={colour === 0 || colour === 3}>
									{FACE_NAMES[colour as Face]}
								</span>
							{/if}
						</div>
					{/if}
				{/each}
			</div>
		{/each}
	</div>
</div>

<style>
	.scene {
		perspective: 1400px;
		perspective-origin: 50% 45%;
		display: grid;
		place-items: center;
		touch-action: none;
		user-select: none;
	}

	.scene--grab {
		cursor: grab;
	}

	.scene--dragging {
		cursor: grabbing;
	}

	.scene:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 6px;
		border-radius: var(--radius-3);
	}

	.cube {
		position: relative;
		transform-style: preserve-3d;
		width: 0;
		height: 0;
		transition: transform var(--dur-mid) var(--ease-out);
	}

	.scene--dragging .cube {
		transition: none;
	}

	.cubie {
		position: absolute;
		width: var(--cubie);
		height: var(--cubie);
		margin-left: calc(var(--half) * -1);
		margin-top: calc(var(--half) * -1);
		transform-style: preserve-3d;
	}

	.face {
		position: absolute;
		inset: 0;
		display: grid;
		place-items: center;
		border-radius: 14%;
		border: 1px solid rgb(0 0 0 / 0.35);
		box-shadow: inset 0 0 0 1px rgb(255 255 255 / 0.07);
		backface-visibility: hidden;
		padding: 0;
	}

	.face--button {
		cursor: pointer;
		appearance: none;
	}

	.face--button:hover {
		box-shadow:
			inset 0 0 0 2px var(--accent),
			0 0 12px color-mix(in oklab, var(--accent) 60%, transparent);
	}

	.face--blank {
		border-style: dashed;
		border-color: var(--hairline-strong);
	}

	.face--ringed {
		box-shadow: inset 0 0 0 3px var(--accent);
	}

	.letter {
		font-family: var(--font-mono);
		font-size: calc(var(--cubie) * 0.38);
		font-weight: 600;
		color: rgb(255 255 255 / 0.75);
		pointer-events: none;
	}

	.letter--dark {
		color: rgb(0 0 0 / 0.55);
	}
</style>
