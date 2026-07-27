import type { AlgCase } from '../types';

/** Orientation of the last layer — all 57 cases. */
export const OLL_CASES: readonly AlgCase[] = [
	{
		id: 'oll-27',
		set: 'oll',
		name: 'Sune',
		shortName: 'OLL 27',
		group: 'Fish shapes',
		tier: 'intermediate',
		algs: [{ moves: "R U R' U R U2 R'" }],
		probability: '4/54'
	},
	{
		id: 'oll-26',
		set: 'oll',
		name: 'Anti-Sune',
		shortName: 'OLL 26',
		group: 'Fish shapes',
		tier: 'intermediate',
		algs: [{ moves: "R U2 R' U' R U' R'" }],
		probability: '4/54'
	}
];

/**
 * The first look of two-look OLL: orient the last-layer edges, ignoring corners.
 * These are not OLL cases — they are the three edge shapes you can be left with.
 */
export const TWO_LOOK_OLL_EDGE_CASES: readonly AlgCase[] = [];
