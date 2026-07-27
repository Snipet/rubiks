/**
 * The vocabulary.
 *
 * Cubing has a large private language and very little of it is written down in
 * one place, which is how a beginner ends up reading a forum post about "sub-15
 * with bad lookahead and a regrip in the sledgehammer" and giving up. Every entry
 * here is written to be read cold: what the word means, and — where there is one
 * — the thing people get wrong about it.
 *
 * Entries are authored grouped by category, because duplicates and gaps show up
 * fastest that way. The page sorts them alphabetically. Anything in `see` must
 * match another entry's `term` exactly; the glossary page links them by name.
 */

import type { GlossaryEntry } from './types';

export const GLOSSARY: readonly GlossaryEntry[] = [
	// --- Notation ------------------------------------------------------------
	{
		term: 'Notation',
		aliases: ['move notation', 'Singmaster notation'],
		category: 'notation',
		definition:
			"The shared language for writing turns: `U R F D L B` for the six faces, `'` for anticlockwise, `2` for a half turn, `M E S` for the slices and `x y z` for whole-cube rotations. It names positions rather than colours, which is why the same algorithm works whichever way round you are holding the cube. Devised by David Singmaster in 1979 and essentially unchanged since.",
		see: ['Prime', 'Wide turn', 'Slice turn', 'Cube rotation']
	},
	{
		term: 'Prime',
		aliases: ["'", 'apostrophe', 'inverse'],
		category: 'notation',
		definition:
			'The mark after a letter that means "the other way round". `R\'` is the same quarter turn as `R` taken anticlockwise, and it undoes it. Said aloud as "R prime". A half turn never takes one, because `R2` covers the same ground in either direction.',
		see: ['Notation', 'Algorithm']
	},
	{
		term: 'Wide turn',
		aliases: ['double-layer turn', 'Rw', 'r'],
		category: 'notation',
		definition:
			"A turn of a face together with the slice behind it — two of the three layers at once, going the way the outer face goes. Written `Rw` or as a lowercase `r`; the two spellings mean the same thing and this site lets you choose which one you see. A wide turn is exactly its face plus the parallel slice: `Rw` is `R M'`.",
		see: ['Slice turn', 'Cube rotation', 'Notation']
	},
	{
		term: 'Slice turn',
		aliases: ['M', 'E', 'S', 'middle slice', 'M slice'],
		category: 'notation',
		definition:
			'A turn of a middle layer on its own, with both outer faces held still. `M` is the slice between L and R and follows `L`; `E` is the slice between U and D and follows `D`; `S` is the slice between F and B and follows `F`. Those three directions are the part everyone forgets, so they are worth learning as three separate facts rather than one rule.',
		see: ['Wide turn', 'Cube rotation', 'Notation']
	},
	{
		term: 'Cube rotation',
		aliases: ['x', 'y', 'z', 'rotation'],
		category: 'notation',
		definition:
			'Turning the whole cube in your hands rather than turning a layer. `x` follows `R`, `y` follows `U`, `z` follows `F`. No piece moves relative to any other, but every letter that follows now means a different face — which is the entire point of doing one.',
		see: ['Notation', 'AUF', 'Regrip']
	},

	// --- Methods -------------------------------------------------------------
	{
		term: 'CFOP',
		aliases: ['Fridrich', 'Fridrich method'],
		category: 'method',
		definition:
			'Cross, F2L, OLL, PLL — the method nearly every fast solver uses. Build a cross on the bottom, fill the four slots to finish two layers, turn the top face one colour with one algorithm, then move the top pieces into place with another. Named after Jessica Fridrich, who worked it out and published it in the 1990s, though several of the pieces existed before her.',
		see: ['Cross', 'F2L', 'OLL', 'PLL', 'Roux', 'ZZ']
	},
	{
		term: 'Roux',
		category: 'method',
		definition:
			'A method built from blocks rather than layers: a 1×2×3 block on the left, a second on the right, the last-layer corners, and finally the six remaining edges using nothing but `M` and `U`. Far fewer algorithms than CFOP and noticeably fewer moves, at the cost of a first half you have to think your way through. Devised by Gilles Roux.',
		see: ['CFOP', 'ZZ', 'Block', 'CMLL', 'Slice turn']
	},
	{
		term: 'ZZ',
		category: 'method',
		definition:
			'A method that orients all twelve edges during the first step, so that everything afterwards can be done with `R`, `U`, `L` and `D` turns alone — no `F`, no `B`, and almost no rotations. The turning is quick and comfortable; the price is a first step that takes real practice to see. Devised by Zbigniew Zborowski.',
		see: ['Edge orientation', 'CFOP', 'Roux', 'ZBLL']
	},
	{
		term: 'Layer by layer',
		aliases: ['LBL', 'beginner method'],
		category: 'method',
		definition:
			'Solving the cube one layer at a time: bottom, middle, top. It needs the fewest algorithms of any complete method, and every one of them reappears in CFOP later, which is why it is what this site teaches first. Slow, but nothing learnt in it has to be unlearnt.',
		see: ['CFOP', 'Cross', 'First two layers', 'Last layer']
	},
	{
		term: 'Cross',
		category: 'method',
		definition:
			'The first step of CFOP: four edges of one colour placed around their centre on the bottom, each with its second colour matching the centre beside it. That last condition is the one beginners skip, and skipping it makes everything after it impossible. On this site the cross is white and stays on the bottom throughout.',
		see: ['CFOP', 'F2L', 'Inspection']
	},
	{
		term: 'F2L',
		category: 'method',
		definition:
			'The second step of CFOP, and the one where most of the time is won or lost. Instead of placing the four bottom corners and then the four middle edges, you join each corner to its edge in the top layer and drop the pair into its slot in one movement. There are 41 cases, and all of them can be worked out rather than memorised.',
		see: ['Pair', 'Slot', 'First two layers', 'Lookahead', 'CFOP']
	},
	{
		term: 'First two layers',
		category: 'method',
		definition:
			'The bottom two layers taken as a unit: the cross, the four bottom corners and the four middle edges — eight of the twenty moving pieces. Every method finishes them before touching the last layer. **F2L** is the particular way CFOP goes about it; the phrase describes the state of the cube, the abbreviation describes the technique.',
		see: ['F2L', 'Last layer', 'Layer by layer']
	},
	{
		term: 'Last layer',
		aliases: ['LL'],
		category: 'method',
		definition:
			'The final eight pieces, sitting on the top face once the first two layers are done. Methods differ mostly in how many algorithms you are willing to memorise to finish them: four short ones in the beginner route, two in CFOP, one in ZBLL.',
		see: ['OLL', 'PLL', 'ZBLL', 'COLL', 'AUF']
	},
	{
		term: 'OLL',
		aliases: ['orientation of the last layer'],
		category: 'method',
		definition:
			'Turning the whole top face one colour, without caring where any piece ends up. 57 cases in full; two-look OLL does the edges and then the corners and needs ten. OLL diagrams are drawn in two shades rather than six colours because the colours genuinely do not matter yet.',
		see: ['PLL', 'Sune', 'Orientation', 'Last layer', 'COLL']
	},
	{
		term: 'PLL',
		aliases: ['permutation of the last layer'],
		category: 'method',
		definition:
			'Moving the last-layer pieces to their proper places once the top is a single colour. 21 cases, each with a letter name — T, Y, Jb, and so on. Two-look PLL sorts the corners first and needs six of them.',
		see: ['OLL', 'Permutation', 'Headlights', 'AUF', 'Last layer']
	},
	{
		term: 'CMLL',
		category: 'method',
		definition:
			'Corners of the last layer, solved in one algorithm while the middle slice is still unsolved — the third step of Roux. 42 cases. Because the `M` slice is going to be fixed afterwards anyway, the algorithms are free to disturb it, and that freedom is what makes them shorter than their CFOP equivalents.',
		see: ['Roux', 'COLL', 'Last layer']
	},
	{
		term: 'COLL',
		category: 'method',
		definition:
			'Orienting and permuting the last-layer corners in a single algorithm, in the case where the last-layer edges are already oriented. 42 cases, and the usual first project after full CFOP: the four edge cases that remain afterwards are ones you already know.',
		see: ['OLL', 'PLL', 'CMLL', 'ZBLL']
	},
	{
		term: 'ZBLL',
		category: 'method',
		definition:
			'Finishing the entire last layer with one algorithm, given that its edges came out of F2L already oriented. 493 cases. It is a long project undertaken as much for the pleasure of it as for the second or two it saves.',
		see: ['COLL', 'Edge orientation', 'Last layer', 'ZZ']
	},

	// --- Technique -----------------------------------------------------------
	{
		term: 'Algorithm',
		aliases: ['alg'],
		category: 'technique',
		definition:
			'A memorised sequence of turns that changes a few pieces and leaves everything else exactly as it was. The second half of that sentence is the useful half: an algorithm earns its place by what it does not disturb.',
		see: ['Trigger', 'Commutator', 'Cancellation', 'Notation']
	},
	{
		term: 'Trigger',
		category: 'technique',
		definition:
			"A short run of moves your hands perform as one unit rather than as separate turns — `R U R'`, `R U' R'`, `F R U`. Long algorithms take far less holding in your head as three or four triggers than as fourteen letters, and quick turning is mostly a matter of owning plenty of them.",
		see: ['Sexy move', 'Sledgehammer', 'Finger trick', 'Algorithm']
	},
	{
		term: 'Sexy move',
		category: 'technique',
		definition:
			"The trigger `R U R' U'`. It is the first sequence most people learn, it hides inside a remarkable number of algorithms, and six repetitions of it bring the cube back to where it started.",
		see: ['Trigger', 'Sledgehammer', 'Sune']
	},
	{
		term: 'Sledgehammer',
		aliases: ['hedgeslammer'],
		category: 'technique',
		definition:
			"The trigger `R' F R F'`. Its inverse, `F R' F' R`, is called the hedgeslammer, and cubers are quite pleased with themselves about that. Both appear all over F2L and OLL, and knowing them by feel saves reading four letters every time.",
		see: ['Trigger', 'Sexy move', 'F2L']
	},
	{
		term: 'Sune',
		category: 'technique',
		definition:
			"The last-layer case solved by `R U R' U R U2 R'`, and the algorithm itself. It twists three corners one way and leaves the fourth alone, and repeating it is how the beginner method orients corners without a second algorithm. Named by Lars Petrus, who called several of his cases after Swedish first names.",
		see: ['Anti-sune', 'OLL', 'Trigger', 'Headlights']
	},
	{
		term: 'Anti-sune',
		aliases: ['antisune'],
		category: 'technique',
		definition:
			"The sune's mirror, `R U2 R' U' R U' R'`, twisting three corners the other way. The two cases are muddled constantly. Check which way the corners are twisted rather than trusting the shape at a glance: running the wrong one of the pair leaves you further from a finished cube than you were.",
		see: ['Sune', 'OLL']
	},
	{
		term: 'AUF',
		aliases: ['adjust upper face', 'adjust U face'],
		category: 'technique',
		definition:
			'Adjusting the Upper Face: the `U` turn before an algorithm that lines the case up, or the one after it that finishes the job when every piece is in the right order but the whole layer is rotated. It is not part of the algorithm and never counted in its move count, which is why a solve can end with one turn still to make.',
		see: ['PLL', 'Last layer', 'Cube rotation']
	},
	{
		term: 'Lookahead',
		category: 'technique',
		definition:
			'Watching for the pieces you will need next while your hands are still finishing the ones you are on. It is the largest single difference between a fast solve and a slow one, and it is trained by turning more slowly rather than faster — you cannot look ahead at a speed your eyes cannot follow.',
		see: ['F2L', 'Slot', 'Inspection']
	},
	{
		term: 'Regrip',
		category: 'technique',
		definition:
			'Letting go and re-taking the cube part-way through an algorithm. Each one costs time, so algorithms are often chosen for having few of them rather than for being shortest: a fourteen-move sequence your hands can run in one breath beats an eleven-move one that needs two regrips.',
		see: ['Finger trick', 'Algorithm', 'One-handed']
	},
	{
		term: 'Finger trick',
		aliases: ['fingertrick', 'fingertricks'],
		category: 'technique',
		definition:
			'Making a turn with a push or a flick of one finger instead of moving the whole hand — `U` with the left index finger, `R` with the right ring finger, and so on. Worth learning early, because unlearning the habit of turning from the wrist takes far longer than learning it properly the first time.',
		see: ['Trigger', 'Regrip', 'One-handed']
	},
	{
		term: 'Slot',
		category: 'technique',
		definition:
			'One of the four gaps in the first two layers that holds a bottom corner and the edge beside it. Filling all four completes the bottom two layers. Solvers talk about the "front-right slot" because that is where most F2L algorithms expect the pair to go in.',
		see: ['F2L', 'Pair', 'Block']
	},
	{
		term: 'Pair',
		category: 'technique',
		definition:
			'A corner and its matching edge joined together in the top layer, ready to be dropped into their slot. Making the pair and inserting it are the two halves of every F2L case, and seeing them as one motion rather than two is most of what makes F2L quick.',
		see: ['F2L', 'Slot', 'Lookahead']
	},
	{
		term: 'Block',
		category: 'technique',
		definition:
			'Two or more pieces already correct relative to each other and moved about as a unit. Block building is the organising idea behind Roux: rather than filling fixed slots in a fixed order, you grow correct chunks wherever the scramble happens to have left them.',
		see: ['Roux', 'Pair', 'Slot']
	},
	{
		term: 'Headlights',
		category: 'technique',
		definition:
			'Two corners showing the same colour on one side of the last layer, with a different colour between them — a pair of headlights looking at you. Spotting them is how most people recognise PLL cases, and several OLL ones.',
		see: ['PLL', 'OLL', 'Sune']
	},
	{
		term: 'Cancellation',
		category: 'technique',
		definition:
			"When the end of one algorithm and the start of the next undo part of each other, so the pair costs fewer moves than the two of them written out. An algorithm ending in `U'` followed by one beginning `U2` needs a single `U` between them instead of two turns. Fewest-moves solvers hunt for cancellations on purpose; speedsolvers get them by luck and take them gratefully.",
		see: ['Algorithm', 'AUF', 'FMC']
	},

	// --- Theory --------------------------------------------------------------
	{
		term: 'Orientation',
		category: 'theory',
		definition:
			'Which way a piece is facing, as distinct from where it sits. A corner in exactly the right place can still be twisted two ways, and an edge in the right place can still be flipped. Solving means fixing both, which is why nearly every method splits the last layer into an orientation step and a permutation step.',
		see: ['Permutation', 'OLL', 'Edge orientation']
	},
	{
		term: 'Permutation',
		category: 'theory',
		definition:
			'Where the pieces are, as distinct from which way they face. A cube can have every piece perfectly oriented and still be thoroughly scrambled, and the final step of most methods does nothing but move pieces between places.',
		see: ['Orientation', 'PLL', 'Parity']
	},
	{
		term: 'Parity',
		category: 'theory',
		definition:
			'Whether a permutation takes an odd or an even number of swaps to undo. On a 3×3 the corners and edges always agree, so positions that look impossible really are impossible — meet one and either a piece has been forced or the cube has been taken apart and rebuilt wrong. On 4×4 and larger the identical centres hide a swap, and that is where parity algorithms come from.',
		see: ['Permutation', 'Big cubes', 'Commutator']
	},
	{
		term: 'Commutator',
		category: 'theory',
		definition:
			"A sequence of the shape `A B A' B'`: do one thing, do another, undo the first, undo the second. When A and B overlap in only a couple of pieces, everything else cancels and the result disturbs almost nothing — which is how three-piece cycles are built, and why the sexy move looks the way it does.",
		see: ['Conjugate', 'Algorithm', 'Sexy move']
	},
	{
		term: 'Conjugate',
		category: 'theory',
		definition:
			"A sequence of the shape `A B A'`: set something up, do the work, put the setup back. Most algorithms are a conjugate wrapped round a commutator, and reading a long one that way is usually what makes it stick.",
		see: ['Commutator', 'Algorithm']
	},
	{
		term: "God's number",
		category: 'theory',
		definition:
			'The largest number of moves any position can need, given perfect play: twenty, counting half turns as one move, or twenty-six if only quarter turns count. Proved in 2010 with a great deal of borrowed computing time. No human method comes near it — a tidy CFOP solve runs to about sixty.',
		see: ['Random state', 'Superflip', 'FMC']
	},
	{
		term: 'Superflip',
		category: 'theory',
		definition:
			'The position in which every piece is at home and all twelve edges are flipped. It needs the full twenty moves, which makes it one of the hardest positions there is, and it is unreasonably pleasant to look at.',
		see: ["God's number", 'Orientation', 'Parity']
	},
	{
		term: 'Random state',
		category: 'theory',
		definition:
			'A scramble made by choosing a legal position uniformly at random and then working out a sequence that reaches it, rather than by shuffling out a list of turns. Competition scrambles are random-state, which is why they run to about twenty moves and never accidentally leave half the cube solved.',
		see: ['Scramble', 'WCA', "God's number"]
	},
	{
		term: 'Edge orientation',
		aliases: ['EO'],
		category: 'theory',
		definition:
			'Whether each edge is flipped, judged against a fixed rule about which colours it is allowed to show on which faces. Solve it early, as ZZ does, and the rest of the solve needs no `F` or `B` turns at all — those are the only moves that can flip an edge.',
		see: ['ZZ', 'Orientation', 'ZBLL']
	},

	// --- Hardware ------------------------------------------------------------
	{
		term: 'Speedcube',
		category: 'hardware',
		definition:
			'A cube built to be turned quickly: light, springy, and willing to complete a turn when the layer beneath it is not quite lined up. A good one costs less than a takeaway and is capable of a world record. The cube is very rarely the thing holding you back.',
		see: ['Corner cutting', 'Magnetic cube', 'Tension', 'Lube']
	},
	{
		term: 'Magnetic cube',
		category: 'hardware',
		definition:
			'A cube with small magnets set in the pieces that pull each layer into line at the end of a turn. It feels crisper and overshoots less. Strength is a matter of taste rather than quality — a strongly magnetic cube is not automatically a better one, and some very fast people prefer none at all.',
		see: ['Speedcube', 'Tension', 'Corner cutting']
	},
	{
		term: 'Lube',
		aliases: ['lubricant'],
		category: 'hardware',
		definition:
			'Silicone oil put inside the cube to change how it feels. Thick lubricant slows a cube down and quietens it; thin speeds it up. It is a finishing touch rather than a repair — a cube that catches usually wants its tensions adjusting instead.',
		see: ['Tension', 'Speedcube', 'Pop']
	},
	{
		term: 'Corner cutting',
		category: 'hardware',
		definition:
			'How far out of line a layer can be and still let the next turn go through. Quoted in degrees in every review, and it matters because turning fast means starting each turn before the last one has quite finished.',
		see: ['Speedcube', 'Magnetic cube', 'Pop']
	},
	{
		term: 'Pop',
		aliases: ['pops', 'popping'],
		category: 'hardware',
		definition:
			'A piece coming out of the cube mid-solve. Usually a sign the tensions are too loose. In competition it is your problem rather than bad luck: you may put the piece back and carry on, with the clock still running.',
		see: ['Tension', 'Speedcube', 'DNF']
	},
	{
		term: 'Tension',
		category: 'hardware',
		definition:
			'How tightly the screws hold each face against the core. Loose turns freely and cuts corners well but pops; tight is stable and locks up. Change one face at a time and give each setting a few dozen solves before deciding — a cube feels wrong for a while after any adjustment.',
		see: ['Pop', 'Speedcube', 'Lube', 'Corner cutting']
	},

	// --- Community and competition -------------------------------------------
	{
		term: 'WCA',
		aliases: ['World Cube Association'],
		category: 'community',
		definition:
			'The body that runs official competitions and keeps the records. It sets the regulations — how scrambles are generated, how inspection works, what counts as a finished solve — and those rules are the reason two times from different corners of the world are measuring the same thing.',
		see: ['Scramble', 'Inspection', 'DNF', 'Ao5']
	},
	{
		term: 'Scramble',
		category: 'community',
		definition:
			'The sequence of moves that mixes the cube before a solve, or the position it leaves behind. Competition scrambles are generated from a random position and applied by a scrambler or a machine, so that everyone in a round faces exactly the same cube.',
		see: ['Random state', 'WCA', 'Inspection']
	},
	{
		term: 'Inspection',
		category: 'community',
		definition:
			'The fifteen seconds before the timer starts, in which you may look at the cube and turn it over in your hands but not turn a layer. Most solvers plan the whole cross and often the first pair. Going over costs two seconds; going well over is a DNF.',
		see: ['WCA', 'Cross', 'DNF', 'Lookahead']
	},
	{
		term: 'DNF',
		aliases: ['did not finish'],
		category: 'community',
		definition:
			'Did Not Finish: a solve that does not count, because the cube was not solved when the timer stopped or a regulation was broken. In an average of five the worst result is dropped anyway, so a single DNF need not spoil the average. Two will.',
		see: ['Ao5', 'WCA', 'Inspection']
	},
	{
		term: 'Ao5',
		aliases: ['ao5', 'average of 5', 'average of five'],
		category: 'community',
		definition:
			'The average of five solves with the best and the worst thrown out and the middle three averaged. Dropping both extremes is what makes it a fairer picture of how you are solving than any single time, which is why it is the number people quote.',
		see: ['Mo3', 'PB', 'DNF', 'WCA']
	},
	{
		term: 'Mo3',
		aliases: ['mo3', 'mean of 3', 'mean of three'],
		category: 'community',
		definition:
			'The mean of three solves with nothing dropped. Used for the long events, where five attempts would take all afternoon. It is less forgiving than an average of five, because one bad solve carries straight through to the result.',
		see: ['Ao5', 'Blindfolded', 'FMC']
	},
	{
		term: 'PB',
		aliases: ['personal best'],
		category: 'community',
		definition:
			'Personal best — your quickest single, or your quickest average, and the two are always quoted separately. Worth recording and worth not chasing: solves aimed at a personal best tend to be rushed ones, and rushed solves teach you very little.',
		see: ['Ao5', 'Sub-X']
	},
	{
		term: 'Sub-X',
		aliases: ['sub-20', 'sub-10', 'sub'],
		category: 'community',
		definition:
			'Shorthand for being reliably faster than a round number. "Sub-20" means averaging under twenty seconds, not having managed it once — the distinction matters, because the gap between a first sub-20 solve and a sub-20 average is usually months.',
		see: ['PB', 'Ao5']
	},
	{
		term: 'One-handed',
		aliases: ['OH', 'one-handed solving'],
		category: 'community',
		definition:
			'Solving with one hand, and an official event in its own right. Algorithms get chosen differently: `U` turns and `M` slices are cheap with a decent grip, `F` turns are expensive, and a longer sequence with a comfortable grip beats a short one you have to fumble for.',
		see: ['Regrip', 'Finger trick', 'WCA']
	},
	{
		term: 'Blindfolded',
		aliases: ['BLD', '3BLD', 'blind'],
		category: 'community',
		definition:
			'Memorise the cube, then solve it without looking, with the memorisation timed as part of the attempt. It is a separate discipline rather than a harder version of speedsolving: pieces are traced into a sequence and moved with commutators, which most speedsolvers never need to learn.',
		see: ['Commutator', 'Mo3', 'WCA']
	},
	{
		term: 'FMC',
		aliases: ['fewest moves', 'fewest moves challenge'],
		category: 'community',
		definition:
			'Fewest Moves: an hour, one scramble, paper, and the aim of writing down the shortest solution you can find. It rewards insight rather than turning speed, and it is where cancellations, inverse scrambles and block building get worked out properly.',
		see: ['Cancellation', "God's number", 'Block']
	},
	{
		term: 'Big cubes',
		aliases: ['4x4', '5x5', 'NxN'],
		category: 'community',
		definition:
			'Cubes larger than 3×3. The plan is the same in outline — solve the centres, pair up the edges, then finish it as a 3×3 — but identical centre pieces can hide a swap, which is where the parity cases that only ever appear on even-sized cubes come from.',
		see: ['Parity', 'Speedcube', 'WCA']
	}
];
