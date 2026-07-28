/**
 * The 2×2 track.
 *
 * One track rather than four, because the puzzle is too small to carry a
 * ladder: the gap between "I can solve this" and "I can solve this in eight
 * seconds" is three ideas, not three years.
 *
 * The through-line is that a 2×2 is a 3×3 with the edges and centres taken
 * away, so nothing learnt here is thrown away later — and quite a lot of it is
 * 3×3 knowledge arriving early, which is the honest reason to spend time on one.
 */

import type { Lesson } from '../types';

export const POCKET_LESSONS: readonly Lesson[] = [
	{
		slug: 'pocket-what-you-are-holding',
		title: 'Eight corners and nothing else',
		summary: 'Why a 2×2 has no centres, what that means for holding it, and your first solve.',
		track: 'pocket',
		order: 1,
		minutes: 8,
		outcomes: [
			'Understand why a 2×2 has no fixed centres and what stands in for them',
			'Solve the first layer by eye',
			'Know that every 2×2 is at most eleven turns from solved'
		],
		body: [
			{
				kind: 'prose',
				text: 'Take a 3×3 and throw away the edges and the centres. What is left is a 2×2 — eight corner pieces and nothing else. Every corner you can see on a 2×2 exists on a 3×3 and behaves identically, which is why the algorithms transfer in both directions.'
			},
			{
				kind: 'heading',
				text: 'There is nothing to measure from'
			},
			{
				kind: 'prose',
				text: 'On a 3×3 the centres never move relative to each other, so the white centre *is* where white belongs and every other piece is placed against it. A 2×2 has no centres. Nothing is fixed, and a solved 2×2 held any way up is still solved.'
			},
			{
				kind: 'prose',
				text: 'That sounds like a loss and is mostly a gift: you never have to line a piece up with a centre, because there is no centre to line it up with. What you do instead is pick one corner and treat it as the reference. Everything else is placed relative to that corner rather than to the puzzle.'
			},
			{
				kind: 'note',
				tone: 'insight',
				title: 'Why scrambles only use three faces',
				text: 'With nothing fixed, turning the left face and turning the right face achieve the same thing from opposite sides. A competition 2×2 scramble therefore only ever says U, R and F — the other three are the same moves seen from behind. You can still turn them; the notation simply does not need them.'
			},
			{
				kind: 'heading',
				text: 'The first layer, by looking'
			},
			{
				kind: 'prose',
				text: 'Pick a colour. Find the four corners carrying it and put them together as a layer — not just the same colour facing down, but each corner with its other two colours matching its neighbours. This is worth doing entirely by eye. It is four pieces, it takes a handful of turns, and the habit of working something out rather than reciting it is the single most useful thing on this site.'
			},
			{
				kind: 'cube',
				setup: "R U' R' F R U R' U' F'",
				caption: 'Turn this one until the bottom layer is done. Then scramble it and do it again.'
			},
			{
				kind: 'note',
				tone: 'tip',
				text: 'If you get stuck, the solve page will show you a way — but read the beginner suggestion rather than the shortest one. The shortest is a machine answer and will teach you nothing about seeing the pieces.'
			},
			{
				kind: 'heading',
				text: 'How far from solved is a 2×2, ever?'
			},
			{
				kind: 'prose',
				text: 'Eleven turns. Not eleven on average — eleven at the very worst, from the most awkward scramble there is. The whole puzzle has 3,674,160 positions, which is few enough that this site searches them outright: the "shortest possible" line on the solve page is not an estimate.'
			},
			{
				kind: 'prose',
				text: 'That number is a useful thing to carry. When a solve takes you forty moves, the gap is not your fingers.'
			},
			{
				kind: 'jump',
				href: '/solve/',
				label: 'Try the solver',
				blurb: 'Paint in your puzzle, or type a scramble, and see what it suggests at each level.'
			}
		]
	},
	{
		slug: 'pocket-last-layer',
		title: 'Finishing with two algorithms',
		summary: 'Orient the top with sune, permute it with one more, and you can solve any 2×2.',
		track: 'pocket',
		order: 2,
		minutes: 10,
		prerequisites: ['pocket-what-you-are-holding'],
		teaches: ['pocket-oll', 'pocket-pll'],
		outcomes: [
			'Solve any 2×2 with two algorithms',
			'Recognise the difference between an adjacent and a diagonal swap',
			'Know why repeating sune always works'
		],
		body: [
			{
				kind: 'prose',
				text: 'With the first layer done, the top is four corners that are twisted the wrong way, in the wrong places, or both. Deal with those two problems in that order and two algorithms cover everything.'
			},
			{ kind: 'heading', text: 'Step one: get the top colour facing up' },
			{
				kind: 'prose',
				text: 'This is sune, and it is the same sune you would use on a 3×3.'
			},
			{
				kind: 'case',
				id: 'pocket-oll-sune',
				caption: 'Hold the finished corner at the back left.'
			},
			{
				kind: 'prose',
				text: 'There are seven ways the top can be twisted and you do not need to learn seven algorithms. Do sune, look again, turn the top to a sensible position, do sune again. It converges every time — usually in two goes, occasionally three.'
			},
			{
				kind: 'note',
				tone: 'warning',
				title: 'Turn the top between goes',
				text: 'Two sunes back to back get you nowhere on half the cases. The adjusting turn in between is not optional tidying; it is the part that makes the repetition work.'
			},
			{ kind: 'heading', text: 'Step two: put them in the right places' },
			{
				kind: 'prose',
				text: 'Now every top sticker faces up and the corners may still be in the wrong order. There are exactly two ways that can be wrong, and telling them apart takes no counting: turn the top and look for one face showing two matching stickers.'
			},
			{
				kind: 'list',
				items: [
					'**A matching pair somewhere** — two neighbouring corners need swapping. Put the pair at the back.',
					'**No matching pair on any face** — the two that need swapping are diagonally opposite.'
				]
			},
			{ kind: 'case', id: 'pocket-pll-adjacent' },
			{ kind: 'case', id: 'pocket-pll-diagonal' },
			{
				kind: 'note',
				tone: 'insight',
				text: 'Both of these are 3×3 algorithms with the edges removed — the first is the corner half of a T permutation, the second of a Y. If you go on to learn PLL properly, you have already started.'
			},
			{
				kind: 'prose',
				text: 'That is a complete method. Two algorithms, a bit of looking, and every 2×2 falls over. Get comfortable here before going further, because everything after this is about saving seconds rather than about being able to finish.'
			}
		]
	},
	{
		slug: 'pocket-ortega',
		title: 'Ortega: stop solving the first layer',
		summary: 'Build a face rather than a layer, and sort both ends out at the finish.',
		track: 'pocket',
		order: 3,
		minutes: 9,
		prerequisites: ['pocket-last-layer'],
		teaches: ['pocket-pbl'],
		outcomes: [
			'Build a first face instead of a first layer',
			'Recognise the five PBL cases',
			'Understand the trade the method is making'
		],
		body: [
			{
				kind: 'prose',
				text: 'Solving the first layer means getting four corners into the right places *and* the right way up. Ortega asks for less: build a first **face** — one colour pointing down, corners in any order at all — and clean up the order at the very end, both layers at once.'
			},
			{
				kind: 'prose',
				text: 'The trade is straightforward. The first stage gets noticeably quicker because you have stopped caring about three quarters of the information. The last stage gets harder, because now two layers are out of order rather than one. On balance it wins, and it wins more the faster you get.'
			},
			{ kind: 'heading', text: 'The three steps' },
			{
				kind: 'steps',
				steps: [
					{
						text: 'Build any face — one colour facing down, order ignored. Usually four or five turns, entirely by eye.'
					},
					{
						text: 'Orient the top with one of the seven algorithms, or with sune repeated if you have not learnt them yet.'
					},
					{ text: 'Permute both layers with a single algorithm. This is the new part.' }
				]
			},
			{ kind: 'heading', text: 'Permuting both layers' },
			{
				kind: 'prose',
				text: 'Each layer is now in one of three states: already right, one pair of neighbours swapped, or a diagonal swap. Nine combinations, one of which is finished, and turning the puzzle over makes several of the rest the same case. Five algorithms cover it.'
			},
			{
				kind: 'case',
				id: 'pocket-pbl-both-diagonal',
				caption: 'Three moves, for the case that looks the worst.'
			},
			{ kind: 'case', id: 'pocket-pbl-both-adjacent' },
			{
				kind: 'note',
				tone: 'tip',
				title: 'Learn the three-move one first',
				text: 'Both layers diagonal is `R2 F2 R2`. It is the shortest algorithm on this entire site and it turns the most alarming-looking case on the puzzle into the easiest. Worth knowing even if you never learn the other four.'
			},
			{
				kind: 'prose',
				text: 'Hold the puzzle with the easier layer on the bottom. If one layer is already right and the other is not, the right one goes underneath — that is what makes five algorithms enough instead of nine.'
			},
			{
				kind: 'jump',
				href: '/algorithms/pocket-pbl/',
				label: 'All five PBL cases',
				blurb: 'With diagrams generated from the algorithms themselves.'
			}
		]
	},
	{
		slug: 'pocket-cll',
		title: 'CLL, and whether you want it',
		summary:
			'One algorithm for the whole last layer — forty cases, and an honest look at the payoff.',
		track: 'pocket',
		order: 4,
		minutes: 8,
		prerequisites: ['pocket-ortega'],
		teaches: ['pocket-cll'],
		outcomes: [
			'Understand what CLL replaces',
			'Know where the forty cases come from',
			'Decide honestly whether it is worth your time'
		],
		body: [
			{
				kind: 'prose',
				text: 'CLL solves the entire last layer in one algorithm. First layer done, look at the top, one sequence, finished. It replaces the two steps of the beginner method with one, and typically saves two to three seconds.'
			},
			{ kind: 'heading', text: 'Where the forty cases come from' },
			{
				kind: 'prose',
				text: 'With the first layer solved there are 648 ways the top can sit — twenty-four arrangements times twenty-seven twist patterns. Two of those count as the same case when you can turn the top before the algorithm and again after it to carry one to the other. Counting properly gives forty-three. One is already solved and two need no twisting at all, and those two are the pair you already know from the last-layer lesson. Forty left.'
			},
			{
				kind: 'note',
				tone: 'insight',
				title: 'The H group has four, not six',
				text: 'Every shape gets six cases except H, which gets four — because the H pattern looks identical after a half turn, so two of its arrangements are the same case seen twice. This is the detail that makes published counts of "42" confusing, and it falls straight out of the arithmetic once you set it up properly.'
			},
			{ kind: 'heading', text: 'Should you learn it?' },
			{
				kind: 'table',
				headers: ['If you', 'Then'],
				rows: [
					[
						'Solve in 20 seconds or more',
						'Do not. Your time is in the first face and in looking ahead, not here.'
					],
					[
						'Solve in 8 to 15 seconds with Ortega',
						'Learn the sune and antisune groups only. Twelve cases, most of the benefit.'
					],
					[
						'Solve under 8 seconds',
						'The full forty starts to pay. You will be recognising faster than you can execute otherwise.'
					],
					[
						'Just want to know the puzzle properly',
						'Read the case list. Understanding the forty is worth something even if you drill none.'
					]
				]
			},
			{
				kind: 'note',
				tone: 'warning',
				title: 'About the algorithms on this site',
				text: 'The forty in the library are shortest solutions found by search, not sequences chosen for how they feel in the hand. They are efficient and every one is verified, but only a few are two-gen. If you mean to drill a case properly, find a version your fingers like — this site says elsewhere not to learn an algorithm you cannot finger, and it means it here.'
			},
			{
				kind: 'jump',
				href: '/algorithms/pocket-cll/',
				label: 'The forty cases',
				blurb: 'Grouped by shape, with recognition for each.'
			}
		]
	}
];
