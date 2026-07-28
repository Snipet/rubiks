/**
 * Tests for lesson content.
 *
 * A lesson body is typed data referring to things elsewhere: case ids in the
 * algorithm library, links to routes, algorithms in a particular puzzle's
 * notation. Every one of those is a way for a lesson to render a hole, and none
 * of them is caught by the type checker. So they are caught here.
 *
 * The notation check is the one that matters most: a 4×4 lesson writes `2R`,
 * which the 3×3 parser reads as something else entirely, so a lesson pointed at
 * the wrong engine would silently show the wrong cube.
 */

import { describe, expect, it } from 'vitest';
import { LESSONS, lessonsOfTrack, TRACKS, track } from './index';
import { ALG_SETS, caseById } from '../algorithms';
import { puzzle } from '$cube/puzzle';
import { tokenise } from '$cube/puzzleState';
import type { Lesson } from '../types';

const ROUTES = new Set([
	'/',
	'/learn/',
	'/algorithms/',
	'/solve/',
	'/trainer/',
	'/timer/',
	'/notation/',
	'/glossary/',
	'/methods/',
	'/tips/',
	'/about/',
	'/data/'
]);

/** The puzzle a lesson is written in. */
const orderOf = (lesson: Lesson) => track(lesson.track).puzzle ?? 3;

describe('every lesson holds together', () => {
	it('slugs are unique and tracks are consistent', () => {
		expect(new Set(LESSONS.map((l) => l.slug)).size).toBe(LESSONS.length);
		for (const t of TRACKS) {
			const lessons = lessonsOfTrack(t.id);
			expect(lessons.length, `track ${t.id} has no lessons`).toBeGreaterThan(0);
			for (const l of lessons) expect(l.track, l.slug).toBe(t.id);
			// Order within a track must be strictly increasing, or "next lesson"
			// sends the reader somewhere arbitrary.
			const orders = lessons.map((l) => l.order);
			expect(
				[...orders].sort((a, b) => a - b),
				t.id
			).toEqual(orders);
		}
	});

	it('every track is reachable and belongs to a real puzzle', () => {
		const seen = new Set(TRACKS.flatMap((t) => t.lessons));
		for (const l of LESSONS) expect(seen.has(l.slug), `${l.slug} is in no track`).toBe(true);
		for (const t of TRACKS) expect([2, 3, 4, 5]).toContain(t.puzzle ?? 3);
	});

	it('prerequisites point at lessons that exist, earlier in the same track', () => {
		const bySlug = new Map(LESSONS.map((l) => [l.slug, l]));
		for (const l of LESSONS) {
			for (const slug of l.prerequisites ?? []) {
				const other = bySlug.get(slug);
				expect(other, `${l.slug} requires missing ${slug}`).toBeDefined();
				if (other!.track === l.track) {
					expect(other!.order, `${l.slug} requires later ${slug}`).toBeLessThan(l.order);
				}
			}
		}
	});

	it('every case block names a case in the library', () => {
		for (const l of LESSONS) {
			for (const block of l.body) {
				if (block.kind !== 'case') continue;
				const entry = caseById(block.id);
				expect(entry, `${l.slug} refers to unknown case ${block.id}`).toBeDefined();
				// And that case has to be for the puzzle the lesson is about, or the
				// reader gets a diagram of a different puzzle mid-sentence.
				expect(entry!.set_.puzzle ?? 3, `${l.slug} → ${block.id}`).toBe(orderOf(l));
			}
		}
	});

	it('every taught set exists and matches the lesson’s puzzle', () => {
		for (const l of LESSONS) {
			for (const id of l.teaches ?? []) {
				const set = ALG_SETS.find((s) => s.id === id);
				expect(set, `${l.slug} teaches unknown set ${id}`).toBeDefined();
				expect(set!.puzzle ?? 3, `${l.slug} teaches ${id}`).toBe(orderOf(l));
			}
		}
	});

	it('every jump goes somewhere real', () => {
		const setPaths = new Set(ALG_SETS.map((s) => `/algorithms/${s.id}/`));
		for (const l of LESSONS) {
			for (const block of l.body) {
				if (block.kind !== 'jump') continue;
				const target = block.href.split('#')[0];
				const known =
					ROUTES.has(target) ||
					setPaths.has(target) ||
					LESSONS.some((other) => target === `/learn/${other.slug}/`);
				expect(known, `${l.slug} links to ${block.href}`).toBe(true);
			}
		}
	});

	it('every algorithm is written in its own puzzle’s notation', () => {
		// The reason this test exists: `2R` is a legal 4×4 move and a different
		// thing to the 3×3 parser, so a lesson in the wrong notation would render a
		// cube that has nothing to do with what the words say.
		for (const l of LESSONS) {
			const p = puzzle(orderOf(l));
			const check = (alg: string, where: string) => {
				for (const name of tokenise(alg)) {
					expect(
						p.parse(name),
						`${l.slug} ${where}: ${name} is not a ${p.size}×${p.size} move`
					).not.toBeNull();
				}
			};
			for (const block of l.body) {
				if (block.kind === 'alg') {
					check(block.moves, 'alg');
					if (block.setup) check(block.setup, 'alg setup');
				} else if (block.kind === 'cube') {
					if (block.setup) check(block.setup, 'cube setup');
				} else if (block.kind === 'steps') {
					for (const step of block.steps) {
						if (step.alg) check(step.alg, 'step');
						if (step.setup) check(step.setup, 'step setup');
					}
				}
			}
		}
	});

	it('says something useful in every listing field', () => {
		for (const l of LESSONS) {
			expect(l.title.length, l.slug).toBeGreaterThan(3);
			expect(l.summary.length, l.slug).toBeGreaterThan(20);
			expect(l.outcomes.length, l.slug).toBeGreaterThan(0);
			expect(l.minutes, l.slug).toBeGreaterThan(0);
			expect(l.body.length, l.slug).toBeGreaterThan(2);
		}
	});
});

describe('the puzzles that have a track', () => {
	it('2×2 and 4×4 both have one, so the learn page is never empty', () => {
		for (const order of [2, 3, 4]) {
			const forPuzzle = TRACKS.filter((t) => (t.puzzle ?? 3) === order);
			expect(forPuzzle.length, `no track for ${order}×${order}`).toBeGreaterThan(0);
			for (const t of forPuzzle) expect(lessonsOfTrack(t.id).length).toBeGreaterThan(0);
		}
	});
});
