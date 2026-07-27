/**
 * The expert track.
 *
 * Written for someone who has full CFOP and is deciding what to do with the next
 * year. The governing rule here is honesty about cost: every set past PLL buys
 * less per algorithm than the one before it, and saying so plainly is more use to
 * a reader than enthusiasm. The track ends with commutators, which are the only
 * thing on this site that changes what the cube *is* rather than how fast you
 * finish it.
 *
 * Every algorithm quoted was run through the cube engine and its effect checked
 * against the sentence describing it.
 */

import type { Lesson } from '../types';

export const EXPERT_LESSONS: readonly Lesson[] = [
	{
		slug: 'last-layer-subsets',
		title: 'The subsets, and what they cost',
		summary:
			'COLL, Winter Variation and ZBLL weighed against the seconds they actually save. Most people should learn COLL and stop.',
		track: 'expert',
		order: 60,
		minutes: 16,
		teaches: ['coll', 'winter-variation'],
		outcomes: [
			'Say what each of the main last-layer subsets does and when it applies',
			'Work out the return on an algorithm set before you commit to learning it',
			'Decide honestly whether ZBLL is worth the next year of your practice',
			'Tell whether the last layer is where your time is going at all'
		],
		body: [
			{
				kind: 'prose',
				text: 'Full CFOP finishes the last layer in two algorithms, around twenty-two turns and two recognition pauses. Everything past this point is an attempt to buy away one of those pauses, and every attempt is priced in algorithms.'
			},
			{
				kind: 'prose',
				text: 'The sets are worth knowing about even if you learn none of them, because the shape of the trade is the same each time and it is the trade rather than the algorithms that tells you what to do next.'
			},
			{ kind: 'heading', text: 'What influencing means' },
			{
				kind: 'prose',
				text: 'Every subset works by using something you already knew earlier in the solve to narrow the case you meet later. The commonest thing to know is whether the last-layer edges came out **oriented** — yellow facing up on all four — when F2L finished.'
			},
			{
				kind: 'note',
				tone: 'insight',
				title: 'One solve in eight',
				text: 'Edges flip in pairs, so with the first two layers done there are eight possible orientation states of the four top edges, and one of them is all four correct. That is where the one-in-eight comes from, and nearly every subset on this page is built on it. You are looking at the top face anyway to pick your OLL, so noticing costs you nothing.'
			},
			{ kind: 'heading', text: 'COLL' },
			{
				kind: 'prose',
				text: '**COLL** solves the last-layer corners completely — orientation and position together — while leaving the edges oriented. You reach for it on the one solve in eight where the edges are already oriented, and it replaces OLL and the corner half of PLL with a single algorithm.'
			},
			{
				kind: 'prose',
				text: 'It is forty-two algorithms: seven corner-orientation shapes, six ways the corners can be arranged within each. Three more cases exist where the corners are already oriented and only need moving, and you know all three of those already — they are the two A permutations and the E permutation.'
			},
			{
				kind: 'alg',
				moves: "R U R' U R U2 R'",
				caption:
					'Sune, unchanged since the beginner track. In one of the six sune cases it leaves the corners not merely oriented but finished, and the edges cycled three ways round. The same is true in every family: one of the six is the OLL algorithm you already use, so forty-two is really thirty-five new.'
			},
			{
				kind: 'prose',
				text: 'Afterwards the corners are done and the edges can only be in one of four states, which the next lesson covers. One time in twelve they are already right and the cube is finished.'
			},
			{ kind: 'heading', text: 'Winter Variation' },
			{
				kind: 'prose',
				text: '**Winter Variation** orients the last-layer corners *while you insert the final F2L pair*. Given oriented edges, that removes OLL from the solve altogether — you finish F2L and go straight to PLL. Twenty-seven algorithms, none of them long.'
			},
			{
				kind: 'note',
				tone: 'warning',
				title: 'Two conditions, not one',
				text: 'Winter Variation needs the last-layer edges oriented **and** the final pair already joined and sitting ready for a three-move insertion. Both at once is uncommon. You can steer your F2L to make the second condition happen more often, but the steering costs turns in F2L, which is where you were trying to save them.'
			},
			{ kind: 'heading', text: 'ZBLL' },
			{
				kind: 'prose',
				text: '**ZBLL** finishes an edge-oriented last layer in one algorithm — orientation and permutation of everything, in one look. It is four hundred and ninety-three algorithms, give or take a handful depending on how you count the symmetric cases.'
			},
			{
				kind: 'prose',
				text: 'In CFOP it applies on that same one solve in eight. Its natural home is ZZ, where edge orientation is guaranteed by the first step and ZBLL therefore applies to every solve you do.'
			},
			{
				kind: 'note',
				tone: 'warning',
				title: 'What five hundred algorithms costs',
				text: 'Three new algorithms a day, learnt and still there a week later, is a good rate and hard to sustain. At that rate ZBLL is most of a year, and the finished set needs maintaining forever after — a case you meet once every few hundred solves will not stay in your hands on its own. People do learn it. They tend to be people who enjoy learning algorithms for its own sake, which is a perfectly good reason and worth being honest with yourself about.'
			},
			{ kind: 'heading', text: 'The arithmetic nobody does' },
			{
				kind: 'table',
				headers: ['Set', 'Algorithms', 'When it applies', 'Roughly what it saves'],
				rows: [
					[
						'PLL, in one look',
						'21',
						'Every solve',
						'About two seconds a solve. This was the good deal, and you have already taken it.'
					],
					[
						'COLL',
						'42 (35 new)',
						'1 solve in 8',
						'A second or so on those solves — call it a tenth of a second on average'
					],
					[
						'Winter Variation',
						'27',
						'1 in 8, and only when the last pair cooperates',
						'A second on perhaps one solve in twenty'
					],
					[
						'ZBLL',
						'493',
						'1 solve in 8 with CFOP, every solve with ZZ',
						'Around a second, on the solves where it lands'
					]
				],
				caption:
					'Seconds per algorithm learnt, falling off a cliff. The last layer is already the fastest-moving part of your solve; there is not much left in it to win.'
			},
			{
				kind: 'note',
				tone: 'tip',
				title: 'Check where your time is before you spend a year',
				text: 'Film ten solves and count the seconds from the first turn to the last F2L pair going in. For nearly everyone between fifteen and thirty seconds, F2L is more than half the solve and most of that half is pauses. A tenth of a second from COLL is real, and it is not where your next five seconds are.'
			},
			{ kind: 'heading', text: 'What most people should do' },
			{
				kind: 'prose',
				text: 'Learn COLL, and stop. It is the smallest set with a genuine payoff, the recognition it teaches you transfers to everything after it, and the same forty-two cases are the corner step of Roux, so nothing is wasted if you ever wander in that direction.'
			},
			{
				kind: 'list',
				items: [
					'**Learn COLL if** your F2L is smooth, your PLL recognition is instant, and you want a set that makes the last layer feel different rather than marginally quicker.',
					'**Skip all of it if** you still pause between F2L pairs. The pause is worth ten times the subset.',
					'**Learn ZBLL if** you are already comfortably under twelve seconds, or you solve ZZ, or you find learning algorithms genuinely enjoyable. Those are the three honest reasons and the third is the commonest.'
				]
			},
			{
				kind: 'note',
				tone: 'history',
				text: "ZB is named for Zbigniew Zborowski and Ron van Bruchem, who worked out the last-layer set in the early 2000s as part of a whole method built around guaranteed edge orientation. Winter Variation carries Michael Winter's name. The habit of naming sets after the person who first wrote them down is why cubing vocabulary reads like a list of strangers."
			},
			{
				kind: 'jump',
				href: '/algorithms/coll/',
				label: 'The COLL set',
				blurb: 'Forty-two cases grouped by family, with diagrams drawn from the moves themselves.'
			},
			{
				kind: 'jump',
				href: '/methods/',
				label: 'How the methods compare',
				blurb: 'CFOP, Roux, ZZ and the rest, with move counts and algorithm counts side by side.'
			}
		]
	},

	{
		slug: 'coll-in-practice',
		title: 'COLL in practice',
		summary:
			'When to reach for it instead of OLL, how to recognise a case in the time you have, and the four edge permutations it leaves you with.',
		track: 'expert',
		order: 61,
		minutes: 18,
		prerequisites: ['last-layer-subsets'],
		teaches: ['coll'],
		outcomes: [
			'Check edge orientation and choose between OLL and COLL without hesitating',
			'Recognise a COLL case by family first and side stickers second',
			'Finish with the four edge permutations and tell them apart at a glance',
			'Judge the cases where running OLL and PLL is the faster choice'
		],
		body: [
			{
				kind: 'prose',
				text: 'COLL is not an alternative to OLL. It is what you do instead of OLL on the one solve in eight where the last-layer edges arrive already oriented, and the decision has to be made in the same glance you were making anyway.'
			},
			{ kind: 'heading', text: 'The check comes first' },
			{
				kind: 'prose',
				text: 'The last pair goes in and you look at the top face. If the four edges show yellow upwards — a complete cross, whatever the corners are doing — you are in COLL territory. If not, run OLL and PLL as you always have. That is the whole of the decision and it should take no longer than reading an OLL shape.'
			},
			{
				kind: 'note',
				tone: 'warning',
				title: 'Do not go hunting',
				text: 'If you find yourself turning the cube round looking for a cross, you have spent the saving before you have made it. COLL cases are the seven shapes you already know as OLL 21 to 27; if what you are looking at is not one of them, it is not a COLL case.'
			},
			{ kind: 'heading', text: 'Seven families' },
			{
				kind: 'prose',
				text: 'The corner-orientation shapes are the ones you learnt for two-look OLL, and cubers name them by their pictures rather than their numbers.'
			},
			{
				kind: 'list',
				items: [
					'**Sune** and **anti-sune** — one corner facing up, the other three twisted the same way round',
					'**Pi** and **H** — no corner facing up at all, told apart by which pairs of side stickers line up',
					'**T**, **U** and **L** — two corners facing up, told apart by where the other two point'
				]
			},
			{
				kind: 'prose',
				text: 'Each family holds six cases, one for each way the four corners can sit relative to one another. One of those six is the OLL algorithm you already use, which is a pleasant thing to discover: run plain sune on the right sune case and the corners come out finished rather than merely oriented.'
			},
			{
				kind: 'alg',
				moves: "R U R' U R U2 R'",
				caption:
					'Sune as a COLL algorithm. Corners solved, and the edges left in a three-cycle — which is to say a U permutation, one of the four things that can be left.'
			},
			{
				kind: 'alg',
				moves: "R U2 R' U' R U' R'",
				caption:
					'Anti-sune, doing the same job for its own family. Seven turns, two faces, and already in your hands.'
			},
			{
				kind: 'alg',
				moves: "R U2 R2 U' R2 U' R2 U2 R",
				caption:
					'A COLL you do not know: nine turns, every one of them on R or U, which makes it quicker to execute than its length suggests. This is the sort of algorithm the set is full of.'
			},
			{
				kind: 'alg',
				moves: "R U R' U R U' R' U R U2 R'",
				caption:
					'The H family — all four corners twisted in opposite pairs. Sune, then most of sune again. Learning the set family by family means learning shapes like this one rather than eleven unrelated turns.'
			},
			{ kind: 'heading', text: 'Recognition, in two stages' },
			{
				kind: 'prose',
				text: 'Reading the family is free; you have been doing it for years. Telling the six cases within a family apart is the new skill, and it is done on the **side** stickers of the corners rather than the top.'
			},
			{
				kind: 'steps',
				steps: [
					{
						text: 'Read the shape on the top face and name the family. Nothing new here.'
					},
					{
						text: 'Look around the sides for **headlights** — two corners on the same face showing the same colour. How many faces have them, and where they sit relative to the twisted corner, is what separates the six.'
					},
					{
						text: 'Turn the top face to the position your algorithm expects, run it, and finish with one of four edge cases.'
					}
				]
			},
			{
				kind: 'note',
				tone: 'tip',
				title: 'Learn one family at a time, and mix it with the one you know',
				text: 'The failure is never doing the algorithm. It is telling the six apart under time. Drill a family against itself — six cases, shuffled, including the OLL algorithm you already had for it — and stop when you can name each one before your hands move. Then leave it a week and come back before adding the next family.'
			},
			{
				kind: 'note',
				tone: 'warning',
				title: 'Half a set is worse than none',
				text: 'If you know four families and meet a fifth, you have to notice that you do not know it, abandon COLL, and fall back to OLL — and that noticing costs more than the algorithm would have saved. Either finish a family or leave it alone; the unit of learning here is the family, not the case.'
			},
			{ kind: 'heading', text: 'The four edge cases' },
			{
				kind: 'prose',
				text: 'With the corners finished, the four edges must be an **even** rearrangement of themselves. There are twelve of those, and they fall into four shapes — the same four you met as the second half of two-look PLL, and now the only thing standing between you and a solved cube.'
			},
			{
				kind: 'alg',
				moves: "M2 U M U2 M' U M2",
				caption:
					'**Ua**. Three edges cycle, one is already home: hold that one at the back. Eight of the twelve arrangements are a U permutation one way or the other.'
			},
			{
				kind: 'alg',
				moves: "M2 U' M U2 M' U' M2",
				caption: '**Ub**. The same seven turns with every single `U` reversed, and nothing else.'
			},
			{
				kind: 'alg',
				moves: 'M2 U M2 U2 M2 U M2',
				caption:
					'**H**. Every edge swaps with the one opposite. Symmetrical, so there is nothing to line up before you start. One in twelve.'
			},
			{
				kind: 'alg',
				moves: "M2 U M2 U M' U2 M2 U2 M' U2",
				caption:
					'**Z**. Two pairs of neighbours change places. Hold it so the front and right edges are the pair that want to swap. Two in twelve.'
			},
			{
				kind: 'note',
				tone: 'insight',
				title: 'One in twelve, instead of one in seventy-two',
				text: 'The remaining twelfth is the case where the edges are already right and the cube finishes as your COLL algorithm ends. Running OLL then PLL, a skip on the last step comes up once in seventy-two solves. With COLL it is once in twelve — which is the part of this set that actually feels like a reward, and the reason people describe COLL as the gateway to one-look last layers.'
			},
			{ kind: 'heading', text: 'When to leave it alone' },
			{
				kind: 'list',
				items: [
					'**When you are not certain within a second.** OLL and PLL cost around twelve extra turns and no thinking. Hesitation costs more.',
					'**When you have only half the set.** Covered above, and it is the commonest way people lose time to COLL.',
					'**In the middle of a competition average.** A set you learnt last week will desert you under pressure. Bring it in when it is boring.'
				]
			},
			{
				kind: 'note',
				tone: 'history',
				text: "The same forty-two cases turn up in the Roux method as **CMLL**, where the rules are looser — a CMLL algorithm has to leave two blocks intact but may do what it likes to the edges. A good third of the algorithms are shared outright, which means learning COLL quietly hands you most of a different method's third step."
			},
			{
				kind: 'jump',
				href: '/algorithms/coll/',
				label: 'COLL, family by family',
				blurb: 'All forty-two, grouped the way you should learn them, with move counts.'
			},
			{
				kind: 'jump',
				href: '/trainer/',
				label: 'Drill a family until it names itself',
				blurb:
					'The trainer shows a case, times your answer, and returns to the slow ones more often.'
			}
		]
	},

	{
		slug: 'roux',
		title: 'Roux, seen from CFOP',
		summary:
			'Two blocks, one corner algorithm and a slice-turn finish. What the method is, why the middle slice is left until last, and whether switching is worth it.',
		track: 'expert',
		order: 62,
		minutes: 18,
		prerequisites: ['last-layer-subsets'],
		teaches: ['cmll'],
		outcomes: [
			'Describe the four steps of Roux and what is solved after each one',
			'Explain why the M slice is deliberately left free until the end',
			'Say what Roux is better and worse at than CFOP, without the partisanship',
			'Decide whether to try it, and how to try it without wrecking your times'
		],
		body: [
			{
				kind: 'prose',
				text: 'Roux is not a variation on CFOP. It solves a different set of pieces in a different order and finishes with a step CFOP has no equivalent of. Gilles Roux published it in 2003, and it is the only serious rival to CFOP at the top of competition results.'
			},
			{ kind: 'heading', text: 'The four steps' },
			{
				kind: 'steps',
				steps: [
					{
						text: '**First block.** Build a 1×2×3 block on the left of the bottom layer: the down-left edge, the two corners either side of it, the two edges above them, and the left centre. No algorithms — it is worked out, the way you work out a cross, but there is more of it.'
					},
					{
						text: '**Second block.** Build the same thing on the right. It has to leave the first block standing, which restricts you to turns of the right-hand face, the top and the middle slice. The two blocks together are the first two layers, minus the middle slice.'
					},
					{
						text: '**CMLL.** Solve all four top corners in a single algorithm — orientation and position at once — while ignoring the edges completely. Forty-two cases.',
						alg: "R U R' U R U2 R'"
					},
					{
						text: '**LSE — the last six edges.** Everything unsolved is now in the middle slice and the top layer: six edges and two centres. Orient them, place the two side edges, and finish with half turns of the slice.',
						alg: "M' U2 M' U2"
					}
				]
			},
			{
				kind: 'note',
				tone: 'insight',
				title: 'Why the slice is left free',
				text: 'The two blocks occupy the left and right layers. Neither of them contains a single piece of the middle slice, so the slice can be spun at any point without damaging anything you have built. Roux hands you that freedom deliberately and then uses it: the corners are solved with the slice hanging loose, and the whole of the last step is slice turns.'
			},
			{ kind: 'heading', text: 'What a CFOP solver notices first' },
			{
				kind: 'list',
				items: [
					'**There is no cross.** There is no step whose only purpose is to make the next step possible.',
					'**Nothing is a layer.** You never protect a finished layer, because until the very end nothing is a finished layer.',
					'**The corners come before the edges** in the last part, which is the opposite way round from OLL and PLL.',
					'**The solve barely rotates.** Roux is mostly R, U and M with a single `y` between blocks — and the M slice is turned with the left hand rather than gripped.',
					'**Fewer algorithms.** Forty-two for CMLL, a handful of patterns for the last six edges, and nothing else. That is the entire method.'
				]
			},
			{ kind: 'heading', text: 'CMLL' },
			{
				kind: 'prose',
				text: 'CMLL is the same forty-two corner cases as COLL. The difference is the rule an algorithm has to obey. A COLL algorithm must leave the last-layer edges oriented, because CFOP still needs them that way. A CMLL algorithm only has to leave the two blocks standing, and the six loose edges may be thrown anywhere, because throwing them anywhere is what the next step expects.'
			},
			{
				kind: 'alg',
				moves: "R U R' U R U2 R'",
				caption:
					'Sune again. It is an OLL algorithm, a COLL algorithm and a CMLL algorithm at once, which is a fair illustration of how much of this is the same knowledge wearing different hats.'
			},
			{
				kind: 'alg',
				moves: "F R U' R' U' R U R' F'",
				caption:
					'A CMLL algorithm that would be no use in CFOP: it flips two of the top edges as it goes. Under Roux rules that is free, because the edges have not been touched yet and will not be until the last step.'
			},
			{ kind: 'heading', text: 'The last six edges' },
			{
				kind: 'prose',
				text: 'This is the step with no CFOP counterpart, and the one people find alien. Six edges remain: the four in the middle slice and the two on the sides of the top layer. It goes in three passes, and only the third involves anything you would call an algorithm.'
			},
			{
				kind: 'steps',
				steps: [
					{
						text: '**Orient them.** Using only slice turns and turns of the top, flip every one of the six the right way up. Recognition is by counting which edges show the top colour, and it is worked out rather than memorised.'
					},
					{
						text: '**Place the two side edges.** Bring the up-left and up-right edges home, again with slice and top turns only. Six or seven turns typically does it.'
					},
					{
						text: '**Finish the slice.** Four edges are left in the middle slice, in one of the twelve arrangements they can reach. A handful of short patterns of slice and top half turns covers every one.',
						alg: 'M2 U2 M2 U2'
					}
				]
			},
			{
				kind: 'alg',
				moves: "M' U2 M' U2",
				caption:
					'A three-cycle of slice edges in four turns: the back edge drops to the front of the bottom, the front-bottom goes round to the back-bottom, and the back-bottom comes up. Nothing else on the cube moves at all.'
			},
			{
				kind: 'alg',
				moves: 'M2 U2 M2 U2',
				caption:
					'The double swap: the two top slice edges change places, and so do the two bottom ones. Four turns, no thinking, and the cube is finished.'
			},
			{
				kind: 'note',
				tone: 'tip',
				text: 'This is why Roux solvers have such good middle-slice technique, and why a Roux solver picks up the M-slice PLLs in an afternoon. If you have been avoiding `M` turns since two-look PLL, a fortnight of Roux last-six-edges will cure it whether or not you keep the method.'
			},
			{ kind: 'heading', text: 'Move counts, honestly' },
			{
				kind: 'prose',
				text: "Roux is usually quoted at forty-five to fifty moves against CFOP's fifty-five to sixty, and the gap is real but smaller than it looks. Roux counts are given in **slice-turn metric**, where an `M` counts as one move. Count the slices as two, which is what the half-turn metric does, and most of the advantage disappears."
			},
			{
				kind: 'table',
				headers: ['', 'CFOP', 'Roux'],
				rows: [
					[
						'Algorithms for the full method',
						'78, plus F2L worked out',
						'42, plus everything else worked out'
					],
					['Typical solve', 'About 55 turns', 'About 48, counting a slice as one'],
					['Cube rotations', 'Several per solve', 'Usually one'],
					[
						'What it demands of you',
						'Recognition and memory',
						'Block building and planning, under time'
					],
					['Where it hurts', 'The pause before OLL', 'The pause after the first block']
				],
				caption:
					'Neither column is a winning argument. They are different distributions of the same difficulty.'
			},
			{ kind: 'heading', text: 'Should you switch' },
			{
				kind: 'prose',
				text: 'Probably not, and certainly not as a remedy. Switching methods costs months, your times go backwards for several weeks, and the fastest Roux solvers sit a shade behind the fastest CFOP solvers and comfortably ahead of nearly everybody else — which tells you plainly that the method is not what is keeping you at twenty seconds.'
			},
			{
				kind: 'prose',
				text: 'There is a better reason to learn it: block building is a different kind of thinking from slot filling, and it makes you better at seeing the cube whatever you solve with. Plenty of people keep CFOP for speed and Roux for pleasure, and the pleasure improves the speed by a route nobody expected.'
			},
			{
				kind: 'note',
				tone: 'tip',
				title: 'A cheap way to try it',
				text: 'Spend a week doing nothing but first blocks. No timer, no full solves — scramble, build a 1×2×3 on the left, scramble again. You will know within a week whether the way it makes you think is something you want more of, and you will not have touched your CFOP times to find out.'
			},
			{
				kind: 'note',
				tone: 'history',
				text: 'Gilles Roux designed the method around a low move count and a small number of algorithms, at a time when the assumption was that speed came from learning more. It took the better part of a decade for competition results to make the case for it, and the argument was settled by people rather than by theory.'
			},
			{
				kind: 'jump',
				href: '/algorithms/cmll/',
				label: 'The CMLL set',
				blurb:
					'Forty-two corner cases with the blocks left standing, grouped by how many corners face up.'
			},
			{
				kind: 'jump',
				href: '/methods/',
				label: 'Methods side by side',
				blurb: 'Steps, move counts and algorithm counts for every method worth taking seriously.'
			}
		]
	},

	{
		slug: 'zz-and-the-others',
		title: 'ZZ, and the others',
		summary:
			'Edge orientation first, F2L without a single rotation, and a fair account of who Petrus and Mehta actually suit.',
		track: 'expert',
		order: 63,
		minutes: 16,
		prerequisites: ['roux'],
		outcomes: [
			'Describe EOLine and what it buys the rest of the solve',
			'Explain why ZZ needs no F or B turns after the first step',
			'Say what Petrus and Mehta do differently, and where each came from',
			'Match a method to the way you actually like to solve'
		],
		body: [
			{
				kind: 'prose',
				text: 'ZZ was published by Zbigniew Zborowski in 2006 and rests on one idea: orient every edge on the cube before you build anything. Everything else in the method is a consequence of that decision.'
			},
			{ kind: 'heading', text: 'EOLine' },
			{
				kind: 'prose',
				text: 'The first step orients all twelve edges and places the two bottom edges that run front to back. Six turns is a typical solution and eight is a bad one — but they have to be found during inspection, in a scramble you have never seen, and that is the part that stops people.'
			},
			{
				kind: 'note',
				tone: 'insight',
				title: 'What edge orientation buys',
				text: 'An edge is "oriented" when it can be brought home without ever turning F or B. Once all twelve are oriented, F and B turns would break that property, so the rest of the solve avoids them entirely — which leaves R, U and L. A cube that only needs three faces turned is a cube you never have to rotate in your hands.'
			},
			{ kind: 'heading', text: 'F2L without rotating' },
			{
				kind: 'prose',
				text: 'With the line in place, the first two layers go in as two blocks, left and right, using nothing but R, U and L. There are no awkward back slots, because there is no back — the cube sits still and your hands do the whole solve from one grip.'
			},
			{
				kind: 'prose',
				text: "This is where ZZ feels different rather than faster. The move count is much like CFOP's. What changes is that the turning is continuous, the pieces stay where your eyes left them, and lookahead comes more readily because nothing you are tracking ever swings out of sight."
			},
			{ kind: 'heading', text: 'The last layer, guaranteed' },
			{
				kind: 'prose',
				text: 'Every ZZ solve arrives at the last layer with the edges already oriented, which is the one-in-eight case CFOP solvers wait for. So the two-look finish is COLL and then one of four edge cases, and the one-look finish is ZBLL — available on every solve rather than one in eight.'
			},
			{
				kind: 'note',
				tone: 'warning',
				title: 'The honest cost of ZZ',
				text: 'EOLine is genuinely hard to plan in fifteen seconds, and reading edge orientation is a skill of its own that takes weeks before it stops being arithmetic. Until it is fluent, your solve begins with a long pause — and a pause at the start is the most expensive kind, because everything after it is waiting.'
			},
			{ kind: 'heading', text: 'Petrus' },
			{
				kind: 'prose',
				text: 'Lars Petrus — whose name you have already met attached to sune — worked his method out in 1981, and both Roux and ZZ owe it something. It builds a 2×2×2 block, grows it to 2×2×3, orients the edges, finishes the first two layers, then does the last layer.'
			},
			{
				kind: 'prose',
				text: 'Petrus is short on algorithms and short on moves, and long on thinking: nearly every step is worked out rather than recalled. It suits people who like the puzzle more than the stopwatch, and it is the origin of the two ideas the other methods took — build blocks rather than layers, and fix edge orientation early.'
			},
			{ kind: 'heading', text: 'Mehta' },
			{
				kind: 'prose',
				text: 'Mehta is the newcomer, published by Yash Mehta in 2020. It builds a first block, then a "belt" of middle-layer edges all the way round, then orients edges and corners, permutes the corners, and finishes with five edges. Each of those is its own small algorithm set.'
			},
			{
				kind: 'prose',
				text: 'It is low on moves, keeps the cube still, and asks for a lot of memorisation across several subsets. Its appeal is to people who already like M-slice work and do not mind learning in sets — which is to say, people who enjoyed learning full PLL.'
			},
			{
				kind: 'table',
				headers: ['Method', 'The distinctive idea', 'Algorithms', 'Suits'],
				rows: [
					[
						'CFOP',
						'Layers, then a two-algorithm last layer',
						'78 for the full method',
						'Anyone. Most material, most people to ask, most competition results.'
					],
					[
						'Roux',
						'Two blocks and a free middle slice',
						'42, plus intuition',
						'People who like planning and do not mind slice turns. Strong one-handed.'
					],
					[
						'ZZ',
						'Orient every edge before you build',
						'28 to 493, depending how far you take the last layer',
						'People who hate rotating, and anyone tempted by ZBLL.'
					],
					[
						'Petrus',
						'Grow one block into the whole cube',
						'About 16, with a two-look last layer',
						'People who would rather think than memorise.'
					],
					[
						'Mehta',
						'A belt of edges, then everything in small sets',
						'Several hundred across the subsets',
						'People who enjoy learning algorithm sets and already turn the slice well.'
					]
				],
				caption: 'Every one of these has produced solvers under ten seconds.'
			},
			{ kind: 'heading', text: 'Choosing honestly' },
			{
				kind: 'prose',
				text: 'Between twenty and thirty seconds, the method is not what is making you slow — the pauses are, and they are the same pauses in every method. Below about twelve seconds the differences start to matter, and by then you will have opinions of your own about which part of a solve you enjoy.'
			},
			{
				kind: 'prose',
				text: 'So pick for pleasure rather than for theory. The method you find interesting is the one you will practise, and practice beats every argument on this page.'
			},
			{
				kind: 'note',
				tone: 'tip',
				text: 'Whatever you pick, the same three things make it faster: fewer pauses, fewer rotations, and better blocks. None of those are method-specific, and all three of them transfer if you change your mind later.'
			},
			{
				kind: 'jump',
				href: '/methods/',
				label: 'The full comparison',
				blurb: 'Each method broken into its steps, with what is solved after every one.'
			},
			{
				kind: 'jump',
				href: '/glossary/',
				label: 'The vocabulary on this page',
				blurb: 'EOLine, belt, block, slice — defined once, with what they are not.'
			}
		]
	},

	{
		slug: 'commutators',
		title: 'Commutators',
		summary:
			'The [A, B] pattern, interchange and insertion, and how to build an algorithm for a case nobody has written down.',
		track: 'expert',
		order: 64,
		minutes: 20,
		prerequisites: ['last-layer-subsets'],
		teaches: ['commutators'],
		outcomes: [
			'Read and expand the notation [A, B] and [S: X]',
			'Say why a commutator moves three pieces and leaves everything else alone',
			'Construct a three-cycle for a case you have never seen',
			'Spot the commutators hiding inside algorithms you already know'
		],
		body: [
			{
				kind: 'prose',
				text: 'Every algorithm on this site was constructed by somebody. They did not find them by trial and error, and there is no book they came from. This lesson is the tool they used, and it is the one thing in the expert track that changes what the cube is rather than how fast you finish it.'
			},
			{ kind: 'heading', text: 'The pattern' },
			{
				kind: 'prose',
				text: "A **commutator** is written `[A, B]` and means: do `A`, do `B`, undo `A`, undo `B`. If `A` is `R U R'` then undoing it is `R U' R'`, so `[R U R', D]` written out in full is `R U R' D R U' R' D'`."
			},
			{
				kind: 'prose',
				text: 'If `A` and `B` had nothing to do with each other — say `R` and `L` — the four parts would cancel and the cube would be untouched. All the interest is in what happens when they overlap slightly.'
			},
			{
				kind: 'note',
				tone: 'insight',
				title: 'Why so little survives',
				text: "Take the pieces `A` moves and the pieces `B` moves. Anything `A` touches that `B` leaves alone gets moved by `A` and put back by the `A'` — because nothing happened to it in between. The same argument runs for `B`. What cannot cancel is the handful of pieces both of them touch. Arrange for `A` and `B` to have exactly **one** piece in common and the survivors are exactly three pieces, cycled."
			},
			{ kind: 'heading', text: 'Three is the smallest number' },
			{
				kind: 'prose',
				text: 'You cannot swap two pieces and leave the rest of the cube alone — you met that as a beginner, as the reason a single flipped edge means somebody has taken the cube apart. Any sequence that restores everything else must move pieces in threes, or in pairs of pairs. So the three-cycle is the atom of cube algorithms, and the commutator is the machine that makes them.'
			},
			{ kind: 'heading', text: 'Interchange and insertion' },
			{
				kind: 'prose',
				text: 'In practice you build a commutator out of two named parts. The **interchange** is usually a single turn that carries one of your three pieces into the place of another. The **insertion** is a short sequence that reaches the third piece — and touches exactly one square the interchange also touches, which is the condition the whole thing rests on.'
			},
			{
				kind: 'prose',
				text: 'Take three corners: the two on the right of the top layer, and the one at the bottom-front-right underneath them.'
			},
			{
				kind: 'alg',
				moves: "R' D' R",
				caption:
					'The insertion. Three turns that reach into the bottom layer, lift a corner into the up-front-right and send the one that was there down. On its own it is vandalism — four corners and four edges out of place — but the up-front-right is the only square of the top layer it touches.'
			},
			{
				kind: 'alg',
				moves: 'U',
				caption:
					'The interchange. One turn, which carries the up-back-right corner into the up-front-right position, and everything else in the top layer round with it.'
			},
			{
				kind: 'alg',
				moves: "R' D' R U R' D R U'",
				caption:
					'Both of them in the commutator pattern. The corner at the up-front-right goes round to the up-back-right, the up-back-right one drops to the down-front-right, and the down-front-right one comes up to the up-front-right. Eight turns, three corners, and not one edge anywhere on the cube.'
			},
			{
				kind: 'prose',
				text: 'The two halves each wreck the cube and each undo their own wreckage. The only place the damage cannot cancel is the up-front-right corner, which is the one square both halves touch — and that single overlap is what produces the cycle.'
			},
			{
				kind: 'note',
				tone: 'warning',
				title: 'Two of the three arrive rotated',
				text: 'Look closely at that eight-turn sequence and the corners do not merely move — two of them are turned a third of the way round as they land. That is not a fault. Which sticker ends up where is part of what you are choosing when you pick an insertion, and it is why a three-cycle that leaves all three corners facing as you found them costs more turns. The A permutation you learnt as a beginner is nine.'
			},
			{ kind: 'heading', text: 'Edges, in four turns' },
			{
				kind: 'alg',
				moves: "M' U2 M U2",
				caption:
					"`[M', U2]`. The up-front edge drops to the down-front, the down-front goes round to the up-back, and the up-back comes to the up-front. No corner moves, no edge is flipped, and it costs four turns. This one is worth doing slowly and watching."
			},
			{
				kind: 'prose',
				text: 'Four turns for a three-cycle is close to the cheapest thing on the cube, and it is not a coincidence: the slice turn and the half turn of the top overlap in exactly one edge.'
			},
			{ kind: 'heading', text: 'Setting the case up' },
			{
				kind: 'prose',
				text: 'A commutator only cycles the three pieces it happens to reach. When the pieces you want are somewhere else, you move them into reach first and put everything back afterwards — a **conjugate**, written `[S: X]` and meaning `S`, then `X`, then undo `S`.'
			},
			{
				kind: 'alg',
				moves: "U M' U2 M U2 U'",
				caption:
					"`[U: [M', U2]]`. The setup turn brings a different edge into the slice's reach, the commutator cycles, and the setup is undone. Now it is the up-right, up-left and down-front edges that move. The last two turns collapse into one when you actually do it."
			},
			{
				kind: 'note',
				tone: 'tip',
				text: 'The setup does not have to be clever, and it should not be long. One or two turns is normal; three means you have probably picked the wrong commutator and should look for an interchange nearer the pieces.'
			},
			{ kind: 'heading', text: 'Building one for a case you have never seen' },
			{
				kind: 'prose',
				text: 'Here is the situation this pays for. You finish the first two layers and find a corner in the wrong slot — two corners in the bottom layer and one in the top all need to move round each other. No algorithm sheet covers it, because it is not a case anyone has named.'
			},
			{
				kind: 'steps',
				steps: [
					{
						text: 'Name the three pieces and where each has to end up. Say it out loud; the whole thing falls apart if you are vague about the cycle.'
					},
					{
						text: 'Find two of the three that a single turn swaps. That turn is your interchange. If no single turn does it, add a setup turn until one does.'
					},
					{
						text: 'Find a short sequence that carries the third piece into the place the interchange acts on, without touching the other two. Three turns is the usual length: out, across, back.',
						alg: "R' D' R"
					},
					{
						text: 'Write it in the pattern — insertion, interchange, insertion undone, interchange undone — and run it on a solved cube first.',
						alg: "R' D' R U R' D R U'"
					},
					{
						text: 'If the pieces land in the right places but facing the wrong way, keep the interchange and change the insertion. There is nearly always another route down.'
					}
				]
			},
			{
				kind: 'note',
				tone: 'warning',
				text: 'Test on a solved cube, every time, before you use it in a solve. A commutator that is nearly right is not partly useful — it is an eight-turn scramble. Running it three times should also bring a solved cube back to solved, which is a cheap way to check you have written it down correctly.'
			},
			{ kind: 'heading', text: 'Commutators hiding in your algorithms' },
			{
				kind: 'prose',
				text: 'Once you can see the pattern you will find it everywhere. The A permutation is a three-cycle of corners and can be written as two commutators stitched together. The E permutation is four corners in two swaps, and is built the same way. The T and Y permutations are a corner swap and an edge swap held together by a conjugate.'
			},
			{
				kind: 'prose',
				text: 'Some things are not commutators, and it is as useful to know which. Sune twists three corners **and** cycles three edges: it is not a three-cycle of anything, so no single commutator produces it. Changing orientation without moving pieces takes a pair of commutators working against each other, which is why the algorithms that do it are long.'
			},
			{
				kind: 'note',
				tone: 'history',
				text: 'The word is borrowed from group theory, where `[a, b] = a b a⁻¹ b⁻¹` measures how far two operations are from being interchangeable. If they commute, the expression collapses to nothing. A cube is interesting precisely because its turns mostly do not commute, and the commutator is the exact measurement of by how much.'
			},
			{
				kind: 'prose',
				text: 'This is the point where the cube stops being a list of cases. You will not stop using memorised algorithms — they are faster, and speed is a real thing to want — but you will stop believing that a case you have never seen is a case you cannot solve.'
			},
			{
				kind: 'jump',
				href: '/algorithms/commutators/',
				label: 'The commutator set',
				blurb:
					'A teaching sequence rather than a list to drill: interchanges, insertions and worked cycles.'
			},
			{
				kind: 'jump',
				href: '/notation/',
				label: 'Bracket notation in full',
				blurb: 'How `[A, B]`, `[S: X]` and the primes and repeats around them are written and read.'
			}
		]
	},

	{
		slug: 'blindfolded',
		title: 'Blindfolded, briefly',
		summary:
			'What a blind solve actually involves, why it is a memory problem rather than a turning one, and why commutators are the door into it.',
		track: 'expert',
		order: 65,
		minutes: 14,
		prerequisites: ['commutators'],
		outcomes: [
			'Describe what happens during memorisation and during execution',
			'Explain the buffer-and-target idea and why it turns a solve into a list',
			'Say what Old Pochmann costs and what three-style buys',
			'Decide whether to try it, with a realistic idea of what it takes'
		],
		body: [
			{
				kind: 'prose',
				text: 'You look at a scrambled cube for as long as you like, put on a blindfold, and solve it without looking again. The clock runs throughout, so memorisation is part of the time. The best in the world do the whole thing in under fifteen seconds. A first success usually takes a few minutes and a fortnight of evenings to arrive at.'
			},
			{
				kind: 'prose',
				text: 'It is worth a lesson here for one reason: it is the natural home of the commutators you have taken up, and it is the cheapest way to make them stick.'
			},
			{ kind: 'heading', text: 'Nothing is solved in order' },
			{
				kind: 'prose',
				text: 'A blind solve does not build a cross or a layer. One piece is chosen as the **buffer** — a fixed position, not a fixed piece — and everything happens through it. You look at what is sitting in the buffer, work out where that piece belongs, and send it there. Whatever comes back into the buffer is the next thing you deal with.'
			},
			{
				kind: 'prose',
				text: 'That turns a scramble into a list. Each position on the cube gets a letter, and the solve becomes a sequence of letters — where the buffer piece goes, then where the new buffer piece goes, and so on until the cycle closes. Eleven or so letters for the edges, seven or eight for the corners.'
			},
			{
				kind: 'note',
				tone: 'insight',
				title: 'Why it is a memory problem',
				text: 'Once the list exists, the turning is mechanical: each letter has a fixed answer. Nothing has to be recognised while the blindfold is on, because there is nothing to look at. That is why blind solvers talk about memorisation almost to the exclusion of everything else, and why their turning looks unhurried compared with a speedsolve.'
			},
			{ kind: 'heading', text: 'Two ways to execute' },
			{
				kind: 'prose',
				text: 'The traditional route is **Old Pochmann**, and it needs two algorithms you already have. Set the target position up so it sits where a known permutation will swap it with the buffer, run the permutation, undo the setup. Then the next letter.'
			},
			{
				kind: 'alg',
				moves: "R U R' U' R' F R2 U' R' U' R U R' F'",
				caption:
					'The T permutation. It swaps two corners and, more to the point here, swaps the up-right and up-left edges — so with the buffer kept at the up-right, any edge set up to the up-left can be sent home with it.'
			},
			{
				kind: 'alg',
				moves: "F R U' R' U' R U R' F' R U R' U' R' F R F'",
				caption:
					'The Y permutation, doing the same work for corners: it swaps two corners diagonally, and every corner target is set up to meet it.'
			},
			{
				kind: 'prose',
				text: 'The cost of Old Pochmann is turns. Every letter is a setup, a permutation of fourteen or seventeen turns, and the setup undone — so an execution runs to three hundred turns and beyond. It is reliable, it needs almost nothing new, and it will get you a first success.'
			},
			{
				kind: 'prose',
				text: 'The fast route is **three-style**: instead of one target at a time, you take them two at a time with a commutator. Three pieces cycle — the buffer and both targets — in eight to twelve turns rather than forty. A whole solve comes down to something like a third of the turning.'
			},
			{
				kind: 'note',
				tone: 'insight',
				title: 'This is why commutators are the door',
				text: 'Three-style is not a set of four hundred memorised algorithms, though people do end up knowing several hundred. It is the commutator method applied to whichever pair of targets comes next, worked out at the table to begin with and remembered through use. Everything in the previous lesson is the whole of the technique; blind solving is where it earns its keep.'
			},
			{ kind: 'heading', text: 'Memorising the list' },
			{
				kind: 'prose',
				text: 'Twenty letters do not stay in your head as letters. They are taken in **pairs**, and each pair is turned into a word or an image — two letters, one picture — and the pictures are hung along a route you know well: the rooms of your house, the walk to work. Recall the route and the pictures come back in order.'
			},
			{
				kind: 'list',
				ordered: true,
				items: [
					'**Corners first.** Eight pieces, five or six letters, one journey. A corners-only blind solve is a real achievement and it comes in about a week.',
					'**Then edges.** Twice the letters and the same technique, which is why doing corners first is the sensible order.',
					'**Then both, sighted.** Memorise properly, then solve with your eyes open and check the letters as you go. It catches the memory mistakes without wasting an attempt.',
					'**Then the blindfold.** By this point the only new thing is the dark.'
				]
			},
			{
				kind: 'note',
				tone: 'warning',
				title: 'Parity, and the one wrong letter',
				text: 'An odd number of targets leaves two pieces swapped at the end, which one extra algorithm fixes — that part is routine. The genuine frustration is that a single wrong letter leaves the cube scrambled with no clue as to where it went wrong. Do the sighted runs. They are not a lesser version of the attempt; they are how you find out that your letter scheme has two positions sharing a name.'
			},
			{ kind: 'heading', text: 'What it does to your cubing' },
			{
				kind: 'prose',
				text: 'You stop seeing faces. A cube stops being six coloured sides and becomes twenty pieces with places to be, which is what it was all along and what the very first lesson on this site said. Most people find their sighted solving improves for reasons they cannot quite point to.'
			},
			{
				kind: 'prose',
				text: 'It is also the least equipment-dependent thing in cubing. No fast turning, no tension tuning, no timer pressure — a chair, a cube and a strip of cloth, and something worth being pleased about at the end of it.'
			},
			{
				kind: 'jump',
				href: '/algorithms/commutators/',
				label: 'Commutators, worked through',
				blurb: 'The interchange-and-insertion patterns that three-style is built from.'
			},
			{
				kind: 'jump',
				href: '/learn/',
				label: 'Back to the tracks',
				blurb: 'Four tracks, with what each one assumes and what it gives you back.'
			}
		]
	}
];
