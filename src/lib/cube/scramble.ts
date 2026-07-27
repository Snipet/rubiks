/**
 * Scramble generation.
 *
 * These are random-move scrambles, filtered so no turn is wasted: never the same
 * face twice, and never a same-axis pair repeated (`R L R` cannot happen). That
 * is what practice scrambles want. It is *not* the WCA's random-state scramble —
 * generating those needs a full two-phase solver and a lot of table memory, and
 * the difference is invisible when you are drilling.
 */

import { formatAlg, invertAlg, parseAlg, simplifyAlg, type Move } from './moves';
import { applyAlg, solvedFacelets } from './facelets';
import type { Facelets } from './types';

const FACES = ['U', 'R', 'F', 'D', 'L', 'B'] as const;
const AXIS_OF: Record<string, number> = { U: 0, D: 0, R: 1, L: 1, F: 2, B: 2 };
const SUFFIX = ['', '2', "'"] as const;

/** A tiny deterministic PRNG so scrambles can be reproduced from a seed. */
export function makeRng(seed: number): () => number {
	let s = seed >>> 0 || 0x2f6e2b1;
	return () => {
		// xorshift32
		s ^= s << 13;
		s >>>= 0;
		s ^= s >>> 17;
		s ^= s << 5;
		s >>>= 0;
		return s / 0x100000000;
	};
}

export interface ScrambleOptions {
	/** How many turns. WCA scrambles are 20-ish; the default matches. */
	length?: number;
	/** Supply a seed for a reproducible scramble. */
	seed?: number;
	/** Restrict to a subset of faces, e.g. for 2-generator drills. */
	faces?: readonly string[];
}

/** Generate a scramble as a canonical string. */
export function randomScramble(options: ScrambleOptions = {}): string {
	const { length = 20, seed, faces = FACES } = options;
	const rand = seed === undefined ? Math.random : makeRng(seed);
	const out: string[] = [];
	let lastFace = '';
	let prevFace = '';

	while (out.length < length) {
		const face = faces[Math.floor(rand() * faces.length)];
		if (face === lastFace) continue;
		// Block `R L R`: a same-axis sandwich is always reducible.
		if (AXIS_OF[face] === AXIS_OF[lastFace] && face === prevFace) continue;
		const suffix = SUFFIX[Math.floor(rand() * SUFFIX.length)];
		out.push(face + suffix);
		prevFace = lastFace;
		lastFace = face;
	}
	return out.join(' ');
}

/** Generate a scramble and the state it produces. */
export function scrambledState(options: ScrambleOptions = {}): {
	scramble: string;
	moves: Move[];
	state: Facelets;
} {
	const scramble = randomScramble(options);
	const moves = parseAlg(scramble);
	return { scramble, moves, state: applyAlg(solvedFacelets(), moves) };
}

/**
 * A setup that leaves the first two layers intact, for last-layer drilling: the
 * inverse of the case algorithm, wrapped in random U-face turns so the case turns
 * up in a different orientation each time and recognition gets properly exercised.
 */
export function lastLayerScramble(caseAlg: string, options: { seed?: number } = {}): string {
	const rand = options.seed === undefined ? Math.random : makeRng(options.seed);
	const auf = () => {
		const n = Math.floor(rand() * 4);
		return n === 0 ? '' : `U${SUFFIX[n - 1]}`;
	};
	const setup = [auf(), formatAlg(invertAlg(parseAlg(caseAlg))), auf()].filter(Boolean).join(' ');
	return formatAlg(simplifyAlg(parseAlg(setup)));
}
