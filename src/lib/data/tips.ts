/**
 * Tips.
 *
 * The test every entry here had to pass: could a reader act on it in their next
 * practice session, and would they know afterwards whether they had? "Practise
 * more" fails that test. "Turn at about two-thirds of your top speed and never
 * stop moving, even when it feels wrong" passes it.
 *
 * Tips are authored grouped by category because that is how the gaps show up —
 * six lookahead tips and one on hardware would mean something was missing. The
 * page sorts and filters them itself.
 *
 * `tier` is the earliest level at which the tip is worth acting on, not the level
 * at which it stops mattering. Almost everything in here still applies later; it
 * is the point where it first becomes the most useful thing you could change.
 */

import type { Tip } from './types';

export const TIPS: readonly Tip[] = [
	// --- Lookahead -----------------------------------------------------------
	{
		id: 'turn-slower-than-you-can',
		title: 'Turn slower than you can, so you never wait for your eyes',
		body: 'This is the single change that moves most people the furthest. Pick a speed around two-thirds of your fastest turning and hold it for the whole solve without stopping. A continuous solve at four turns a second beats a stuttering one at eight, because the pauses are longer than the turns they interrupt. Your hands are almost never the limit — your eyes are, and slowing your hands lets them catch up.',
		category: 'lookahead',
		tier: 'beginner'
	},
	{
		id: 'eyes-ahead-of-hands',
		title: 'While your hands do a pair you know, your eyes should be on the next one',
		body: 'An algorithm you have drilled needs no supervision. The moment you commit to a pair, stop watching it and start hunting for the next corner and edge. If that feels impossible, train it directly: pick one edge before you start and keep your eyes on it for the whole solve, losing it and finding it again. Tracking a piece through turns is the entire mechanical skill behind lookahead, and it is quicker to learn on purpose than by accident.',
		category: 'lookahead',
		tier: 'intermediate'
	},
	{
		id: 'slow-solve-drill',
		title: 'Do a sixty-second solve on purpose',
		body: 'Set yourself a target of sixty seconds and use every one of them. The rule is that the cube never stops moving and you never look for a piece you have not already found. If you have to break the rule, you were going too fast. Two or three of these at the start of a session are worth more than the twenty timed solves that follow.',
		category: 'lookahead',
		tier: 'intermediate'
	},
	{
		id: 'cross-on-the-bottom',
		title: 'Keep the cross on the bottom, even though you cannot see it',
		body: 'Building the cross on the bottom and leaving it there means you never rotate the cube to check it, and it forces you to track the edges rather than watch them. It is worse for about a week and better for ever afterwards. If you learnt with the cross on top, this is the change worth making before any algorithm learning.',
		category: 'lookahead',
		tier: 'beginner'
	},
	{
		id: 'plan-the-cross',
		title: 'Plan the whole cross during inspection, then look for the first pair',
		body: 'Fifteen seconds is enough to plan four edges once you have practised it for a fortnight — start by planning two, then three. When the cross is planned you are free to spend the execution finding your first pair, which means you begin F2L with no pause at all. Cross planning is the highest-value use of inspection by a wide margin.',
		category: 'lookahead',
		tier: 'intermediate'
	},
	{
		id: 'pair-you-can-see',
		title: 'Solve the pair you can see, not the pair in front of you',
		body: 'There is no order to F2L. If the front-right slot is awkward and the back-left pair is sitting in plain sight, do the back-left one. Rotating to reach a pair you have already found is cheaper than searching for the one you wanted, and much cheaper than forcing an insertion you have not planned.',
		category: 'lookahead',
		tier: 'intermediate'
	},
	{
		id: 'last-slot-into-oll',
		title: 'Recognise your OLL while the last pair is still going in',
		body: 'The final F2L insertion tells you most of what you need. Watch the top edges as the pair drops — by the time your hands finish, you should already know whether you have a dot, a line, an L or a cross, and often the whole case. This one habit removes a full pause from every solve and costs nothing but attention.',
		category: 'lookahead',
		tier: 'advanced'
	},
	{
		id: 'pause-before-not-during',
		title: 'If you must pause, pause before the algorithm rather than inside it',
		body: 'A pause in the middle of an algorithm means a regrip and a lost thread, and it usually means you started before you had recognised the case. Take the extra fifth of a second up front, then execute without stopping. Fast solves are not pause-free; they have their pauses in the cheap places.',
		category: 'lookahead',
		tier: 'advanced'
	},

	// --- Finger tricks -------------------------------------------------------
	{
		id: 'push-dont-grip',
		title: 'Push the layer, do not grip and rotate',
		body: 'A turn should come from one finger flicking a layer while the rest of the hand holds the cube still. If your whole hand rotates, the cube has to be re-found afterwards and you have paid for the turn twice. Watch your knuckles: if they move much, you are gripping.',
		category: 'fingertricks',
		tier: 'beginner',
		alg: "R U R' U'"
	},
	{
		id: 'sexy-move-fingering',
		title: 'Learn one fingering for the sexy move and never use another',
		body: 'Right ring finger for R, left index pushing U, right index for R prime, right thumb for U prime. It is the most common four moves on the cube and appears inside dozens of algorithms, so the fingering you use here sets your ceiling everywhere. Get it from a video rather than inventing it, and do it slowly a hundred times before doing it quickly once — speed comes from the fingering, and the fingering is decided in the first few dozen attempts.',
		category: 'fingertricks',
		tier: 'beginner',
		alg: "R U R' U'"
	},
	{
		id: 'double-flick-u2',
		title: 'Do U2 with two fingers, not one finger twice',
		body: 'Index then middle finger of the same hand, in one motion. Turning U twice with the same finger needs a reset between the halves, which is a wasted beat in an algorithm you will do thousands of times. The same idea applies to R2 with the ring finger and then the middle.',
		category: 'fingertricks',
		tier: 'intermediate',
		alg: 'M2 U M2 U2 M2 U M2'
	},
	{
		id: 'sledgehammer-and-hedgeslammer',
		title: 'Learn the sledgehammer and its inverse as one thing',
		body: 'R prime F R F prime and its reverse, F R prime F prime R, are the second most useful trigger after the sexy move. The F prime is a left index push, not a wrist turn. Learning both directions together costs almost nothing extra and covers twice as many F2L cases.',
		category: 'fingertricks',
		tier: 'intermediate',
		alg: "R' F R F'"
	},
	{
		id: 'm-slice-grip',
		title: 'The M slice is a left ring finger pulling down and a left index pushing up',
		body: 'M with the ring finger, M prime with the index, with the cube held between the right thumb and fingers so the left hand is free to do nothing else. If you are turning M with your right hand or rotating the cube to reach it, that is the thing to fix — every last-layer edge algorithm and the whole of Roux depends on it.',
		category: 'fingertricks',
		tier: 'intermediate',
		alg: "M2 U' M U2 M' U' M2"
	},
	{
		id: 'wide-turn-not-rotation',
		title: 'A wide turn is a rotation you did not have to make',
		body: 'Rw is R and the slice behind it, which leaves the cube in the same orientation as an x rotation but keeps your hands where they were. Wherever an algorithm asks for a rotation followed by a turn, look for the wide-turn version instead. Many published OLL algorithms are written the slower way for no better reason than that it is how they were first typed out.',
		category: 'fingertricks',
		tier: 'intermediate',
		alg: "Rw U R' U' Rw' F R F'"
	},
	{
		id: 'mirror-your-triggers',
		title: 'Learn the left-handed mirror of the triggers you use most',
		body: 'L prime U prime L U is the sexy move on the other side, and knowing it means you can insert a pair into the front-left slot without rotating to get at it. Start with the sexy move and the sledgehammer. Your left hand will be embarrassing for a fortnight; that is the point.',
		category: 'fingertricks',
		tier: 'advanced',
		alg: "L' U' L U"
	},
	{
		id: 'learn-algs-slowly-first',
		title: 'The first fifty repetitions of a new algorithm should be slow and deliberate',
		body: 'Speed comes from the fingering, and the fingering is decided in the first few dozen attempts. If you drill a new case fast before you have chosen where each finger goes, you memorise the mess and then have to unlearn it. Do it slowly enough to notice every regrip, then remove the regrips, then go faster.',
		category: 'fingertricks',
		tier: 'intermediate'
	},
	{
		id: 'count-your-regrips',
		title: 'Count the regrips in your worst algorithm',
		body: 'Film one algorithm and count how many times you let go of the cube to reposition your hand. Every regrip is roughly the cost of two turns. Most people have one or two algorithms carrying three unnecessary regrips, and replacing those with a better-fingered version of the same case is the cheapest time you will ever buy.',
		category: 'fingertricks',
		tier: 'advanced'
	},
	{
		id: 'cancellations',
		title: 'Look at the join between two algorithms',
		body: 'When an algorithm ends in U prime and the next begins with U, those two moves cancel and you should never do either. The last-slot-into-OLL and OLL-into-PLL joins are where this pays: two or three moves a solve, taken by noticing rather than by turning faster. Once you have full OLL and PLL this is one of the few gains left that costs no memorisation.',
		category: 'fingertricks',
		tier: 'expert'
	},

	// --- Practice ------------------------------------------------------------
	{
		id: 'two-look-before-full',
		title: 'Finish two-look OLL and PLL completely before touching the full sets',
		body: 'Ten OLL algorithms and six PLL ones give you a complete last layer in two looks, and they are all in the full sets anyway, so nothing is wasted. People who go straight for the fifty-seven learn them slowly, forget half, and are slower for six months than they would have been. The two-look route can take you to about twenty seconds on its own.',
		category: 'practice',
		tier: 'beginner'
	},
	{
		id: 'one-weakness-at-a-time',
		title: 'Pick one thing to fix this week and let everything else be bad',
		body: 'Cross planning, or lookahead into the second pair, or the four PLL cases you keep hesitating on — one of them, for a week. Working on everything at once produces no measurable change in anything, and no measurable change is what makes people give up. Write down what you chose, because you will forget by Wednesday.',
		category: 'practice',
		tier: 'intermediate'
	},
	{
		id: 'drill-in-context',
		title: 'Drill algorithms from a real solve, not from a solved cube',
		body: 'Doing a PLL twelve times in a row from a solved cube trains your fingers and not your eyes, and recognition is the slower half. Scramble the last layer properly, or use a trainer that does, so that every repetition begins with the work of identifying the case. It is less satisfying and considerably more useful.',
		category: 'practice',
		tier: 'intermediate'
	},
	{
		id: 'five-algorithms-a-week',
		title: 'Five new algorithms a week is a good pace, and ten is not twice as good',
		body: 'Beyond about five, the new cases interfere with each other and with the ones from last week, and you end up with fifteen half-known algorithms rather than five solid ones. Learn them in related groups — the four cases that share a shape, a case and its mirror — because related cases interfere less than unrelated ones.',
		category: 'practice',
		tier: 'advanced'
	},
	{
		id: 'review-before-new',
		title: 'Spend the first five minutes reviewing before you learn anything new',
		body: "Yesterday's cases are the ones about to be lost, and they are cheap to keep. Five minutes of review at the start of a session preserves more than twenty minutes of new learning adds. The trainer on this site schedules this for you, but the habit matters more than the tool.",
		category: 'practice',
		tier: 'intermediate'
	},
	{
		id: 'film-yourself',
		title: 'Film thirty seconds of your own solving',
		body: 'Almost everyone is wrong about what their own hands do. A phone propped against a mug for one solve will show you a regrip you did not know about, a pause you thought was instant, and a rotation you swore you had stopped making. It tells you more in half a minute than an hour of reading, this page included.',
		category: 'practice',
		tier: 'intermediate'
	},
	{
		id: 'untimed-solves',
		title: 'Technique changes in untimed solves and reverts in timed ones',
		body: 'Under the clock you will always fall back on what you already do well, which is precisely the thing you are trying to replace. Do the new technique untimed until it stops feeling new, and only then let it near a stopwatch. If your average gets worse the week you start timing something new, this is why.',
		category: 'practice',
		tier: 'intermediate'
	},
	{
		id: 'short-focused-sessions',
		title: 'Twenty attentive minutes beats two distracted hours',
		body: 'Solving while half-watching something else builds speed at the things you can already do and changes nothing else. If you are not thinking about the solve, you are practising your existing habits rather than replacing them. Two short sessions with a purpose will move you further in a week than a long one without.',
		category: 'practice',
		tier: 'beginner'
	},
	{
		id: 'name-your-plateau',
		title: 'Every plateau has a different cause, so name yours before treating it',
		body: 'Stuck around forty seconds is usually still using the beginner last layer. Stuck around twenty-five is usually F2L done well but planned badly. Stuck around eighteen is usually lookahead, not algorithms. Stuck around fourteen is usually the cross and the first pair. Learning more algorithms is the answer to exactly one of those, and it is the one people always reach for.',
		category: 'practice',
		tier: 'intermediate'
	},
	{
		id: 'intuitive-f2l-properly',
		title: 'Work F2L out rather than looking it up',
		body: 'All forty-one cases come from three ideas: get the pair joined in the top layer, get it separated so it can be joined, or get the pieces out of the slot so you can start. Reading the list is quicker on the day and much slower over a year, because a memorised case is only that case while an understood one covers the ones you have not met.',
		category: 'practice',
		tier: 'intermediate'
	},
	{
		id: 'one-scramble-many-ways',
		title: 'Solve the same scramble five times in a row',
		body: 'The first attempt is a solve. The next four are an experiment in which cross you should have built, which pair to have started with, and where the rotations really came from. It removes the luck from the comparison and shows you decisions you did not know you were making.',
		category: 'practice',
		tier: 'advanced'
	},

	// --- Hardware ------------------------------------------------------------
	{
		id: 'a-better-cube-helps-less-than-you-hope',
		title: 'A better cube helps far less than you hope until you are already fast',
		body: 'Any current speedcube from any of the well-known makers is capable of a world record, and none of them will save a solver who is pausing between pairs. Below about twenty seconds, the difference a new cube makes is a second at most and often nothing. Above that, it is worth having a decent one and then forgetting about it. Buy one good cube early, then spend the next year on your hands rather than your shelf.',
		category: 'hardware',
		tier: 'beginner'
	},
	{
		id: 'magnet-strength-is-taste',
		title: 'Magnet strength is a preference, not a quality',
		body: 'Magnets pull each layer into line at the end of a turn, so the cube overshoots less and feels crisper. Strong is not better: strong magnets resist the start of a turn as well as ending it, which some people find tiring over a long session, and some very fast solvers use none at all. If a cube feels like hard work rather than like precision, its magnets are too strong for you.',
		category: 'hardware',
		tier: 'intermediate'
	},
	{
		id: 'tension-one-face-at-a-time',
		title: 'Change tension one face at a time, a quarter turn at a time',
		body: 'Loosen or tighten a single face by a quarter turn of the screw, then do fifty solves before deciding. Adjusting all six at once means you cannot tell what helped, and adjusting by feel alone means you will keep going until the cube pops. Looser cuts corners better and pops; tighter is stable and locks up. There is no correct setting, only the one you stop noticing.',
		category: 'hardware',
		tier: 'intermediate'
	},
	{
		id: 'lube-weights',
		title: 'Thick lube in the core, thin on the pieces',
		body: 'Heavy silicone — the treacle-like sort — goes on the springs and core to slow a cube down, quieten it and take away a rattly feel. Light silicone goes on the sliding surfaces of the pieces to speed it up. A drop or two of each is a full application; more will make the cube sluggish for a week while it works its way out. Lube is a finishing touch, not a repair.',
		category: 'hardware',
		tier: 'intermediate'
	},
	{
		id: 'lube-does-not-fix-catching',
		title: 'A cube that catches wants its tensions changed, not more lube',
		body: 'Catching and locking up mean the layers are not lining up in time, which is a tension and corner-cutting problem. Lubricant changes how a turn feels once it is going, not whether it can start. If a cube locks on the same face repeatedly, loosen that face slightly and leave the bottle alone.',
		category: 'hardware',
		tier: 'intermediate'
	},
	{
		id: 'corner-cutting-numbers',
		title: 'Corner cutting matters, but the numbers in reviews stopped mattering years ago',
		body: 'Corner cutting is how far out of line a layer can be and still let the next turn through, and it matters because turning quickly means starting each turn before the last has finished. Every current cube cuts far more than any human needs. Use the figure to rule out something ancient, not to choose between two modern cubes.',
		category: 'hardware',
		tier: 'intermediate'
	},
	{
		id: 'break-in-before-judging',
		title: 'Give a new cube a week before you decide anything about it',
		body: 'Cubes change substantially over the first few hundred solves as the plastic wears in, and the factory lubricant needs turning through before the true feel appears. Setting up a cube on the day it arrives means tuning it for a state it will not be in by Friday. Turn it, ignore it, then adjust.',
		category: 'hardware',
		tier: 'beginner'
	},
	{
		id: 'one-cube-for-everything',
		title: 'Use one cube for everything for a few months',
		body: 'Every cube has a slightly different weight, speed and amount of give, and your hands calibrate to whichever one they see most. Switching between three costs a second or so each time while you readjust. Keep a main cube and let the others be curiosities.',
		category: 'hardware',
		tier: 'intermediate'
	},
	{
		id: 'stickerless-or-stickers',
		title: 'Stickerless cubes cannot wear out; stickered ones can look better doing it',
		body: 'Stickerless plastic never peels, chips or fades, which is why most people use it now. Stickers can be replaced in any colour scheme and some solvers find the flatter finish quicker to read. Both are allowed in competition. It is entirely a matter of what your eyes prefer.',
		category: 'hardware',
		tier: 'beginner'
	},
	{
		id: 'dont-buy-during-a-plateau',
		title: 'The urge to buy a cube arrives precisely when practice gets hard',
		body: 'A plateau feels like an equipment problem because equipment is the part you can change in an afternoon. It almost never is. If you find yourself reading reviews rather than solving, that is the signal to pick one weakness and drill it for a week — and if the times move, you have saved the money and learnt something.',
		category: 'hardware',
		tier: 'intermediate'
	},

	// --- Mindset -------------------------------------------------------------
	{
		id: 'getting-worse-first',
		title: 'Changing technique makes you slower first, for one to three weeks',
		body: 'Replacing the beginner middle layer with F2L, or moving the cross to the bottom, or learning to plan in inspection — each of these will cost you several seconds a solve at first. That dip is the change working, not failing. The people who never get faster are usually the ones who abandoned three good changes at the two-day mark.',
		category: 'mindset',
		tier: 'beginner'
	},
	{
		id: 'judge-by-average',
		title: 'Judge yourself on an average of twelve, never on a personal best',
		body: 'A single fast time is mostly a lucky scramble and cannot be repeated on request. An average of twelve reflects what you can actually do, moves slowly enough to be believed, and improves in a way you can point at. Keep the best single for the pleasure of it and make decisions on the average.',
		category: 'mindset',
		tier: 'intermediate'
	},
	{
		id: 'finish-every-solve',
		title: 'Never abandon a solve because it is going badly',
		body: 'A ruined cross, a pop, a PLL you cannot recall — finish it anyway. Recovering from a solve that has gone wrong is a skill in itself, and it is the one competition asks for most often. Restarting teaches you nothing except how to restart.',
		category: 'mindset',
		tier: 'beginner'
	},
	{
		id: 'bad-days-are-normal',
		title: 'Some sessions are several seconds slower for no reason you will find',
		body: 'Tiredness, cold hands, a different chair. Everyone has days where the average sits well above normal, and hunting for the cause usually produces a change that makes things worse. Note it, stop early, and come back tomorrow.',
		category: 'mindset',
		tier: 'beginner'
	},
	{
		id: 'the-internet-shows-the-top',
		title: 'The times you see online are the top fraction of a percent',
		body: 'Videos are made by people who are unusually fast and posted on the days they were unusually fast. A solve under a minute puts you ahead of nearly everyone who has ever picked up a cube, and under thirty seconds is genuinely good. Whatever number you are comparing yourself against, it is not the median.',
		category: 'mindset',
		tier: 'beginner'
	},
	{
		id: 'decide-what-you-want',
		title: 'Decide whether you want to be fast or to understand it, and say so out loud',
		body: 'Both are good reasons to be here and they lead to different advice. Wanting to be fast means CFOP, drills and a stopwatch. Wanting to understand means blocks, commutators and probably Roux or Petrus, with times that stay unremarkable for a long time. Trouble comes from wanting one and following advice written for the other.',
		category: 'mindset',
		tier: 'intermediate'
	},
	{
		id: 'stop-before-you-are-sick-of-it',
		title: 'Stop while you still want another solve',
		body: 'The session that ends in frustration is the one that leaves the cube in a drawer for a month. Finish on a good average, or on a case that has finally stuck, and you will come back tomorrow. Consistency over months beats intensity over a weekend by a distance nothing else on this page can match.',
		category: 'mindset',
		tier: 'beginner'
	},

	// --- Competition ---------------------------------------------------------
	{
		id: 'you-will-be-slower',
		title: 'Expect to be several seconds slower at your first competition',
		body: 'A borrowed mat, an unfamiliar table, someone watching, and a scramble you did not generate. Everyone is slower than their home average the first time, often by a third, and it has nothing to do with how well you know the cube. Go expecting it and the day is a pleasure rather than a disappointment.',
		category: 'competition',
		tier: 'intermediate'
	},
	{
		id: 'practise-with-inspection',
		title: 'Practise with the real fifteen seconds and the spoken warnings',
		body: 'Inspection is at most fifteen seconds, with the judge calling eight and twelve. If you have only ever inspected for as long as you felt like, the call at eight seconds will startle you into a bad plan. Practise with a timer that enforces it, so the warning is information rather than a shock.',
		category: 'competition',
		tier: 'intermediate'
	},
	{
		id: 'hands-flat-until-green',
		title: 'Both hands flat on the timer until the light goes green',
		body: 'The timer needs both hands on the pads, palms down, and a moment for it to arm. Starting early is the most common way to lose a solve you had already done well, because you notice the timer never started only after you have finished. Practise the start on a stackmat if you can borrow one — it is a physical habit, not a fact to remember.',
		category: 'competition',
		tier: 'intermediate'
	},
	{
		id: 'how-an-ao5-works',
		title: 'An average of five drops the best and the worst',
		body: 'The fastest and slowest of your five solves are discarded and the middle three are averaged, which is why a single disaster costs little and two cost everything. A single DNF becomes the discarded worst and barely hurts you. Knowing this changes how you play the fifth solve: if you are safe, solve normally rather than gambling.',
		category: 'competition',
		tier: 'intermediate'
	},
	{
		id: 'the-plus-two-rules',
		title: 'Learn what counts as solved before you need to know',
		body: 'A cube one face out by up to forty-five degrees counts as solved. More than that, but still a single turn from solved, is a two-second penalty. Anything further is a DNF. The practical consequence is that a half-finished last move is not worth panicking about, and a whole missing move is not worth arguing about.',
		category: 'competition',
		tier: 'advanced'
	},
	{
		id: 'volunteer-to-judge',
		title: 'Volunteer to judge and to scramble',
		body: 'An hour of judging teaches you the regulations better than reading them, and scrambling teaches you what a properly applied scramble looks like. It also means you spend the long gaps between your own rounds doing something, which is the difference between a good competition day and five hours of waiting.',
		category: 'competition',
		tier: 'intermediate'
	},
	{
		id: 'warm-up-before-your-round',
		title: 'Warm up in the ten minutes before you are called, not two hours before',
		body: 'Cold hands solve slowly and competitions involve a lot of sitting about. A dozen relaxed solves shortly before your group is called puts your hands where your average expects them. Do not do fifty and arrive tired.',
		category: 'competition',
		tier: 'advanced'
	}
];

/** Look one up by id. */
export function tipById(id: string): Tip | undefined {
	return TIPS.find((t) => t.id === id);
}

/** Category order and labels, for filters and headings. */
export const TIP_CATEGORIES: readonly { id: Tip['category']; label: string; blurb: string }[] = [
	{
		id: 'lookahead',
		label: 'Lookahead',
		blurb: 'Seeing the next step while your hands are still on this one.'
	},
	{
		id: 'fingertricks',
		label: 'Finger tricks',
		blurb: 'How the turns are actually made, and where the wasted motion hides.'
	},
	{
		id: 'practice',
		label: 'Practice',
		blurb: 'What to do with a session, and what to leave alone.'
	},
	{
		id: 'hardware',
		label: 'Hardware',
		blurb: 'Cubes, magnets, tensions and lube — and how little of it matters.'
	},
	{
		id: 'mindset',
		label: 'Mindset',
		blurb: 'Staying at it, and measuring the right thing.'
	},
	{
		id: 'competition',
		label: 'Competition',
		blurb: 'Inspection, the timer, averages and the day itself.'
	}
];
