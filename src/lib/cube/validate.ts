/**
 * State validation.
 *
 * When someone types their physical cube into the sticker editor there are a
 * great many ways to get it slightly wrong, and "that's not solvable" on its own
 * is a useless error message. Each check here reports what is wrong in the terms
 * a cuber would use, and — where the maths allows it — how to fix it.
 */

import { CubieDecodeError, faceletsToCubie, permutationParity } from './cubie';
import { colorCounts, countUnset, UNSET } from './facelets';
import { CENTER_FACELETS, FACE_NAMES, N_FACELETS, type Facelets } from './types';

export type ValidationCode =
	| 'incomplete'
	| 'centers'
	| 'color-count'
	| 'bad-corner'
	| 'bad-edge'
	| 'duplicate-corner'
	| 'duplicate-edge'
	| 'corner-twist'
	| 'edge-flip'
	| 'parity';

export interface ValidationIssue {
	code: ValidationCode;
	/** Short, human sentence describing the problem. */
	message: string;
	/** What to do about it, when there is a clear answer. */
	hint?: string;
	/** Sticker indices worth highlighting in the editor. */
	facelets?: number[];
}

export interface ValidationResult {
	ok: boolean;
	issues: ValidationIssue[];
	/** How many stickers are still uncoloured. */
	unset: number;
}

/**
 * Check whether a sticker state describes a real, solvable cube.
 *
 * The three "impossible cube" laws are checked last, because they only mean
 * anything once the cheaper structural checks pass:
 *
 * - corner twists must sum to a multiple of 3,
 * - edge flips must sum to an even number,
 * - corner and edge permutation parity must agree.
 */
export function validateFacelets(f: Facelets): ValidationResult {
	const issues: ValidationIssue[] = [];
	const unset = countUnset(f);

	if (unset > 0) {
		issues.push({
			code: 'incomplete',
			message: `${unset} sticker${unset === 1 ? '' : 's'} still ${unset === 1 ? 'needs' : 'need'} a colour.`,
			hint: 'Pick a colour from the palette, then click the blank stickers.',
			facelets: Array.from({ length: N_FACELETS }, (_, i) => i).filter((i) => f[i] === UNSET)
		});
		return { ok: false, issues, unset };
	}

	const centers = CENTER_FACELETS.map((i) => f[i]);
	if (new Set(centers).size !== 6) {
		issues.push({
			code: 'centers',
			message: 'The six centre stickers must all be different colours.',
			hint: 'Centres never move relative to each other, so they define the colour scheme.',
			facelets: [...CENTER_FACELETS]
		});
	}

	const counts = colorCounts(f);
	const wrong = counts.map((n, i) => ({ n, i })).filter(({ n }) => n !== 9);
	if (wrong.length > 0) {
		issues.push({
			code: 'color-count',
			message:
				'Each colour must appear exactly nine times: ' +
				wrong.map(({ n, i }) => `${FACE_NAMES[i]} has ${n}`).join(', ') +
				'.',
			hint: 'Count round the cube again — a miscount here is the most common mistake.'
		});
	}

	if (issues.length > 0) return { ok: false, issues, unset };

	let state;
	try {
		state = faceletsToCubie(f);
	} catch (err) {
		if (err instanceof CubieDecodeError) {
			issues.push({
				code: err.kind === 'corner' ? 'bad-corner' : 'bad-edge',
				message: err.message,
				hint:
					err.kind === 'corner'
						? 'Every corner carries three colours from three mutually adjacent faces.'
						: 'Every edge carries two colours from two adjacent faces — never two opposites.'
			});
			return { ok: false, issues, unset };
		}
		throw err;
	}

	if (new Set(state.cp).size !== 8) {
		issues.push({
			code: 'duplicate-corner',
			message: 'Two corner positions hold the same corner piece.',
			hint: 'One of the corners has been read wrong — check the three colours of each.'
		});
	}
	if (new Set(state.ep).size !== 12) {
		issues.push({
			code: 'duplicate-edge',
			message: 'Two edge positions hold the same edge piece.',
			hint: 'One of the edges has been read wrong — check the two colours of each.'
		});
	}
	if (issues.length > 0) return { ok: false, issues, unset };

	const twist = state.co.reduce((a, b) => a + b, 0) % 3;
	if (twist !== 0) {
		issues.push({
			code: 'corner-twist',
			message: 'One corner is twisted in place — this state cannot be reached by turning.',
			hint:
				twist === 1
					? 'Rotate one corner counter-clockwise (or two corners clockwise) in your input.'
					: 'Rotate one corner clockwise (or two corners counter-clockwise) in your input.'
		});
	}

	const flip = state.eo.reduce((a, b) => a + b, 0) % 2;
	if (flip !== 0) {
		issues.push({
			code: 'edge-flip',
			message: 'One edge is flipped in place — this state cannot be reached by turning.',
			hint: 'Flip one edge in your input, or check whether you mixed up its two colours.'
		});
	}

	if (permutationParity(state.cp) !== permutationParity(state.ep)) {
		issues.push({
			code: 'parity',
			message: 'Two pieces are swapped — this state cannot be reached by turning.',
			hint: 'Swap any two corners, or any two edges, in your input.'
		});
	}

	return { ok: issues.length === 0, issues, unset };
}

/** Convenience wrapper for callers that only care whether the state is legal. */
export function isSolvable(f: Facelets): boolean {
	return validateFacelets(f).ok;
}
