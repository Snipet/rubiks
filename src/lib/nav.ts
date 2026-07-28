/**
 * Site navigation.
 *
 * Each section owns one of the cube's six colours, set as `--section` on the
 * page root. Learn is green, algorithms red, solve blue, trainer orange, timer
 * yellow, reference the white face. It means the chrome tells you where you are
 * before you have read a word.
 */

import type { Pathname } from '$app/types';

export type SectionId = 'learn' | 'algorithms' | 'solve' | 'trainer' | 'timer' | 'reference';

export interface NavItem {
	id: SectionId;
	/** A concrete path, so it can be handed straight to `resolve()`. */
	href: Pathname;
	label: string;
	/** One line for the menu and the landing-page cards. */
	blurb: string;
	/** Path prefixes that count as being inside this section. */
	match: string[];
}

export const NAV: readonly NavItem[] = [
	{
		id: 'learn',
		href: '/learn/',
		label: 'Learn',
		blurb: 'Four tracks, from your very first solve to full CFOP and beyond.',
		match: ['/learn']
	},
	{
		id: 'algorithms',
		href: '/algorithms/',
		label: 'Algorithms',
		blurb: 'Every case worth knowing, searchable, with diagrams generated from the moves.',
		match: ['/algorithms']
	},
	{
		id: 'solve',
		href: '/solve/',
		label: 'Solve',
		blurb: 'Type in the cube in your hands and get advice pitched at your level.',
		match: ['/solve']
	},
	{
		id: 'trainer',
		href: '/trainer/',
		label: 'Trainer',
		blurb: 'Drill the cases you keep fumbling, on a schedule that remembers which ones.',
		match: ['/trainer']
	},
	{
		id: 'timer',
		href: '/timer/',
		label: 'Timer',
		blurb: 'Scrambles, inspection, and the averages competitions actually use.',
		match: ['/timer']
	},
	{
		id: 'reference',
		href: '/notation/',
		label: 'Reference',
		blurb: 'Notation, glossary, method comparison, finger tricks and hardware notes.',
		match: ['/notation', '/glossary', '/methods', '/tips', '/about', '/data']
	}
];

/** Which section a path belongs to, if any. */
export function sectionFor(pathname: string): SectionId | undefined {
	const path = pathname.replace(/\/+$/, '') || '/';
	for (const item of NAV) {
		if (item.match.some((prefix) => path === prefix || path.startsWith(`${prefix}/`)))
			return item.id;
	}
	return undefined;
}
