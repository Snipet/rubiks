<script lang="ts">
	import { resolve } from '$app/paths';
	import CubeDiagram from '$components/cube/CubeDiagram.svelte';
	import AlgString from '$components/ui/AlgString.svelte';
	import Card from '$components/ui/Card.svelte';
	import Chip from '$components/ui/Chip.svelte';
	import { BRAND } from '$lib/brand';
	import { ALG_SETS, ALL_CASES, algorithmCount } from '$data/algorithms';
	import { caseFromAlg } from '$cube/facelets';

	const cases = ALL_CASES.length;
	const algs = algorithmCount();

	/** The sets whose size is a mathematical fact rather than an editorial choice. */
	const enumerated = ALG_SETS.filter((s) => s.expectedCount !== undefined);

	/**
	 * A worked demonstration of the point below: the picture is not a drawing kept
	 * beside the algorithm, it is the cube the algorithm was run backwards on.
	 */
	const demoAlg = "R U R' U' R' F R2 U' R' U' R U R' F'";
	const demoState = caseFromAlg(demoAlg);
</script>

<svelte:head>
	<title>{BRAND}</title>
	<meta
		name="description"
		content="What this site is, who it is for, how every algorithm on it is checked by machine, and what it does with your data — which is nothing."
	/>
</svelte:head>

<div class="page">
	<header class="head">
		<p class="eyebrow">Reference</p>
		<h1>About {BRAND}</h1>
		<p class="lede">
			A place to learn the cube properly, look up any algorithm, and get advice about the cube in
			front of you — built so that the things it tells you can be checked rather than trusted.
		</p>
	</header>

	<section class="prose block">
		<h2>What this is</h2>
		<p>
			Four learning tracks, from a first solve through to material most people never bother with; a
			library of {cases} cases with {algs} algorithms between them; a page where you describe the cube
			in your hands and get told what to do next at the level you asked for; a trainer that remembers
			which cases you keep fumbling; and a timer that measures what competitions measure.
		</p>
		<p>
			It is written for someone who wants to understand the cube rather than be walked through it.
			That means the lessons say what a step is <em>for</em> before saying what to do, and it means the
			reference pages are longer than they strictly need to be. If you would rather be handed six algorithms
			and left alone, the beginner track will do that and stop.
		</p>
		<p>
			Two conventions run through the whole site, so that nothing contradicts anything else: the
			<strong>white cross goes on the bottom</strong> and the last layer is yellow, and turns are
			written in the standard notation — <code>U R F D L B</code>, a <code>'</code> for
			anticlockwise,
			<code>Rw</code> for a wide turn, <code>M E S</code> for the slices and <code>x y z</code> for
			whole-cube rotations. There is a
			<a href={resolve('/notation/')}>full notation reference</a> if any of that is new.
		</p>
	</section>

	<section class="block">
		<h2>How it checks its own work</h2>
		<p class="section-lede">
			Algorithm lists on the web are copied from one another, and a typo introduced once propagates
			for years. There is no editorial process that catches this reliably, because reading an
			algorithm does not tell you what it does. So this site does something else: it runs them.
		</p>

		<div class="steps">
			<Card padding="md" accent>
				<p class="step__label">One</p>
				<h3>There is a working cube inside the site</h3>
				<p>
					Not a picture of a cube — a model of one. It knows where all twenty moving pieces are,
					which way round each of them is sitting, and exactly what any turn does to all of them.
					Give it a sequence of moves and it will tell you the state of every sticker afterwards.
					Every other claim on this page rests on that one piece of machinery, and it has its own
					tests: turning a face four times must return the cube to where it started, a sequence
					followed by its own reverse must change nothing, and so on.
				</p>
			</Card>

			<Card padding="md" accent>
				<p class="step__label">Two</p>
				<h3>Every algorithm is executed and checked against what its set claims to do</h3>
				<p>
					Each set of algorithms comes with a promise. A PLL algorithm promises to move the last
					layer's pieces into place while leaving the first two layers untouched. An OLL algorithm
					promises to turn the whole top face one colour without disturbing anything below it. An
					F2L algorithm promises to fill one slot without breaking the cross or the other three
					slots.
				</p>
				<p>
					So each algorithm is run backwards from a solved cube to produce the case it is meant to
					solve, then run forwards on that case, and the result is inspected against the promise. A
					mistyped move almost always breaks one of these checks — the layers underneath end up
					disturbed, or the top face does not come out one colour. When that happens the build fails
					and the page never gets published. Where a case lists more than one algorithm, the
					alternatives are checked against the primary one too, which catches a variant pasted under
					the wrong case.
				</p>
			</Card>

			<Card padding="md" accent>
				<p class="step__label">Three</p>
				<h3>The pictures are computed from the moves, not drawn beside them</h3>
				<p>
					The usual way to publish an algorithm is to write the moves in one place and draw the case
					diagram in another, which means there are two copies of the truth and they can drift
					apart. Here there is one. A diagram is produced by taking a solved cube, running the
					algorithm backwards on it, and colouring in whatever comes out. The picture cannot
					disagree with the algorithm, because the picture <em>is</em> the algorithm.
				</p>
				<figure class="demo">
					<CubeDiagram
						facelets={demoState}
						view="pll"
						size={112}
						label="A last-layer case, drawn by running its algorithm backwards"
					/>
					<figcaption>
						<AlgString alg={demoAlg} size="sm" count />
						<p>
							Nobody drew that diagram. It is what a solved cube looks like once that algorithm has
							been run backwards on it — which is precisely the position the algorithm solves.
						</p>
					</figcaption>
				</figure>
			</Card>

			<Card padding="md" accent>
				<p class="step__label">Four</p>
				<h3>Completeness is checked against cases worked out from first principles</h3>
				<p>
					Checking that every algorithm is correct still leaves the possibility that one is missing.
					So the cube engine is asked to generate every case that can exist, from the rules of the
					puzzle rather than from any published list. For the last layer's orientation: corner
					twists must add up to a multiple of three and edge flips must come in pairs, and working
					through every legal combination and grouping together the ones that differ only by a turn
					of the top face produces exactly {enumerated.find((s) => s.id === 'oll')?.expectedCount} cases.
					The same argument gives {enumerated.find((s) => s.id === 'pll')?.expectedCount} for permutation
					and
					{enumerated.find((s) => s.id === 'f2l')?.expectedCount} for filling a single slot.
				</p>
				<p>
					Every case in the library is then labelled by the same machinery and the two lists are
					compared. A case in the theory with nothing to solve it is a gap; two cases sharing a
					label are duplicates. Both fail the build. The familiar numbers below are therefore not
					copied from anywhere — they are recomputed every time the site is built, and the library
					is held to them.
				</p>
				<div class="counts">
					{#each enumerated as set (set.id)}
						<div class="count">
							<span class="count__value">{set.expectedCount}</span>
							<span class="count__label">{set.shortName}</span>
						</div>
					{/each}
					<div class="count">
						<span class="count__value">{cases}</span>
						<span class="count__label">cases published</span>
					</div>
					<div class="count">
						<span class="count__value">{algs}</span>
						<span class="count__label">algorithms, all executed</span>
					</div>
				</div>
			</Card>
		</div>

		<Card padding="md" class="caveat">
			<h3>What the checking does not prove</h3>
			<p>
				It proves that an algorithm does what its set says it does. It does not prove that it is the
				best algorithm for the case, the most comfortable one for your hands, or the one you should
				learn first. Recognition notes, finger-trick advice, the order lessons are taught in and
				every recommendation on the site are editorial: written carefully, held to a house style,
				and capable of being wrong. If something here reads as false to you, it may well be.
			</p>
		</Card>
	</section>

	<section class="block">
		<h2>What this site does with your data</h2>
		<div class="plain">
			<Card padding="md">
				<h3>Nothing leaves your browser</h3>
				<p>
					There are no accounts and nothing to sign up for. There is no analytics, no tracking, no
					advertising, and no third-party script of any kind — the pages load nothing from anywhere
					except the site itself.
				</p>
			</Card>
			<Card padding="md">
				<h3>Your progress is stored on this device</h3>
				<p>
					Which cases you have drilled, which lessons you have marked done, your solve times and
					your appearance settings all live in this browser's local storage. They are never sent
					anywhere, because there is nowhere to send them: the whole site is a set of static files
					with no server behind it. Clear your browser data and it is gone, and it will not follow
					you to another device.
				</p>
			</Card>
		</div>
	</section>

	<section class="block">
		<h2>Names and trademarks</h2>
		<div class="prose">
			<p>
				This is an independent project. It is <strong
					>not affiliated with, endorsed by, or connected to the owners of the Rubik's trademark</strong
				>, and it uses none of their branding — no logos, no packaging, no product imagery. The word
				appears here only where it is the ordinary name for the puzzle, in the way anyone would use
				it in a sentence.
			</p>
			<p>
				Every diagram on the site is generated by the code described above, and every illustration
				is original. The algorithms themselves are, for the most part, the shared property of the
				cubing community — worked out and published over forty-odd years by a great many people, and
				free for anyone to use.
			</p>
			<div class="chips">
				<Chip tone="neutral">No accounts</Chip>
				<Chip tone="neutral">No tracking</Chip>
				<Chip tone="neutral">No cookies</Chip>
				<Chip tone="neutral">No server</Chip>
				<Chip tone="neutral">Unaffiliated</Chip>
			</div>
		</div>
	</section>

	<section class="block">
		<h2>Where to start</h2>
		<div class="onward">
			<Card href={resolve('/learn/')} accent>
				<h3>Learn</h3>
				<p>Four tracks, from your first solve to full CFOP and past it.</p>
			</Card>
			<Card href={resolve('/algorithms/')} accent>
				<h3>Algorithms</h3>
				<p>The whole library, searchable, every case checked.</p>
			</Card>
			<Card href={resolve('/methods/')} accent>
				<h3>Methods</h3>
				<p>Six ways to solve a cube, compared with the costs left in.</p>
			</Card>
			<Card href={resolve('/glossary/')} accent>
				<h3>Glossary</h3>
				<p>The private language of cubing, written to be read cold.</p>
			</Card>
		</div>
	</section>
</div>

<style>
	.head {
		max-width: var(--measure);
	}

	.head h1 {
		margin-block: var(--space-2) var(--space-4);
	}

	.lede {
		color: var(--text-muted);
		font-size: var(--step-1);
		line-height: var(--leading-snug);
	}

	.block {
		margin-block-start: var(--space-8);
	}

	.block > h2 {
		margin-block-end: var(--space-4);
		padding-block-end: var(--space-2);
		border-bottom: 2px solid var(--section-edge);
		font-size: var(--step-2);
	}

	.prose p {
		max-width: var(--measure);
		color: var(--text-muted);
	}

	.prose p + p {
		margin-block-start: var(--space-4);
	}

	.section-lede {
		max-width: var(--measure);
		margin-block-end: var(--space-5);
		color: var(--text-muted);
		font-size: var(--step-0);
	}

	.steps {
		display: grid;
		gap: var(--space-4);
	}

	.steps h3 {
		margin-block: var(--space-1) var(--space-3);
		max-width: 46ch;
		font-size: var(--step-1);
	}

	.steps p {
		max-width: var(--measure);
		color: var(--text-muted);
	}

	.steps p + p {
		margin-block-start: var(--space-4);
	}

	.steps .step__label {
		color: var(--section);
		font-size: var(--step--2);
		font-weight: 650;
		letter-spacing: var(--tracking-caps);
		text-transform: uppercase;
	}

	.demo {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--space-5);
		margin-block-start: var(--space-5);
		padding: var(--space-4);
		background: var(--surface-2);
		border-radius: var(--radius-3);
	}

	.demo figcaption {
		display: grid;
		gap: var(--space-3);
		min-width: 0;
		flex: 1 1 18rem;
	}

	.demo figcaption p {
		color: var(--text-faint);
		font-size: var(--step--1);
		line-height: var(--leading-snug);
	}

	.counts {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-6);
		margin-block-start: var(--space-5);
		padding-block-start: var(--space-4);
		border-top: var(--border);
	}

	.count {
		display: grid;
		gap: var(--space-1);
	}

	.count__value {
		color: var(--text);
		font-size: var(--step-3);
		font-weight: 650;
		font-variant-numeric: tabular-nums;
		line-height: 1;
	}

	.count__label {
		color: var(--text-faint);
		font-size: var(--step--2);
		letter-spacing: var(--tracking-caps);
		text-transform: uppercase;
	}

	.block :global(.caveat) {
		margin-block-start: var(--space-4);
		border-style: dashed;
	}

	.block :global(.caveat h3) {
		margin-block-end: var(--space-3);
		font-size: var(--step-1);
	}

	.block :global(.caveat p) {
		max-width: var(--measure);
		color: var(--text-muted);
	}

	.plain,
	.onward {
		display: grid;
		gap: var(--space-4);
		grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));
		align-items: start;
	}

	.plain h3,
	.onward h3 {
		margin-block-end: var(--space-2);
		font-size: var(--step-1);
	}

	.plain p,
	.onward p {
		color: var(--text-muted);
		font-size: var(--step--1);
		line-height: var(--leading-snug);
	}

	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
		margin-block-start: var(--space-5);
	}
</style>
