/**
 * Tests for camera colour classification.
 *
 * A real scan cannot be unit tested, so these build synthetic photographs
 * instead: take a known cube state, render each sticker as the RGB a camera
 * would plausibly report, add the distortions that actually break scanners —
 * noise, a warm cast, one face in shadow, a washed-out highlight — and check the
 * original state comes back.
 *
 * The hard pair is red and orange. Every test here includes states with plenty of
 * both, because a classifier that separates green from blue and nothing else
 * would pass a weaker suite than this.
 */

import { describe, expect, it } from 'vitest';
import { classify, samplePatch, type Sample } from './scan';
import { solvedFacelets, stateFromAlg } from './facelets';
import type { Face, Facelets } from './types';

/** Plausible camera readings for a standard sticker set, in U R F D L B order. */
const PLASTIC: Sample[] = [
	{ r: 244, g: 246, b: 248 }, // U white
	{ r: 196, g: 32, b: 40 }, // R red
	{ r: 30, g: 158, b: 74 }, // F green
	{ r: 246, g: 200, b: 24 }, // D yellow
	{ r: 236, g: 118, b: 24 }, // L orange
	{ r: 22, g: 96, b: 208 } // B blue
];

/** A deterministic jitter, so a failure is always reproducible. */
function noise(seed: number) {
	let s = seed >>> 0 || 1;
	return () => {
		s ^= s << 13;
		s >>>= 0;
		s ^= s >>> 17;
		s ^= s << 5;
		s >>>= 0;
		return s / 0x100000000 - 0.5;
	};
}

interface Conditions {
	/** Peak channel wobble, in levels. */
	jitter?: number;
	/** Per-channel multiplier, for a warm or cold cast. */
	cast?: [number, number, number];
	/** Faces rendered darker, as if in shadow. */
	shadow?: Face[];
	/** Faces rendered brighter, as if catching the light. */
	highlight?: Face[];
	seed?: number;
}

/** Render a cube state as the samples a camera might return. */
function photograph(state: Facelets, conditions: Conditions = {}): Sample[] {
	const { jitter = 0, cast = [1, 1, 1], shadow = [], highlight = [], seed = 1 } = conditions;
	const rand = noise(seed);
	const clamp = (v: number) => Math.max(0, Math.min(255, v));
	return Array.from({ length: 54 }, (_, i) => {
		const base = PLASTIC[state[i]];
		const face = Math.floor(i / 9) as Face;
		const scale = shadow.includes(face) ? 0.45 : highlight.includes(face) ? 1.35 : 1;
		return {
			r: clamp(base.r * scale * cast[0] + rand() * jitter),
			g: clamp(base.g * scale * cast[1] + rand() * jitter),
			b: clamp(base.b * scale * cast[2] + rand() * jitter)
		};
	});
}

const STATES: [string, Facelets][] = [
	['solved', solvedFacelets()],
	['sexy move', stateFromAlg("R U R' U'")],
	['a T perm', stateFromAlg("R U R' F' R U R' U' R' F R2 U' R'")],
	['a long scramble', stateFromAlg("B' U2 F R2 D L F2 U' B D2 R F' L2 U R2 D'")],
	['superflip', stateFromAlg("R L U2 F U' D F2 R2 B2 L U2 F' B' U R2 D F2 U R2 U")]
];

describe('a clean photograph', () => {
	it.each(STATES)('reads %s back exactly', (_name, state) => {
		const result = classify(photograph(state));
		expect(Array.from(result.facelets)).toEqual(Array.from(state));
		expect(result.doubtful).toEqual([]);
	});
});

describe('the distortions that break scanners', () => {
	it.each(STATES)('survives sensor noise: %s', (_name, state) => {
		for (let seed = 1; seed <= 8; seed++) {
			const result = classify(photograph(state, { jitter: 26, seed }));
			expect(Array.from(result.facelets), `seed ${seed}`).toEqual(Array.from(state));
		}
	});

	it.each(STATES)('survives a warm cast: %s', (_name, state) => {
		// Indoor light. The classifier compares against centres from the same
		// photograph, so a cast that moves everything moves the references too.
		const result = classify(photograph(state, { cast: [1.15, 1.0, 0.78], jitter: 12 }));
		expect(Array.from(result.facelets)).toEqual(Array.from(state));
	});

	it.each(STATES)('survives one face in shadow: %s', (_name, state) => {
		const result = classify(photograph(state, { shadow: [1, 5], jitter: 10 }));
		expect(Array.from(result.facelets)).toEqual(Array.from(state));
	});

	it.each(STATES)('survives a blown-out highlight: %s', (_name, state) => {
		const result = classify(photograph(state, { highlight: [0], jitter: 10 }));
		expect(Array.from(result.facelets)).toEqual(Array.from(state));
	});
});

describe('red against orange', () => {
	it('keeps them apart even when the cast pushes red towards orange', () => {
		// The pair that actually fails in practice. A warm cast lifts red's green
		// channel, which is exactly what makes it look orange.
		const state = stateFromAlg("R U R' F' R U R' U' R' F R2 U' R' D2 L F2");
		const result = classify(photograph(state, { cast: [1.0, 1.18, 0.85], jitter: 14 }));
		const reds = Array.from(state).filter((c) => c === 1).length;
		const oranges = Array.from(state).filter((c) => c === 4).length;
		expect(reds).toBe(9);
		expect(oranges).toBe(9);
		expect(Array.from(result.facelets)).toEqual(Array.from(state));
	});

	it('keeps white apart from yellow when both are washed out', () => {
		const state = stateFromAlg("F R U R' U' F' D R2 U2");
		const result = classify(photograph(state, { highlight: [0, 3], jitter: 12 }));
		expect(Array.from(result.facelets)).toEqual(Array.from(state));
	});
});

describe('the nine-of-each constraint', () => {
	it('always returns exactly nine of every colour', () => {
		// True by construction, and worth asserting: it is the property that stops
		// one bad reading cascading into a state no cube could hold.
		for (const [, state] of STATES) {
			for (let seed = 1; seed <= 5; seed++) {
				const result = classify(photograph(state, { jitter: 40, seed }));
				const counts = [0, 0, 0, 0, 0, 0];
				for (const colour of result.facelets) counts[colour]++;
				expect(counts).toEqual([9, 9, 9, 9, 9, 9]);
			}
		}
	});

	it('holds even when the samples are nonsense', () => {
		// Six identical grey faces cannot be read, but the result must still be a
		// shape the rest of the site can handle rather than a crash.
		const grey: Sample[] = Array.from({ length: 54 }, () => ({ r: 128, g: 128, b: 128 }));
		const result = classify(grey);
		const counts = [0, 0, 0, 0, 0, 0];
		for (const colour of result.facelets) counts[colour]++;
		expect(counts).toEqual([9, 9, 9, 9, 9, 9]);
	});

	it('keeps every centre as its own face', () => {
		for (const [, state] of STATES) {
			const result = classify(photograph(state, { jitter: 30 }));
			for (let face = 0; face < 6; face++) expect(result.facelets[face * 9 + 4]).toBe(face);
		}
	});
});

describe('confidence', () => {
	it('flags nothing on a clean photograph, or on a lightly noisy one', () => {
		// The behaviour that matters, rather than the absolute number: a reader
		// should not be asked to check stickers that were read perfectly well.
		expect(classify(photograph(STATES[3][1])).doubtful).toEqual([]);
		expect(classify(photograph(STATES[3][1], { jitter: 26, seed: 3 })).doubtful).toEqual([]);
	});

	it('flags stickers when the photograph is genuinely ambiguous', () => {
		// Enough noise that some readings are coin flips. The classifier must say so
		// rather than present a guess as a reading — that is the whole point of
		// surfacing doubtful stickers for the reader to correct.
		const result = classify(photograph(STATES[3][1], { jitter: 120, seed: 3 }));
		expect(result.doubtful.length).toBeGreaterThan(0);
		// And at that noise level readings really are going wrong, so flagging them
		// is the correct response rather than over-caution.
		const wrong = Array.from(result.facelets).filter((c, i) => c !== STATES[3][1][i]).length;
		expect(wrong).toBeGreaterThan(0);
		// Reported worst-first, so the interface can walk them in order.
		for (let i = 1; i < result.doubtful.length; i++) {
			expect(result.confidence[result.doubtful[i]]).toBeGreaterThanOrEqual(
				result.confidence[result.doubtful[i - 1]]
			);
		}
	});

	it('never flags a centre', () => {
		const result = classify(photograph(STATES[2][1], { jitter: 120, seed: 9 }));
		for (const i of result.doubtful) expect(i % 9).not.toBe(4);
	});
});

describe('sampling a patch', () => {
	it('averages the pixels it covers', () => {
		// A 5×5 image, all one colour, so the average is that colour.
		const width = 5;
		const pixels = new Uint8ClampedArray(width * width * 4);
		for (let i = 0; i < width * width; i++) {
			pixels[i * 4] = 10;
			pixels[i * 4 + 1] = 20;
			pixels[i * 4 + 2] = 30;
			pixels[i * 4 + 3] = 255;
		}
		expect(samplePatch(pixels, width, 2, 2, 1)).toEqual({ r: 10, g: 20, b: 30 });
	});

	it('ignores pixels outside the image rather than reading rubbish', () => {
		const width = 3;
		const pixels = new Uint8ClampedArray(width * width * 4).fill(200);
		const sample = samplePatch(pixels, width, 0, 0, 2);
		expect(sample.r).toBeGreaterThan(0);
		expect(sample.r).toBeLessThanOrEqual(200);
	});

	it('rejects a sample count that is not a cube', () => {
		expect(() => classify([])).toThrow();
		expect(() => classify(Array.from({ length: 53 }, () => ({ r: 0, g: 0, b: 0 })))).toThrow();
	});
});
