/**
 * The lesson registry.
 *
 * Four tracks, one per skill tier. A track is a reading order rather than a
 * gate — nothing is locked, because someone who has solved a cube before should
 * not have to click through "this is a corner piece" to reach F2L.
 */

import type { Lesson, SkillTier, Track } from '../types';
import { BEGINNER_LESSONS } from './beginner';
import { INTERMEDIATE_LESSONS } from './intermediate';
import { ADVANCED_LESSONS } from './advanced';
import { EXPERT_LESSONS } from './expert';

export const LESSONS: readonly Lesson[] = [
	...BEGINNER_LESSONS,
	...INTERMEDIATE_LESSONS,
	...ADVANCED_LESSONS,
	...EXPERT_LESSONS
]
	.slice()
	.sort((a, b) => a.order - b.order);

export const TRACKS: readonly Track[] = [
	{
		id: 'beginner',
		title: 'Your first solve',
		tagline: 'Layer by layer, from a scrambled cube to a solved one.',
		description:
			'No prior knowledge assumed, and nothing skipped. You will finish with a method that solves any cube every time, using seven short algorithms. It is not the fastest method — that is deliberate. Everything here is a foundation the later tracks build on rather than replace.',
		lessons: BEGINNER_LESSONS.map((l) => l.slug)
	},
	{
		id: 'intermediate',
		title: 'Faster, with fewer pauses',
		tagline: 'Trade memorised steps for understanding, and stop turning the cube so much.',
		description:
			'You can already solve it. This track replaces the beginner method piece by piece: pairing corners with edges instead of placing them separately, two-look last layer instead of four steps, and the habits — lookahead, finger tricks, planning the cross — that separate a two-minute solve from a thirty-second one.',
		lessons: INTERMEDIATE_LESSONS.map((l) => l.slug)
	},
	{
		id: 'advanced',
		title: 'Full CFOP',
		tagline: 'All 57 orientation cases, all 21 permutation cases, and the recognition to match.',
		description:
			'The long haul. Learning 78 algorithms is less daunting than it sounds if you take them in groups that share a shape, and this track sets out an order that keeps the payoff coming. Just as much attention goes to recognition, because knowing an algorithm you cannot spot in time is worth nothing.',
		lessons: ADVANCED_LESSONS.map((l) => l.slug)
	},
	{
		id: 'expert',
		title: 'Past CFOP',
		tagline: 'Last-layer subsets, alternative methods, and building your own algorithms.',
		description:
			'Where the interesting choices are. COLL and Winter Variation for skipping steps, Roux and ZZ for a different shape of solve entirely, and commutators for the point at which you stop looking algorithms up and start working them out.',
		lessons: EXPERT_LESSONS.map((l) => l.slug)
	}
];

const BY_SLUG = new Map(LESSONS.map((l) => [l.slug, l]));

export function lessonBySlug(slug: string): Lesson | undefined {
	return BY_SLUG.get(slug);
}

export function track(id: SkillTier): Track {
	const found = TRACKS.find((t) => t.id === id);
	if (!found) throw new Error(`Unknown track "${id}"`);
	return found;
}

export function lessonsOfTrack(id: SkillTier): Lesson[] {
	return track(id)
		.lessons.map((slug) => BY_SLUG.get(slug))
		.filter((l): l is Lesson => l !== undefined);
}

/** The lesson before and after this one, within its own track. */
export function neighbours(slug: string): { previous?: Lesson; next?: Lesson } {
	const lesson = BY_SLUG.get(slug);
	if (!lesson) return {};
	const siblings = lessonsOfTrack(lesson.track);
	const index = siblings.findIndex((l) => l.slug === slug);
	return {
		previous: index > 0 ? siblings[index - 1] : undefined,
		next: index >= 0 && index < siblings.length - 1 ? siblings[index + 1] : undefined
	};
}

/** Total reading time of a track, in minutes. */
export function trackMinutes(id: SkillTier): number {
	return lessonsOfTrack(id).reduce((n, l) => n + l.minutes, 0);
}
