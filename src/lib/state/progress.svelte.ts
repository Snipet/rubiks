/**
 * Learning progress and solve history, persisted to localStorage.
 *
 * The trainer uses a small Leitner-style scheduler: every case sits in a box, a
 * correct recall moves it up a box and a mistake sends it back to box 1. Box
 * number maps to a review interval, so cases you keep fumbling come round often
 * and cases you know drift into the background. This is deliberately simple —
 * there is no server, and a scheduler you can reason about beats one you can't.
 */

import { browser } from '$app/environment';

export type CaseConfidence = 'unseen' | 'learning' | 'known' | 'solid';

export interface CaseProgress {
	/** Leitner box, 1..5. */
	box: number;
	/** Epoch millis of the next scheduled review. */
	due: number;
	/** Total attempts and successes, for the stats view. */
	attempts: number;
	correct: number;
	/** Best recall time in milliseconds. */
	best?: number;
	/** Rolling mean of the last few attempts, in milliseconds. */
	recent?: number;
	/** Marked by the learner as "I know this", independent of drilling. */
	pinned?: boolean;
}

export interface SolveRecord {
	/** Epoch millis. */
	at: number;
	/** Elapsed milliseconds. */
	ms: number;
	scramble: string;
	/** `dnf` and `plus2` follow competition conventions. */
	penalty?: 'dnf' | 'plus2';
	/** Optional note the solver typed afterwards. */
	note?: string;
}

export interface ProgressShape {
	cases: Record<string, CaseProgress>;
	/** Lesson slugs the reader has marked complete. */
	lessons: string[];
	solves: SolveRecord[];
	/** Epoch-day numbers on which anything was practised, for the streak. */
	activeDays: number[];
}

const KEY = 'rubiks-seanfunk:progress:v1';
const MAX_SOLVES = 2000;

/** Review intervals in days for Leitner boxes 1..5. */
const INTERVALS = [0, 1, 3, 8, 21] as const;

const EMPTY: ProgressShape = { cases: {}, lessons: [], solves: [], activeDays: [] };

const DAY = 86_400_000;
const epochDay = (t: number) => Math.floor(t / DAY);

function load(): ProgressShape {
	if (!browser) return structuredClone(EMPTY);
	try {
		const raw = localStorage.getItem(KEY);
		if (!raw) return structuredClone(EMPTY);
		const parsed = JSON.parse(raw) as Partial<ProgressShape>;
		return {
			cases: typeof parsed.cases === 'object' && parsed.cases ? parsed.cases : {},
			lessons: Array.isArray(parsed.lessons) ? parsed.lessons : [],
			solves: Array.isArray(parsed.solves) ? parsed.solves : [],
			activeDays: Array.isArray(parsed.activeDays) ? parsed.activeDays : []
		};
	} catch {
		return structuredClone(EMPTY);
	}
}

class Progress {
	#value = $state<ProgressShape>(structuredClone(EMPTY));
	#hydrated = $state(false);

	get current(): ProgressShape {
		return this.#value;
	}
	get hydrated(): boolean {
		return this.#hydrated;
	}

	hydrate() {
		if (!browser || this.#hydrated) return;
		this.#value = load();
		this.#hydrated = true;
	}

	// --- Cases -------------------------------------------------------------

	caseProgress(id: string): CaseProgress | undefined {
		return this.#value.cases[id];
	}

	confidence(id: string): CaseConfidence {
		const p = this.#value.cases[id];
		if (!p) return 'unseen';
		if (p.pinned || p.box >= 5) return 'solid';
		if (p.box >= 3) return 'known';
		return 'learning';
	}

	/** Record an attempt at a case. `ms` is optional; omit for a self-reported recall. */
	record(id: string, correct: boolean, ms?: number, now = Date.now()) {
		const existing = this.#value.cases[id] ?? {
			box: 1,
			due: now,
			attempts: 0,
			correct: 0
		};
		const box = correct ? Math.min(5, existing.box + 1) : 1;
		const next: CaseProgress = {
			...existing,
			box,
			due: now + INTERVALS[box - 1] * DAY,
			attempts: existing.attempts + 1,
			correct: existing.correct + (correct ? 1 : 0)
		};
		if (ms !== undefined && correct) {
			next.best = next.best === undefined ? ms : Math.min(next.best, ms);
			next.recent = next.recent === undefined ? ms : Math.round(next.recent * 0.7 + ms * 0.3);
		}
		this.#value = {
			...this.#value,
			cases: { ...this.#value.cases, [id]: next },
			activeDays: this.#withToday(now)
		};
		this.#persist();
	}

	setPinned(id: string, pinned: boolean) {
		const existing = this.#value.cases[id] ?? { box: 1, due: 0, attempts: 0, correct: 0 };
		this.#value = {
			...this.#value,
			cases: { ...this.#value.cases, [id]: { ...existing, pinned } }
		};
		this.#persist();
	}

	/** Case ids due for review, soonest first. */
	dueCases(ids: readonly string[], now = Date.now()): string[] {
		return ids
			.filter((id) => {
				const p = this.#value.cases[id];
				return !p || p.due <= now;
			})
			.sort((a, b) => (this.#value.cases[a]?.due ?? 0) - (this.#value.cases[b]?.due ?? 0));
	}

	// --- Lessons -----------------------------------------------------------

	lessonDone(slug: string): boolean {
		return this.#value.lessons.includes(slug);
	}

	toggleLesson(slug: string, now = Date.now()) {
		const has = this.lessonDone(slug);
		this.#value = {
			...this.#value,
			lessons: has ? this.#value.lessons.filter((s) => s !== slug) : [...this.#value.lessons, slug],
			activeDays: has ? this.#value.activeDays : this.#withToday(now)
		};
		this.#persist();
	}

	// --- Solves ------------------------------------------------------------

	addSolve(record: SolveRecord) {
		const solves = [record, ...this.#value.solves].slice(0, MAX_SOLVES);
		this.#value = { ...this.#value, solves, activeDays: this.#withToday(record.at) };
		this.#persist();
	}

	updateSolve(at: number, patch: Partial<SolveRecord>) {
		this.#value = {
			...this.#value,
			solves: this.#value.solves.map((s) => (s.at === at ? { ...s, ...patch } : s))
		};
		this.#persist();
	}

	removeSolve(at: number) {
		this.#value = { ...this.#value, solves: this.#value.solves.filter((s) => s.at !== at) };
		this.#persist();
	}

	/** Consecutive days of activity ending today (or yesterday, mid-streak). */
	get streak(): number {
		const days = new Set(this.#value.activeDays);
		if (days.size === 0) return 0;
		const today = epochDay(Date.now());
		let day = days.has(today) ? today : days.has(today - 1) ? today - 1 : null;
		if (day === null) return 0;
		let n = 0;
		while (days.has(day)) {
			n++;
			day--;
		}
		return n;
	}

	clearAll() {
		this.#value = structuredClone(EMPTY);
		this.#persist();
	}

	/** Everything, as a JSON string, for the export button. */
	export(): string {
		return JSON.stringify(this.#value, null, 2);
	}

	/** Replace everything from a previously exported payload. */
	import(json: string): { ok: true } | { ok: false; error: string } {
		try {
			const parsed = JSON.parse(json) as Partial<ProgressShape>;
			if (typeof parsed !== 'object' || parsed === null) throw new Error('not an object');
			this.#value = {
				cases: parsed.cases ?? {},
				lessons: parsed.lessons ?? [],
				solves: parsed.solves ?? [],
				activeDays: parsed.activeDays ?? []
			};
			this.#persist();
			return { ok: true };
		} catch (err) {
			return { ok: false, error: err instanceof Error ? err.message : 'Could not read that file' };
		}
	}

	#withToday(now: number): number[] {
		const today = epochDay(now);
		return this.#value.activeDays.includes(today)
			? this.#value.activeDays
			: [...this.#value.activeDays, today].slice(-400);
	}

	#persist() {
		if (!browser) return;
		try {
			localStorage.setItem(KEY, JSON.stringify(this.#value));
		} catch {
			// Out of quota: keep working in memory for this session.
		}
	}
}

export const progress = new Progress();

/** Competition-style statistics over a run of solves. */
export function solveStats(solves: readonly SolveRecord[]) {
	const effective = (s: SolveRecord) =>
		s.penalty === 'dnf' ? Infinity : s.ms + (s.penalty === 'plus2' ? 2000 : 0);
	const valid = solves.filter((s) => s.penalty !== 'dnf');

	/** Trimmed mean: drop the best and worst, average the rest. WCA "average of n". */
	const average = (list: readonly SolveRecord[]) => {
		if (list.length < 3) return null;
		const dnfs = list.filter((s) => s.penalty === 'dnf').length;
		if (dnfs > 1) return null;
		const times = list.map(effective).sort((a, b) => a - b);
		const trimmed = times.slice(1, -1);
		if (trimmed.some((t) => !Number.isFinite(t))) return null;
		return trimmed.reduce((a, b) => a + b, 0) / trimmed.length;
	};

	/** Mean of the middle three of five, the usual "mo3"/"ao5" family. */
	const window = (n: number) => (solves.length >= n ? average(solves.slice(0, n)) : null);

	return {
		count: solves.length,
		best: valid.length ? Math.min(...valid.map(effective)) : null,
		worst: valid.length ? Math.max(...valid.map(effective)) : null,
		mean: valid.length ? valid.map(effective).reduce((a, b) => a + b, 0) / valid.length : null,
		ao5: window(5),
		ao12: window(12),
		ao50: window(50),
		ao100: window(100),
		/** Best rolling average of 5 across the whole history. */
		bestAo5: (() => {
			let best: number | null = null;
			for (let i = 0; i + 5 <= solves.length; i++) {
				const a = average(solves.slice(i, i + 5));
				if (a !== null && (best === null || a < best)) best = a;
			}
			return best;
		})()
	};
}

/** Format milliseconds the way a timer display should. */
export function formatTime(ms: number | null, penalty?: SolveRecord['penalty']): string {
	if (penalty === 'dnf') return 'DNF';
	if (ms === null || !Number.isFinite(ms)) return '—';
	const total = Math.round(ms / 10) / 100;
	const minutes = Math.floor(total / 60);
	const seconds = total - minutes * 60;
	const body =
		minutes > 0 ? `${minutes}:${seconds.toFixed(2).padStart(5, '0')}` : seconds.toFixed(2);
	return penalty === 'plus2' ? `${body}+` : body;
}
