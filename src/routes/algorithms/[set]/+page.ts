import { error } from '@sveltejs/kit';
import { ALG_SETS, algSet, casesOfSet } from '$data/algorithms';
import type { AlgSetId } from '$data/types';

/** Prerender one page per set. */
export function entries() {
	return ALG_SETS.map((s) => ({ set: s.id }));
}

export function load({ params }: { params: { set: string } }) {
	const known = ALG_SETS.some((s) => s.id === params.set);
	if (!known) error(404, `There is no algorithm set called "${params.set}"`);
	const id = params.set as AlgSetId;
	return { set: algSet(id), cases: casesOfSet(id) };
}
