import type { AlgCase } from '../types';

/** Permutation of the last layer — all 21 cases. */
export const PLL_CASES: readonly AlgCase[] = [
	{
		id: 'pll-t',
		set: 'pll',
		name: 'T Permutation',
		shortName: 'T',
		group: 'Adjacent corner swap',
		tier: 'intermediate',
		algs: [{ moves: "R U R' U' R' F R2 U' R' U' R U R' F'" }],
		probability: '1/18'
	},
	{
		id: 'pll-h',
		set: 'pll',
		name: 'H Permutation',
		shortName: 'H',
		group: 'Edges only',
		tier: 'intermediate',
		algs: [{ moves: 'M2 U M2 U2 M2 U M2' }],
		probability: '1/72'
	},
	{
		id: 'pll-ua',
		set: 'pll',
		name: 'Ua Permutation',
		shortName: 'Ua',
		group: 'Edges only',
		tier: 'intermediate',
		algs: [{ moves: "M2 U M U2 M' U M2" }],
		probability: '1/18'
	}
];
