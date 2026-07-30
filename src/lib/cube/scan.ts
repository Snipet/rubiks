/**
 * Turning camera samples into sticker colours.
 *
 * The naive approach is to threshold each sticker's hue against six named
 * colours, and it fails the moment the light is warm, or the puzzle is a shade
 * off standard, or half the face is in shadow. Orange and red sit close enough
 * in hue that a single bad threshold ruins a scan, and the reader has no way to
 * tell which sticker was misread.
 *
 * Two things make it reliable instead, and neither needs a model:
 *
 * 1. **The centres are the palette.** Each face has exactly one centre, and the
 *    six centres are one of each colour by definition. So the scan does not need
 *    to know what "red" looks like in the abstract — it needs to know what red
 *    looks like *in this photograph*, and the centre of the red face says so.
 *
 * 2. **Every colour appears exactly nine times.** That is a hard constraint, and
 *    enforcing it turns a pile of independent guesses into one assignment
 *    problem. A sticker that would rather be orange cannot be, if the nine orange
 *    places are already taken by stickers more confident than it.
 *
 * What comes back includes a confidence per sticker, so the interface can put the
 * doubtful ones in front of the reader rather than hoping.
 */

import { FACES, type Face, type Facelets } from './types';

export interface Sample {
	r: number;
	g: number;
	b: number;
}

export interface ScanResult {
	facelets: Facelets;
	/** 0 to 1 per sticker: how much closer the winner was than the runner-up. */
	confidence: number[];
	/** Sticker indices whose reading is worth a second look, worst first. */
	doubtful: number[];
}

/**
 * Distance between two samples.
 *
 * Compared in a normalised space rather than raw RGB: a sticker in shadow is the
 * same colour as one in the light, and dividing through by brightness is most of
 * what it takes to say so. White is the exception — it has no hue to normalise —
 * so overall lightness is kept as a weighted fourth dimension, which is what
 * separates white from yellow when both saturate the sensor.
 */
function distance(a: Sample, b: Sample): number {
	const norm = (s: Sample) => {
		const sum = s.r + s.g + s.b || 1;
		return { x: s.r / sum, y: s.g / sum, l: sum / 765 };
	};
	const p = norm(a);
	const q = norm(b);
	const dx = p.x - q.x;
	const dy = p.y - q.y;
	const dl = p.l - q.l;
	// Chromaticity dominates; lightness breaks the white-versus-yellow tie.
	return dx * dx + dy * dy + 0.12 * dl * dl;
}

/**
 * Classify 54 samples into six colours, nine of each.
 *
 * Samples arrive in the site's usual sticker order — U face first, row-major,
 * then R, F, D, L, B — so index 4 of each face is that face's centre.
 */
export function classify(samples: readonly Sample[]): ScanResult {
	if (samples.length !== 54) {
		throw new Error(`Expected 54 samples, got ${samples.length}`);
	}

	// The palette: one reference per colour, taken from that face's centre.
	const reference = FACES.map((face) => samples[face * 9 + 4]);

	const cost = samples.map((sample) => reference.map((ref) => distance(sample, ref)));

	// Centres are their own colour by construction, and are not up for debate.
	const assigned = new Array<number>(54).fill(-1);
	const remaining = FACES.map(() => 9);
	for (const face of FACES) {
		assigned[face * 9 + 4] = face;
		remaining[face] -= 1;
	}

	/**
	 * Assign the most confident stickers first, respecting the nine-per-colour
	 * budget. Confidence is the gap between a sticker's best and second-best
	 * colour: a sticker that is obviously green should get to claim green before
	 * one that is torn between red and orange.
	 */
	const order = samples
		.map((_, index) => index)
		.filter((index) => assigned[index] === -1)
		.sort((a, b) => gap(cost[b]) - gap(cost[a]));

	for (const index of order) {
		let best = -1;
		let bestCost = Infinity;
		for (const face of FACES) {
			if (remaining[face] === 0) continue;
			if (cost[index][face] < bestCost) {
				bestCost = cost[index][face];
				best = face;
			}
		}
		assigned[index] = best;
		remaining[best] -= 1;
	}

	// A greedy pass can paint itself into a corner, so try swapping pairs: if two
	// stickers would both rather have each other's colour, trade them. Repeated
	// until nothing improves, which for 54 items is a handful of passes.
	let improved = true;
	let rounds = 0;
	while (improved && rounds++ < 20) {
		improved = false;
		for (let i = 0; i < 54; i++) {
			if (i % 9 === 4) continue; // centres are fixed
			for (let j = i + 1; j < 54; j++) {
				if (j % 9 === 4) continue;
				const a = assigned[i];
				const b = assigned[j];
				if (a === b) continue;
				const now = cost[i][a] + cost[j][b];
				const swapped = cost[i][b] + cost[j][a];
				if (swapped < now - 1e-9) {
					assigned[i] = b;
					assigned[j] = a;
					improved = true;
				}
			}
		}
	}

	const facelets = new Uint8Array(54);
	const confidence = new Array<number>(54).fill(1);
	for (let i = 0; i < 54; i++) {
		facelets[i] = assigned[i];
		if (i % 9 === 4) continue;
		/*
		 * Confidence is the *margin*, not whether the sticker got its first choice.
		 * After the swap pass nearly everything does get its first choice, so that
		 * measure reads 1 across the board and flags nothing — including readings
		 * that were a coin flip. What matters is how much closer the winner was
		 * than the nearest alternative, relative to the spread of the whole palette.
		 */
		const mine = cost[i][assigned[i]];
		let runnerUp = Infinity;
		for (const face of FACES) {
			if (face === assigned[i]) continue;
			if (cost[i][face] < runnerUp) runnerUp = cost[i][face];
		}
		const sorted = [...cost[i]].sort((x, y) => x - y);
		const spread = sorted[5] - sorted[0] || 1;
		confidence[i] = Math.max(0, Math.min(1, (runnerUp - mine) / spread));
	}

	const margins = confidence.filter((_, i) => i % 9 !== 4).sort((a, b) => a - b);
	const median = margins[Math.floor(margins.length / 2)] ?? 0;
	const floor = median * DOUBTFUL_FRACTION_OF_MEDIAN;
	const doubtful = Array.from({ length: 54 }, (_, i) => i)
		.filter((i) => i % 9 !== 4 && confidence[i] < floor)
		.sort((a, b) => confidence[a] - confidence[b]);

	return { facelets, confidence, doubtful };
}

/**
 * How far below the scan's own typical margin a reading has to fall before it is
 * worth showing the reader.
 *
 * Relative rather than absolute, and that is the point: the margins in a
 * photograph depend on the light, the plastic and the camera, so a fixed
 * threshold is either too twitchy indoors or too trusting in the dark. Comparing
 * each sticker against the median margin of the *same* scan calibrates itself.
 *
 * Measured on rendered scrambles: a clean photograph has a worst margin around
 * 0.20 against a median of 0.46, so nothing trips; by the noise level where
 * readings genuinely come back wrong, the worst margins are at zero while the
 * median is still 0.16, so they do.
 */
const DOUBTFUL_FRACTION_OF_MEDIAN = 0.35;

/** The gap between the best and second-best option, as a confidence proxy. */
function gap(costs: readonly number[]): number {
	const sorted = [...costs].sort((a, b) => a - b);
	return sorted[1] - sorted[0];
}

/**
 * Average the pixels in a square patch, which is what a single sticker reading
 * is: one number per channel from the middle of the sticker, away from the edges
 * where the plastic catches the light.
 */
export function samplePatch(
	pixels: Uint8ClampedArray,
	width: number,
	cx: number,
	cy: number,
	radius: number
): Sample {
	let r = 0;
	let g = 0;
	let b = 0;
	let n = 0;
	for (let y = cy - radius; y <= cy + radius; y++) {
		for (let x = cx - radius; x <= cx + radius; x++) {
			const at = (y * width + x) * 4;
			if (at < 0 || at + 2 >= pixels.length) continue;
			r += pixels[at];
			g += pixels[at + 1];
			b += pixels[at + 2];
			n++;
		}
	}
	if (n === 0) return { r: 0, g: 0, b: 0 };
	return { r: r / n, g: g / n, b: b / n };
}

/** The colour a face's stickers should be drawn as, for the live preview. */
export const SAMPLE_CSS = (s: Sample) =>
	`rgb(${Math.round(s.r)} ${Math.round(s.g)} ${Math.round(s.b)})`;

/** Which face of the puzzle a scanning step is asking for, in a sensible order. */
export const SCAN_ORDER: readonly Face[] = [0, 2, 1, 5, 4, 3];
