/**
 * User settings, persisted to localStorage.
 *
 * Everything here is a presentation or pedagogy preference — nothing about cube
 * state lives in this file. Reads are safe during prerendering: the defaults are
 * used on the server and the stored values are adopted on mount, which keeps the
 * prerendered HTML stable.
 */

import { browser } from '$app/environment';
import type { SkillTier } from '$data/types';
import { PUZZLE_SIZES, type PuzzleSize } from '$cube/puzzle';

export type Theme = 'dark' | 'light' | 'system';
export type Palette = 'classic' | 'deuteranopia' | 'protanopia' | 'tritanopia' | 'high-contrast';
export type Density = 'comfortable' | 'compact';
export type MotionPref = 'system' | 'full' | 'reduced';
export type CubeView = 'iso' | 'flat' | 'net';
export type HandPreference = 'right' | 'left';

export interface SettingsShape {
	theme: Theme;
	palette: Palette;
	density: Density;
	motion: MotionPref;
	/**
	 * Which puzzle the site is about. This is the widest-reaching setting there
	 * is: it changes what the cube shows, what the algorithm library lists, what
	 * the scrambles look like and which lessons apply.
	 */
	puzzle: PuzzleSize;
	/** Which recommendation tier to lead with. */
	skill: SkillTier;
	/** Show a letter on each sticker as well as its colour. */
	stickerLetters: boolean;
	/** Preferred default view for the interactive cube. */
	cubeView: CubeView;
	/** Milliseconds per quarter turn in animations. */
	turnSpeed: number;
	/** Prefer left-hand variants where the library offers them. */
	hand: HandPreference;
	/** Show move counts next to every algorithm. */
	showMoveCounts: boolean;
	/** Read algorithms out with wide turns written as `Rw` rather than `r`. */
	wideNotation: 'Rw' | 'r';
	/** Announce recognition hints before the algorithm in the trainer. */
	trainerHints: boolean;
	/** Whether the visitor has been through the welcome flow. */
	onboarded: boolean;
}

const DEFAULTS: SettingsShape = {
	theme: 'system',
	palette: 'classic',
	density: 'comfortable',
	motion: 'system',
	puzzle: 3,
	skill: 'beginner',
	stickerLetters: false,
	cubeView: 'iso',
	turnSpeed: 260,
	hand: 'right',
	showMoveCounts: true,
	wideNotation: 'Rw',
	trainerHints: true,
	onboarded: false
};

const KEY = 'rubiks-seanfunk:settings:v1';

function load(): SettingsShape {
	if (!browser) return { ...DEFAULTS };
	try {
		const raw = localStorage.getItem(KEY);
		if (!raw) return { ...DEFAULTS };
		const parsed = JSON.parse(raw) as Partial<SettingsShape>;
		// Only adopt keys we know about, so a stale payload cannot inject junk.
		const merged = { ...DEFAULTS };
		for (const key of Object.keys(DEFAULTS) as (keyof SettingsShape)[]) {
			if (parsed[key] !== undefined && typeof parsed[key] === typeof DEFAULTS[key]) {
				// @ts-expect-error — key-wise assignment of a matching type
				merged[key] = parsed[key];
			}
		}
		// A matching type is not enough for the puzzle size: a stored 7, from a
		// future build or a hand-edited value, would ask for an engine that does
		// not exist. Anything unrecognised falls back to the 3×3.
		if (!PUZZLE_SIZES.includes(merged.puzzle)) merged.puzzle = DEFAULTS.puzzle;
		return merged;
	} catch {
		return { ...DEFAULTS };
	}
}

class Settings {
	#value = $state<SettingsShape>({ ...DEFAULTS });
	#hydrated = $state(false);

	get current(): SettingsShape {
		return this.#value;
	}

	get hydrated(): boolean {
		return this.#hydrated;
	}

	/** Adopt stored values. Call once, from the root layout's mount. */
	hydrate() {
		if (!browser || this.#hydrated) return;
		this.#value = load();
		this.#hydrated = true;
	}

	set<K extends keyof SettingsShape>(key: K, value: SettingsShape[K]) {
		this.#value = { ...this.#value, [key]: value };
		this.#persist();
	}

	update(patch: Partial<SettingsShape>) {
		this.#value = { ...this.#value, ...patch };
		this.#persist();
	}

	reset() {
		this.#value = { ...DEFAULTS };
		this.#persist();
	}

	#persist() {
		if (!browser) return;
		try {
			localStorage.setItem(KEY, JSON.stringify(this.#value));
		} catch {
			// Private browsing or a full quota: the site still works, it just forgets.
		}
	}

	/** The `data-*` attributes the root element should carry. */
	get documentAttributes(): Record<string, string> {
		const s = this.#value;
		const attrs: Record<string, string> = {
			'data-palette': s.palette,
			'data-density': s.density,
			'data-puzzle': String(s.puzzle)
		};
		if (s.theme !== 'system') attrs['data-theme'] = s.theme;
		if (s.motion !== 'system') attrs['data-motion'] = s.motion;
		return attrs;
	}
}

export const settings = new Settings();

export const SETTING_LABELS = {
	theme: { dark: 'Dark', light: 'Light', system: 'Match system' },
	palette: {
		classic: 'Classic',
		deuteranopia: 'Deuteranopia-friendly',
		protanopia: 'Protanopia-friendly',
		tritanopia: 'Tritanopia-friendly',
		'high-contrast': 'High contrast'
	},
	density: { comfortable: 'Comfortable', compact: 'Compact' },
	motion: { system: 'Match system', full: 'Full animation', reduced: 'Reduced' },
	cubeView: { iso: '3D', flat: 'Last layer', net: 'Unfolded net' },
	hand: { right: 'Right-handed', left: 'Left-handed' }
} as const;

/** How each size is named, and what changing to it actually means. */
export const PUZZLE_LABELS: Record<PuzzleSize, string> = {
	2: '2×2',
	3: '3×3',
	4: '4×4',
	5: '5×5'
};

export const PUZZLE_FULL_NAMES: Record<PuzzleSize, string> = {
	2: '2×2×2 · Pocket Cube',
	3: '3×3×3 · the standard cube',
	4: '4×4×4 · Revenge',
	5: '5×5×5 · Professor'
};

export const PUZZLE_BLURBS: Record<PuzzleSize, string> = {
	2: 'Corners only. The same last-layer thinking as a 3×3, over in a dozen moves.',
	3: 'The full site: every method, every algorithm set, the solver and the trainer.',
	4: 'Loose centres and pieces that come in pairs, which lets it reach states a 3×3 never can.',
	5: 'Coming later.'
};

/** The sizes the site is finished for. 5×5 parses and turns, but has no content. */
export const AVAILABLE_PUZZLES: readonly PuzzleSize[] = [2, 3, 4];
