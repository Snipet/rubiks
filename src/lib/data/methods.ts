/**
 * The methods people actually use.
 *
 * Method comparisons on the web tend to be written by someone defending the
 * method they use, which is how a beginner ends up believing that Roux is
 * "objectively more efficient" or that CFOP is "just memorisation". Both claims
 * contain a fact and hide a cost. Every entry here is written to include the
 * cost: the `cons` are not softened, and `suitedTo` names a person rather than
 * hedging.
 *
 * Move counts are typical full solves in the half-turn metric for a competent
 * solver of that method, not records and not theoretical minimums. Algorithm
 * counts are what you need for the complete method, with the reduced route noted
 * where one exists — the difference between them is usually the difference
 * between a fortnight and a year.
 *
 * The methods are ordered the way a person meets them, not by any ranking.
 */

import type { SolvingMethod } from './types';

export const METHODS: readonly SolvingMethod[] = [
	{
		id: 'layer-by-layer',
		name: 'Layer by layer',
		alsoKnownAs: ['LBL', 'the beginner method'],
		inventor: 'No single author; the version most people learnt comes from David Singmaster',
		year: '1979 onwards',
		summary:
			'Solve the cube one layer at a time, bottom to top, using a handful of short algorithms that each leave the finished layers alone. It is the only method here you can be taught in an afternoon, and the only one nobody keeps.',
		steps: [
			{
				name: 'White cross',
				detail:
					'Four white edges around the white centre on the bottom, each matching the centre beside it. No algorithm — this step is worked out, and it is worth working out rather than being shown.'
			},
			{
				name: 'Bottom corners',
				detail:
					'Bring each white corner above its slot and repeat a short sequence until it drops in the right way up. The same six-move trigger handles every case.'
			},
			{
				name: 'Middle edges',
				detail:
					'Send each middle-layer edge down from the top with one algorithm and its mirror. This is the step that costs the method its move count: the edge goes in, and a corner comes out and goes back.'
			},
			{
				name: 'Yellow cross',
				detail:
					'Flip the top edges yellow-side-up with one algorithm applied once, twice or three times depending on what you started with.'
			},
			{
				name: 'Yellow face',
				detail:
					'Orient the top corners with Sune, repeated from a particular sticker until the whole face is yellow.'
			},
			{
				name: 'Corner positions',
				detail:
					'Cycle three top corners into their correct places, ignoring which way round they are. This is the A permutation, and it survives into CFOP unchanged.'
			},
			{
				name: 'Edge positions',
				detail:
					'Cycle the last three edges. This is the U permutation, and it also survives into CFOP.'
			}
		],
		moveCount: '100–120 moves',
		algCount: '4–7',
		pros: [
			'The fewest algorithms of any complete method, and the shortest ones.',
			'Every step visibly finishes something, so you can tell whether it worked without knowing any theory.',
			'Nothing learnt here has to be unlearnt: three of the algorithms are used unchanged in CFOP, and the rest of the ideas transfer.',
			'It can be reasoned about. If you lose your place you can look at the cube and see which step you are on.',
			'It is teachable. You can show someone else the whole method over a coffee, which is worth more than it sounds.'
		],
		cons: [
			'Roughly twice the moves of a modern method, and most of the excess is in the middle layer, where a corner is pulled out and replaced for every single edge.',
			'The last layer takes four separate algorithms and a lot of looking, which is where the pauses live.',
			'It caps out somewhere around forty seconds. Past that point every second comes from replacing part of the method rather than from practising it.',
			'The step order works against lookahead — each step ends with a completed layer you then stop and stare at.',
			'The two-stage top-corner routine is fiddly to recognise and is the first thing everyone gets wrong.'
		],
		suitedTo:
			'Your first cube, and your first few hundred solves. Learn it properly, get comfortable finishing a cube unaided, then replace the middle layer with F2L and the top with two-look OLL and PLL — in that order, one at a time.',
		tier: 'beginner'
	},

	{
		id: 'cfop',
		name: 'CFOP',
		alsoKnownAs: ['Fridrich', 'Fridrich method'],
		inventor: 'Jessica Fridrich, building on work by Hans Dockhorn, Anneke Treep and others',
		year: 'Assembled through the 1980s, published on the web in 1997',
		summary:
			'Cross, F2L, OLL, PLL. Build the cross, fill the four slots a pair at a time to finish two layers, turn the top face one colour with one algorithm, then permute it with another. It is what nearly every fast solver uses, and it wins on turning speed rather than on efficiency.',
		steps: [
			{
				name: 'Cross',
				detail:
					'Four bottom edges, ideally planned entirely during inspection and executed without looking. Around eight moves for a solver who plans it, and it should be the least of your worries by the time you are fast.'
			},
			{
				name: 'F2L',
				detail:
					'Join each bottom corner to its middle edge in the top layer and insert the pair in one movement. 41 cases, all of which can be worked out from three or four principles rather than memorised. This step is over half the solve and is where the time is won.'
			},
			{
				name: 'OLL',
				detail:
					'One algorithm turns the whole top face yellow, ignoring where the pieces end up. 57 cases in full; ten if you do the edges and then the corners as two separate looks.'
			},
			{
				name: 'PLL',
				detail:
					'One algorithm moves the top pieces to their proper places. 21 cases in full; six for the two-look route, which does the corners and then the edges.'
			}
		],
		moveCount: '55–60 moves',
		algCount: '78 in full (16 for the two-look route)',
		pros: [
			'Better documented than everything else on this page put together. Whatever you are stuck on, someone has written about it.',
			'The two-look route is a genuine method in itself, so there is a working cube at every stage of learning rather than a cliff.',
			'F2L is intuitive and transfers to every other method — the time spent on it is never wasted, even if you switch later.',
			'The algorithms are R and U heavy, which is what hands are good at, and the finger tricks are well worked out.',
			'Progress is measurable. Learning ten more OLL cases produces a change you can see in a session average.',
			'Almost everyone you will meet at a competition uses it, so help is available in the room.'
		],
		cons: [
			'Seventy-eight algorithms is a great deal of memorising, and the rarer OLL cases come up roughly once in fifty-seven solves, so they rot between sightings.',
			'The highest move count of any modern method here. It is fast because the moves are quick, not because there are few of them.',
			'The cross and F2L involve a lot of cube rotations, and the last slot in particular tends to need one.',
			'The last layer is two looks and stays two looks. Reducing it to one means ZBLL, which is 493 more cases.',
			'It tempts beginners into learning full OLL far too early. Learnt before F2L is smooth, it buys nothing and eats months.'
		],
		suitedTo:
			'Almost anyone who wants to be fast and would rather practise than research. If you have no particular reason to choose otherwise, choose this one — it is what the advanced track on this site teaches, and the reason is availability of help rather than superiority.',
		tier: 'intermediate'
	},

	{
		id: 'roux',
		name: 'Roux',
		inventor: 'Gilles Roux',
		year: '2003',
		summary:
			'Two 1×2×3 blocks, then the last-layer corners in one algorithm, then the six remaining edges with nothing but M and U turns. Roughly ten fewer moves per solve than CFOP, paid for with a first half that has to be thought through rather than executed.',
		steps: [
			{
				name: 'First block',
				detail:
					'A 1×2×3 block on the left-hand side: three edges, two corners, one centre. Entirely intuitive, and the hardest thing on this page to learn to plan.'
			},
			{
				name: 'Second block',
				detail:
					'The mirror block on the right, built with R, U and M turns while leaving the first one intact. Also intuitive, and rather harder than the first because you now have constraints.'
			},
			{
				name: 'CMLL',
				detail:
					'All four last-layer corners in a single algorithm — 42 cases — with no obligation to preserve the middle slice, which is what makes these algorithms shorter than their CFOP equivalents.'
			},
			{
				name: 'Last six edges',
				detail:
					'Four top edges, two bottom edges and the centres, finished with M and U turns alone. Usually taken as orient, then place the two side edges, then cycle the rest. Almost no memorisation, but real technique.'
			}
		],
		moveCount: '45–50 moves',
		algCount: '42 for CMLL, plus about a dozen for the edges',
		pros: [
			'The lowest move count of the mainstream speed methods, which means you can be quick without turning quickly. It suits people whose hands are not fast.',
			'No cube rotations after the blocks, and no D-layer turns at all in the second half.',
			'Two-thirds of the solve is intuitive, so you finish understanding the cube rather than reciting it.',
			'The last six edges need barely any algorithms, and the ones there are come out of the same M-and-U vocabulary.',
			'Excellent for fewest-moves practice and for anyone who enjoys planning more than drilling.',
			'Once the M-slice technique is there, the low move count makes it strong one-handed.'
		],
		cons: [
			'Block building has no procedure, only practice. Progress is slow, hard to measure, and there is nothing to memorise your way through a bad week with.',
			'M-slice turning is awkward until you have built a grip most people have never used, and it is genuinely difficult one-handed for a beginner — the opposite of the reputation the method has among people who already have it.',
			'A stiff or badly tensioned cube fights the M slice harder than it fights anything in CFOP.',
			'CMLL recognition is unfamiliar: you are reading corners while the middle slice is still a mess, and that takes weeks to stop being slow.',
			'Far less material, far fewer trainers, and far fewer people in the room who can look at your solve and tell you what went wrong.',
			'The last step can go wrong in ways that are hard to diagnose, because everything is in one slice and nothing is labelled.'
		],
		suitedTo:
			'Someone who would rather solve a puzzle than run a drill, is willing to be slower than their friends for a couple of months, and is not working to a deadline. It is also the strongest choice if your hands cannot turn quickly, because it asks for fewer turns rather than faster ones.',
		tier: 'advanced'
	},

	{
		id: 'zz',
		name: 'ZZ',
		inventor: 'Zbigniew Zborowski',
		year: '2006',
		summary:
			'Orient all twelve edges in the very first step, and everything afterwards can be done with R, U, L and D turns — no F, no B, and almost no rotations. Comfortable, quick turning, bought with the hardest first step to learn to see.',
		steps: [
			{
				name: 'EOLine',
				detail:
					'Orient all twelve edges while placing the two bottom edges that sit under F and B. Around six to eight moves, and months of learning to recognise. Nothing later works if this goes wrong.'
			},
			{
				name: 'Left and right blocks',
				detail:
					'Finish the first two layers in two 1×2×3 halves using only R, U, L and D turns. Because every edge is oriented, no pair ever needs flipping, and no rotation is ever needed.'
			},
			{
				name: 'Last layer',
				detail:
					'The last-layer edges arrive already oriented, so seven corner-orientation cases and 21 permutations finish it. The intended endgame is ZBLL: one algorithm for the whole layer, 493 cases.'
			}
		],
		moveCount: '50–55 moves',
		algCount: '28 for a working solve (493 more for ZBLL)',
		pros: [
			'No F or B turns after the first step and essentially no rotations, so the turning is faster and more comfortable than CFOP at the same skill.',
			'Last-layer edges are oriented for free, which removes a whole class of OLL and makes ZBLL reachable in a way it is not from CFOP.',
			'Very strong one-handed, for the same reason: everything is R, U and D.',
			'Pairs never need flipping during the first two layers, which makes them quicker to plan and quicker to see.',
			'Move count is a little below CFOP without giving up algorithmic execution.'
		],
		cons: [
			'EOLine is the steepest learning curve of any first step. Edge orientation is invisible until you have trained your eyes for it, and that takes weeks in which your times get worse.',
			"The payoff arrives late. Without ZBLL the last layer is no better than CFOP's, so the first several months of ZZ are effort with modest reward.",
			'A misjudged EOLine cannot be recovered from — you notice at the last layer, and by then it is over.',
			'Blocks are less forgiving than a cross: there is no single "keep going" move when the plan collapses.',
			"The material is thinner than CFOP's and the community smaller, though far larger than Petrus or Mehta."
		],
		suitedTo:
			'Someone already solving comfortably in the twenties with CFOP who likes the idea of never turning F again, and who is honestly interested in the ZBLL project rather than merely impressed by it. Learning ZZ for the first two layers alone is a reasonable amount of work for a small gain.',
		tier: 'advanced'
	},

	{
		id: 'petrus',
		name: 'Petrus',
		inventor: 'Lars Petrus',
		year: '1981',
		summary:
			'Grow a 2×2×2 block into a 2×2×3, orient all the edges, finish the first two layers, and solve the last layer. The method that taught the community block building, still one of the most move-efficient, and now used by almost nobody for speed.',
		steps: [
			{
				name: '2×2×2 block',
				detail:
					'Any corner and its three edges, anywhere on the cube. Entirely free-form, which is what makes it both elegant and hard to plan in fifteen seconds.'
			},
			{
				name: 'Extend to 2×2×3',
				detail:
					'Add a second corner and two more edges to the block. Still intuitive, still no algorithms, and slower to recognise than anything in CFOP.'
			},
			{
				name: 'Orient the edges',
				detail:
					'Flip the remaining edges so every one is oriented, using a small set of short sequences. From here the whole cube can be finished with R, U and L turns.'
			},
			{
				name: 'Finish the first two layers',
				detail:
					'Two more pairs into the remaining slots, without F or B turns and without rotations.'
			},
			{
				name: 'Last layer',
				detail:
					'Classically taken in three looks — corner positions, corner orientations, then edges — which keeps the algorithm count tiny. Modern practitioners bolt on COLL and EPLL, or ZBLL.'
			}
		],
		moveCount: '45–50 moves',
		algCount: '10 in the classic form, around 30 with a modern ending',
		pros: [
			'Among the most move-efficient methods here, and the ideas behind it underpin both Roux and ZZ.',
			'Almost entirely intuitive up to the last layer, so it builds genuine understanding of how pieces move.',
			'The early edge orientation gives the same F-free, rotation-free turning that ZZ is known for — Petrus had it twenty-five years first.',
			'Outstanding for fewest-moves solving, where planning matters and the clock does not.',
			'You can be solving with fewer than ten algorithms, which is remarkable for a method this efficient.'
		],
		cons: [
			'Barely anyone uses it for speed now, so modern material is scarce and trainers are homemade or absent.',
			'The free-form 2×2×2 start is the hardest step on this page to plan inside fifteen seconds of inspection, because there is no fixed target to look for.',
			'Block extension is slow to recognise and produces long pauses that a stopwatch punishes.',
			'The classic three-look last layer means three separate recognitions, and pauses cost more than moves do.',
			'It has largely been absorbed: Roux took the blocks, ZZ took the edge orientation, and each of them refined the part it took.'
		],
		suitedTo:
			'People who care about elegance and efficiency more than about a session average, and anyone taking up fewest-moves as an event. It is a fine method to understand and a poor one to choose if the goal is a fast time this year.',
		tier: 'advanced'
	},

	{
		id: 'mehta',
		name: 'Mehta',
		inventor: 'Yash Mehta',
		year: '2020',
		summary:
			'A Roux-style first block, then the middle-layer belt, then the whole remainder in algorithmic steps: orient the edges, orient six corners, permute six corners, permute five edges. Roux move counts with CFOP-style execution, and the newest method here by twenty years.',
		steps: [
			{
				name: 'First block',
				detail:
					'The same 1×2×3 block on the bottom left that Roux begins with, and it inherits the same learning curve.'
			},
			{
				name: 'Three quarters belt',
				detail:
					'Three of the four middle-layer edges, placed intuitively. The cube is now a block plus most of a belt, which is a shape nothing else here produces.'
			},
			{
				name: 'EOLE',
				detail:
					'Orient the last-layer edges while inserting the final belt edge, in one algorithm. 44 cases, and the step that gives the method its character.'
			},
			{
				name: '6CO',
				detail: 'Orient all six remaining corners at once. 26 cases.'
			},
			{
				name: '6CP',
				detail: 'Permute those six corners. 27 cases, and the least familiar recognition here.'
			},
			{
				name: 'L5EP',
				detail: 'Permute the last five edges. 16 cases, all short.'
			}
		],
		moveCount: '45–50 moves',
		algCount: 'About 110 for the usual route',
		pros: [
			'Roux-level move counts with algorithmic execution, so the efficiency does not depend on planning well under pressure.',
			'The belt approach avoids the M-slice endgame entirely — no last-six-edges technique to build.',
			'Turning is R, U and D with no rotations, which is comfortable and strong one-handed.',
			'The steps are short and the recognitions are all on the same few pieces, so the solve flows once the cases are in.',
			'Genuinely new thinking, and the small community around it is unusually willing to help.'
		],
		cons: [
			'It is only a few years old and it shows. Documentation is thin, trainers are homemade, and there is no settled agreement on the best route through the middle of it.',
			'Around 110 algorithms — comparable to full CFOP — for a method with a fraction of the support behind it.',
			'6CO and 6CP recognition is unlike anything else, so there is nothing to transfer in and nothing to transfer out.',
			'Almost no significant competition results have been set with it, so its ceiling is currently a matter of argument rather than evidence.',
			'The first block is a Roux block, so you take on that learning curve before you reach any of the parts that make the method distinctive.'
		],
		suitedTo:
			'Someone already fast with another method who finds a new idea more appealing than a better time, and who is content to be an early adopter — writing your own notes, building your own drills, and accepting that some of it may not survive.',
		tier: 'expert'
	}
];

/** Look one up by id. */
export function methodById(id: string): SolvingMethod | undefined {
	return METHODS.find((m) => m.id === id);
}
