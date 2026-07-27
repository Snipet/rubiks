/**
 * Content contracts.
 *
 * Everything the site displays — algorithm cases, lessons, tips — is plain typed
 * data. Case diagrams and move counts are computed from the algorithm strings at
 * load time rather than stored, so there is no second copy of the truth to keep
 * in step.
 */

import type { DiagramView } from '$cube/mask';

/**
 * Where a learner sits. Used to choose which recommendation to lead with, which
 * algorithm variant to show first, and how much explanation to include.
 */
export type SkillTier = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export const SKILL_TIERS: readonly SkillTier[] = ['beginner', 'intermediate', 'advanced', 'expert'];

export const SKILL_LABELS: Record<SkillTier, string> = {
	beginner: 'Beginner',
	intermediate: 'Intermediate',
	advanced: 'Advanced',
	expert: 'Expert'
};

export const SKILL_BLURBS: Record<SkillTier, string> = {
	beginner: 'Learning layer by layer. Fewest algorithms to memorise, clearest steps.',
	intermediate: 'Comfortable solving unaided. Ready for two-look last layer and intuitive F2L.',
	advanced: 'Working through full OLL and PLL, chasing sub-20.',
	expert: 'Full CFOP down cold. Interested in COLL, ZBLL, winning tricks and alternative methods.'
};

/** The algorithm collections the library is grouped into. */
export type AlgSetId =
	| 'beginner-f2l'
	| 'beginner-ll'
	| 'f2l'
	| 'oll-2look'
	| 'oll'
	| 'pll-2look'
	| 'pll'
	| 'coll'
	| 'winter-variation'
	| 'cmll'
	| 'commutators';

export interface AlgSetMeta {
	id: AlgSetId;
	/** Display name, e.g. "OLL — Orientation of the Last Layer". */
	name: string;
	/** Two or three words for chips and breadcrumbs. */
	shortName: string;
	/** One sentence: what this set does for you. */
	summary: string;
	/** A paragraph or two of orientation, shown at the top of the set page. */
	description: string;
	/** Earliest tier that should meet this set. */
	tier: SkillTier;
	/** How diagrams for this set are drawn. */
	view: DiagramView;
	/**
	 * Expected number of cases, asserted in tests. Only set this where the count
	 * is a mathematical fact — 57 OLL, 21 PLL, 41 F2L — not where it is a matter
	 * of editorial taste.
	 */
	expectedCount?: number;
	/** Ordered list of sub-group names, for sectioning the set page. */
	groups?: readonly string[];
	/**
	 * Cases borrowed from another set, listed in teaching order and appended after
	 * any the set authors itself. The two-look sets work this way: they are a route
	 * through OLL and PLL, not a second copy of those algorithms.
	 */
	derivedFrom?: {
		source: AlgSetId | AlgSetId[];
		caseIds: readonly string[];
	};
	/** Which invariant the verifier holds this set's algorithms to. */
	verify: 'oll' | 'pll' | 'f2l' | 'coll' | 'cmll' | 'll-edges' | 'well-formed';
}

/** One way of solving a case. */
export interface AlgVariant {
	/** Move sequence in standard notation. */
	moves: string;
	/** Short label, e.g. "left-hand", "2-gen", "one-handed". */
	label?: string;
	/** Why you might pick this one. */
	note?: string;
	/** Who this variant suits. Omit for "anyone". */
	tier?: SkillTier;
}

/** A single case in the library. */
export interface AlgCase {
	/** Stable slug, unique across all sets. e.g. `pll-t`, `oll-21`, `f2l-01`. */
	id: string;
	set: AlgSetId;
	/** Full name, e.g. "T Permutation", "Sune", "Anti-Sune". */
	name: string;
	/** Compact name for chips, e.g. "T", "OLL 21". */
	shortName: string;
	/** Sub-group within the set, matching one of the set's `groups`. */
	group?: string;
	/**
	 * Solutions, best-first. The first entry is what the site shows by default
	 * and what the case diagram is generated from.
	 */
	algs: readonly AlgVariant[];
	/** When a learner should meet this case. */
	tier: SkillTier;
	/** How often it comes up, as a readable fraction, e.g. "1/72". */
	probability?: string;
	/** What the case looks like and how to spot it, in a sentence or two. */
	recognition?: string;
	/** Anything worth knowing: finger tricks, common mistakes, related cases. */
	notes?: string;
	/** Named triggers that appear in the primary algorithm, e.g. "sexy move". */
	triggers?: readonly string[];
	/** Id of the case this one mirrors, if any. */
	mirrorOf?: string;
	/** Free-form tags for search and filtering. */
	tags?: readonly string[];
	/**
	 * Setup moves that produce this case from a solved cube. Defaults to the
	 * inverse of the primary algorithm, which is right for nearly every case;
	 * override only when the algorithm ends in a different orientation.
	 */
	setup?: string;
}

/** A case with everything derived from its algorithm filled in. */
export interface ResolvedAlgCase extends AlgCase {
	/** Sticker state the primary algorithm solves. */
	caseState: import('$cube/types').Facelets;
	/** Move count of the primary algorithm, half-turn metric. */
	moveCount: number;
	/** Parsed primary algorithm. */
	primary: import('$cube/moves').Move[];
	set_: AlgSetMeta;
}

// ---------------------------------------------------------------------------
// Lessons
// ---------------------------------------------------------------------------

/**
 * Lesson bodies are built from typed blocks rather than markdown, so a step can
 * embed a live cube, a case diagram or an algorithm chip and stay type-checked.
 */
export type LessonBlock =
	/** A paragraph. Inline markup: `**bold**`, `*italic*`, `` `code` ``, `[text](href)`. */
	| { kind: 'prose'; text: string }
	/** A section heading inside a lesson. */
	| { kind: 'heading'; text: string; id?: string }
	/** A bulleted or numbered list. */
	| { kind: 'list'; ordered?: boolean; items: string[] }
	/** A callout box. */
	| { kind: 'note'; tone: 'tip' | 'warning' | 'insight' | 'history'; title?: string; text: string }
	/** An algorithm to learn, shown as a chip with a play button. */
	| { kind: 'alg'; moves: string; caption?: string; setup?: string }
	/** A case from the library, shown with its diagram. */
	| { kind: 'case'; id: string; caption?: string }
	/** An interactive cube the reader can turn, optionally pre-scrambled. */
	| { kind: 'cube'; setup?: string; caption?: string; view?: 'iso' | 'flat'; label?: string }
	/** A numbered procedure, each step optionally carrying an algorithm. */
	| { kind: 'steps'; steps: { text: string; alg?: string; setup?: string }[] }
	/** A side-by-side comparison table. */
	| { kind: 'table'; headers: string[]; rows: string[][]; caption?: string }
	/** A link across to another lesson or to a set page. */
	| { kind: 'jump'; href: string; label: string; blurb?: string };

export interface Lesson {
	/** URL slug. */
	slug: string;
	title: string;
	/** One sentence shown in listings. */
	summary: string;
	/** Which track this lesson belongs to. */
	track: SkillTier;
	/** Position within the track. */
	order: number;
	/** Rough reading/practice time in minutes. */
	minutes: number;
	/** Slugs of lessons worth reading first. */
	prerequisites?: string[];
	/** Algorithm set ids this lesson teaches, linked at the bottom. */
	teaches?: AlgSetId[];
	/** What the reader will be able to do afterwards. */
	outcomes: string[];
	body: LessonBlock[];
}

export interface Track {
	id: SkillTier;
	title: string;
	tagline: string;
	description: string;
	/** Ordered lesson slugs. */
	lessons: string[];
}

// ---------------------------------------------------------------------------
// Reference content
// ---------------------------------------------------------------------------

export interface GlossaryEntry {
	term: string;
	/** Alternative spellings and abbreviations, for search. */
	aliases?: string[];
	definition: string;
	/** Related terms, by exact `term`. */
	see?: string[];
	category: 'notation' | 'method' | 'technique' | 'hardware' | 'community' | 'theory';
}

export interface Tip {
	id: string;
	title: string;
	body: string;
	category: 'lookahead' | 'fingertricks' | 'practice' | 'hardware' | 'mindset' | 'competition';
	tier: SkillTier;
	/** Optional algorithm demonstrating the point. */
	alg?: string;
}

export interface SolvingMethod {
	id: string;
	name: string;
	/** e.g. "Fridrich". */
	alsoKnownAs?: string[];
	inventor?: string;
	year?: string;
	summary: string;
	/** Ordered high-level steps. */
	steps: { name: string; detail: string }[];
	/** Typical move count for a full solve. */
	moveCount: string;
	/** How many algorithms you need to know the whole thing. */
	algCount: string;
	pros: string[];
	cons: string[];
	/** Who it suits. */
	suitedTo: string;
	tier: SkillTier;
}
