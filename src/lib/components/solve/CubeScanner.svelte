<!--
	Reading a cube with the camera.

	Six faces, one at a time. Three would be nicer and does not work: three faces
	show 27 stickers, and while the centres and any piece showing two of its
	stickers do follow from them, the rest genuinely does not. `$cube/deduce`
	measures exactly what is forced, so this asks for faces until it has enough
	rather than assuming a number — usually five, sometimes all six.

	Two things make the colour reading survive real light, and neither needs a
	model. The **centres are the palette**: each face has exactly one, the six are
	one of each colour by definition, so the scan learns what red looks like *in
	this photograph* rather than in the abstract. And **every colour appears nine
	times**, which turns a pile of independent guesses into one assignment problem
	where a doubtful sticker cannot steal a place from a confident one.

	Anything still doubtful is put in front of the reader to correct, because a
	scanner that quietly guesses is worse than one that asks.
-->
<script lang="ts">
	import { onDestroy, tick } from 'svelte';
	import Button from '$components/ui/Button.svelte';
	import Chip from '$components/ui/Chip.svelte';
	import CubeNet from '$components/cube/CubeNet.svelte';
	import { deduce, facesStillNeeded } from '$cube/deduce';
	import { classify, samplePatch, SAMPLE_CSS, SCAN_ORDER, type Sample } from '$cube/scan';
	import { validateFacelets } from '$cube/validate';
	import { FACE_NAMES, type Face, type Facelets } from '$cube/types';

	interface Props {
		/** Called with a complete, legal cube state once the reader accepts it. */
		onscanned: (state: Facelets) => void;
		oncancel?: () => void;
	}

	let { onscanned, oncancel }: Props = $props();

	type Phase = 'idle' | 'starting' | 'live' | 'review' | 'denied' | 'unsupported';

	let phase = $state<Phase>('idle');
	let error = $state('');
	let video = $state<HTMLVideoElement | null>(null);
	let stream: MediaStream | null = null;
	let frame: number | undefined;

	/** Live readings from the nine patches, for the on-screen swatches. */
	let live = $state<Sample[]>([]);
	/** Captured samples per face, keyed by face index. */
	let captured = $state<Record<number, Sample[]>>({});
	/** The state after classification, once every face is in. */
	let scanned = $state<Facelets | null>(null);
	let doubtful = $state<number[]>([]);
	let brush = $state<Face>(0);

	const step = $derived(SCAN_ORDER.findIndex((face) => captured[face] === undefined));
	const target = $derived<Face | undefined>(step === -1 ? undefined : SCAN_ORDER[step]);
	const done = $derived(Object.keys(captured).length);

	const stillNeeded = $derived(scanned ? facesStillNeeded(scanned) : []);
	const validation = $derived(scanned ? validateFacelets(scanned) : null);

	async function start() {
		if (!navigator.mediaDevices?.getUserMedia) {
			phase = 'unsupported';
			return;
		}
		phase = 'starting';
		error = '';
		try {
			stream = await navigator.mediaDevices.getUserMedia({
				video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 } },
				audio: false
			});
			/*
			 * Order matters here, and getting it wrong showed nothing at all: the
			 * <video> element only exists while the phase is 'live', so the stream
			 * has to be attached *after* the phase flips and after Svelte has
			 * flushed that change to the DOM. Attaching first leaves `video` null,
			 * the feed never starts, and every capture reads a zero-sized frame.
			 */
			phase = 'live';
			await tick();
			if (!video) throw new Error('the preview element did not appear');
			video.srcObject = stream;
			await video.play();
			sampleLoop();
		} catch (err) {
			// A refusal and a missing camera are different problems with different
			// answers, so they are not collapsed into one message.
			const name = err instanceof DOMException ? err.name : '';
			if (name === 'NotAllowedError' || name === 'SecurityError') {
				phase = 'denied';
			} else {
				phase = 'idle';
				error =
					name === 'NotFoundError'
						? 'No camera was found on this device.'
						: 'The camera could not be started. Painting the stickers by hand still works.';
			}
		}
	}

	function stop() {
		if (frame) cancelAnimationFrame(frame);
		frame = undefined;
		stream?.getTracks().forEach((track) => track.stop());
		stream = null;
	}

	/**
	 * The nine patch centres, as fractions of the framed square.
	 *
	 * Sampled well inside each sticker: the edges of a cube sticker catch the light
	 * and pick up the black plastic around them, and both pull a reading towards
	 * grey.
	 */
	const GRID = Array.from({ length: 9 }, (_, i) => ({
		fx: 0.5 + ((i % 3) - 1) * 0.28,
		fy: 0.5 + (Math.floor(i / 3) - 1) * 0.28
	}));

	let canvas: HTMLCanvasElement | undefined;

	function read(): Sample[] | null {
		if (!video || video.videoWidth === 0) return null;
		canvas ??= document.createElement('canvas');
		const size = Math.min(video.videoWidth, video.videoHeight);
		canvas.width = size;
		canvas.height = size;
		const ctx = canvas.getContext('2d', { willReadFrequently: true });
		if (!ctx) return null;
		// Draw the centred square of the frame, which is what the overlay frames.
		ctx.drawImage(
			video,
			(video.videoWidth - size) / 2,
			(video.videoHeight - size) / 2,
			size,
			size,
			0,
			0,
			size,
			size
		);
		const pixels = ctx.getImageData(0, 0, size, size).data;
		const radius = Math.max(2, Math.round(size * 0.03));
		return GRID.map(({ fx, fy }) =>
			samplePatch(pixels, size, Math.round(fx * size), Math.round(fy * size), radius)
		);
	}

	function sampleLoop() {
		const samples = read();
		if (samples) live = samples;
		frame = requestAnimationFrame(sampleLoop);
	}

	function capture() {
		if (target === undefined) return;
		const samples = read();
		if (!samples) {
			// Silently doing nothing is the worst option: the reader presses the
			// button, sees no change, and has no idea whether it worked.
			error = 'The camera has not produced a frame yet. Give it a moment and try again.';
			return;
		}
		error = '';
		captured = { ...captured, [target]: samples };
		if (Object.keys(captured).length === 6) finish();
	}

	function finish() {
		// Samples must be handed over in the site's sticker order, not capture order.
		const ordered: Sample[] = [];
		for (let face = 0; face < 6; face++) ordered.push(...captured[face]);
		const result = classify(ordered);
		scanned = result.facelets;
		doubtful = result.doubtful;
		phase = 'review';
		stop();
	}

	function retake(face: Face) {
		const next = { ...captured };
		delete next[face];
		captured = next;
		scanned = null;
		doubtful = [];
		if (phase === 'review') start();
	}

	function paint(index: number) {
		if (!scanned) return;
		const next = new Uint8Array(scanned);
		next[index] = brush;
		scanned = next;
		doubtful = doubtful.filter((i) => i !== index);
	}

	function accept() {
		if (!scanned) return;
		const filled = deduce(scanned);
		onscanned(filled.complete ? filled.facelets : scanned);
	}

	function restart() {
		captured = {};
		scanned = null;
		doubtful = [];
		error = '';
		start();
	}

	onDestroy(stop);

	const PALETTE: Face[] = [0, 1, 2, 3, 4, 5];
	const SWATCH = [
		'var(--sticker-u)',
		'var(--sticker-r)',
		'var(--sticker-f)',
		'var(--sticker-d)',
		'var(--sticker-l)',
		'var(--sticker-b)'
	];
	const HOLD: Record<number, string> = {
		0: 'the white face towards the camera, green on top',
		2: 'the green face towards the camera, white on top',
		1: 'the red face towards the camera, white on top',
		5: 'the blue face towards the camera, white on top',
		4: 'the orange face towards the camera, white on top',
		3: 'the yellow face towards the camera, blue on top'
	};
</script>

<section class="scanner" aria-label="Scan your cube with the camera">
	{#if phase === 'idle' || phase === 'starting'}
		<div class="intro">
			<h3>Read the cube with your camera</h3>
			<p>
				Six faces, one at a time — it will tell you which to point at next. Nothing leaves this
				device; the frames are read in the browser and never uploaded.
			</p>
			<p class="aside">
				Three faces would be quicker and does not work: 27 stickers leave the other half of the cube
				genuinely undetermined, so this asks until it has enough rather than guessing.
			</p>
			{#if error}<p class="error">{error}</p>{/if}
			<Button variant="section" onclick={start} disabled={phase === 'starting'}>
				{phase === 'starting' ? 'Asking for the camera…' : 'Start the camera'}
			</Button>
		</div>
	{:else if phase === 'denied'}
		<div class="intro">
			<h3>The camera was not allowed</h3>
			<p>
				Your browser blocked it, which is a per-site permission you can change in the address bar.
				Nothing here needs the camera — painting the stickers by hand does the same job.
			</p>
			<div class="row">
				<Button variant="secondary" onclick={start}>Ask again</Button>
				{#if oncancel}<Button variant="ghost" onclick={oncancel}>Paint by hand instead</Button>{/if}
			</div>
		</div>
	{:else if phase === 'unsupported'}
		<div class="intro">
			<h3>This browser has no camera access</h3>
			<p>
				`getUserMedia` is unavailable here — usually because the page is not on a secure origin.
				Painting the stickers by hand works everywhere.
			</p>
			{#if oncancel}<Button variant="secondary" onclick={oncancel}>Paint by hand</Button>{/if}
		</div>
	{:else if phase === 'live'}
		<div class="stage">
			<video bind:this={video} class="feed" playsinline muted autoplay></video>
			<div class="overlay" aria-hidden="true">
				{#each GRID as cell, i (i)}
					<span
						class="patch"
						style:left="{cell.fx * 100}%"
						style:top="{cell.fy * 100}%"
						style:background={live[i] ? SAMPLE_CSS(live[i]) : 'transparent'}
					></span>
				{/each}
			</div>
		</div>

		<div class="prompt">
			<Chip tone="section" size="md">Face {done + 1} of 6</Chip>
			{#if target !== undefined}
				<p>
					Hold <strong>{HOLD[target]}</strong>, fill the frame, and capture. The nine squares show
					what the camera is reading.
				</p>
			{/if}
		</div>

		<div class="row">
			<Button variant="section" onclick={capture}>Capture this face</Button>
			<Button variant="ghost" onclick={restart} disabled={done === 0}>Start over</Button>
			{#if oncancel}<Button variant="ghost" onclick={oncancel}>Cancel</Button>{/if}
		</div>

		{#if error}
			<p class="error">{error}</p>
		{/if}

		{#if done > 0}
			<p class="captured">
				Captured:
				{#each SCAN_ORDER.filter((f) => captured[f]) as face, i (face)}{i > 0
						? ', '
						: ''}{FACE_NAMES[face]}{/each}
			</p>
		{/if}
	{:else if phase === 'review' && scanned}
		<div class="review">
			<h3>Check the reading</h3>
			<CubeNet facelets={scanned} onpaint={paint} highlight={doubtful} size={320} />

			<div class="palette" role="radiogroup" aria-label="Correction colour">
				{#each PALETTE as face (face)}
					<button
						type="button"
						role="radio"
						aria-checked={brush === face}
						class="swatch"
						class:swatch--on={brush === face}
						style:background={SWATCH[face]}
						onclick={() => (brush = face)}
					>
						<span class="visually-hidden">{FACE_NAMES[face]} colour</span>
					</button>
				{/each}
			</div>

			{#if doubtful.length > 0}
				<p class="warn">
					{doubtful.length}
					{doubtful.length === 1 ? 'sticker was' : 'stickers were'} close between two colours and
					{doubtful.length === 1 ? 'is' : 'are'} ringed above. Pick a colour and click any that is wrong.
				</p>
			{:else}
				<p class="ok">Every sticker read cleanly. Click any that still looks wrong.</p>
			{/if}

			{#if validation && !validation.ok}
				<p class="error">
					{validation.issues[0]?.message} A misread sticker usually shows up exactly like this — the ringed
					ones are the first place to look.
				</p>
			{:else if stillNeeded.length > 0}
				<p class="warn">
					Some pieces are still undetermined. Retake the
					{stillNeeded.map((f) => FACE_NAMES[f]).join(' or ')} face.
				</p>
			{/if}

			<div class="row">
				<Button variant="section" onclick={accept} disabled={!validation?.ok}>Use this cube</Button>
				<Button variant="ghost" onclick={restart}>Scan again</Button>
				{#if target === undefined}
					<Button variant="ghost" onclick={() => retake(0)}>Retake the white face</Button>
				{/if}
			</div>
		</div>
	{/if}
</section>

<style>
	.scanner {
		display: grid;
		gap: var(--space-4);
		justify-items: center;
		padding: var(--space-5);
		border: var(--border);
		border-radius: var(--radius-4);
		background: var(--surface-1);
	}

	.intro,
	.review {
		display: grid;
		gap: var(--space-3);
		justify-items: center;
		text-align: center;
		max-width: 30rem;
	}

	.intro h3,
	.review h3 {
		font-size: var(--step-1);
	}

	.intro p,
	.prompt p {
		color: var(--text-muted);
		line-height: var(--leading-normal);
	}

	.aside {
		font-size: var(--step--1);
		color: var(--text-faint);
	}

	.stage {
		position: relative;
		width: min(22rem, 100%);
		aspect-ratio: 1;
		border-radius: var(--radius-3);
		overflow: hidden;
		background: var(--bg-deep);
	}

	.feed {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.overlay {
		position: absolute;
		inset: 0;
		pointer-events: none;
	}

	.patch {
		position: absolute;
		width: 2.25rem;
		height: 2.25rem;
		margin: -1.125rem 0 0 -1.125rem;
		border-radius: var(--radius-1);
		box-shadow:
			0 0 0 2px rgb(255 255 255 / 0.85),
			0 0 0 4px rgb(0 0 0 / 0.35);
	}

	.prompt {
		display: grid;
		gap: var(--space-2);
		justify-items: center;
		text-align: center;
		max-width: 26rem;
	}

	.row {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-3);
		justify-content: center;
	}

	.captured,
	.ok,
	.warn,
	.error {
		font-size: var(--step--1);
		text-align: center;
		max-width: 28rem;
		line-height: var(--leading-snug);
	}

	.captured,
	.ok {
		color: var(--text-muted);
	}

	.warn {
		color: var(--caution);
	}

	.error {
		color: var(--danger);
	}

	.palette {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
		justify-content: center;
	}

	.swatch {
		width: 2rem;
		height: 2rem;
		border-radius: var(--radius-1);
		border: 2px solid transparent;
		box-shadow: inset 0 0 0 1px rgb(0 0 0 / 0.3);
	}

	.swatch--on {
		border-color: var(--accent);
		transform: scale(1.1);
	}
</style>
