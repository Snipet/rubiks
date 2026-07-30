/**
 * Tests for filling in unseen stickers.
 *
 * The headline question is how many faces a camera has to see, and the answer is
 * not the comfortable one. These tests measure it on real scrambles rather than
 * reasoning about it: hide faces, deduce, and count what is left.
 *
 * The safety property matters more than the count. `deduce` must never write a
 * sticker it has not proved, so every test that fills anything in also checks the
 * result against the state it was hiding.
 */

import { describe, expect, it } from 'vitest';
import { deduce, facesStillNeeded, oppositeFace } from './deduce';
import { solvedFacelets, stateFromAlg, UNSET } from './facelets';
import { validateFacelets } from './validate';
import { FACES, type Face, type Facelets } from './types';

/** Blank every sticker except the named faces. */
function keepOnly(state: Facelets, faces: readonly Face[]): Facelets {
	const out = new Uint8Array(54).fill(UNSET);
	for (const face of faces) {
		for (let i = 0; i < 9; i++) out[face * 9 + i] = state[face * 9 + i];
	}
	return out;
}

const SCRAMBLES = [
	"R U R' U'",
	"F R U R' U' F'",
	"R U2 R' U' R U' R' L' U2 L U L' U L",
	"D R' U' R D' R2 U R U' R' U' R2 U2",
	"B' U2 F R2 D L F2 U' B D2 R F'",
	"L2 D2 R U2 R' D2 L2 U' F2 U F2 R2"
];

const U = 0 as Face;
const R = 1 as Face;
const F = 2 as Face;
const D = 3 as Face;
const L = 4 as Face;
const B = 5 as Face;

describe('the colour scheme', () => {
	it('pairs opposite faces three apart', () => {
		expect(oppositeFace(U)).toBe(D);
		expect(oppositeFace(R)).toBe(L);
		expect(oppositeFace(F)).toBe(B);
		for (const face of FACES) expect(oppositeFace(oppositeFace(face))).toBe(face);
	});

	it('gets all six centres from three', () => {
		const state = stateFromAlg("R U R' U'");
		const seen = keepOnly(state, [U, R, F]);
		const after = deduce(seen);
		for (const face of FACES) {
			expect(after.facelets[face * 9 + 4], `centre of face ${face}`).toBe(state[face * 9 + 4]);
		}
	});
});

describe('never writes a sticker it has not proved', () => {
	it.each(SCRAMBLES)('agrees with the hidden truth: %s', (alg) => {
		const truth = stateFromAlg(alg);
		// Try every three-face and five-face combination that shares a corner.
		for (const faces of [
			[U, R, F],
			[U, F, L],
			[D, F, R],
			[U, R, F, D],
			[U, R, F, D, L]
		] as Face[][]) {
			const after = deduce(keepOnly(truth, faces));
			for (let i = 0; i < 54; i++) {
				if (after.facelets[i] === UNSET) continue;
				expect(after.facelets[i], `${alg} from ${faces.join('')} at ${i}`).toBe(truth[i]);
			}
		}
	});

	it('fills nothing at all from an empty scan', () => {
		const after = deduce(new Uint8Array(54).fill(UNSET));
		expect(after.unknown.length).toBe(54);
		expect(after.complete).toBe(false);
	});
});

describe('how many faces are enough', () => {
	it('three faces is NOT enough', () => {
		// The claim worth being precise about. Three faces show 27 stickers; the
		// centres and any piece showing two of its stickers follow, and the rest
		// genuinely does not. A scanner that stopped here would be guessing.
		for (const alg of SCRAMBLES) {
			const after = deduce(keepOnly(stateFromAlg(alg), [U, R, F]));
			expect(after.complete, alg).toBe(false);
			expect(after.unknown.length, alg).toBeGreaterThan(0);
		}
	});

	it('but three faces does resolve a good deal', () => {
		// Worth measuring rather than hand-waving: it is most of the cube, which is
		// why the feature is still worth having.
		const after = deduce(keepOnly(stateFromAlg(SCRAMBLES[4]), [U, R, F]));
		const known = 54 - after.unknown.length;
		expect(known).toBeGreaterThan(27);
		expect(known).toBeLessThan(54);
	});

	it('five faces is usually enough, and honest when it is not', () => {
		// My first assumption was that one hidden face always follows. It does not.
		// With the top hidden, each top-layer edge shows only its side sticker — and
		// if two of them are flipped so that side shows the *top* colour, nothing
		// distinguishes them. `R U R' U'` is exactly that case.
		let complete = 0;
		let incomplete = 0;
		for (const alg of SCRAMBLES) {
			for (const hidden of FACES) {
				const after = deduce(
					keepOnly(
						stateFromAlg(alg),
						FACES.filter((f) => f !== hidden)
					)
				);
				if (after.complete) {
					complete++;
					// Whenever it does claim completeness, it has to be right.
					expect(Array.from(after.facelets), `${alg} without ${hidden}`).toEqual(
						Array.from(stateFromAlg(alg))
					);
				} else {
					incomplete++;
				}
			}
		}
		// Both outcomes happen, which is the whole reason the scanner counts rather
		// than assuming a fixed number of faces.
		expect(complete).toBeGreaterThan(0);
		expect(incomplete).toBeGreaterThan(0);
	});

	it('six faces is the only guarantee', () => {
		for (const alg of SCRAMBLES) {
			const after = deduce(stateFromAlg(alg));
			expect(after.complete, alg).toBe(true);
			expect(Array.from(after.facelets), alg).toEqual(Array.from(stateFromAlg(alg)));
		}
	});

	it('names the flipped-edge case that defeats a five-face scan', () => {
		// Pinned down concretely so the explanation in the scanner stays true: three
		// top stickers unresolved, all of them on edges.
		const after = deduce(
			keepOnly(
				stateFromAlg("R U R' U'"),
				FACES.filter((f) => f !== U)
			)
		);
		expect(after.complete).toBe(false);
		expect(after.unknown).toEqual([1, 5, 7]);
		expect(after.ambiguous.every((a) => a.kind === 'edge')).toBe(true);
	});

	it('four faces is sometimes enough and sometimes not', () => {
		// Which is the honest answer, and the reason the scanner counts rather than
		// assuming. Four faces around a band leave two edges showing one sticker
		// each of the same colour, and nothing distinguishes them.
		const truth = stateFromAlg(SCRAMBLES[4]);
		const results = [
			[U, R, F, D],
			[U, R, F, L],
			[U, R, D, L],
			[R, F, L, B]
		].map((faces) => deduce(keepOnly(truth, faces as Face[])).complete);
		expect(results).toContain(false);
	});

	it('a solved cube is a special case, and still not deducible from three', () => {
		// Every piece is where it belongs, but "every piece is where it belongs" is
		// a fact about the answer, not something three faces tell you.
		const after = deduce(keepOnly(solvedFacelets(), [U, R, F]));
		expect(after.complete).toBe(false);
	});
});

describe('what it reports', () => {
	it('names the slots it could not pin down', () => {
		const after = deduce(keepOnly(stateFromAlg(SCRAMBLES[4]), [U, R, F]));
		expect(after.ambiguous.length).toBeGreaterThan(0);
		for (const entry of after.ambiguous) {
			expect(['corner', 'edge']).toContain(entry.kind);
			// More than one candidate is exactly why it is unresolved.
			expect(entry.candidates).toBeGreaterThan(1);
		}
	});

	it('suggests faces worth scanning next, best first', () => {
		const seen = keepOnly(stateFromAlg(SCRAMBLES[4]), [U, R, F]);
		const needed = facesStillNeeded(seen);
		expect(needed.length).toBeGreaterThan(0);
		// Never suggests a face already scanned.
		for (const face of needed) expect([U, R, F]).not.toContain(face);
	});

	it('asks for nothing once the cube is determined', () => {
		const truth = stateFromAlg(SCRAMBLES[0]);
		expect(
			facesStillNeeded(
				keepOnly(
					truth,
					FACES.filter((f) => f !== D)
				)
			)
		).toEqual([]);
		expect(facesStillNeeded(truth)).toEqual([]);
	});
});

describe('it composes with the validator', () => {
	it('a fully deduced scan is a legal cube', () => {
		// Only assert legality where the deduction actually completed; where it did
		// not, the state still holds UNSET and there is nothing to validate.
		for (const alg of SCRAMBLES) {
			for (const hidden of FACES) {
				const after = deduce(
					keepOnly(
						stateFromAlg(alg),
						FACES.filter((f) => f !== hidden)
					)
				);
				if (!after.complete) continue;
				expect(validateFacelets(after.facelets).ok, `${alg} without ${hidden}`).toBe(true);
			}
		}
	});

	it('a misread sticker leaves the scan unresolvable rather than plausible', () => {
		// The failure mode that matters for a camera: a colour read wrongly should
		// show up as a contradiction, not as a different legal cube.
		const truth = stateFromAlg(SCRAMBLES[4]);
		const seen = keepOnly(
			truth,
			FACES.filter((f) => f !== D)
		);
		// Corrupt one corner sticker to a colour that cannot belong to that piece.
		const corner = 8; // URF's U sticker
		seen[corner] = seen[corner] === 1 ? 2 : 1;
		const after = deduce(seen);
		const stillWrong = !after.complete || !validateFacelets(after.facelets).ok;
		expect(stillWrong).toBe(true);
	});
});
