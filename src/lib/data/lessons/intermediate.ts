/**
 * The intermediate track.
 *
 * Written for someone who can already finish a cube unaided and wants the time
 * down. The through-line is that the beginner method is not wrong, it is
 * wasteful, and each lesson here replaces one wasteful part of it: the cross
 * gets planned, the corners and edges get paired, the four last-layer steps
 * become two. Every algorithm below is either part of the two-look sets or a
 * three-turn insertion the reader is meant to understand rather than memorise.
 */

import type { Lesson } from '../types';

export const INTERMEDIATE_LESSONS: readonly Lesson[] = [
	{
		slug: 'why-the-beginner-method-is-slow',
		title: 'Why the beginner method is slow',
		summary:
			'Where a two-minute solve actually spends its time, and which part of the beginner method each lesson in this track replaces.',
		track: 'intermediate',
		order: 20,
		minutes: 10,
		outcomes: [
			'Say roughly how many turns your solve takes and where they go',
			'Tell the difference between turning slowly and stopping to look',
			'Know what each lesson in this track is replacing, and in what order'
		],
		body: [
			{
				kind: 'prose',
				text: 'You can solve a cube without help. Everything from here is about doing the same thing in a third of the time, and it begins with an unwelcome fact: moving your hands faster is not how that happens.'
			},
			{ kind: 'heading', text: 'Count the turns' },
			{
				kind: 'prose',
				text: 'A beginner solve runs to something like a hundred and ten turns. A solve built from the methods in this track runs to about seventy. That saving is real, but it is the smaller of the two available — the larger one is in the time between the turns.'
			},
			{
				kind: 'table',
				headers: ['Step', 'Beginner method', 'This track'],
				rows: [
					[
						'Cross',
						'about 10 turns, built on top and then flipped over',
						'about 7 turns, worked out before you touch the cube'
					],
					[
						'Bottom corners and middle edges',
						'about 62 turns across eight separate looks',
						'F2L: about 32 turns across four looks'
					],
					['Last layer', 'about 35 turns across four steps', 'about 30 turns across two steps'],
					['Whole solve', 'about 110 turns, thirteen pauses', 'about 70 turns, eight pauses']
				],
				caption:
					'Rough figures, and yours will differ. The column that matters is the last row: half the turns saved, and five fewer moments where you stop and look.'
			},
			{
				kind: 'note',
				tone: 'insight',
				title: 'Where the time actually goes',
				text: 'Three turns a second is a comfortable, unhurried speed, and a hundred and ten turns at that rate is under forty seconds of turning. If your solves take two minutes, then more than a minute of each one is you looking at a cube your hands are not moving. That minute is what this track is really for.'
			},
			{ kind: 'heading', text: 'The three expensive habits' },
			{
				kind: 'prose',
				text: 'Three things in the beginner method cost far more than the rest put together. Each of them is there because it makes the method quicker to learn, which was the right trade at the time.'
			},
			{
				kind: 'list',
				items: [
					"**Repeating a sequence until it works.** Seating one first-layer corner can take six goes at `R U R' U'` — twenty-four turns to place a single piece. Reading which way the corner is twisted replaces all of them with three or five.",
					'**Turning the cube over.** Building the cross with white on top and then flipping the cube costs a moment of turning and, far worse, costs you every piece you were keeping track of. You come out of the rotation looking at a cube you no longer recognise.',
					'**Placing pieces one at a time.** A bottom corner and the middle edge above it finish up side by side. The beginner method puts the corner in, then lifts it out again as part of an eight-turn algorithm for the edge, then puts it back. Pairing them up first and inserting them together does both jobs in about eight turns.'
				]
			},
			{ kind: 'heading', text: 'What replaces what' },
			{
				kind: 'list',
				ordered: true,
				items: [
					'The cross moves to the bottom of the cube and gets planned in full before your hands move.',
					'The bottom corners and middle edges become one step, F2L, done a pair at a time and mostly worked out rather than recalled.',
					'The four last-layer steps become two: make the top face one colour, then move the pieces to where they belong.',
					'Lookahead — knowing where the next piece is while your hands are still busy — takes the pauses out of everything above.'
				]
			},
			{
				kind: 'prose',
				text: 'Nothing you already know is discarded. The sexy move you have done a thousand times is the backbone of F2L, and the last-layer algorithms in the beginner set reappear inside the two-look sets under their proper names.'
			},
			{
				kind: 'note',
				tone: 'warning',
				title: 'One thing at a time',
				text: 'There are about seventeen algorithms in this track, and learning all of them in a week is the usual way to stall. The algorithms go in, the lookahead does not follow, and the times barely move. Take F2L on its own for a fortnight before you touch the last layer.'
			},
			{
				kind: 'note',
				tone: 'tip',
				title: 'Measure before you change anything',
				text: 'Time ten solves now and write down the average. It is the only way you will know later whether a change helped, and it is unexpectedly encouraging in about a month.'
			},
			{
				kind: 'jump',
				href: '/timer/',
				label: 'Time ten solves before you start',
				blurb:
					'Scrambles, inspection, and an average of five, so the number you write down means something.'
			},
			{
				kind: 'jump',
				href: '/methods/',
				label: 'How the methods compare',
				blurb: 'What CFOP asks of you against Roux and ZZ, in move counts and algorithms.'
			}
		]
	},

	{
		slug: 'planning-the-cross',
		title: 'Planning the cross',
		summary:
			'Build it on the bottom, work it out before the timer starts, and stop turning the cube over.',
		track: 'intermediate',
		order: 21,
		minutes: 14,
		prerequisites: ['why-the-beginner-method-is-slow'],
		outcomes: [
			'Build the cross on the bottom without turning the cube over',
			'Place a cross edge in three turns instead of taking it up to the top first',
			'Plan at least two cross edges before you start turning',
			'Recognise when your cross has taken twice as many turns as it needed'
		],
		body: [
			{
				kind: 'prose',
				text: 'The cross is the only step with no algorithms and the only step you can plan completely before you touch the cube. Those two facts make it the cheapest improvement available: no memorisation, and a saving of five or six seconds for most people.'
			},
			{ kind: 'heading', text: 'Build it on the bottom' },
			{
				kind: 'prose',
				text: 'The beginner route makes a daisy on the top face and then drops the four petals down. It is a good first method because every step is visible. It also takes roughly twice as many turns as building the cross directly, and it teaches your eyes to read the cross from the wrong side.'
			},
			{
				kind: 'prose',
				text: 'From now on: **white stays on the bottom from the first turn to the last**. You never flip the cube over, not to check the cross and not to start the corners.'
			},
			{
				kind: 'note',
				tone: 'insight',
				title: 'You do not need to see the white stickers',
				text: 'The bottom is the one face you cannot see, and it turns out not to matter. A cross edge is correct when the colour on its **side** face matches the centre above it. Get that right and the white is forced — there is nowhere else for it to be. So you check the cross by looking at the four sides, exactly as you will check everything else for the rest of the solve.'
			},
			{ kind: 'heading', text: 'Getting an edge home' },
			{
				kind: 'prose',
				text: 'Four situations cover every cross edge. Read them as ideas rather than as algorithms — each one is short enough to work out at the cube, and that is the point of the step.'
			},
			{
				kind: 'steps',
				steps: [
					{
						text: 'In the top layer with white facing up. Turn the top until its side colour sits above the matching centre, then turn that face twice. This is the beginner insertion and it is still the right one when the edge is already the right way round.',
						alg: 'F2'
					},
					{
						text: 'In the top layer with white facing sideways. Do not take it round to face upwards. Bring it to the top-right with white on the right-hand face, and tip it straight in: the front face carries it down, and the last turn puts the bottom-right edge back where it was.',
						alg: "R' F R"
					},
					{
						text: 'In the middle layer, wedged between two side faces. One turn of a side face drops it into the bottom. Turn the bottom first so the empty slot is waiting underneath, then turn the bottom back afterwards.',
						alg: "D R' D'"
					},
					{
						text: 'In the bottom layer but under the wrong centre, or lying on its side. Take it out with a single turn rather than nudging it round, and put it in properly.',
						alg: 'F'
					}
				]
			},
			{
				kind: 'note',
				tone: 'warning',
				title: 'The cross that looks finished',
				text: 'The commonest cross mistake is not a wrong edge, it is a cross whose four edges match each other but sit one centre round from where they should be. Check each edge against the **centre above it**, one at a time, before you move on. A cross that is a quarter turn out costs you the whole of F2L.'
			},
			{ kind: 'heading', text: 'Planning it before you start' },
			{
				kind: 'prose',
				text: 'Competitions give you fifteen seconds of inspection, and the habit is worth building even if you never enter one. Fifteen seconds is a long time when your hands are still.'
			},
			{
				kind: 'list',
				ordered: true,
				items: [
					'Find all four white edges first, before planning anything. Say where they are to yourself.',
					'Pick the one that goes in with the fewest turns and start there, not with a particular colour.',
					'Work out the second edge **from the position the first one leaves**, which is the part that takes practice.',
					'Hold the cube still while you do this. Turning it over to look is how the plan gets lost.'
				]
			},
			{
				kind: 'note',
				tone: 'tip',
				title: 'Two edges, not four',
				text: 'Most people cannot plan four edges after a fortnight of trying, and pushing at it produces a fifteen-second stare followed by a scrambled plan. Plan two properly. Your eyes will find the other two while your hands are doing the first two, which is the same skill as lookahead and worth building here, where there is least going on.'
			},
			{ kind: 'heading', text: 'Why eight turns is always enough' },
			{
				kind: 'prose',
				text: 'The four white edges can be arranged in 190,080 ways, which is small enough for a computer to check exhaustively — and this site does. No cross on any scramble needs more than **eight** turns. Across four hundred random scrambles the shortest cross averaged 5.8 turns, and five or six was much the commonest answer.'
			},
			{
				kind: 'prose',
				text: 'That is the number to hold in your head. If your cross takes fourteen turns, the extra six are not a turning problem, they are the cost of solving one edge at a time without looking at what the next one needs.'
			},
			{
				kind: 'note',
				tone: 'tip',
				title: 'Sticking with white for now',
				text: 'Solvers who can build a cross on any of the six colours — colour neutrality — get a shorter cross on every scramble and save around a second. It also means learning to see six crosses where you now see one. It is worth doing eventually. It is not worth doing this month.'
			},
			{ kind: 'heading', text: 'Practising it' },
			{
				kind: 'list',
				items: [
					'Scramble, inspect for fifteen seconds, solve only the cross, and stop. Twenty of those takes five minutes.',
					'Count the turns each time and write the number down. Aim to get your average under eight.',
					'Then do the same drill but keep going until the first pair is in. Cross plus one pair is the real target.',
					'Watch the pieces rather than your hands. The cross is the least crowded place in the solve to build that habit.'
				]
			},
			{
				kind: 'jump',
				href: '/solve/',
				label: 'Let the solver show you the shortest cross',
				blurb:
					'Paint in the cube in front of you and compare its cross with the one you found. The gap is your homework.'
			}
		]
	},

	{
		slug: 'f2l-intuitively',
		title: 'F2L, intuitively',
		summary:
			'Pair each corner with its edge and put them in together — the single largest saving in the whole method, and mostly not memorisation.',
		track: 'intermediate',
		order: 22,
		minutes: 22,
		prerequisites: ['planning-the-cross'],
		teaches: ['f2l'],
		outcomes: [
			'Explain what a slot is and which two pieces live in it',
			'Insert a joined pair with a three-turn sequence from either side',
			'Bring a corner and an edge together instead of looking up a case',
			'Deal with a corner that has white facing upwards, and with pieces stuck in a slot',
			'Finish the first two layers in about thirty-five turns'
		],
		body: [
			{
				kind: 'prose',
				text: 'This is the lesson that matters. Learning the last layer properly saves you perhaps five seconds; learning to see F2L saves thirty, and it is the difference between reciting a method and solving a cube.'
			},
			{ kind: 'heading', text: 'The slot' },
			{
				kind: 'prose',
				text: 'Once the cross is done, the bottom two layers need eight more pieces: four corners and four middle edges. They pair off. The corner that belongs between the front and right centres, and the edge that belongs directly above it, live in the same gap. That gap is a **slot**, and there are four of them.'
			},
			{
				kind: 'prose',
				text: 'F2L means filling a slot with both its pieces in one go. Instead of eight separate jobs you have four, and each one is about eight turns rather than sixteen.'
			},
			{
				kind: 'note',
				tone: 'insight',
				title: 'You have already done one F2L case',
				text: "The beginner algorithm for a middle edge is `U R U' R' U' F' U F`. Look at what it does: it lifts the bottom corner out of the slot, sets the edge against it, and puts the pair back in together. It is an F2L insertion for the one case where the corner happens to be in place already. The rest of this lesson is the other cases."
			},
			{ kind: 'heading', text: 'Open the slot, then close it' },
			{
				kind: 'prose',
				text: 'Hold the cube with a slot at the **front-right**. One turn of the right face lifts whatever is in that slot up into the top layer and leaves the slot open. One turn back puts it down again.'
			},
			{
				kind: 'prose',
				text: "That is the entire mechanism. Every F2L insertion is: open the slot, arrange the two pieces above the hole with a turn of the top, and close it. `R U R'` is the whole method in three turns."
			},
			{
				kind: 'cube',
				setup: "R U' R'",
				caption:
					'This cube has one slot open at the front-right and its two pieces sitting in the top layer. Find them — a corner and an edge sharing two colours — then turn R, U, R prime and watch them go in together.',
				label: 'One F2L pair, waiting'
			},
			{ kind: 'heading', text: 'The two insertions' },
			{
				kind: 'prose',
				text: 'Everything below assumes the slot is at the front-right, with white on the bottom. Call the two colours of that slot the **front colour** and the **right colour**; the corner carries both of them plus white, and the edge carries both of them and no white.'
			},
			{
				kind: 'steps',
				steps: [
					{
						text: 'White facing right. The corner sits in the top layer above its slot with white on the right-hand face. Put the edge at the **back** of the top layer, showing the front colour upwards. Now: the first turn opens the slot and takes the corner out of the way, the second brings the corner and the edge round together so they meet, and the third closes the slot on both of them.',
						alg: "R U R'"
					},
					{
						text: 'White facing you. Same corner position, but white on the front face. Now the edge belongs on the **left** of the top layer, showing the right colour upwards, and the whole thing happens on the front face instead: open, bring them round, close.',
						alg: "F' U' F"
					}
				]
			},
			{
				kind: 'prose',
				text: 'Those two sequences, mirrored round the four slots, solve a good half of all F2L cases outright. Notice that neither of them was memorised — each is the same three ideas in a different order, and you can rebuild either one at the cube if it goes out of your head.'
			},
			{ kind: 'heading', text: 'When the pair is already joined' },
			{
				kind: 'prose',
				text: 'Sometimes the corner and the edge are already side by side in the top layer, showing the same colour upwards — a two-piece block. You cannot open the slot underneath them without breaking them apart, so move the block out of the way first, open the slot, and bring it back.'
			},
			{
				kind: 'steps',
				steps: [
					{
						text: 'Corner above the slot with white facing you, edge immediately to its right, both showing the front colour on top.',
						alg: "U R U' R'"
					},
					{
						text: 'Corner above the slot with white facing right, edge immediately in front of it, both showing the right colour on top.',
						alg: "U' F' U F"
					}
				]
			},
			{
				kind: 'note',
				tone: 'insight',
				title: 'Why the first turn goes the wrong way',
				text: 'That opening turn of the top face looks like a wasted move and is the opposite. It carries the joined pair off the slot so the slot can be opened without splitting it. Move it clear, open the hole, bring it back over the hole, close. Once you see it that way, you will stop trying to remember which direction the first turn goes: it is whichever direction takes the pair away from the slot.'
			},
			{ kind: 'heading', text: 'When white is on top' },
			{
				kind: 'prose',
				text: 'Here is the case that defeats people. The corner is in the top layer with **white facing upwards**. There is no way to join a pair around it, because the white sticker has to end up pointing down and it is currently pointing at the ceiling.'
			},
			{
				kind: 'prose',
				text: 'The fix is to use the slot as a place to turn the corner round. Put the corner into the slot the wrong way, which leaves white on the side, and then take it out again.'
			},
			{
				kind: 'steps',
				steps: [
					{
						text: 'Hold the corner above its slot with white facing up, and its edge in the top layer beside it on the right.'
					},
					{
						text: 'The first three turns tuck the edge out of harm in the neighbouring slot, carry the corner across the top and bring the edge back. The corner now has white on the side, which is what you needed.',
						alg: "R U2 R'"
					},
					{
						text: 'And now it is the first insertion you learnt, from the top of this lesson.',
						alg: "U' R U R'"
					}
				]
			},
			{
				kind: 'cube',
				setup: "R U' R' U R U2 R'",
				caption:
					"Work through R U2 R' U' R U R' on this one, a turn at a time, and watch the corner turn over inside the slot. Seven turns; the beginner route to the same position is about twenty.",
				label: 'The corner with white facing up'
			},
			{
				kind: 'note',
				tone: 'tip',
				title: 'The rule that saves you',
				text: 'White must be on the **side** of the corner, never on top, at the moment you join the pair. If white is up, spend two or three turns fixing that before you think about the edge. Trying to build a pair around an upward-facing white sticker is the single commonest way an F2L pair balloons to twenty turns.'
			},
			{ kind: 'heading', text: 'When a piece is already in the slot' },
			{
				kind: 'prose',
				text: 'A slot with the wrong things in it is not a special case. Take them out with the same turns that put things in, and then solve it normally. The habit to break is nudging: a piece that is nearly right is still wrong, and lifting it out is nearly always faster than working round it.'
			},
			{
				kind: 'steps',
				steps: [
					{
						text: 'Corner in the slot but twisted, edge in the top layer. The first three turns lift the corner out and turn it so white faces the side; the last four are the insertion you already know.',
						alg: "R U R' U' R U R'"
					},
					{
						text: 'Corner already correct in the slot, edge still in the top layer. Take the corner back out, set the edge against it, and put both in from the front. This is the beginner middle-edge algorithm, and now you know why it looks the way it does.',
						alg: "U R U' R' U' F' U F"
					},
					{
						text: 'Both pieces in the slot and both wrong. Lift the pair straight out into the top layer, then treat it as any other case.',
						alg: "R U' R'"
					}
				]
			},
			{ kind: 'heading', text: 'The other three slots' },
			{
				kind: 'prose',
				text: 'Everything above was written for the front-right slot. The quickest way to use it everywhere is to turn the whole cube — a `y` rotation brings the next slot to the front-right — and solve every pair in the same place with the same fingers.'
			},
			{
				kind: 'prose',
				text: 'That is a fine way to start and it is what most people do for the first few months. In time you will learn the back-right slot in place, using the left hand, because a rotation costs about as much as two turns. Do not rush it: a rotation you can do without thinking beats an in-place solution you have to work out.'
			},
			{
				kind: 'note',
				tone: 'warning',
				title: 'Do not go looking for the 41 cases yet',
				text: 'There are 41 F2L cases and the library has all of them with the shortest known solution to each. Learning them as a list is the slow road: you finish up recognising forty-one pictures instead of seeing two pieces and a hole. Work them out at the cube for a month first. The half-dozen you keep fumbling are then worth looking up, and they will stick, because you will know what they are for.'
			},
			{ kind: 'heading', text: 'How many turns a pair should take' },
			{
				kind: 'prose',
				text: 'Three turns for the luckiest cases, seven or eight for most, eleven for the worst — that is the range. Four pairs comes to about thirty-two turns, and with the cross the first two layers should be around forty.'
			},
			{
				kind: 'prose',
				text: 'If a pair is taking you twenty turns, the answer is almost never a missing algorithm. It is one of three things: white was facing up when you tried to pair, you broke a finished slot and had to repair it, or you inserted into the slot next door. Slow down and look before the first turn.'
			},
			{ kind: 'heading', text: 'Practising it' },
			{
				kind: 'list',
				items: [
					'Solve the cross and the first two layers only, then scramble again. The last layer teaches you nothing here.',
					'Do it slowly enough that you never stop moving. Speed is the last thing to add, not the first.',
					'After each pair, ask which two pieces you will do next, before you start turning.',
					'Count the turns for a single pair now and then. Anything past twelve is worth replaying.'
				]
			},
			{
				kind: 'jump',
				href: '/algorithms/f2l/',
				label: 'All 41 F2L cases',
				blurb:
					'Grouped by where the two pieces start, with a cube that will run any of them for you. Read it after a month of working them out, not before.'
			}
		]
	},

	{
		slug: 'two-look-oll',
		title: 'Two-look OLL',
		summary:
			'Make the whole top face one colour with ten algorithms instead of fifty-seven: three for the edges, seven for the corners.',
		track: 'intermediate',
		order: 23,
		minutes: 18,
		prerequisites: ['f2l-intuitively'],
		teaches: ['oll-2look'],
		outcomes: [
			'Orient the last-layer edges with one of three algorithms',
			'Orient the last-layer corners with one of seven, and hold each one the right way round',
			'Say how likely each case is, and which ones to learn first',
			'Explain what two-look costs you against full OLL'
		],
		body: [
			{
				kind: 'prose',
				text: 'The first two layers are done and the top is a mess. OLL — orientation of the last layer — turns the whole top face one colour in a single algorithm, ignoring where the pieces end up. There are fifty-seven cases. You are not going to learn fifty-seven algorithms today.'
			},
			{
				kind: 'prose',
				text: 'Instead you split the job in two: get the four **edges** showing yellow on top, then the four **corners**. Three algorithms for the first half, seven for the second. Ten in total, and seven of the ten are genuine OLL cases that stay with you when you learn the full set.'
			},
			{ kind: 'heading', text: 'The edges first' },
			{
				kind: 'prose',
				text: 'Look at the top face and ignore the corners completely. The yellow edge stickers make one of four shapes: a cross (nothing to do), a straight line, a bent pair, or nothing at all.'
			},
			{
				kind: 'alg',
				moves: "F R U R' U' F'",
				caption:
					'**The line.** Two yellow edges opposite each other. Hold the line running left to right, across the cube rather than towards you.'
			},
			{
				kind: 'alg',
				moves: "Fw R U R' U' Fw'",
				caption:
					'**The bent pair.** Two yellow edges next to each other. Hold them pointing at you and to the right. `Fw` is a wide turn: the front face and the layer behind it, together.'
			},
			{
				kind: 'alg',
				moves: "F R U R' U' F' Fw R U R' U' Fw'",
				caption:
					'**The dot.** No yellow edges at all. This is the other two algorithms one after the other, so there is nothing new to learn — it is the same six turns twice, once narrow and once wide.'
			},
			{
				kind: 'note',
				tone: 'insight',
				title: 'Three algorithms that are really one',
				text: 'All three are the same sequence: front, sexy move, front back again. Widening the first and last turn shifts which edges it flips, and doing both versions in a row flips all four. If you ever forget the dot case, do the line algorithm, look at what you have, and finish it off.'
			},
			{
				kind: 'table',
				headers: ['Shape', 'How often', 'What to do'],
				rows: [
					['Cross already', '1 in 8', 'Nothing — go straight to the corners'],
					['Bent pair', '1 in 2', 'The wide-turn version'],
					['Line', '1 in 4', 'The plain version'],
					['Dot', '1 in 8', 'Both, one after the other']
				],
				caption:
					'Half of all solves give you the bent pair, so that is the one to make automatic first.'
			},
			{ kind: 'heading', text: 'Then the corners' },
			{
				kind: 'prose',
				text: 'Now every edge shows yellow on top and the corners do not. Seven cases cover it. The first thing to count is how many corners already show yellow on top: none, one, or two. That splits seven cases into groups of two, two and three, and the rest is where the remaining yellow stickers point.'
			},
			{
				kind: 'alg',
				moves: "R U R' U R U2 R'",
				caption:
					'**Sune.** One corner shows yellow on top; hold it at the front-left. Check the front-right corner: its yellow sticker faces you. Seven turns, and the most useful algorithm on the cube — it turns up again in COLL, in Winter Variation and in half the last-layer tricks you will meet later.'
			},
			{
				kind: 'alg',
				moves: "R U2 R' U' R U' R'",
				caption:
					'**Anti-sune.** Again one corner shows yellow on top, but with it at the front-left the front-right corner points its yellow to the **right** instead of at you. Turn the top half a turn so the correct corner sits at the back-right, then this.'
			},
			{
				kind: 'alg',
				moves: "R U2 R' U' R U R' U' R U' R'",
				caption:
					'**H.** No corner shows yellow on top, and the four yellow stickers are two on the front face and two at the back. Two sunes back to back, near enough.'
			},
			{
				kind: 'alg',
				moves: "R U2 R2 U' R2 U' R2 U2 R",
				caption:
					'**Pi.** No corner shows yellow on top either, but here two yellow stickers sit side by side on one face. Hold that pair on the **left**; the other two stickers face front and back.'
			},
			{
				kind: 'alg',
				moves: "R2 D R' U2 R D' R' U2 R'",
				caption:
					'**Headlights.** Two corners show yellow on top, both at the back, and the two yellow side stickers sit side by side on the face towards you. The `D` turns feel odd at first; they are what lets the algorithm hold the back corners still.'
			},
			{
				kind: 'alg',
				moves: "Rw U R' U' Rw' F R F'",
				caption:
					'**T.** Two corners show yellow on top, both on the **right**. The front-left corner points its yellow at you and the back-left corner points its yellow at the back.'
			},
			{
				kind: 'alg',
				moves: "F' Rw U R' U' Rw' F R",
				caption:
					'**Bowtie.** Two corners show yellow on top, diagonally opposite each other — that diagonal is the giveaway. Hold it so the yellow stickers you can see are on the front face and the left face.'
			},
			{
				kind: 'table',
				headers: ['Case', 'Yellow corners on top', 'How often'],
				rows: [
					['Already done', '4', '1 in 27'],
					['Sune', '1', '4 in 27'],
					['Anti-sune', '1', '4 in 27'],
					['Headlights', '2', '4 in 27'],
					['T', '2', '4 in 27'],
					['Bowtie', '2', '4 in 27'],
					['Pi', '0', '4 in 27'],
					['H', '0', '2 in 27']
				],
				caption:
					'Every case except H and the free one comes up equally often, so there is no clever order to learn them in. Sune and anti-sune first, because they are short and they recur elsewhere.'
			},
			{
				kind: 'note',
				tone: 'insight',
				title: 'Why twenty-sevenths',
				text: 'Each corner can sit in one of three twists, and the twists of any three corners force the fourth — the total has to come to a whole number of full turns. Three corners times three twists gives twenty-seven equally likely arrangements, one of which is solved.'
			},
			{
				kind: 'note',
				tone: 'warning',
				title: 'Counting the top stickers is not enough',
				text: 'Three of the seven cases show two yellow corners on top and they are told apart only by where the side stickers point. Headlights has both yellow corners at the back and its two side stickers together on one face; T has them both on the right, pointing front and back; bowtie has them diagonally opposite. Learn to look at the sides from the start and you will not have to unlearn a habit later.'
			},
			{ kind: 'heading', text: 'What this costs you' },
			{
				kind: 'prose',
				text: 'Against full OLL, two-look costs about five extra turns and one extra pause per solve — a second or so once you are quick. Against not knowing OLL at all it saves far more than that, and ten algorithms is an evening rather than a season.'
			},
			{
				kind: 'prose',
				text: 'The seven corner algorithms are OLL cases 21 to 27, kept exactly as they are in the full set. When you come to learn all fifty-seven, these seven are already done.'
			},
			{
				kind: 'jump',
				href: '/algorithms/oll-2look/',
				label: 'The ten two-look OLL algorithms',
				blurb: 'Every case with a diagram generated from the moves, and a cube that will run them.'
			},
			{
				kind: 'jump',
				href: '/notation/',
				label: 'Wide turns and slice turns',
				blurb: 'What `Fw`, `Rw` and `M` mean, and how they relate to the turns you already know.'
			}
		]
	},

	{
		slug: 'two-look-pll',
		title: 'Two-look PLL',
		summary:
			'Move the last-layer pieces to where they belong in two steps: corners first, then edges. Six algorithms, or seven if you want the comfortable one.',
		track: 'intermediate',
		order: 24,
		minutes: 18,
		prerequisites: ['two-look-oll'],
		teaches: ['pll-2look'],
		outcomes: [
			'Spot headlights and tell an adjacent corner case from a diagonal one',
			'Permute the last-layer corners with two mirrored algorithms',
			'Finish the edges with one of four algorithms, chosen at a glance',
			'Say why the edge step can only ever be one of four cases'
		],
		body: [
			{
				kind: 'prose',
				text: 'The top face is one colour and nothing is in the right place. PLL — permutation of the last layer — finishes the cube. Twenty-one cases in one look; in two looks it comes down to six algorithms, and every one of them is part of the full set.'
			},
			{ kind: 'heading', text: 'Corners: look for headlights' },
			{
				kind: 'prose',
				text: 'Ignore the edges entirely for now. Look at the two top-layer corners on each side of the cube. When they show the same colour, with something different between them, they are called **headlights** — and headlights mean those two corners are correct relative to each other.'
			},
			{
				kind: 'list',
				items: [
					'**All four faces show headlights** — the corners are already done. One case in six.',
					'**Exactly one face shows headlights** — two corners need swapping with each other, next to each other. Four cases in six, so this is what you will usually get.',
					'**No headlights anywhere** — the two corners that need swapping are diagonally opposite. One case in six.'
				]
			},
			{
				kind: 'prose',
				text: 'For the common case, hold the headlights at the **back**. One of the two corners now facing you is already exactly right — all three of its colours match the faces it touches. Which one it is tells you which algorithm to use.'
			},
			{
				kind: 'alg',
				moves: "R' F R' B2 R F' R' B2 R2",
				caption:
					'Headlights at the back, and the **front-left** corner is the one already in place. Nine turns. The `B2` turns are the awkward part, and they buy you a version that needs no cube rotation, which most published ones do.'
			},
			{
				kind: 'alg',
				moves: "L F' L B2 L' F L B2 L2",
				caption:
					'Headlights at the back, and the **front-right** corner is the one already in place. The same algorithm mirrored — every right becomes a left and every turn reverses. Learning it as a mirror rather than as nine new turns takes about ten minutes.'
			},
			{
				kind: 'alg',
				moves: "F R U' R' U' R U R' F' R U R' U' R' F R F'",
				caption:
					'**No headlights**: the diagonal case. This one works from any angle, so there is nothing to line up. It disturbs two edges as it goes, which does not matter — the edges are the next step. Cubers call it the Y permutation.'
			},
			{
				kind: 'note',
				tone: 'insight',
				title: 'You could manage with two',
				text: 'Run one of the corner algorithms on a diagonal case from any angle and you get an adjacent case, which the same two algorithms then finish. So two algorithms genuinely cover every corner case. It costs eighteen turns instead of seventeen and two recognition looks instead of one, which is why most people learn the third.'
			},
			{
				kind: 'note',
				tone: 'tip',
				title: 'Check before you move on',
				text: 'After the corner step, all four faces should show headlights. If they do not, you held the case the wrong way round — run the corner step again rather than trying to patch it with the edge algorithms, which cannot fix corners.'
			},
			{ kind: 'heading', text: 'Edges: one of four' },
			{
				kind: 'prose',
				text: 'With the corners right, the edges can only be in four arrangements. That is not a simplification for teaching, it is a fact about the puzzle: corners in place means the edges must be an **even** rearrangement, and there are only twelve of those — one solved, eight three-cycles, and three double swaps.'
			},
			{
				kind: 'alg',
				moves: "M2 U M U2 M' U M2",
				caption:
					'**U permutation.** Three edges cycle round and one is already correct: hold that one at the back. This version is for when the edge at the front belongs on the **right**. Two thirds of all edge cases are a U permutation one way or the other.'
			},
			{
				kind: 'alg',
				moves: "M2 U' M U2 M' U' M2",
				caption:
					'**U permutation, the other way.** Correct edge at the back again, but now the front edge belongs on the **left**. It is the first algorithm with every `U` turn reversed, which is the whole of what you have to remember.'
			},
			{
				kind: 'alg',
				moves: 'M2 U M2 U2 M2 U M2',
				caption:
					'**H permutation.** Every edge swaps with the one opposite it. Symmetrical, so there is nothing to line up before you start — the only case in the set you can begin without thinking. One in twelve.'
			},
			{
				kind: 'alg',
				moves: "M2 U M2 U M' U2 M2 U2 M' U2",
				caption:
					'**Z permutation.** Two pairs of neighbouring edges change places. Hold it so the front edge and the right edge want to swap with each other. The half turn at the end is not decoration — the slice turns leave the whole top layer out of line, and that puts it back.'
			},
			{
				kind: 'table',
				headers: ['Edge case', 'How often', 'What you see'],
				rows: [
					['Already done', '1 in 12', 'Everything matches; the solve is finished'],
					['U permutation', '8 in 12', 'One edge correct, three cycling round it'],
					['Z permutation', '2 in 12', 'Two pairs of neighbours swapped, no edge correct'],
					['H permutation', '1 in 12', 'Every edge opposite where it belongs']
				],
				caption: 'Twelve even arrangements of four edges, and that is all there is.'
			},
			{
				kind: 'note',
				tone: 'tip',
				title: 'If the M turns feel impossible',
				text: "They do at first — the middle slice is pulled with the left hand's fingers rather than gripped and turned, and it takes a week or so to stop feeling wrong. If you would rather start elsewhere, the same two U permutations can be done with right-hand turns: `R U' R U R U R U' R' U' R2` for the first and `R2 U R U R' U' R' U' R' U R'` for the second. They are longer. Come back to the slice versions when your hands are ready."
			},
			{
				kind: 'note',
				tone: 'warning',
				title: 'The turn nobody counts',
				text: 'Almost every last-layer algorithm ends with a turn of the top face to line the layer back up. It does not appear in the written algorithm and it still costs you the time. Get into the habit of looking for it as the algorithm ends rather than after you have stopped.'
			},
			{ kind: 'heading', text: 'What this costs you' },
			{
				kind: 'prose',
				text: 'Two-look PLL runs about twelve turns longer than the one-look version and adds a second recognition pause. The six algorithms here are all part of the twenty-one, so none of the work is wasted when you go on to the full set. The four edge algorithms are precisely the cases a one-look solver meets when the corners happen to need nothing doing to them.'
			},
			{
				kind: 'jump',
				href: '/algorithms/pll-2look/',
				label: 'The two-look PLL algorithms',
				blurb: 'Corner cases and edge cases, with the diagrams drawn from the moves themselves.'
			},
			{
				kind: 'jump',
				href: '/trainer/',
				label: 'Drill the ones you keep fumbling',
				blurb:
					'The trainer shows a case, times your answer, and comes back to the slow ones more often.'
			}
		]
	},

	{
		slug: 'lookahead',
		title: 'Lookahead',
		summary:
			'Knowing where the next pair is while your hands are still on this one — the largest saving left after F2L, and the one nobody can hand you.',
		track: 'intermediate',
		order: 25,
		minutes: 16,
		prerequisites: ['f2l-intuitively'],
		outcomes: [
			'Work out how much of your solve is turning and how much is looking',
			'Practise deliberately slowly without it feeling like a waste of time',
			'Track a piece through turns you are making with your hands',
			'Recognise which pauses are a lookahead problem and which are a recognition problem'
		],
		body: [
			{
				kind: 'prose',
				text: 'Two people can turn at the same speed and be twenty seconds apart. The difference is not in their hands. One of them knows what they are doing next while the current pair is going in; the other stops, looks, finds, and starts again, four times a solve.'
			},
			{ kind: 'heading', text: 'The arithmetic' },
			{
				kind: 'prose',
				text: 'Take a seventy-turn solve at four turns a second. That is under twenty seconds of turning. If your average is forty seconds, then twenty seconds of every solve is your hands sitting still. No amount of finger training touches that half.'
			},
			{
				kind: 'note',
				tone: 'insight',
				title: 'Turns per second is a trap',
				text: 'It is the most tempting thing to measure and the least useful. Pushing your turning rate from four to five shaves four seconds off a seventy-turn solve, and it usually adds more than that back in pauses, because your eyes cannot keep up with your hands. The people who look fast are not turning fast; they are never stopping.'
			},
			{ kind: 'heading', text: 'Turning slower to go faster' },
			{
				kind: 'prose',
				text: 'The drill is uncomfortable and it works. Solve at about two turns a second — slow enough to feel silly — with one rule: **you may not pause**. Not between pairs, not before the last layer. If you have to stop, you were going too fast; go slower.'
			},
			{
				kind: 'prose',
				text: 'Your first slow solves will be no faster than your normal ones, which is the point being made rather clearly. After a fortnight of ten a day they will be faster, and then your normal solves will follow.'
			},
			{ kind: 'heading', text: 'Tracking a piece' },
			{
				kind: 'prose',
				text: 'While your hands do the current insertion, your eyes should be somewhere else. Pick one piece — the **corner** of the next pair, not both pieces — and follow it through the turns you are making. It will move; you know exactly where it goes, because you are the one turning the face it is on.'
			},
			{
				kind: 'list',
				ordered: true,
				items: [
					'Start by tracking a piece through a single insertion. Three turns, one piece.',
					'Then track it through a whole pair, including the setup turns.',
					'Then track both pieces of the next pair.',
					'Then stop tracking and notice you can already see where they are.'
				]
			},
			{
				kind: 'note',
				tone: 'tip',
				title: 'Watch the cube, not your hands',
				text: 'Most people watch the piece they are inserting go home. There is no information there — you already know it works. The insertion is where your eyes are free, and the last three turns of a pair are the most valuable three turns in the solve for finding the next one.'
			},
			{ kind: 'heading', text: 'Where the pauses are' },
			{
				kind: 'table',
				headers: ['You stop here', 'It is really this', 'What fixes it'],
				rows: [
					[
						'Before the first turn',
						'The cross was not planned',
						'Inspection drills — cross, then cross plus one pair'
					],
					['Between F2L pairs', 'Lookahead', 'Slow solves with no pauses'],
					[
						'After the last pair',
						'OLL recognition',
						'Drill the ten cases until the shape names itself'
					],
					['After OLL', 'PLL recognition', 'Learn to read headlights before the algorithm ends'],
					[
						'Halfway through a pair',
						'You had no plan when you started it',
						'Look before the first turn, not during the third'
					]
				],
				caption:
					'Filming a solve on a phone and counting the stops is worth more than an hour of practice.'
			},
			{
				kind: 'note',
				tone: 'insight',
				title: 'Why an algorithm is a rest',
				text: 'A memorised sequence needs no attention once it is running, which makes it the best place in the solve to look somewhere else. That is why speedsolvers learn full OLL and PLL and it is why the last layer eventually feels like a break rather than a task. F2L is the hard part, because you are improvising and watching at the same time.'
			},
			{ kind: 'heading', text: 'The plateau' },
			{
				kind: 'prose',
				text: 'Nearly everyone stalls at around the same place: F2L learnt, two-look last layer learnt, times sitting between forty seconds and a minute and refusing to move for weeks. It is not a sign that you need more algorithms. It is a sign that the algorithms are ahead of the eyes, which is the normal order for it to happen in.'
			},
			{
				kind: 'prose',
				text: 'The way through is boring and reliable: slow solves, no pauses, every day, for a fortnight. Nothing new to learn. It is the least glamorous advice in cubing and the most consistently effective.'
			},
			{
				kind: 'note',
				tone: 'warning',
				title: 'Do not practise mistakes',
				text: 'Practising fast and sloppy makes you quick at doing the wrong thing. If a pair goes wrong, stop the solve and work out what you should have seen. Ten thoughtful solves beat fifty rushed ones, and they are less tiring.'
			},
			{
				kind: 'jump',
				href: '/tips/',
				label: 'Practice notes and drills',
				blurb: 'Short, specific things to try, sorted by what you are working on.'
			},
			{
				kind: 'jump',
				href: '/timer/',
				label: 'Averages, not personal bests',
				blurb:
					'An average of twelve tells you whether the practice is working. A single fast solve tells you nothing.'
			}
		]
	},

	{
		slug: 'finger-tricks',
		title: 'Finger tricks',
		summary:
			'How a turn gets made without regripping, which ones everybody ends up using, and why algorithms are written the way they are.',
		track: 'intermediate',
		order: 26,
		minutes: 12,
		prerequisites: ['two-look-pll'],
		outcomes: [
			'Turn the top face with either index finger instead of regripping',
			'Explain what a regrip is and count the ones in an algorithm',
			'Recognise the common triggers inside the algorithms you already know',
			'Practise an algorithm in a way that builds speed rather than mistakes'
		],
		body: [
			{
				kind: 'prose',
				text: 'A finger trick is a turn made by one finger moving while the rest of the hand holds the cube still. That is the whole idea, and it is why a solver who looks like they are barely moving is turning four times a second.'
			},
			{
				kind: 'prose',
				text: 'The alternative is a **regrip**: letting go, taking hold of the cube somewhere else, and carrying on. A regrip costs about as much as two turns and it breaks your grip on the cube at the moment your eyes are busy elsewhere.'
			},
			{ kind: 'heading', text: 'The ones everybody ends up with' },
			{
				kind: 'list',
				items: [
					"`U` with the **left** index finger, which carries the front of the top layer to the left; `U'` with the **right** index finger, carrying it back the other way. Neither hand lets go of the cube. Left-handers often swap these and it makes no difference.",
					'`U2` as two pushes of the same finger, one after the other — a double flick — rather than one big shove.',
					"`R` and `R'` from the wrist. The right hand rolls; the fingers do not reach round. The left hand holds the cube still throughout.",
					"`F` and `F'` from the left thumb and index finger on the front face, so the right hand can stay where it is for the turn after.",
					"`M` and `M'` pulled with the fingers of the left hand on the middle column. Awkward for a week, then invisible.",
					'Wide turns like `Rw` with the same motion as `R`, with one more finger on the cube.'
				]
			},
			{
				kind: 'note',
				tone: 'tip',
				title: 'There is no single correct fingering',
				text: 'Hand size, cube size and which hand you favour all move the answer around, and watching two fast solvers do the same algorithm will show you two different sets of fingers. What is not negotiable is the principle: one motion per turn, and no letting go.'
			},
			{ kind: 'heading', text: 'Triggers' },
			{
				kind: 'prose',
				text: 'Your hands do not learn algorithms. They learn **triggers** — short groups of turns that come out as a single motion — and an algorithm is a handful of triggers strung together. Once you have the triggers, a new algorithm made of familiar ones takes a few minutes rather than a few days.'
			},
			{
				kind: 'list',
				items: [
					"`R U R' U'` — the sexy move. You have been doing this since your first solve.",
					"`R U R'` — the F2L insertion, and the first half of half the algorithms you know.",
					"`R' F R F'` — sometimes called the sledgehammer, and its reverse `F R' F' R` the hedge.",
					"`R U R' U R U2 R'` — sune, which is a trigger in its own right by the time you have done it a thousand times."
				]
			},
			{
				kind: 'note',
				tone: 'insight',
				title: 'Why the same case has several algorithms',
				text: 'Look at any case in the library with more than one solution and count the regrips rather than the turns. An eleven-turn algorithm your hands can run without letting go beats a nine-turn one with two regrips, every time. That is the whole reason published algorithms disagree with each other: they were chosen by people with different grips.'
			},
			{ kind: 'heading', text: 'Learning an algorithm properly' },
			{
				kind: 'list',
				ordered: true,
				items: [
					'Work out the fingers before the speed. Run it at one turn a second and decide which finger makes each turn.',
					'Find the regrips. If there are more than one, look for another version of the same algorithm.',
					'Do it thirty times slowly with the same fingers every time. Slowly means slowly.',
					'Only then speed it up, and stop the moment it stops being the same motion.',
					'Come back to it tomorrow. Fingers learn overnight in a way they do not learn in a long sitting.'
				]
			},
			{
				kind: 'note',
				tone: 'warning',
				title: 'A stiff cube cannot be finger-tricked',
				text: 'If a face needs a shove to move, no amount of technique will help. Loosen the tension until a face turns with a fingertip and the cube can turn a face that is slightly out of line without locking up. A cube that is too loose pops instead, so adjust it a little at a time.'
			},
			{
				kind: 'prose',
				text: 'None of this is worth doing before the lookahead work. Fast hands attached to slow eyes produce the same solve time and more mistakes. Fingers are the polish; sort the pauses first.'
			},
			{
				kind: 'jump',
				href: '/tips/',
				label: 'Finger trick and hardware notes',
				blurb: 'Tensions, lubricant, and what actually matters when buying a cube.'
			},
			{
				kind: 'jump',
				href: '/glossary/',
				label: 'Sexy move, sledgehammer, AUF',
				blurb: 'The names cubers use, defined once so the rest of the site can use them freely.'
			}
		]
	}
];
