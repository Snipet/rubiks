/**
 * Tests for the 2×2 advice engine.
 *
 * The one that matters is the last: take a random puzzle, follow the advice for
 * one tier, apply it literally, and repeat until it is solved. If any suggestion
 * were wrong — a rotation left dangling, an adjusting turn in the wrong place, a
 * step that does not converge — the loop would run away rather than finish, and
 * the test would fail rather than a reader being told to do something that does
 * not work.
 */

import { describe, expect, it } from 'vitest';
import {
	isSolvedPocket,
	playPocket,
	POCKET_MOVES,
	solvedPocket,
	type PocketState
} from '../pocket';
import { planPocket } from './pocketPlan';
import type { SkillTier } from '$data/types';

function lcg(seed: number) {
	let s = seed >>> 0;
	return () => {
		s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
		return s / 0x100000000;
	};
}

function scramble(seed: number, count = 14): PocketState {
	const rand = lcg(seed);
	let state = solvedPocket();
	let lastFace = '';
	for (let i = 0; i < count;) {
		const move = POCKET_MOVES[Math.floor(rand() * POCKET_MOVES.length)];
		if (move[0] === lastFace) continue;
		state = playPocket(state, [move]);
		lastFace = move[0];
		i++;
	}
	return state;
}

describe('planning a 2×2', () => {
	it('says there is nothing to do when there is nothing to do', () => {
		const plan = planPocket(solvedPocket());
		expect(plan.stage).toBe('solved');
		expect(plan.recommendations).toEqual([]);
		expect(plan.optimalLength).toBe(0);
	});

	it('always offers the shortest possible answer', () => {
		for (let seed = 1; seed <= 40; seed++) {
			const state = scramble(seed);
			const plan = planPocket(state);
			const expert = plan.recommendations.find((r) => r.tier === 'expert');
			expect(expert, `seed ${seed}`).toBeDefined();
			expect(expert!.moves, `seed ${seed}`).toBeDefined();
			const after = playPocket(state, expert!.moves!.split(' '));
			expect(isSolvedPocket(after), `seed ${seed}`).toBe(true);
			expect(expert!.moveCount).toBe(plan.optimalLength);
		}
	});

	it('every suggestion it makes really does what it says', () => {
		// Applied literally, exactly as printed, with no interpretation.
		for (let seed = 1; seed <= 60; seed++) {
			const state = scramble(seed);
			const plan = planPocket(state);
			expect(plan.recommendations.length, `seed ${seed}`).toBeGreaterThan(0);
			for (const rec of plan.recommendations) {
				if (!rec.moves) continue;
				const after = playPocket(state, rec.moves.split(' '));
				const label = `seed ${seed} / ${rec.tier} / ${rec.moves}`;
				// Every suggestion has to be forward progress, never a no-op and never
				// a step backwards. The stages run first-layer, orient, permute,
				// solved, so the index must strictly increase.
				const order = ['first-layer', 'orient', 'permute', 'solved'];
				expect(rec.moves!.length, label).toBeGreaterThan(0);
				expect(order.indexOf(planPocket(after).stage), label).toBeGreaterThan(
					order.indexOf(plan.stage)
				);
			}
		}
	});

	it('reports a step for every unsolved state and a sane progress figure', () => {
		for (let seed = 1; seed <= 40; seed++) {
			const plan = planPocket(scramble(seed));
			expect(plan.stepName.length).toBeGreaterThan(0);
			expect(plan.progress).toBeGreaterThan(0);
			expect(plan.progress).toBeLessThan(1);
			expect(plan.optimalLength).toBeGreaterThan(0);
		}
	});

	const tiers: SkillTier[] = ['beginner', 'intermediate', 'advanced', 'expert'];

	it.each(tiers)('following the %s advice solves 25 random puzzles', (tier) => {
		for (let seed = 100; seed < 125; seed++) {
			let state = scramble(seed);
			let steps = 0;
			while (!isSolvedPocket(state)) {
				const plan = planPocket(state);
				// Take the reader's own tier if it has something to say, else the
				// nearest one that does — which is exactly what the page does.
				const rank = (t: SkillTier) => Math.abs(tiers.indexOf(t) - tiers.indexOf(tier));
				const pick = [...plan.recommendations]
					.filter((r) => r.moves)
					.sort((a, b) => rank(a.tier) - rank(b.tier))[0];
				expect(pick, `seed ${seed} tier ${tier}: nothing to do at ${plan.stage}`).toBeDefined();
				state = playPocket(state, pick!.moves!.split(' '));
				steps++;
				expect(steps, `seed ${seed} tier ${tier} did not converge`).toBeLessThan(12);
			}
		}
	});

	it('the beginner route needs no algorithm beyond sune and one more', () => {
		// The promise the page makes to a beginner: two algorithms is enough.
		const allowed = new Set(['pocket-oll-sune', 'pocket-pll-adjacent', 'pocket-pll-diagonal']);
		for (let seed = 200; seed < 230; seed++) {
			let state = scramble(seed);
			let steps = 0;
			while (!isSolvedPocket(state)) {
				const plan = planPocket(state);
				const pick = plan.recommendations.find((r) => r.tier === 'beginner' && r.moves);
				expect(pick, `seed ${seed} at ${plan.stage}`).toBeDefined();
				if (pick!.caseId) expect(allowed.has(pick!.caseId), pick!.caseId).toBe(true);
				state = playPocket(state, pick!.moves!.split(' '));
				expect(++steps).toBeLessThan(12);
			}
		}
	});
});
