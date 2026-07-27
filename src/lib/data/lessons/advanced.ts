/**
 * The advanced track.
 *
 * Written for someone who solves unaided with two-look last layer and has
 * decided — or is deciding — to learn the whole of OLL and PLL. Two things
 * govern the tone. First, the arithmetic is given honestly: seventy-eight
 * algorithms buy a few seconds, and saying so is more useful than pretending
 * otherwise. Second, recognition gets as much room as memorisation, because an
 * algorithm you cannot name in time is worth nothing at speed.
 *
 * Every case number, probability and sticker description below was read off the
 * algorithm library itself rather than from memory, so the lessons and the set
 * pages cannot drift apart.
 */

import type { Lesson } from '../types';

export const ADVANCED_LESSONS: readonly Lesson[] = [
	{
		slug: 'committing-to-full-cfop',
		title: 'Committing to full CFOP',
		summary:
			'What seventy-eight algorithms actually buy you, how long they take, and why they are learnt in shape groups rather than in numerical order.',
		track: 'advanced',
		order: 40,
		minutes: 14,
		prerequisites: ['two-look-pll', 'lookahead'],
		outcomes: [
			'Say what full OLL and full PLL are worth in seconds, against the two-look versions',
			'Work out how long the set will take at a rate you can keep to',
			'Choose whether to learn PLL or OLL first, for a reason rather than by default',
			'Explain why the cases are learnt in shape groups and not by number'
		],
		body: [
			{
				kind: 'prose',
				text: 'Two-look last layer takes sixteen algorithms and finishes the cube in four steps: orient the edges, orient the corners, place the corners, place the edges. Full CFOP replaces those four with two. One algorithm makes the whole top face yellow. One algorithm finishes the cube.'
			},
			{
				kind: 'prose',
				text: 'There are fifty-seven of the first and twenty-one of the second. Seventy-eight algorithms is the largest piece of memorisation in ordinary speedcubing, and it is worth being clear-eyed about what it is for before starting.'
			},
			{ kind: 'heading', text: 'The bill' },
			{
				kind: 'prose',
				text: 'You are not starting from nothing. The seven corner algorithms from two-look OLL are OLL cases 21 to 27, kept unchanged, and every algorithm in two-look PLL is one of the twenty-one. So the real bill is around **sixty-four new algorithms** — fifty OLL and fourteen PLL.'
			},
			{
				kind: 'table',
				headers: ['Step', 'Two-look', 'One-look', 'Saving'],
				rows: [
					[
						'OLL',
						'10 algorithms, about 15 turns, two looks',
						'57 algorithms, about 10 turns, one look',
						'roughly a second'
					],
					[
						'PLL',
						'6 algorithms, about 25 turns, two looks',
						'21 algorithms, about 13 turns, one look',
						'two seconds, sometimes three'
					]
				],
				caption:
					'Turn counts are averages over the sets. The saving assumes you are already turning at three or four a second and that the recognition is automatic — which is a large assumption, and the subject of two of the lessons below.'
			},
			{
				kind: 'note',
				tone: 'insight',
				title: 'Three seconds, and where they matter',
				text: 'Three seconds is a fifth of a fifteen-second solve and a twelfth of a thirty-five-second one. If your average is above thirty seconds, there are five- and ten-second savings still lying about in lookahead and F2L, and they are cheaper. Full CFOP is what you do when the cheap savings have gone.'
			},
			{ kind: 'heading', text: 'How long it takes' },
			{
				kind: 'prose',
				text: 'Take a rate you can keep to rather than the rate you manage in the first fortnight. Two new algorithms a week, drilled properly and still there a month later, is a good honest pace. Sixty-four algorithms at that rate is about eight months.'
			},
			{
				kind: 'list',
				items: [
					'**Four a week** finishes in four months, and is achievable if you already drill daily and have good finger habits.',
					'**Ten a week** is the rate people announce on the first Monday. Retention falls off a cliff somewhere around the fourth case of the week, and the cases you half-learn are worse than the ones you have not met, because you hesitate over them in solves.',
					'**One a week** is not too slow. It is a year, and at the end of it you have full CFOP, which you did not have at the start.'
				]
			},
			{
				kind: 'note',
				tone: 'warning',
				title: 'Your times will get worse first',
				text: 'A newly learnt case takes two seconds to recognise and three to execute, against the second and a half your two-look route costs. So every group you start using makes your average worse for a week or two. This is normal, it is temporary, and it is the reason to keep the two-look algorithms sharp rather than deleting them the moment a new group goes in.'
			},
			{ kind: 'heading', text: 'PLL first' },
			{
				kind: 'prose',
				text: 'If you do one set and not the other, do PLL. The arithmetic is not close. Sixteen of the twenty-one permutation cases come up about once in every eighteen solves; a typical orientation case comes up about once in fifty-four. Each PLL you learn therefore pays out three times as often as each OLL, and there are twenty-one of them rather than fifty-seven.'
			},
			{
				kind: 'prose',
				text: 'There is a second reason. PLL is the last thing you do, so a slow one is dead time at the end of a solve where nothing else is competing for your attention. An OLL you fumble at least happens while you still have a permutation case to read afterwards.'
			},
			{
				kind: 'note',
				tone: 'tip',
				text: 'The two OLL lessons come first in this track because OLL is the part that needs a plan — fifty-seven cases go badly wrong without an order to take them in. PLL mostly needs drilling. There is no dependency between them, so read [Learning PLL properly](/learn/learning-pll-properly/) first if you would rather start there.'
			},
			{ kind: 'heading', text: 'Groups, not numbers' },
			{
				kind: 'prose',
				text: 'The OLL numbering is historical. It sorts nothing you care about. Learning cases 1 to 10 in order gives you four dots, two squares, two lightning bolts and two fish: four unrelated recognition patterns, starting with the eight cases that are both the longest to execute and the rarest to meet.'
			},
			{
				kind: 'prose',
				text: 'The library groups the fifty-seven by **shape** instead — the pattern the yellow stickers make on the top face. Cases in a group look alike, which means you learn their recognition together and, more to the point, you learn the *differences* between them together. That is where the recognition time actually goes.'
			},
			{
				kind: 'note',
				tone: 'insight',
				title: 'Seventeen of the pairs are mirrors',
				text: 'Thirty-four of the fifty-seven cases are the mirror image of another case: sune and anti-sune, the two squares, the two W shapes, the four P shapes in two pairs, the kite and anti-kite, all four knight moves, all four awkward shapes, all six L shapes, all six lightning bolts and two of the dots. Learn one of a mirror pair properly and the other costs a fraction of the time, because your left hand is doing what your right hand already knows. Learning them out of order — one in March and its mirror in July — throws that away.'
			},
			{ kind: 'heading', text: 'What "learnt" means' },
			{
				kind: 'prose',
				text: 'Worth fixing before you start, because the honest definition is stricter than the comfortable one and it is what stops half-learnt cases piling up.'
			},
			{
				kind: 'list',
				ordered: true,
				items: [
					'You can name the case in about a second, from the two faces you can see, without turning the cube round.',
					'Your hands run it without your attention, at your normal turning speed, with the same fingers every time.',
					'It survives the night. Drill it, sleep, and do it cold the next morning before you touch anything else.',
					'It survives a mixed drill — the whole group shuffled together, in random order.',
					'Using it in a solve does not cost you your lookahead. If it does, it is not finished.'
				]
			},
			{
				kind: 'jump',
				href: '/algorithms/oll/',
				label: 'All 57 orientation cases',
				blurb: 'Grouped by shape, with diagrams generated from the algorithms themselves.'
			},
			{
				kind: 'jump',
				href: '/algorithms/pll/',
				label: 'All 21 permutation cases',
				blurb: 'The set that repays fluency more than any other, and the one to learn first.'
			}
		]
	},

	{
		slug: 'learning-oll-without-drowning',
		title: 'Learning OLL without drowning',
		summary:
			'A concrete order for the fifty-seven cases, why the dots come last, and how to drill a group until it stops needing thought.',
		track: 'advanced',
		order: 41,
		minutes: 20,
		prerequisites: ['committing-to-full-cfop'],
		teaches: ['oll'],
		outcomes: [
			'Take the 57 cases in an order that keeps the payoff coming',
			'Drill a group of two to six cases until recognition and execution are both automatic',
			'Keep solving at full speed while half the set is still unlearnt',
			'Say why the eight dot cases are worth the least per algorithm'
		],
		body: [
			{
				kind: 'prose',
				text: 'Fifty-seven cases is not a memory problem, it is a scheduling problem. People who stall do not stall because their memory failed; they stall because they took the cases in an order that made every week feel the same as the last one, with no group ever quite finished.'
			},
			{
				kind: 'prose',
				text: 'The order below fixes that. It starts with the groups you can finish in a sitting, keeps every mirror pair together, and leaves the six L shapes and the eight dots until you have months of momentum behind you.'
			},
			{ kind: 'heading', text: 'The seven you already have' },
			{
				kind: 'prose',
				text: 'The corner algorithms from two-look OLL — sune, anti-sune, headlights, T, bowtie, pi and H — are the seven cases where every edge is already oriented. They are OLL 21 to 27 and they need no further work.'
			},
			{
				kind: 'prose',
				text: 'Those seven cover one solve in eight. Hold that figure next to another one: the eight dot cases, the longest algorithms in the set, also cover one solve in eight between them. Seven cases you already have against eight you have not started, for exactly the same share of your solving. That comparison decides the order everything else goes in.'
			},
			{ kind: 'heading', text: 'The order' },
			{
				kind: 'table',
				headers: ['Order', 'Group', 'Cases', 'Why here'],
				rows: [
					['—', 'All edges oriented', '7 (OLL 21–27)', 'Already known from two-look'],
					[
						'1',
						'Corners oriented',
						'2 (28, 57)',
						'Two cases, both unmistakable from the top face alone'
					],
					['2', 'Squares', '2 (5, 6)', 'A mirror pair, seven turns each, one shape'],
					['3', 'T shapes', '2 (33, 45)', 'You already use 45 as the two-look line algorithm'],
					['4', 'C shapes', '2 (34, 46)', 'Two more cases with one shape between them'],
					['5', 'W shapes', '2 (36, 38)', 'A mirror pair built from turns you have'],
					['6', 'P shapes', '4 (31, 32, 43, 44)', 'Two mirror pairs; 43 and 44 are six turns each'],
					[
						'7',
						'Fish shapes',
						'4 (9, 10, 35, 37)',
						'Sune-shaped, and the recognition is distinctive'
					],
					[
						'8',
						'Lightning bolts',
						'6 (7, 8, 11, 12, 39, 40)',
						'Three mirror pairs, two of them seven turns each'
					],
					[
						'9',
						'Knight move shapes',
						'4 (13, 14, 15, 16)',
						'Two mirror pairs that need care told apart'
					],
					['10', 'Awkward shapes', '4 (29, 30, 41, 42)', 'Two mirror pairs, longer algorithms'],
					['11', 'L shapes', '6 (47, 48, 49, 50, 53, 54)', 'Six cases, one shape between them'],
					['12', 'I shapes', '4 (51, 52, 55, 56)', 'Four cases, one shape, wide turns throughout'],
					['13', 'Dots', '8 (1, 2, 3, 4, 17, 18, 19, 20)', 'Rarest per case, longest to execute']
				],
				caption:
					'Seven plus fifty gives fifty-seven. Groups one to six are fourteen algorithms, seven weeks at two a week — and at the end of them you are one-look on more than a third of your solves.'
			},
			{
				kind: 'note',
				tone: 'tip',
				title: 'Finish a group before starting the next',
				text: 'The point of small groups is the finishing. A group you have closed is a shape you never have to think about again, and that feeling is what carries you through the L shapes in month six. A half-finished group gives you nothing at all, because you still have to check whether this particular case is one of the ones you know.'
			},
			{ kind: 'heading', text: 'The two that come first' },
			{
				kind: 'prose',
				text: 'Both cases in the first group have every corner already oriented, which means the algorithm only has to flip edges. They are also two of the seven cases in the whole set that can be told apart from the top face alone, so they cost you nothing in recognition.'
			},
			{
				kind: 'alg',
				moves: "Rw U R' U' Rw' R U R U' R'",
				caption:
					'**OLL 28.** Every corner is yellow on top and two neighbouring edges are flipped, giving a fat blob of yellow with a bite out of one side. Ten turns, and it opens with a sexy move whose first turn is made wide.'
			},
			{
				kind: 'alg',
				moves: "R U R' U' M' U R U' Rw'",
				caption:
					"**OLL 57.** Every corner yellow again, but this time the two flipped edges are opposite each other, so the yellow makes a bar straight across the middle with a corner in each of the four positions. Nine turns, and the `M'` in the middle is the only awkward part."
			},
			{ kind: 'heading', text: 'A mirror pair, done properly' },
			{
				kind: 'prose',
				text: 'The squares are the first place to practise learning a case and its mirror together rather than months apart. They are the same seven turns with every right becoming a left and every direction reversed.'
			},
			{
				kind: 'alg',
				moves: "Rw' U2 R U R' U Rw",
				caption:
					'**OLL 5.** A solid two-by-two block of yellow, here sitting at the front-right of the top face.'
			},
			{
				kind: 'alg',
				moves: "Rw U2 R' U' R U' Rw'",
				caption:
					'**OLL 6.** The mirror. Same block, other hand. Learn the second one the day after the first, not the week after.'
			},
			{ kind: 'heading', text: 'Drilling a group' },
			{
				kind: 'prose',
				text: 'This is the part that decides whether the eight months work. The loop below takes about twenty minutes a day for a pair of cases, and about a week for a group of four.'
			},
			{
				kind: 'list',
				ordered: true,
				items: [
					'**Work out the fingers before the speed.** Run the algorithm at one turn a second and settle which finger makes each turn. Count the regrips; if there is more than one, look at the other versions on the set page before you commit.',
					'**Set the case up from solved.** Run the algorithm backwards — every turn reversed, in reverse order — and you are looking at the case. The trainer does this for you, which is the whole reason it exists.',
					'**Thirty slow repetitions of the new case.** Same fingers each time. Slow means slower than feels sensible.',
					'**Then the whole group shuffled.** This is the step people skip and it is the step that builds recognition. Set up a random case from the group, name it out loud, then solve it. Naming before turning is not optional — that is the skill you are buying.',
					'**Sleep on it.** Do the group cold the next morning before anything else. Anything you have to look up was not learnt, and it goes back to step three.',
					'**Only then, into solves.** Keep two-look ready as a fallback: if you cannot name the case within about two seconds, do the two-look route and carry on. Stalling mid-solve to dig for an algorithm teaches you to stall.',
					'**Leave the group alone for a fortnight, then test it cold.** What survives that is yours.'
				]
			},
			{
				kind: 'note',
				tone: 'warning',
				title: 'Do not learn an algorithm you cannot finger',
				text: 'An algorithm that needs two regrips will always be slower than the two-look route it replaced, and it will feel like the learning is not working. Every case in the library has at least one version chosen for the hands rather than the move count. Pick the one your fingers like, write it down, and never learn a second version of the same case unless you are deliberately replacing the first.'
			},
			{ kind: 'heading', text: 'Why the dots come last' },
			{
				kind: 'prose',
				text: 'The dot cases — no yellow edge facing up at all — are eight of the fifty-seven, and between them they account for one solve in eight. That is the same share the seven cross cases cover, and the cross cases were free.'
			},
			{
				kind: 'prose',
				text: 'They are also individually the rarest things in the set. Most OLL cases turn up about once in fifty-four solves. OLL 1 turns up once in a hundred and eight, and OLL 20 — every corner oriented, every edge flipped — once in two hundred and sixteen, which makes it the rarest case in CFOP. You could learn it in March and not meet it until June.'
			},
			{
				kind: 'prose',
				text: 'And they are the longest. Every dot algorithm in the library runs to eleven, twelve or thirteen turns, against six or seven for the squares and the shorter P shapes. Eight long algorithms, learnt last, for the least frequent eighth of your solves.'
			},
			{
				kind: 'note',
				tone: 'tip',
				title: 'What to do about dots in the meantime',
				text: "Keep doing two-look on them. Run `F R U R' U' F'` on any dot and you get a case with two edges oriented, which by then you will know one-look. It costs six turns and a look, it happens in one solve in eight, and it means you can leave the dots until last without a hole in your solving."
			},
			{
				kind: 'note',
				tone: 'history',
				text: "The dot algorithm most people meet first is the two-look pair run back to back without re-holding: `F R U R' U' F'` followed by `Fw R U R' U' Fw'`. Those twelve turns are a genuine one-look algorithm in their own right — they are OLL 2, one of the eight. So the first dot case is already in your hands, and it went in without anyone calling it OLL."
			},
			{ kind: 'heading', text: 'Keeping the solve honest while you learn' },
			{
				kind: 'list',
				items: [
					'Do not stop timing. You want to see the dip when a group goes in and the recovery a fortnight later; that curve is what tells you the pace is right.',
					'Do not learn a new group in the week you are also working on lookahead. One new thing at a time, always.',
					'If a case has been in your set for a month and you still hesitate, the problem is recognition, not memory. The next lesson is about that.',
					'Ten solves a day with a clean two-look last layer beat fifty solves a day spent hunting for half-learnt cases.'
				]
			},
			{
				kind: 'jump',
				href: '/algorithms/oll/',
				label: 'The 57 cases, grouped by shape',
				blurb: 'Every group above, in order, with move counts and alternative fingerings.'
			},
			{
				kind: 'jump',
				href: '/trainer/',
				label: 'Drill a group without setting cases up by hand',
				blurb:
					'Pick the set, and it shows a case, times your answer and brings back the ones you were slow on.'
			}
		]
	},

	{
		slug: 'oll-recognition',
		title: 'OLL recognition',
		summary:
			'Reading the case from the stickers instead of counting them, and the single sticker that separates each pair of lookalikes.',
		track: 'advanced',
		order: 42,
		minutes: 16,
		prerequisites: ['learning-oll-without-drowning'],
		teaches: ['oll'],
		outcomes: [
			'Narrow 57 cases to a handful with two glances rather than by counting stickers',
			'Read the side stickers as part of the case rather than as an afterthought',
			'Name the sticker that separates each pair of lookalikes you keep confusing',
			'Practise recognition on its own, away from the algorithms'
		],
		body: [
			{
				kind: 'prose',
				text: 'Once a group is in your hands, the time it costs you is recognition, not execution. A ten-turn algorithm at four turns a second takes two and a half seconds. Finding out which algorithm it is takes most people longer than that for months.'
			},
			{ kind: 'heading', text: 'Counting stickers does not work' },
			{
				kind: 'prose',
				text: 'The instinct is to count the yellow stickers on the top face. It tells you almost nothing. Twenty-one of the fifty-seven cases show exactly five yellow stickers up there, centre included, and another twelve show four.'
			},
			{
				kind: 'prose',
				text: 'Reading the *shape* rather than the count is better, and still not enough on its own. Fifty of the fifty-seven cases share their top-face pattern with at least one other case; only seven — OLL 17, 20, 25, 28, 39, 40 and 57 — can be identified from the top face alone. Everything else needs the sides.'
			},
			{
				kind: 'note',
				tone: 'insight',
				title: 'The stickers you cannot see are half the case',
				text: 'A case is fifty-seven possibilities spread across twenty-one stickers: nine on the top face and twelve more standing up around the sides. The twelve are where the corners point, and since a corner can point three ways and the top face only records one of them, the sides carry information the top face cannot. Reading them is not extra work. It is the other half of the case.'
			},
			{ kind: 'heading', text: 'Two glances' },
			{
				kind: 'prose',
				text: 'Take the case in two passes rather than trying to see it whole. The first pass is the edges, the second is the corners, and between them they cut fifty-seven cases down to at most twelve.'
			},
			{
				kind: 'prose',
				text: '**First, the edge shape.** Ignore the corners entirely and look at the four edge stickers on the top face. They make a cross, a line, an L, or a dot — the same four shapes you learnt for two-look.'
			},
			{
				kind: 'prose',
				text: '**Then count the corners showing yellow on top.** The answer is none, one, two or four. Three is impossible, for the reason the beginner method gave: the twists of the four corners have to balance out, and three corners already facing up leave the fourth with nothing to balance against.'
			},
			{
				kind: 'table',
				headers: ['Edge shape', 'No corners up', 'One corner up', 'Two corners up', 'All four up'],
				rows: [
					['Cross', '2 cases', '2 cases', '3 cases', 'solved'],
					['Line', '4 cases', '4 cases', '6 cases', '1 case'],
					['L', '6 cases', '8 cases', '12 cases', '1 case'],
					['Dot', '2 cases', '2 cases', '3 cases', '1 case']
				],
				caption:
					'Two glances, and the worst you can be left with is twelve. Three of the sixteen boxes hold a single case, four more hold two, and the average box holds four.'
			},
			{
				kind: 'note',
				tone: 'tip',
				text: 'Notice how the boxes line up with the groups you learnt in. Line with no corners up is exactly the four I shapes. Line with one corner up is exactly the four knight moves. L with no corners up is exactly the six L shapes. Learning in shape groups was already teaching you the recognition tree; this is the tree written out.'
			},
			{ kind: 'heading', text: 'The third glance: a single sticker' },
			{
				kind: 'prose',
				text: 'Inside a box, the cases differ only in where the remaining yellow stickers point — and almost always, one sticker decides. Finding that sticker for each pair you confuse, and writing it down, is what turns a three-second recognition into a half-second one.'
			},
			{
				kind: 'prose',
				text: 'Here is the pair everyone meets first. Both are T shapes: the same T of yellow on the top face, and nothing on the top face separates them.'
			},
			{
				kind: 'alg',
				moves: "R U R' U' R' F R F'",
				caption:
					'**OLL 33, the Key.** Hold the T with its bar on the right. The front face shows **two yellow stickers side by side** at its left-hand end — the front-left corner and the front edge — and the back face shows the same. Eight turns: sexy move, then sledgehammer.'
			},
			{
				kind: 'alg',
				moves: "F R U R' U' F'",
				caption:
					'**OLL 45, the T Shape.** Same T, same holding. Now the front face shows **one yellow sticker, in the middle**, and the two corner stickers have gone round to the left face instead. Six turns, and you have been doing it since two-look — this is the line algorithm.'
			},
			{
				kind: 'note',
				tone: 'insight',
				title: 'The check, in one sentence',
				text: 'With the bar of the T on your right, look at the front-left corner: yellow on the **front** means the Key, yellow on the **left** means the T Shape. One sticker, one decision, and nothing else on the cube needs looking at.'
			},
			{
				kind: 'prose',
				text: 'The three cases with a cross and two corners up work the same way, and you already know two of them. The top face separates the bowtie — its two oriented corners sit diagonally opposite, which is visible from above — and the sides separate the other two. Headlights has its two remaining yellow stickers side by side on one face. The chameleon has them on opposite faces, one pointing at you and one pointing away.'
			},
			{ kind: 'heading', text: 'Hold it the same way every time' },
			{
				kind: 'prose',
				text: 'Recognition is a habit rather than a calculation, and habits need a fixed viewpoint. Decide now that you read every case with the same two faces towards you, and re-hold to that position rather than reading the case from wherever the last F2L pair left you.'
			},
			{
				kind: 'list',
				items: [
					'Read the top face at a slight angle, so the front and left side stickers are visible without moving your head. Most people settle on tilting the cube away from them.',
					'Never turn the cube over to look. If you cannot see the case, you are holding it wrong, and the fix is a habit rather than a rotation.',
					'The `U` turn you make to line the case up is part of the algorithm, not part of the recognition. Decide the case first, then decide the turn.'
				]
			},
			{
				kind: 'note',
				tone: 'warning',
				title: 'Recognising from the wrong angle',
				text: 'A case seen from the back looks like a different case, and there is a whole category of solve-ruining mistakes that come from reading a shape while the cube is still rotated from the last insertion. If a case took you longer than usual, check afterwards whether you were holding it the way you drilled it. Usually you were not.'
			},
			{ kind: 'heading', text: 'Where the recognition should happen' },
			{
				kind: 'prose',
				text: 'The last three turns of the final F2L pair are the most valuable in the solve. Your hands are busy with something they know, so your eyes are free — and the top face is already showing you most of the case, because inserting a pair does not touch the edges you are about to read.'
			},
			{
				kind: 'prose',
				text: 'Getting the edge shape during that insertion, and the corner count immediately after, takes the OLL pause from a second to nearly nothing. This is the same skill as lookahead in F2L, applied to a place with less going on, because there is only one thing to look at.'
			},
			{ kind: 'heading', text: 'Practising recognition on its own' },
			{
				kind: 'list',
				ordered: true,
				items: [
					'**Name, do not solve.** Set up a case, say the name out loud, check, move on. Sixty cases in five minutes, and no turning at all beyond the setups.',
					'**Time the naming.** Anything over a second and a half goes on a list. The list is your next practice session.',
					'**Drill the confusions, not the set.** If you mix up the two knight moves, drill those two against each other twenty times. Drilling all fifty-seven when six are the problem wastes an hour.',
					'**Write down your own check.** For each pair you confuse, write the one sticker that decides, in your own words. The act of writing it is most of the benefit.'
				]
			},
			{
				kind: 'note',
				tone: 'tip',
				text: 'Two-sided recognition — reading the case without moving your head or the cube — is worth building from the start for the same reason it matters in PLL. It is much harder to unlearn a habit of tilting the cube than it is to start without one.'
			},
			{
				kind: 'jump',
				href: '/trainer/',
				label: 'Recognition drills, timed',
				blurb:
					'Shows a case, times your answer, and comes back more often to the ones you are slow on.'
			},
			{
				kind: 'jump',
				href: '/algorithms/oll/',
				label: 'The cases, side by side',
				blurb:
					'Groups laid out together, which is the view that makes the differences between lookalikes obvious.'
			}
		]
	},

	{
		slug: 'learning-pll-properly',
		title: 'Learning PLL properly',
		summary:
			'All twenty-one, recognised by headlights and blocks, and why this is the set where fluency pays back most.',
		track: 'advanced',
		order: 43,
		minutes: 20,
		prerequisites: ['committing-to-full-cfop'],
		teaches: ['pll'],
		outcomes: [
			'Split the 21 cases into three families with one glance at the corners',
			'Tell the four G permutations apart, which is the hardest recognition in the set',
			'Take the cases in an order that keeps the recognition coherent',
			'Say why PLL repays drilling more than any other set'
		],
		body: [
			{
				kind: 'prose',
				text: 'Twenty-one algorithms, and you use one of them in every solve you will ever do. No other set on the cube has that property: an F2L case might not appear, an OLL case turns up once in fifty-four solves, but the last layer always has to be permuted, and there are only twenty-one ways it can need doing.'
			},
			{
				kind: 'prose',
				text: 'That is why this is the set to make fluent rather than merely known. Taking a T permutation from two and a half seconds to one and a quarter is a second and a quarter off every single solve, for a fortnight of drilling and nothing new memorised.'
			},
			{ kind: 'heading', text: 'How often each one comes up' },
			{
				kind: 'prose',
				text: 'Sixteen of the twenty-one turn up about once in eighteen solves — so if you solve twenty times a day, you meet each of them roughly every other day. Five are rarer: the Z and E permutations about once in thirty-six, and the H and the two N permutations once in seventy-two. A skip, where the layer is already permuted, is also one in seventy-two.'
			},
			{
				kind: 'note',
				tone: 'insight',
				title: 'The rare ones are not optional',
				text: 'One in seventy-two sounds negligible until you notice it is once every three or four days of ordinary practice, and that the N permutations are among the longest algorithms in the set. A case you meet twice a week and fumble both times is costing you more than a case you meet daily and run cleanly.'
			},
			{ kind: 'heading', text: 'Recognition: corners first' },
			{
				kind: 'prose',
				text: 'Look at the two top-layer corners on each of the four faces and ask one question: do they show the same colour? A face where they do is showing **headlights**, and it means those two corners are already correct relative to each other.'
			},
			{
				kind: 'list',
				items: [
					'**Four faces with headlights** — the corners are done. One of the four edge-only cases: Ua, Ub, H or Z.',
					'**Exactly one face with headlights** — two adjacent corners need swapping. Twelve cases, including all four G permutations.',
					'**No headlights anywhere** — the two corners that need swapping are diagonally opposite. Five cases: E, V, Y, Na, Nb.'
				]
			},
			{
				kind: 'prose',
				text: 'There is no other possibility. Two faces with headlights cannot happen, and neither can three, which makes this the cheapest question in the whole of CFOP: ask it of each face and twenty-one cases become four, twelve or five.'
			},
			{ kind: 'heading', text: 'Then the blocks' },
			{
				kind: 'prose',
				text: 'A **block** is two neighbouring stickers of the same colour on one face — a corner and the edge beside it. A face showing all three the same is a **solved bar**: that face needs nothing doing. Counting blocks splits each family neatly.'
			},
			{
				kind: 'table',
				headers: ['What you see', 'What it is'],
				rows: [
					['Four faces of headlights, one of them a solved bar', 'Ua or Ub — three edges cycling'],
					['Four faces of headlights, no bar', 'H or Z — the edges swap in pairs'],
					['One headlight face, a solved bar, blocks on the other three', 'Ja or Jb'],
					['One headlight face and two blocks', 'Aa, Ab or T'],
					['One headlight face and one block', 'Ra, Rb, or one of the four G permutations'],
					['One headlight face, a solved bar, and no blocks at all', 'F'],
					[
						'No headlights and nothing else either',
						'E — the corners swap diagonally, the edges are done'
					],
					['No headlights, a block on every face', 'Na or Nb'],
					['No headlights and two blocks', 'V or Y']
				],
				caption:
					'Two glances — headlights, then blocks — and no case has more than six candidates left. The colours of the blocks finish the job.'
			},
			{
				kind: 'note',
				tone: 'tip',
				title: 'Na and Nb, in one glance',
				text: 'Both N permutations show a block on every one of the four faces, and nothing else in the set does. Which is which is one more look: **Na has all four blocks on the right-hand end of their face, Nb has all four on the left**. It is the tidiest recognition in the whole set, sitting on two of the cases people find hardest.'
			},
			{
				kind: 'note',
				tone: 'tip',
				title: 'V and Y',
				text: 'Both show no headlights and two blocks. In the **V** the two blocks meet at the same corner, wrapping round it. In the **Y** they are on opposite sides of the cube, diagonally apart.'
			},
			{ kind: 'heading', text: 'The four G permutations' },
			{
				kind: 'prose',
				text: 'These are the ones people leave until last and then find they cannot tell apart, which is a shame, because between them they turn up in about one solve in five. Learn them as a family of four, in one fortnight, using one consistent check.'
			},
			{
				kind: 'prose',
				text: "Hold the case with the **headlights at the back**. There is now exactly one block anywhere on the cube, and it touches either the front-left corner or the front-right corner. Which corner, and which of that corner's two faces the block lies on, names the case."
			},
			{
				kind: 'table',
				headers: ['The block is', 'It is'],
				rows: [
					['On the front face, at the left — front-left corner with the front edge', 'Gd'],
					['On the left face, at the front — front-left corner with the left edge', 'Ga'],
					['On the front face, at the right — front-right corner with the front edge', 'Gb'],
					['On the right face, at the front — front-right corner with the right edge', 'Gc']
				],
				caption:
					'Headlights at the back, then one question: which corner does the block touch, and does it run along the front face or round the side.'
			},
			{
				kind: 'alg',
				moves: "R2 Uw R' U R' U' R Uw' R2 F' U F",
				caption:
					'**Ga.** Twelve turns, held together by a pair of wide `Uw` turns that let the whole thing run without a regrip. There is a version with `D` turns instead if wide turns of the top layer feel wrong; it costs three more moves. The other three G permutations are close enough in shape that the fourth takes an afternoon once you have the first three.'
			},
			{ kind: 'heading', text: 'An order for the twenty-one' },
			{
				kind: 'prose',
				text: 'Recognition is the reason for this order rather than difficulty. Cases that are read the same way are learnt together, so each group closes a branch of the tree above.'
			},
			{
				kind: 'table',
				headers: ['Order', 'Cases', 'Why here'],
				rows: [
					['—', 'Ua, Ub, H, Z, Aa, Ab', 'Already known from two-look'],
					['1', 'T, Ja, Jb', 'Short, common, and the blocks make them unmistakable'],
					['2', 'F, Ra, Rb', 'The rest of the adjacent-swap family bar the G permutations'],
					['3', 'Y, V', 'Diagonal swaps, two blocks each, told apart in one look'],
					['4', 'E, Na, Nb', 'The rest of the diagonal family; E may already be known'],
					['5', 'Ga, Gb, Gc, Gd', 'Last, together, with the check above']
				],
				caption:
					'Fifteen cases in five groups, and you will already have one of E or Y from two-look depending on which diagonal algorithm you were taught — so fourteen new. At two a week that is seven weeks, of which the last two are the G permutations on their own.'
			},
			{
				kind: 'alg',
				moves: "R U R' U' R' F R2 U' R' U' R U R' F'",
				caption:
					'**The T permutation.** Swaps two adjacent corners and the two edges beside them. Fourteen turns, no regrips for most hands, and the algorithm most people can do fastest — which makes it the right one to set your standard by.'
			},
			{
				kind: 'alg',
				moves: "R U R' F' R U R' U' R' F R2 U' R' U'",
				caption:
					"**The Jb permutation.** One face is completely solved — the bar — and the other three faces each show a block at the same end. Ja is its mirror, with the blocks at the other end. Written here with the final `U'` included, because that turn is part of the solve whether or not the list you copied it from says so."
			},
			{ kind: 'heading', text: 'Two-sided recognition' },
			{
				kind: 'prose',
				text: 'The goal is to name the case from the two faces you can see without moving the cube or your head. It is worth being honest about why this is harder than it sounds: the pattern of headlights and blocks on two faces does not always pick out a single case, and for some pairs of faces it leaves as many as eight candidates. What finishes the job is the **colours** — not that there is a block, but that the block is the blue one and the face beyond it is red.'
			},
			{
				kind: 'prose',
				text: 'So two-sided recognition is learnt case by case rather than as a rule, and it takes a few months. Start it early anyway. Every rotation you make to see the back of the cube costs you about a third of a second and, worse, arrives at a cube you have to re-read.'
			},
			{
				kind: 'note',
				tone: 'warning',
				title: 'The turn nobody writes down',
				text: 'Every PLL needs a turn of the top face before it, to line the case up, and usually one after it, to finish the cube. Neither appears in the written algorithm and both cost you time. Drill the finish: run the algorithm, find the final turn, and stop the clock only when the cube is actually solved.'
			},
			{ kind: 'heading', text: 'Drills that work on this set' },
			{
				kind: 'list',
				items: [
					'**The time attack.** All twenty-one in a row, timed, from a list. Under a minute is a reasonable first target; solvers with a fast last layer manage half that. It is the single most informative minute of practice in cubing, because the slow ones announce themselves.',
					'**Four angles.** Take one case and drill it from all four positions of the top layer, so that recognising it never depends on which face you happened to be looking at.',
					'**Mirror pairs together.** Ja against Jb, Ra against Rb, Ua against Ub, and — once you meet them — Ga against Gc and Gb against Gd. Drilling a case against the one it is confused with is worth more than drilling it alone.',
					'**Recognition only.** Set up a case, name it, do not solve it. Twenty cases a minute, and it is the drill that moves your times most in the week before a competition.'
				]
			},
			{
				kind: 'note',
				tone: 'history',
				text: "The letters are not initials of anything. Most of them come from the way the old lists drew the cases: arrows showing which piece goes where, so the H permutation's arrows make an H, the Z permutation's make a Z, and the U permutation's make a U. Some of the others take a generous eye, and a few are the letters that happened to be left over. Nobody has renamed them since, which is why a set of twenty-one algorithms is labelled like a seating plan."
			},
			{
				kind: 'jump',
				href: '/algorithms/pll/',
				label: 'All 21 permutation cases',
				blurb: 'Grouped by what the corners do, with recognition notes and alternative fingerings.'
			},
			{
				kind: 'jump',
				href: '/trainer/',
				label: 'A timed PLL drill',
				blurb: 'Set it to PLL and it will keep handing you the cases you are slowest on.'
			}
		]
	},

	{
		slug: 'cross-to-first-pair',
		title: 'Cross to first pair',
		summary:
			'What to plan in fifteen seconds beyond the cross, and how to come out of it already knowing which pair goes in first.',
		track: 'advanced',
		order: 44,
		minutes: 16,
		prerequisites: ['planning-the-cross', 'lookahead'],
		outcomes: [
			'Plan a full cross and track one F2L pair through it during inspection',
			'Choose the first slot deliberately rather than taking whatever appears',
			'Say what to do in the quarter of solves where no pair is ready',
			'Start the solve without a pause between the cross and the first insertion'
		],
		body: [
			{
				kind: 'prose',
				text: 'The pause between finishing the cross and starting the first pair is the most avoidable second in the solve. Everything you need to remove it happens before the timer starts, in a fifteen-second window where your hands are still and the cube is not changing.'
			},
			{ kind: 'heading', text: 'The cross is smaller than it feels' },
			{
				kind: 'prose',
				text: "Across five hundred random scrambles solved by this site's own cross solver, the shortest cross averaged **5.7 turns** and never needed more than seven; over all possible scrambles the worst case is eight. Half of all scrambles have a six-turn cross, and about a third are five or fewer."
			},
			{
				kind: 'prose',
				text: 'Six turns is two seconds of turning. If your inspection is spent entirely on the cross, you are spending fifteen seconds planning two seconds of solve, and arriving at the F2L with nothing.'
			},
			{
				kind: 'note',
				tone: 'insight',
				title: 'Plan the cross in the first five seconds',
				text: 'Not because the remaining ten are enough for the rest — they are not — but because everything worth doing with them depends on knowing exactly what the cross will do to the cube. You cannot track a corner through turns you have not chosen yet.'
			},
			{ kind: 'heading', text: 'What to look at next' },
			{
				kind: 'prose',
				text: 'With the cross planned, use the rest of inspection on one pair. Not two, not all four. One pair, tracked properly, is worth more than four pairs glanced at.'
			},
			{
				kind: 'list',
				ordered: true,
				items: [
					'**Find a corner with white on it that is in the top layer.** Corners are harder to find mid-solve than edges, which is why the corner is the piece to commit to memory.',
					'**Find its edge.** The two colours of the corner other than white tell you exactly which edge you want.',
					'**Work out where the cross moves put them.** This is the part that takes practice. You are not tracking pieces through a scramble — you chose the turns, so you know what each one does.',
					'**Decide which slot they go into and where that slot will be when the cross finishes.** Not "the front-right slot" but "the slot between green and red, which will be on my left".'
				]
			},
			{
				kind: 'note',
				tone: 'tip',
				title: 'Track the corner, not the pair',
				text: 'Following two pieces through six turns is about four times as hard as following one, and it is unnecessary. Track the corner. The edge will be somewhere in the top layer and you will see it in the half-second after the cross goes in — a period during which your hands are already moving towards the corner.'
			},
			{ kind: 'heading', text: 'One solve in four gives you nothing' },
			{
				kind: 'prose',
				text: 'It is worth knowing what a normal scramble actually offers. Taking the same five hundred scrambles and building the shortest cross on each, then counting the pairs whose corner *and* edge both finish in the top layer, free to be paired without disturbing anything:'
			},
			{
				kind: 'table',
				headers: ['Pairs with both pieces free after the cross', 'Share of scrambles'],
				rows: [
					['None', '27%'],
					['One', '48%'],
					['Two', '23%'],
					['Three', '2%']
				],
				caption:
					'About one pair on average, and in more than a quarter of solves not a single one. A first pair is not something the scramble owes you.'
			},
			{
				kind: 'prose',
				text: 'When nothing is free, the plan is different and you should have it ready rather than discovering it with the timer running. Find a corner that is stuck in a slot it does not belong in and plan the three turns that lift it out. The extraction is not a wasted move — it puts the corner in the top layer where you can use it, and it usually brings its edge up too.'
			},
			{
				kind: 'note',
				tone: 'warning',
				title: 'The slot you go to first is a choice',
				text: 'Most people insert into whichever slot the first pair happens to suit, and then rotate. Try instead to pick the pair whose slot is at the **front-right or back-right** with the cube held as the cross leaves it. Right-hand slots need no rotation, and a rotation at that point costs you about as much as the insertion.'
			},
			{ kind: 'heading', text: 'Rotations' },
			{
				kind: 'prose',
				text: 'Count them for a few solves. Most people at thirty seconds make five or six cube rotations; a sub-twenty solve has one or two. They are expensive twice over: the turn itself, and the fact that you come out of it looking at a cube from a new angle with your tracking lost.'
			},
			{
				kind: 'list',
				items: [
					'Filling the two right-hand slots first, then rotating once, is a good default and costs nothing to adopt.',
					'`y` rotations during F2L are worth it when they turn an awkward back-left insertion into a routine front-right one. Rotating to *look* at something is not.',
					'The rotation to avoid entirely is the one at the end of the cross. If your cross plan finishes with the cube facing the wrong way, plan the cross edges in a different order.'
				]
			},
			{ kind: 'heading', text: 'X-cross, honestly' },
			{
				kind: 'prose',
				text: 'An X-cross is a cross that solves one F2L pair along the way, so you come out of it with the cross and a quarter of the F2L done. It saves two or three seconds when it works.'
			},
			{
				kind: 'prose',
				text: 'It is worth attempting only when the pair is nearly free already — the corner and edge joined, or a single turn from joined, and sitting where a cross edge is going anyway. Hunting for one on every scramble costs more inspection time than it returns, and a failed X-cross leaves you with a solved cross, no plan, and eight seconds gone.'
			},
			{
				kind: 'note',
				tone: 'tip',
				text: 'Try X-crosses in untimed solves for a month before you allow one into a timed solve. The skill it actually builds is planning the cross in a different order to suit something else, and that is useful even on the solves where the X-cross does not appear.'
			},
			{ kind: 'heading', text: 'Drills' },
			{
				kind: 'list',
				ordered: true,
				items: [
					'**Cross with your eyes shut.** Inspect for fifteen seconds, close your eyes, do the cross. If you cannot, you had not planned it — you were reading it as you went.',
					'**Cross plus one pair, then stop.** Twenty of these takes ten minutes. Count how often the pair you planned actually went in as planned; at the start it will be about half.',
					'**Say the plan out loud** before you start: "cross is F, R prime, D two, L; the corner is the green-orange-white one, it is at the back-right and it ends up at the front-left." Saying it is what shows you whether you had it.',
					'**Count your rotations** for ten solves and write the number down. That single number moves more than most drills do.'
				]
			},
			{
				kind: 'note',
				tone: 'insight',
				title: 'What colour neutrality is worth',
				text: 'Building the cross on whichever colour the scramble favours saves about a second, mostly by giving you a shorter cross and a better first pair. Full neutrality means learning to see six crosses where you see one and takes months. Learning **two** colours — white and yellow, since the pieces you look for are the same ones — gets most of the benefit for a fraction of the work, and is the version worth doing while your times are still coming down for other reasons.'
			},
			{
				kind: 'jump',
				href: '/timer/',
				label: 'Inspection, timed properly',
				blurb:
					'Fifteen seconds, a scramble, and the averages that tell you whether the habit is bedding in.'
			},
			{
				kind: 'jump',
				href: '/solve/',
				label: 'Compare your cross with the shortest one',
				blurb:
					'Paint in the cube and the solver will show you the cross it would have built, and how long yours was.'
			}
		]
	},

	{
		slug: 'getting-to-sub-20',
		title: 'Getting to sub-20',
		summary:
			'Where the twenty seconds go, what to measure, and why the answer is almost never that your hands are too slow.',
		track: 'advanced',
		order: 45,
		minutes: 14,
		prerequisites: ['cross-to-first-pair'],
		outcomes: [
			'Break your solve into four splits and say which one is costing you',
			'Tell a lookahead problem, a recognition problem and a turning problem apart',
			'Build a practice week that works on one thing at a time',
			'Say honestly which algorithms sub-20 requires and which it does not'
		],
		body: [
			{
				kind: 'prose',
				text: 'A twenty-second solve is about sixty turns. Sixty turns in twenty seconds is three turns a second, which is an unhurried pace — you can watch someone do it and think they are being careful. Nothing about sub-20 requires fast hands.'
			},
			{
				kind: 'prose',
				text: 'What it requires is that the twenty seconds are nearly all turning. That is the whole problem, and every measurement below is a way of finding out where they are not.'
			},
			{ kind: 'heading', text: 'The budget' },
			{
				kind: 'table',
				headers: ['Step', 'Turns', 'Time', 'What it looks like'],
				rows: [
					['Cross', 'about 6', '2 s', 'Planned in inspection, run without looking at it'],
					['F2L', 'about 28', '10 s', 'Four pairs, no pause between them, at most two rotations'],
					['OLL', 'about 10', '3 s', 'Case read during the last insertion'],
					['PLL', 'about 13', '4 s', 'Corners read as the OLL algorithm finishes'],
					['Alignment turns', 'about 3', '1 s', 'The turns nobody writes down']
				],
				caption:
					'Sixty turns, twenty seconds, three turns a second throughout. If your F2L takes sixteen seconds and everything else matches, you have found your problem without needing any other diagnosis.'
			},
			{
				kind: 'note',
				tone: 'insight',
				title: 'Two-look is not what is stopping you',
				text: 'Two-look last layer adds about three seconds to that budget, which puts sub-20 at the edge of reach rather than out of it. Plenty of people are sub-20 with two-look OLL and full PLL. If your F2L is twelve seconds, learning fifty more orientation cases will not make you sub-20 and twelve months of it will not either.'
			},
			{ kind: 'heading', text: 'What to measure' },
			{
				kind: 'prose',
				text: 'Averages tell you whether you are improving. They do not tell you what to do next. Four measurements do.'
			},
			{
				kind: 'list',
				items: [
					'**Splits.** Stop the timer when the cross is done, then again after F2L. Do it ten times and average each. Nothing else you measure is as useful as knowing your F2L time on its own.',
					'**Pauses over half a second.** Film one solve on a phone and count them. Most people at thirty seconds have six or seven; a sub-20 solve has one or two.',
					'**Rotations.** Count them in the same video. Five or six means the F2L is being solved wherever the pieces happen to be rather than where you decided.',
					'**Turns per second.** Count the turns in the video and divide. Almost everyone finds this number is already high enough, which is the useful part — it tells you to stop trying to move faster.'
				]
			},
			{
				kind: 'table',
				headers: ['You stop here', 'It is really', 'What to do about it'],
				rows: [
					[
						'Before the first turn',
						'The cross was not planned',
						'Inspection drills: cross, then cross plus one pair'
					],
					[
						'After the cross',
						'No first pair planned',
						'Track one corner through the cross during inspection'
					],
					[
						'Between pairs',
						'Lookahead',
						'Slow solves at two turns a second with no pauses allowed'
					],
					[
						'Halfway through a pair',
						'You started it without a plan',
						'Decide the whole insertion before the first turn of it'
					],
					[
						'After the last pair',
						'OLL recognition',
						'Recognition-only drills, and read the case during the insertion'
					],
					[
						'After OLL',
						'PLL recognition',
						'Learn to read the corners as the OLL algorithm finishes'
					],
					[
						'After PLL',
						'The alignment turn',
						'Drill finishing: stop the clock only when the cube is solved'
					]
				],
				caption:
					'Filming one solve and going through it with this table takes ten minutes and is worth more than an hour of practice.'
			},
			{ kind: 'heading', text: 'A practice week' },
			{
				kind: 'prose',
				text: 'Practice that is all timed solves stops working somewhere around twenty-five seconds. The mix below is about forty minutes a day and it keeps one thing at a time under repair.'
			},
			{
				kind: 'list',
				items: [
					'**Twenty slow solves.** Two turns a second, no pauses permitted. This is the lookahead drill and it is the most valuable thing on the list.',
					'**One average of twelve, timed properly.** With inspection. This is your measurement, not your practice.',
					'**One PLL time attack.** All twenty-one in a row, against the clock.',
					'**One OLL group.** Whichever group you are learning, or whichever one the recognition list says you are slow on.',
					'**Ten cross-plus-first-pair drills.** Fifteen seconds of inspection, then cross and one pair, then stop.',
					'**One rest day a week.** Fingers and recognition both consolidate overnight, and a week with a day off in it beats a week without one.'
				]
			},
			{
				kind: 'note',
				tone: 'warning',
				title: 'Personal bests tell you nothing',
				text: 'A single fast solve is a scramble that suited you plus a skip. Judge everything on an average of twelve, and expect that average to move in steps with plateaus between them rather than smoothly. A fortnight with no improvement is normal and is not evidence that what you are doing is wrong.'
			},
			{ kind: 'heading', text: 'What sub-20 feels like' },
			{
				kind: 'prose',
				text: 'It is quieter than it looks from below. The last layer stops being the exciting part and becomes a rest — two algorithms your hands run while your mind is already finished. The F2L stops feeling like four separate problems. And the solve stops having a moment where you look at the cube and think.'
			},
			{
				kind: 'prose',
				text: 'The next barrier is at about fifteen seconds, and it is a different animal: that one does want full OLL, and it wants F2L solutions chosen for what they leave behind rather than for what they cost. Before any of that, there is a good case for staying at twenty for a month and making it consistent, because an average of twelve at nineteen seconds with no solve above twenty-two is a much better foundation than one that swings between fourteen and twenty-eight.'
			},
			{
				kind: 'jump',
				href: '/timer/',
				label: 'Averages of five and twelve',
				blurb:
					'The numbers competitions use, and the only ones worth judging a fortnight of practice by.'
			},
			{
				kind: 'jump',
				href: '/tips/',
				label: 'Drills, hardware and habits',
				blurb: 'Short specific things to try, sorted by what you are working on.'
			},
			{
				kind: 'jump',
				href: '/learn/',
				label: 'What comes after CFOP',
				blurb:
					'COLL and Winter Variation, Roux and ZZ, and the point at which you stop looking algorithms up.'
			}
		]
	}
];
