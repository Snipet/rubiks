import { error } from '@sveltejs/kit';
import { ALG_SETS } from '$data/algorithms';
import type { AlgSetId } from '$data/types';

/** Prerender one page per set. */
export function entries() {
	return ALG_SETS.map((s) => ({ set: s.id }));
}

/**
 * Only the set id crosses this boundary.
 *
 * Anything returned from `load` is serialised into the prerendered HTML so the
 * client can hydrate without re-running it — which for a set of 57 cases means
 * embedding 57 sticker arrays and 57 parsed move lists in the page. The library
 * is already in the JavaScript bundle, so the page looks the cases up itself and
 * the HTML stays small.
 */
export function load({ params }: { params: { set: string } }) {
	if (!ALG_SETS.some((s) => s.id === params.set)) {
		error(404, `There is no algorithm set called "${params.set}"`);
	}
	return { setId: params.set as AlgSetId };
}
