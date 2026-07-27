/**
 * Text renderings of cube cases.
 *
 * Used to make test failures legible: when a coverage check reports that an OLL
 * case has no algorithm, the failure message shows the case rather than an opaque
 * key. Also handy in a terminal when authoring the library.
 */

import { FLAT_LAYOUT } from '$cube/mask';
import { f2lKey, F2L_SLOTS, LL_CORNERS, LL_EDGES, orientationKey, permutationKey } from '$cube/ll';
import { faceletsToCubie } from '$cube/cubie';
import { FACE_NAMES, type Facelets } from '$cube/types';

const GRID = 5;

/**
 * The classic last-layer picture, as text.
 *
 * `oriented` mode marks stickers showing the U colour with `#` and the rest with
 * `.`, which is exactly what an OLL diagram conveys. `colors` mode prints the
 * face letter of each sticker, which is what a PLL diagram needs.
 */
export function asciiLastLayer(state: Facelets, mode: 'oriented' | 'colors' = 'oriented'): string {
	const cells: string[][] = Array.from({ length: GRID }, () => Array(GRID).fill(' '));
	for (const sticker of FLAT_LAYOUT) {
		const color = state[sticker.index];
		cells[sticker.row][sticker.col] =
			mode === 'oriented' ? (color === 0 ? '#' : '.') : FACE_NAMES[color];
	}
	return cells.map((row) => row.join(' ')).join('\n');
}

/** A one-line summary of which last-layer pieces need to go where. */
export function describePermutation(state: Facelets): string {
	const { cp, ep } = faceletsToCubie(state);
	const cornerNames = ['URF', 'UFL', 'ULB', 'UBR'];
	const edgeNames = ['UR', 'UF', 'UL', 'UB'];
	const corners = LL_CORNERS.map((slot, i) => {
		const home = LL_CORNERS.indexOf(cp[slot] as never);
		return home === i ? null : `${cornerNames[i]}→${cornerNames[home]}`;
	}).filter(Boolean);
	const edges = LL_EDGES.map((slot, i) => {
		const home = LL_EDGES.indexOf(ep[slot] as never);
		return home === i ? null : `${edgeNames[i]}→${edgeNames[home]}`;
	}).filter(Boolean);
	return [
		corners.length ? `corners ${corners.join(' ')}` : 'corners solved',
		edges.length ? `edges ${edges.join(' ')}` : 'edges solved'
	].join('; ');
}

/** A sentence describing where an F2L case's two pieces are. */
export function describeF2l(state: Facelets, slot = 'FR'): string {
	const spec = F2L_SLOTS.find((s) => s.id === slot)!;
	const { cp, co, ep, eo } = faceletsToCubie(state);
	const cornerSlot = cp.indexOf(spec.corner);
	const edgeSlot = ep.indexOf(spec.edge);

	const cornerNames: Record<number, string> = {
		0: 'up-front-right',
		1: 'up-front-left',
		2: 'up-back-left',
		3: 'up-back-right'
	};
	const edgeNames: Record<number, string> = {
		0: 'up-right',
		1: 'up-front',
		2: 'up-left',
		3: 'up-back'
	};
	const twist = ['white/yellow facing up', 'twisted clockwise', 'twisted anticlockwise'];

	const cornerWhere =
		cornerSlot === spec.corner
			? `corner already in the slot (${twist[co[cornerSlot]]})`
			: `corner at ${cornerNames[cornerSlot] ?? `slot ${cornerSlot}`} (${twist[co[cornerSlot]]})`;
	const edgeWhere =
		edgeSlot === spec.edge
			? `edge already in the slot (${eo[edgeSlot] ? 'flipped' : 'correct'})`
			: `edge at ${edgeNames[edgeSlot] ?? `slot ${edgeSlot}`} (${eo[edgeSlot] ? 'flipped' : 'correct'})`;

	return `${cornerWhere}; ${edgeWhere}`;
}

/** A block of text describing one uncovered case, for a failing coverage check. */
export function describeCase(state: Facelets, kind: 'oll' | 'pll' | 'f2l'): string {
	switch (kind) {
		case 'oll':
			return `key ${orientationKey(state)}\n${asciiLastLayer(state, 'oriented')}`;
		case 'pll':
			return `key ${permutationKey(state)} — ${describePermutation(state)}\n${asciiLastLayer(state, 'colors')}`;
		case 'f2l':
			return `key ${f2lKey(state, 'FR')} — ${describeF2l(state)}`;
	}
}
