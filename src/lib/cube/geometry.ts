/**
 * Geometry for the 3D cube view.
 *
 * Kept out of the component so it can be tested. A wrong entry here would show
 * up as stickers in the wrong places or a layer turning the wrong way — both
 * things that look plausible in a screenshot and are maddening to debug, so they
 * are pinned down by tests instead.
 *
 * Model coordinates are the natural ones: **x right, y up, z towards the
 * viewer**. CSS puts y the other way up, which the component compensates for
 * when it positions a cubie; everything in this file uses the model convention.
 */

import type { Face } from './types';

export interface CubiePosition {
	x: number;
	y: number;
	z: number;
}

/** The 26 visible cubies. The core is not drawn. */
export const CUBIES: readonly CubiePosition[] = (() => {
	const out: CubiePosition[] = [];
	for (let x = -1; x <= 1; x++)
		for (let y = -1; y <= 1; y++)
			for (let z = -1; z <= 1; z++) if (x || y || z) out.push({ x, y, z });
	return out;
})();

/**
 * Which facelet a cubie shows on a given face.
 *
 * Worked out from the facelet numbering rather than tabulated: `U1` is the
 * up-back-left sticker, so the U face's rows run back to front; `D1` is
 * down-front-left, so D's rows run front to back; `B` and `R` are numbered as
 * seen from outside those faces, which is why their columns count backwards.
 */
export function faceletAt(face: Face, x: number, y: number, z: number): number {
	switch (face) {
		case 0:
			return 0 + (z + 1) * 3 + (x + 1); // U: rows back→front, columns left→right
		case 1:
			return 9 + (1 - y) * 3 + (1 - z); // R: columns front→back
		case 2:
			return 18 + (1 - y) * 3 + (x + 1); // F
		case 3:
			return 27 + (1 - z) * 3 + (x + 1); // D: rows front→back
		case 4:
			return 36 + (1 - y) * 3 + (z + 1); // L: columns back→front
		case 5:
			return 45 + (1 - y) * 3 + (1 - x); // B: seen from behind
	}
}

/** The faces a cubie actually shows, given where it sits. */
export function visibleFaces(x: number, y: number, z: number): Face[] {
	const faces: Face[] = [];
	if (y === 1) faces.push(0);
	if (x === 1) faces.push(1);
	if (z === 1) faces.push(2);
	if (y === -1) faces.push(3);
	if (x === -1) faces.push(4);
	if (z === -1) faces.push(5);
	return faces;
}

/**
 * How each face of a cubie is placed, as a CSS transform prefix. These are the
 * canonical placements: `rotateY(90deg) translateZ(h)` puts a face on the right.
 */
export const FACE_TRANSFORM: Record<Face, string> = {
	0: 'rotateX(90deg)',
	1: 'rotateY(90deg)',
	2: '',
	3: 'rotateX(-90deg)',
	4: 'rotateY(-90deg)',
	5: 'rotateY(180deg)'
};

/**
 * Axis and direction for every turn, in CSS's y-down coordinate system.
 *
 * Derived from the right-hand rule on CSS axes, where `rotateX` sends y→z,
 * `rotateY` sends z→x and `rotateZ` sends x→y:
 *
 * - a `U` turn takes the front face to the left, which is `rotateY(-90deg)`;
 * - an `R` turn takes the front face to the top, which is `rotateX(90deg)`;
 * - an `F` turn takes the top face to the right, which is `rotateZ(90deg)`.
 *
 * Everything else follows: the opposite face turns the other way, a slice
 * follows the face it is named after, and a wide turn follows its own face.
 */
export const TURN: Record<string, { axis: 'X' | 'Y' | 'Z'; sign: 1 | -1 }> = {
	U: { axis: 'Y', sign: -1 },
	D: { axis: 'Y', sign: 1 },
	E: { axis: 'Y', sign: 1 },
	Uw: { axis: 'Y', sign: -1 },
	Dw: { axis: 'Y', sign: 1 },
	y: { axis: 'Y', sign: -1 },
	R: { axis: 'X', sign: 1 },
	L: { axis: 'X', sign: -1 },
	M: { axis: 'X', sign: -1 },
	Rw: { axis: 'X', sign: 1 },
	Lw: { axis: 'X', sign: -1 },
	x: { axis: 'X', sign: 1 },
	F: { axis: 'Z', sign: 1 },
	B: { axis: 'Z', sign: -1 },
	S: { axis: 'Z', sign: 1 },
	Fw: { axis: 'Z', sign: 1 },
	Bw: { axis: 'Z', sign: -1 },
	z: { axis: 'Z', sign: 1 }
};

/** Whether a cubie belongs to the layer a move turns. */
export function inLayer(base: string, c: CubiePosition): boolean {
	switch (base) {
		case 'U':
			return c.y === 1;
		case 'D':
			return c.y === -1;
		case 'R':
			return c.x === 1;
		case 'L':
			return c.x === -1;
		case 'F':
			return c.z === 1;
		case 'B':
			return c.z === -1;
		case 'M':
			return c.x === 0;
		case 'E':
			return c.y === 0;
		case 'S':
			return c.z === 0;
		case 'Uw':
			return c.y >= 0;
		case 'Dw':
			return c.y <= 0;
		case 'Rw':
			return c.x >= 0;
		case 'Lw':
			return c.x <= 0;
		case 'Fw':
			return c.z >= 0;
		case 'Bw':
			return c.z <= 0;
		default:
			return true; // x, y and z rotate the whole cube
	}
}

/** Every facelet shown by the cubies a move turns. */
export function faceletsInLayer(base: string): Set<number> {
	const out = new Set<number>();
	for (const c of CUBIES) {
		if (!inLayer(base, c)) continue;
		for (const face of visibleFaces(c.x, c.y, c.z)) out.add(faceletAt(face, c.x, c.y, c.z));
	}
	return out;
}
