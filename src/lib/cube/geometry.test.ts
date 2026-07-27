import { describe, expect, it } from 'vitest';
import {
	CUBIES,
	faceletAt,
	faceletsInLayer,
	FACE_TRANSFORM,
	inLayer,
	TURN,
	visibleFaces
} from './geometry';
import { movePerm } from './moves';
import {
	CORNER_FACELETS,
	EDGE_FACELETS,
	CENTER_FACELETS,
	N_FACELETS,
	type Face
} from './types';

describe('the 3D cube shows every sticker exactly once', () => {
	it('has 26 cubies', () => {
		expect(CUBIES).toHaveLength(26);
	});

	it('maps the 26 cubies onto all 54 facelets, with no gaps and no duplicates', () => {
		const seen = new Map<number, string>();
		for (const c of CUBIES) {
			for (const face of visibleFaces(c.x, c.y, c.z)) {
				const index = faceletAt(face, c.x, c.y, c.z);
				expect(index, `out of range at (${c.x},${c.y},${c.z}) face ${face}`).toBeGreaterThanOrEqual(
					0
				);
				expect(index).toBeLessThan(N_FACELETS);
				const where = `(${c.x},${c.y},${c.z}) face ${face}`;
				expect(seen.has(index), `facelet ${index} claimed by both ${seen.get(index)} and ${where}`)
					.toBe(false);
				seen.set(index, where);
			}
		}
		expect(seen.size).toBe(N_FACELETS);
	});

	it('gives corners three faces, edges two and centres one', () => {
		const counts = { 1: 0, 2: 0, 3: 0 } as Record<number, number>;
		for (const c of CUBIES) counts[visibleFaces(c.x, c.y, c.z).length]++;
		expect(counts[1]).toBe(6); // centres
		expect(counts[2]).toBe(12); // edges
		expect(counts[3]).toBe(8); // corners
	});

	it('places the corner cubies on the facelets the engine calls corners', () => {
		const cornerFacelets = new Set(CORNER_FACELETS.flat());
		for (const c of CUBIES) {
			const faces = visibleFaces(c.x, c.y, c.z);
			if (faces.length !== 3) continue;
			for (const face of faces) {
				expect(cornerFacelets.has(faceletAt(face, c.x, c.y, c.z))).toBe(true);
			}
		}
	});

	it('places the edge cubies on the facelets the engine calls edges', () => {
		const edgeFacelets = new Set(EDGE_FACELETS.flat());
		for (const c of CUBIES) {
			const faces = visibleFaces(c.x, c.y, c.z);
			if (faces.length !== 2) continue;
			for (const face of faces) {
				expect(edgeFacelets.has(faceletAt(face, c.x, c.y, c.z))).toBe(true);
			}
		}
	});

	it('places the centre cubies on the centre facelets', () => {
		const centres = new Set(CENTER_FACELETS);
		for (const c of CUBIES) {
			const faces = visibleFaces(c.x, c.y, c.z);
			if (faces.length !== 1) continue;
			expect(centres.has(faceletAt(faces[0], c.x, c.y, c.z))).toBe(true);
		}
	});

	it('agrees with the engine on which cubie holds a named corner', () => {
		// URF is at (1, 1, 1) and must show U9, R1 and F3.
		expect(faceletAt(0 as Face, 1, 1, 1)).toBe(8); // U9
		expect(faceletAt(1 as Face, 1, 1, 1)).toBe(9); // R1
		expect(faceletAt(2 as Face, 1, 1, 1)).toBe(20); // F3
		// DBL is at (-1, -1, -1) and must show D7, B9 and L7.
		expect(faceletAt(3 as Face, -1, -1, -1)).toBe(33); // D7
		expect(faceletAt(5 as Face, -1, -1, -1)).toBe(53); // B9
		expect(faceletAt(4 as Face, -1, -1, -1)).toBe(42); // L7
	});

	it('gives every face a placement transform', () => {
		for (const face of [0, 1, 2, 3, 4, 5] as Face[]) {
			expect(FACE_TRANSFORM[face]).toBeDefined();
		}
	});
});

describe('layers match what the engine actually turns', () => {
	const MOVES = Object.keys(TURN);

	it('every move the engine knows has a layer and a direction', () => {
		for (const base of MOVES) {
			expect(TURN[base], base).toBeDefined();
			expect(['X', 'Y', 'Z']).toContain(TURN[base].axis);
		}
	});

	it('the layer contains every sticker the move disturbs', () => {
		for (const base of MOVES) {
			const perm = movePerm(base);
			const layer = faceletsInLayer(base);
			for (let i = 0; i < N_FACELETS; i++) {
				if (perm[i] === i) continue;
				// The sticker's new home and its old home must both be in the layer;
				// a turn cannot carry a sticker out of the block it is part of.
				expect(layer.has(i), `${base} changes facelet ${i}, which is outside its layer`).toBe(true);
				expect(layer.has(perm[i]), `${base} sources facelet ${perm[i]} from outside its layer`).toBe(
					true
				);
			}
		}
	});

	it('layer sizes are what the geometry implies', () => {
		const size = (base: string) => CUBIES.filter((c) => inLayer(base, c)).length;
		// A face layer is 9 cubies; a slice is 9 too (the centre cubie of the cube
		// is not drawn, so it is 8 for slices).
		for (const face of ['U', 'D', 'R', 'L', 'F', 'B']) expect(size(face), face).toBe(9);
		for (const slice of ['M', 'E', 'S']) expect(size(slice), slice).toBe(8);
		for (const wide of ['Uw', 'Dw', 'Rw', 'Lw', 'Fw', 'Bw']) expect(size(wide), wide).toBe(17);
		for (const rotation of ['x', 'y', 'z']) expect(size(rotation), rotation).toBe(26);
	});

	it('opposite layers share nothing', () => {
		for (const [a, b] of [
			['U', 'D'],
			['R', 'L'],
			['F', 'B']
		]) {
			const layerA = CUBIES.filter((c) => inLayer(a, c));
			const layerB = new Set(CUBIES.filter((c) => inLayer(b, c)));
			expect(layerA.some((c) => layerB.has(c)), `${a}/${b}`).toBe(false);
		}
	});

	it('a wide turn is its face plus the slice beside it', () => {
		const pairs: [string, string, string][] = [
			['Rw', 'R', 'M'],
			['Lw', 'L', 'M'],
			['Uw', 'U', 'E'],
			['Dw', 'D', 'E'],
			['Fw', 'F', 'S'],
			['Bw', 'B', 'S']
		];
		for (const [wide, face, slice] of pairs) {
			for (const c of CUBIES) {
				expect(inLayer(wide, c), `${wide} at (${c.x},${c.y},${c.z})`).toBe(
					inLayer(face, c) || inLayer(slice, c)
				);
			}
		}
	});

	it('slices and faces on the same axis turn the way their names promise', () => {
		// M follows L, E follows D, S follows F — same axis, same direction.
		expect(TURN.M).toEqual(TURN.L);
		expect(TURN.E).toEqual(TURN.D);
		expect(TURN.S).toEqual(TURN.F);
		// Opposite faces turn opposite ways about the same axis.
		expect(TURN.U.axis).toBe(TURN.D.axis);
		expect(TURN.U.sign).toBe(-TURN.D.sign);
		expect(TURN.R.sign).toBe(-TURN.L.sign);
		expect(TURN.F.sign).toBe(-TURN.B.sign);
		// A whole-cube rotation goes the same way as the face it is named after.
		expect(TURN.x).toEqual(TURN.R);
		expect(TURN.y).toEqual(TURN.U);
		expect(TURN.z).toEqual(TURN.F);
	});
});
