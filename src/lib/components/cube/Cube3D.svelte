<!--
	An interactive cube you can turn and orbit.

	Built from 26 positional cubies in CSS 3D rather than a canvas, so it stays
	sharp at any size, inherits the theme's sticker colours for free, and needs no
	rendering library. Each cubie shows whatever stickers currently sit at *its
	position*, which means a turn is animated by rotating the affected cubies and
	then simply repainting from the new state — no piece identity to track.
-->
<script lang="ts">
	import { applyMove, UNSET } from '$cube/facelets';
	import { untrack } from 'svelte';
	import { parseAlg, type Move } from '$cube/moves';
	import { FACE_NAMES, type Face, type Facelets } from '$cube/types';
	import { CUBIES, faceletAt, FACE_TRANSFORM, inLayer, TURN, visibleFaces } from '$cube/geometry';
	import { settings } from '$state/settings.svelte';

	interface Props {
		facelets: Facelets;
		size?: number;
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
		orbit = true,
		onmove,
		onsticker,
		highlight = [],
		pitch: initialPitch = -25,
		yaw: initialYaw = -38,
		label = 'Interactive cube',
		class: className = ''
	}: Props = $props();

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

	// Cubie positions, sticker mapping and face placement all live in
	// `$cube/geometry`, where they are covered by tests — a wrong entry there shows
	// up as stickers in the wrong places, which is hard to spot by eye.

	const CUBIE = $derived(size / 3.35);
	const HALF = $derived(CUBIE / 2);
	const GAP = $derived(CUBIE * 0.035);

	// --- turning ------------------------------------------------------------

	let cubieEls: (HTMLElement | null)[] = $state(Array(26).fill(null));
	let busy = $state(false);

	/** True while an algorithm is playing, so callers can disable controls. */
	export function isBusy() {
		return busy;
	}

	function baseTransform(c: { x: number; y: number; z: number }): string {
		// CSS y points down, so the model's up becomes a negative offset.
		const step = CUBIE + GAP;
		return `translate3d(${c.x * step}px, ${-c.y * step}px, ${c.z * step}px)`;
	}

	/** Play a single move, animating it. Resolves once the state has been updated. */
	export function turn(move: Move | string): Promise<void> {
		const parsed = typeof move === 'string' ? parseAlg(move)[0] : move;
		if (!parsed) return Promise.resolve();
		const spec = TURN[parsed.base];
		const duration = settings.current.turnSpeed * (parsed.amount === 2 ? 1.55 : 1);

		if (!spec || duration <= 0) {
			// Reduced motion, or a move with no visual layer: apply it outright.
			facelets = applyMove(facelets, parsed);
			onmove?.(parsed.name, facelets);
			return Promise.resolve();
		}

		const degrees = spec.sign * 90 * (parsed.amount === 3 ? -1 : parsed.amount);
		const affected = CUBIES.map((c, i) => (inLayer(parsed.base, c) ? i : -1)).filter((i) => i >= 0);

		busy = true;
		const animations = affected
			.map((i) => {
				const el = cubieEls[i];
				if (!el) return null;
				const base = baseTransform(CUBIES[i]);
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
			facelets = applyMove(facelets, parsed);
			busy = false;
			onmove?.(parsed.name, facelets);
			return Promise.resolve();
		}

		return Promise.all(animations.map((a) => a.finished.catch(() => undefined))).then(() => {
			// `fill: 'none'` means the cubies snap back to their base transform, which
			// is exactly right once the repaint below has moved the colours along.
			facelets = applyMove(facelets, parsed);
			busy = false;
			onmove?.(parsed.name, facelets);
		});
	}

	/** Play a whole algorithm, one move at a time. */
	export async function play(alg: string | readonly Move[]) {
		const moves = typeof alg === 'string' ? parseAlg(alg) : alg;
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
		{#each CUBIES as c, i (i)}
			<div class="cubie" bind:this={cubieEls[i]} style:transform={baseTransform(c)}>
				{#each visibleFaces(c.x, c.y, c.z) as face (face)}
					{@const index = faceletAt(face, c.x, c.y, c.z)}
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
