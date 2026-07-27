import type { AlgCase } from '../types';

/** First two layers — all 41 cases for the front-right slot. */
export const F2L_CASES: readonly AlgCase[] = [
	{
		id: 'f2l-01',
		set: 'f2l',
		name: 'Pair made, insert right',
		shortName: 'F2L 1',
		group: 'Corner in the top, edge in the top',
		tier: 'intermediate',
		algs: [{ moves: "U R U' R'" }]
	},
	{
		id: 'f2l-02',
		set: 'f2l',
		name: 'Pair made, insert left',
		shortName: 'F2L 2',
		group: 'Corner in the top, edge in the top',
		tier: 'intermediate',
		algs: [{ moves: "U' L' U L" }]
	}
];
