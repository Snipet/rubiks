/**
 * The site's name, in one place.
 *
 * Written lowercase throughout, with the bracketed `[dot]` kept literally — it is
 * part of the name, not a stand-in for a full stop. Never capitalise it, not even
 * at the start of a sentence or in a page title.
 */

export const BRAND = 'rubiks[dot]seanfunk';

/** The three pieces, for rendering the wordmark with the bracket styled apart. */
export const BRAND_PARTS = ['rubiks', '[dot]', 'seanfunk'] as const;

export const TAGLINE =
	'Learn the cube, look up any algorithm, and get advice on the cube in front of you.';

/** Build a page title. Section pages read "algorithms · rubiks[dot]seanfunk". */
export function pageTitle(section?: string): string {
	return section ? `${section} · ${BRAND}` : BRAND;
}
