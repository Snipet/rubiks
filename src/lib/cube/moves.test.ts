import { describe, expect, it } from 'vitest';
import {
	algPerm,
	composePerm,
	formatAlg,
	HTM_MOVES,
	IDENTITY,
	invertAlg,
	invertPerm,
	mirrorAlg,
	movePerm,
	parseAlg,
	simplifyAlg,
	NotationError
} from './moves';
import {
	applyAlg,
	caseFromAlg,
	faceletsEqual,
	faceletsToString,
	isSolved,
	isSolvedIgnoringOrientation,
	reorientToStandard,
	solvedFacelets,
	stateFromAlg,
	ORIENTATIONS
} from './facelets';
import { cubieToFacelets, faceletsToCubie, permutationParity, solvedCubie } from './cubie';
import { validateFacelets } from './validate';
import { CENTER_FACELETS, N_FACELETS } from './types';

const permEquals = (a: Readonly<Uint8Array>, b: Readonly<Uint8Array>) =>
	a.length === b.length && a.every((v, i) => v === b[i]);

/** Order of the group element produced by an algorithm. */
function order(alg: string): number {
	const p = algPerm(alg);
	let acc = p;
	for (let n = 1; n <= 5000; n++) {
		if (permEquals(acc, IDENTITY)) return n;
		acc = composePerm(acc, p);
	}
	return -1;
}

/** Which sticker indices a move actually disturbs. */
function movedStickers(alg: string): number[] {
	const p = algPerm(alg);
	return Array.from({ length: N_FACELETS }, (_, i) => i).filter((i) => p[i] !== i);
}

const ALL_TURNS = [
	'U',
	'R',
	'F',
	'D',
	'L',
	'B',
	'Uw',
	'Rw',
	'Fw',
	'Dw',
	'Lw',
	'Bw',
	'M',
	'E',
	'S',
	'x',
	'y',
	'z'
];

describe('permutations are well formed', () => {
	it('every base move is a bijection on 54 stickers', () => {
		for (const m of ALL_TURNS) {
			expect(new Set(movePerm(m)).size, m).toBe(N_FACELETS);
		}
	});

	it('each quarter turn has order 4', () => {
		for (const m of ALL_TURNS) expect(order(m), m).toBe(4);
	});

	it('half turns have order 2 and inverses undo', () => {
		for (const m of HTM_MOVES) {
			const p = movePerm(m);
			expect(permEquals(composePerm(p, invertPerm(p)), IDENTITY), m).toBe(true);
		}
		for (const m of ALL_TURNS) expect(order(`${m}2`), m).toBe(2);
	});

	it('opposite faces commute', () => {
		for (const [a, b] of [
			['R', 'L'],
			['U', 'D'],
			['F', 'B']
		]) {
			expect(permEquals(algPerm(`${a} ${b}`), algPerm(`${b} ${a}`)), `${a}/${b}`).toBe(true);
		}
	});

	it('a face turn disturbs exactly 20 stickers', () => {
		// 8 on the face itself (the centre stays) plus 3 on each of 4 neighbours.
		for (const f of ['U', 'R', 'F', 'D', 'L', 'B']) {
			expect(movedStickers(f).length, f).toBe(20);
		}
	});

	it('a slice turn disturbs exactly 12 stickers', () => {
		// 3 on each of the 4 faces it cuts through, including their centres.
		for (const s of ['M', 'E', 'S']) expect(movedStickers(s).length, s).toBe(12);
	});

	it('a wide turn disturbs exactly 32 stickers', () => {
		// The face turn's 20 and the slice turn's 12 are disjoint: the face turn
		// grabs the outer strip of each neighbour, the slice the middle strip.
		for (const w of ['Rw', 'Lw', 'Uw', 'Dw', 'Fw', 'Bw']) {
			expect(movedStickers(w).length, w).toBe(32);
		}
	});

	it('a rotation disturbs every sticker except the core-adjacent fixed points', () => {
		// A quarter rotation about an axis leaves only the two centres on that axis.
		expect(movedStickers('x').length).toBe(52);
		expect(movedStickers('y').length).toBe(52);
		expect(movedStickers('z').length).toBe(52);
	});
});

describe('known group orders', () => {
	// Published values. Reproducing all of these by chance with a broken move
	// table is not plausible.
	it.each([
		['R U', 105],
		["R U'", 63],
		["R U R' U'", 6],
		["R U2 D' B D'", 1260],
		['R L', 4],
		['R U F', 80],
		["R' F R F'", 6],
		["R U R' U R U2 R'", 6],
		["R U R' U' R' F R2 U' R' U' R U R' F'", 2],
		['M2 U M2 U2 M2 U M2', 2],
		["R2 U R U R' U' R' U' R' U R'", 3]
	])('order(%s) = %i', (alg, expected) => {
		expect(order(alg as string)).toBe(expected);
	});
});

describe('wide and slice turns act on the right layers', () => {
	it('a wide turn leaves the far face completely alone', () => {
		const opposite: Record<string, [number, number]> = {
			Rw: [36, 44],
			Lw: [9, 17],
			Uw: [27, 35],
			Dw: [0, 8],
			Fw: [45, 53],
			Bw: [18, 26]
		};
		for (const [move, [lo, hi]] of Object.entries(opposite)) {
			const p = movePerm(move);
			for (let i = lo; i <= hi; i++) expect(p[i], `${move} moved sticker ${i}`).toBe(i);
		}
	});

	it('a wide turn twists its own face exactly like the face turn does', () => {
		const pairs: [string, string, number][] = [
			['Rw', 'R', 9],
			['Lw', 'L', 36],
			['Uw', 'U', 0],
			['Dw', 'D', 27],
			['Fw', 'F', 18],
			['Bw', 'B', 45]
		];
		for (const [wide, face, base] of pairs) {
			const pw = movePerm(wide);
			const pf = movePerm(face);
			for (let i = base; i < base + 9; i++) expect(pw[i], `${wide} vs ${face} at ${i}`).toBe(pf[i]);
		}
	});

	it('a slice turn leaves both parallel faces alone', () => {
		const parallel: Record<string, number[]> = {
			M: [9, 36],
			E: [0, 27],
			S: [18, 45]
		};
		for (const [move, faces] of Object.entries(parallel)) {
			const p = movePerm(move);
			for (const base of faces) {
				for (let i = base; i < base + 9; i++) expect(p[i], `${move} moved sticker ${i}`).toBe(i);
			}
		}
	});

	it('M matches an independently hand-derived cycle definition', () => {
		// M cuts the middle columns of U, F, D and B and follows L, so
		// U → F → D → B → U, with B's column running the other way up.
		const expected = new Uint8Array(IDENTITY);
		for (const cycle of [
			[1, 19, 28, 52],
			[4, 22, 31, 49],
			[7, 25, 34, 46]
		]) {
			for (let i = 0; i < cycle.length; i++) {
				expected[cycle[(i + 1) % cycle.length]] = cycle[i];
			}
		}
		expect(permEquals(movePerm('M'), expected)).toBe(true);
	});

	it('a wide turn is its face plus the parallel slice', () => {
		expect(permEquals(algPerm('Rw'), algPerm("R M'"))).toBe(true);
		expect(permEquals(algPerm('Lw'), algPerm('L M'))).toBe(true);
		expect(permEquals(algPerm('Uw'), algPerm("U E'"))).toBe(true);
		expect(permEquals(algPerm('Dw'), algPerm('D E'))).toBe(true);
		expect(permEquals(algPerm('Fw'), algPerm('F S'))).toBe(true);
		expect(permEquals(algPerm('Bw'), algPerm("B S'"))).toBe(true);
	});

	it('a rotation is the three parallel layers turning together', () => {
		expect(permEquals(algPerm('x'), algPerm("R M' L'"))).toBe(true);
		expect(permEquals(algPerm('y'), algPerm("U E' D'"))).toBe(true);
		expect(permEquals(algPerm('z'), algPerm("F S B'"))).toBe(true);
	});
});

describe('whole-cube rotations', () => {
	it('relabel the faces as expected', () => {
		// Centres are the ground truth for where a face went.
		const centreMap = (alg: string) => {
			const f = stateFromAlg(alg);
			return CENTER_FACELETS.map((i) => f[i]);
		};
		//                          U  R  F  D  L  B  ← reading "this slot now shows"
		expect(centreMap('x')).toEqual([2, 1, 3, 5, 4, 0]); // U←F, F←D, D←B, B←U
		expect(centreMap('y')).toEqual([0, 5, 1, 3, 2, 4]); // R←B, F←R, L←F, B←L
		expect(centreMap('z')).toEqual([4, 0, 2, 1, 3, 5]); // U←L, R←U, D←R, L←D
	});

	it('leave the cube solved, only held differently', () => {
		for (const r of ORIENTATIONS) {
			const f = stateFromAlg(r);
			expect(isSolvedIgnoringOrientation(f), r || 'identity').toBe(true);
			expect(isSolved(reorientToStandard(f)!), r || 'identity').toBe(true);
		}
	});

	it('the 24 orientations are all distinct', () => {
		const seen = new Set(ORIENTATIONS.map((r) => faceletsToString(stateFromAlg(r))));
		expect(seen.size).toBe(24);
	});

	it('reorienting recovers the canonical frame after a rotated algorithm', () => {
		// The A-perm is normally written with a leading x, so the cube ends tilted.
		const alg = "x R2 D2 R' U' R D2 R' U R'";
		const state = applyAlg(caseFromAlg(alg), alg);
		expect(isSolved(state)).toBe(true); // inverse-then-alg cancels exactly
		const tilted = stateFromAlg('x');
		expect(isSolved(tilted)).toBe(false);
		expect(isSolvedIgnoringOrientation(tilted)).toBe(true);
	});
});

describe('superflip', () => {
	// All twelve edges flipped in place, everything else solved: the unique state
	// requiring 20 moves in half-turn metric.
	const SUPERFLIP = "R L U2 F U' D F2 R2 B2 L U2 F' B' U R2 D F2 U R2 U";

	it('flips all twelve edges and nothing else', () => {
		const state = faceletsToCubie(stateFromAlg(SUPERFLIP));
		expect(state.cp).toEqual([0, 1, 2, 3, 4, 5, 6, 7]);
		expect(state.co).toEqual([0, 0, 0, 0, 0, 0, 0, 0]);
		expect(state.ep).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
		expect(state.eo).toEqual([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
	});

	it('is its own inverse', () => {
		expect(order(SUPERFLIP)).toBe(2);
	});

	it('is a legal cube state', () => {
		expect(validateFacelets(stateFromAlg(SUPERFLIP)).ok).toBe(true);
	});

	it('is reachable another way too', () => {
		// A different published 20-move superflip must land on the same state.
		const other = "U R2 F B R B2 R U2 L B2 R U' D' R2 F R' L B2 U2 F2";
		expect(faceletsEqual(stateFromAlg(SUPERFLIP), stateFromAlg(other))).toBe(true);
	});
});

describe('facelet / cubie round trip', () => {
	it('survives a round trip for many random-ish states', () => {
		let f = solvedFacelets();
		let seed = 12345;
		const rand = () => (seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
		for (let i = 0; i < 500; i++) {
			f = applyAlg(f, HTM_MOVES[Math.floor(rand() * HTM_MOVES.length)]);
			const cubie = faceletsToCubie(f);
			expect(faceletsEqual(cubieToFacelets(cubie), f)).toBe(true);
			expect(validateFacelets(f).ok).toBe(true);
		}
	});

	it('solved converts to the solved cubie state', () => {
		expect(faceletsToCubie(solvedFacelets())).toEqual(solvedCubie());
	});

	it('serialises to the conventional string', () => {
		expect(faceletsToString(solvedFacelets())).toBe(
			'UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB'
		);
	});
});

describe('sticker geometry sanity', () => {
	it('a U turn carries the front colour round to the left face', () => {
		// The UF edge's F sticker (F2, index 19) lands on the UL edge's L sticker.
		const f = stateFromAlg('U');
		expect(f[37]).toBe(2); // L2 now shows green (F)
		expect(f[7]).toBe(0); // the U sticker stays white
	});

	it('the sexy move leaves the whole down face except the DFR corner', () => {
		// R U R' U' touches the DFR corner, which owns D3 — nothing else on D.
		const f = stateFromAlg("R U R' U'");
		const changed = [];
		for (let i = 27; i < 36; i++) if (f[i] !== 3) changed.push(i);
		expect(changed).toEqual([29]);
	});

	it('a T-perm swaps two corners and two edges of the last layer only', () => {
		const state = faceletsToCubie(stateFromAlg("R U R' U' R' F R2 U' R' U' R U R' F'"));
		expect(state.co).toEqual([0, 0, 0, 0, 0, 0, 0, 0]);
		expect(state.eo).toEqual([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
		expect(state.cp).toEqual([3, 1, 2, 0, 4, 5, 6, 7]); // URF ↔ UBR
		expect(state.ep).toEqual([2, 1, 0, 3, 4, 5, 6, 7, 8, 9, 10, 11]); // UR ↔ UL
	});
});

describe('notation', () => {
	it('parses and reprints canonically', () => {
		expect(formatAlg(parseAlg("R U R’ U'"))).toBe("R U R' U'");
		expect(formatAlg(parseAlg('r Uw2 M’ x2'))).toBe("Rw Uw2 M' x2");
		expect(formatAlg(parseAlg("R2'"))).toBe('R2');
		expect(formatAlg(parseAlg('R,U , R2'))).toBe('R U R2');
		expect(formatAlg(parseAlg('2R 2L'))).toBe('Rw Lw');
	});

	it('treats aliases as the same move', () => {
		expect(permEquals(algPerm('r'), algPerm('Rw'))).toBe(true);
		expect(permEquals(algPerm('u2'), algPerm('Uw2'))).toBe(true);
	});

	it('expands repeated groups', () => {
		expect(formatAlg(parseAlg("(R U R' U')*3"))).toBe("R U R' U' R U R' U' R U R' U'");
		expect(formatAlg(parseAlg('(R U)2 F'))).toBe('R U R U F');
		expect(formatAlg(parseAlg("(R U R')'"))).toBe("R U' R'");
		expect(formatAlg(parseAlg("(R (U D)2 R')"))).toBe("R U D U D R'");
	});

	it('rejects nonsense', () => {
		expect(() => parseAlg('Q')).toThrow(NotationError);
		expect(() => parseAlg('R U (F')).toThrow(NotationError);
		expect(() => parseAlg('R U )')).toThrow(NotationError);
	});

	it('inverting an algorithm undoes it', () => {
		const alg = "R U R' U' R' F R2 U' R' U' R U R' F'";
		expect(isSolved(applyAlg(stateFromAlg(alg), invertAlg(parseAlg(alg))))).toBe(true);
	});

	it('mirroring swaps R and L and flips direction', () => {
		expect(formatAlg(mirrorAlg(parseAlg("R U R' U'")))).toBe("L' U' L U");
		expect(formatAlg(mirrorAlg(parseAlg('R2 D2')))).toBe('L2 D2');
	});

	it('mirroring twice is the identity', () => {
		const alg = "Rw U R' U' Rw' F R F'";
		expect(formatAlg(mirrorAlg(mirrorAlg(parseAlg(alg))))).toBe(alg);
	});

	it('a mirrored algorithm has the same order and move count', () => {
		for (const alg of ["R U R' U R U2 R'", "R U R' U' R' F R2 U' R' U' R U R' F'"]) {
			const mirrored = formatAlg(mirrorAlg(parseAlg(alg)));
			expect(order(mirrored), alg).toBe(order(alg));
			expect(parseAlg(mirrored).length).toBe(parseAlg(alg).length);
		}
	});

	it('simplify cancels and merges', () => {
		expect(formatAlg(simplifyAlg(parseAlg("R R'")))).toBe('');
		expect(formatAlg(simplifyAlg(parseAlg('R R')))).toBe('R2');
		expect(formatAlg(simplifyAlg(parseAlg('R R2')))).toBe("R'");
		expect(formatAlg(simplifyAlg(parseAlg("R L R'")))).toBe('L');
		expect(formatAlg(simplifyAlg(parseAlg("U D U2 D'")))).toBe("U'");
		expect(formatAlg(simplifyAlg(parseAlg("R U U' R'")))).toBe('');
		expect(formatAlg(simplifyAlg(parseAlg("F R L' R' L F'")))).toBe('');
	});

	it('simplify never changes what an algorithm does', () => {
		for (const alg of [
			"R R' U U2 D D' F F F F",
			"R L R' L' U D U' D'",
			"R U R' U' R' F R2 U' R' U' R U R' F'",
			'M2 U M2 U2 M2 U M2',
			"Rw U R' U' Rw' F R F' L L' B B2 B"
		]) {
			expect(
				faceletsEqual(stateFromAlg(alg), stateFromAlg(formatAlg(simplifyAlg(parseAlg(alg))))),
				alg
			).toBe(true);
		}
	});
});

describe('case generation', () => {
	it('an algorithm solves the case derived from it', () => {
		for (const alg of [
			"R U R' U' R' F R2 U' R' U' R U R' F'", // T perm
			"x R2 D2 R' U' R D2 R' U R'", // Aa perm — contains a rotation
			"R U R' U R U2 R'", // Sune
			'M2 U M2 U2 M2 U M2', // H perm
			"Rw U R' U' Rw' F R F'" // OLL with a wide turn
		]) {
			expect(isSolvedIgnoringOrientation(applyAlg(caseFromAlg(alg), alg)), alg).toBe(true);
		}
	});
});

describe('validation', () => {
	it('accepts a solved cube', () => {
		expect(validateFacelets(solvedFacelets()).ok).toBe(true);
	});

	it('catches a single twisted corner', () => {
		const f = solvedFacelets();
		[f[8], f[9], f[20]] = [f[20], f[8], f[9]]; // URF: U9 R1 F3
		const result = validateFacelets(f);
		expect(result.ok).toBe(false);
		expect(result.issues.map((i) => i.code)).toContain('corner-twist');
	});

	it('catches a single flipped edge', () => {
		const f = solvedFacelets();
		[f[5], f[10]] = [f[10], f[5]]; // UR edge
		const result = validateFacelets(f);
		expect(result.ok).toBe(false);
		expect(result.issues.map((i) => i.code)).toContain('edge-flip');
	});

	it('catches a two-piece swap', () => {
		const f = solvedFacelets();
		[f[5], f[10], f[7], f[19]] = [f[7], f[19], f[5], f[10]];
		const result = validateFacelets(f);
		expect(result.ok).toBe(false);
		expect(result.issues.map((i) => i.code)).toContain('parity');
	});

	it('catches a bad colour count', () => {
		const f = solvedFacelets();
		f[8] = 1;
		const result = validateFacelets(f);
		expect(result.ok).toBe(false);
		expect(result.issues.map((i) => i.code)).toContain('color-count');
	});

	it('catches an impossible edge made of two opposite colours', () => {
		const f = solvedFacelets();
		// Make the UR edge white/yellow, keeping every colour count at nine by
		// borrowing the recoloured sticker back from the DF edge.
		f[10] = 3; // R2 → yellow, so UR reads white/yellow
		f[28] = 1; // D2 → red, keeping the tallies straight
		const result = validateFacelets(f);
		expect(result.ok).toBe(false);
		expect(result.issues.map((i) => i.code)).toContain('bad-edge');
	});

	it('reports unset stickers first', () => {
		const f = solvedFacelets();
		f[0] = 255;
		const result = validateFacelets(f);
		expect(result.issues[0].code).toBe('incomplete');
		expect(result.unset).toBe(1);
	});
});

describe('parity helper', () => {
	it('counts transpositions', () => {
		expect(permutationParity([0, 1, 2, 3])).toBe(0);
		expect(permutationParity([1, 0, 2, 3])).toBe(1);
		expect(permutationParity([1, 2, 0, 3])).toBe(0);
		expect(permutationParity([3, 2, 1, 0])).toBe(0);
	});
});
