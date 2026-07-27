<script lang="ts">
	import { resolve } from '$app/paths';
	import Button from '$components/ui/Button.svelte';
	import Card from '$components/ui/Card.svelte';
	import Chip from '$components/ui/Chip.svelte';
	import Segmented from '$components/ui/Segmented.svelte';
	import { pageTitle } from '$lib/brand';
	import { METHODS } from '$data/methods';
	import { SKILL_LABELS } from '$data/types';

	/** Which column of every method to line up side by side. */
	type Lens = 'steps' | 'pros' | 'cons' | 'suitedTo';

	const LENSES: readonly { value: Lens; label: string; title: string }[] = [
		{ value: 'pros', label: 'Strengths', title: 'What each method is good at' },
		{ value: 'cons', label: 'Trade-offs', title: 'What each method costs you' },
		{ value: 'steps', label: 'Steps', title: 'The shape of a solve in each method' },
		{ value: 'suitedTo', label: 'Who it suits', title: 'Who each method is a good fit for' }
	];

	let lens = $state<Lens>('pros');

	const lensBlurb: Record<Lens, string> = {
		pros: 'The case for each method, in its own terms.',
		cons: 'The part enthusiasts leave out. Every method on this page has a real cost.',
		steps: 'What you are doing, in order, from a scrambled cube to a solved one.',
		suitedTo: 'Not a ranking. A description of the person each method fits.'
	};
</script>

<svelte:head>
	<title>{pageTitle('methods')}</title>
	<meta
		name="description"
		content="CFOP, Roux, ZZ, Petrus, Mehta and layer by layer, compared side by side with their real costs as well as their strengths."
	/>
</svelte:head>

<div class="page page--wide">
	<header class="head">
		<p class="eyebrow">Reference</p>
		<h1>Six ways to solve a cube</h1>
		<p class="lede">
			There is no best method, and anyone who tells you otherwise is describing their own hands and
			their own patience. What there is, is a set of trades: fewer algorithms against more moves,
			intuition against drilling, a gentle start against a high ceiling. Here are six of them with
			the costs left in.
		</p>
		<p class="note">
			Move counts are typical full solves in the half-turn metric for someone competent with that
			method — not records, and not the theoretical minimum. Algorithm counts are for the complete
			method, with the reduced route shown where one exists.
		</p>
	</header>

	<nav class="jumps" aria-label="Jump to a method">
		{#each METHODS as method (method.id)}
			<Button size="sm" variant="ghost" href="#{method.id}">{method.name}</Button>
		{/each}
	</nav>

	<section class="glance" aria-labelledby="glance-heading">
		<h2 id="glance-heading">At a glance</h2>
		<div class="scroll-x">
			<table class="table">
				<thead>
					<tr>
						<th scope="col">Method</th>
						<th scope="col">Typical solve</th>
						<th scope="col">Algorithms</th>
						<th scope="col">Steps</th>
						<th scope="col">Meet it at</th>
					</tr>
				</thead>
				<tbody>
					{#each METHODS as method (method.id)}
						<tr>
							<th scope="row">
								<a class="table__name" href="#{method.id}">{method.name}</a>
								{#if method.year}<span class="table__year">{method.year.replace(/,.*$/, '')}</span
									>{/if}
							</th>
							<td class="table__num">{method.moveCount}</td>
							<td class="table__num">{method.algCount}</td>
							<td class="table__num">{method.steps.length}</td>
							<td><Chip tone="section">{SKILL_LABELS[method.tier]}</Chip></td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</section>

	<section class="compare" aria-labelledby="compare-heading">
		<div class="compare__bar">
			<div>
				<h2 id="compare-heading">Side by side</h2>
				<p class="compare__blurb">{lensBlurb[lens]}</p>
			</div>
			<Segmented
				label="What to compare"
				size="sm"
				value={lens}
				onchange={(v) => (lens = v)}
				options={LENSES}
			/>
		</div>

		<div class="compare__grid">
			{#each METHODS as method (method.id)}
				<article class="column">
					<h3 class="column__name">
						<a href="#{method.id}">{method.name}</a>
					</h3>
					{#if lens === 'steps'}
						<ol class="column__steps">
							{#each method.steps as step (step.name)}
								<li>{step.name}</li>
							{/each}
						</ol>
					{:else if lens === 'suitedTo'}
						<p class="column__prose">{method.suitedTo}</p>
					{:else}
						<ul class="column__list" class:column__list--cons={lens === 'cons'}>
							{#each method[lens] as line (line)}
								<li>{line}</li>
							{/each}
						</ul>
					{/if}
				</article>
			{/each}
		</div>
	</section>

	<section class="details" aria-label="Each method in detail">
		{#each METHODS as method (method.id)}
			<article class="method" id={method.id}>
				<header class="method__head">
					<div class="method__title">
						<h2>{method.name}</h2>
						{#if method.alsoKnownAs?.length}
							<p class="method__aka">Also called {method.alsoKnownAs.join(', ')}</p>
						{/if}
					</div>
					<div class="method__chips">
						<Chip tone="section">{SKILL_LABELS[method.tier]}</Chip>
						<Chip>{method.moveCount}</Chip>
						<Chip>{method.algCount} algorithms</Chip>
					</div>
				</header>

				<p class="method__summary">{method.summary}</p>

				{#if method.inventor || method.year}
					<p class="method__origin">
						{#if method.inventor}{method.inventor}{/if}{#if method.inventor && method.year}
							·
						{/if}{#if method.year}{method.year}{/if}
					</p>
				{/if}

				<div class="method__body">
					<div class="method__steps">
						<h3>The solve, in order</h3>
						<ol class="steps">
							{#each method.steps as step, i (step.name)}
								<li class="step">
									<span class="step__index" aria-hidden="true">{i + 1}</span>
									<div>
										<p class="step__name">{step.name}</p>
										<p class="step__detail">{step.detail}</p>
									</div>
								</li>
							{/each}
						</ol>
					</div>

					<div class="method__verdict">
						<Card padding="sm" class="ledger ledger--pros">
							<h3>What it gives you</h3>
							<ul>
								{#each method.pros as line (line)}
									<li>{line}</li>
								{/each}
							</ul>
						</Card>
						<Card padding="sm" class="ledger ledger--cons">
							<h3>What it costs you</h3>
							<ul>
								{#each method.cons as line (line)}
									<li>{line}</li>
								{/each}
							</ul>
						</Card>
						<Card padding="sm" accent>
							<h3 class="suited__heading">Worth choosing if</h3>
							<p class="suited__text">{method.suitedTo}</p>
						</Card>
					</div>
				</div>
			</article>
		{/each}
	</section>

	<section class="onward">
		<h2>Where to go next</h2>
		<div class="onward__grid">
			<Card href={resolve('/learn/')} accent>
				<h3>The learning tracks</h3>
				<p>
					Layer by layer from a standing start, then the route into CFOP one step at a time, with
					nothing to unlearn on the way.
				</p>
			</Card>
			<Card href={resolve('/algorithms/')} accent>
				<h3>The algorithm library</h3>
				<p>
					Every case for CFOP and the Roux corner set, with diagrams computed from the moves rather
					than drawn beside them.
				</p>
			</Card>
			<Card href={resolve('/glossary/')} accent>
				<h3>The glossary</h3>
				<p>
					EOLine, CMLL, belt, block, ZBLL — the vocabulary this page assumes, written to be read
					cold.
				</p>
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

	.note {
		margin-block-start: var(--space-4);
		color: var(--text-faint);
		font-size: var(--step--1);
		line-height: var(--leading-snug);
	}

	.jumps {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-1);
		margin-block: var(--space-6) var(--space-7);
		padding-block: var(--space-2);
		border-block: var(--border);
	}

	h2 {
		font-size: var(--step-2);
	}

	.glance h2,
	.compare h2,
	.onward h2 {
		margin-block-end: var(--space-4);
	}

	/* --- At a glance ------------------------------------------------------- */
	.table {
		width: 100%;
		min-width: 46rem;
		border-collapse: collapse;
		font-size: var(--step--1);
	}

	.table th,
	.table td {
		padding: var(--space-3) var(--space-4);
		text-align: left;
		vertical-align: baseline;
		border-bottom: var(--border);
	}

	.table thead th {
		color: var(--text-faint);
		font-size: var(--step--2);
		font-weight: 600;
		letter-spacing: var(--tracking-caps);
		text-transform: uppercase;
		border-bottom: 2px solid var(--section-edge);
	}

	.table tbody tr:hover {
		background: var(--surface-1);
	}

	.table tbody th {
		font-weight: 600;
	}

	.table__name {
		font-size: var(--step-0);
		font-weight: 650;
		text-decoration: none;
		color: var(--text);
	}

	.table__name:hover {
		color: var(--accent);
	}

	.table__year {
		display: block;
		color: var(--text-faint);
		font-size: var(--step--2);
		font-weight: 400;
	}

	.table__num {
		color: var(--text-muted);
		font-variant-numeric: tabular-nums;
	}

	/* --- Side by side ------------------------------------------------------ */
	.compare {
		margin-block-start: var(--space-8);
	}

	.compare__bar {
		display: flex;
		flex-wrap: wrap;
		align-items: end;
		justify-content: space-between;
		gap: var(--space-4);
		margin-block-end: var(--space-5);
	}

	.compare__bar h2 {
		margin-block-end: var(--space-2);
	}

	.compare__blurb {
		max-width: 52ch;
		color: var(--text-muted);
		font-size: var(--step--1);
	}

	.compare__grid {
		display: grid;
		gap: var(--space-4);
		grid-template-columns: repeat(auto-fit, minmax(17rem, 1fr));
		align-items: start;
	}

	.column {
		padding: var(--space-4);
		background: var(--surface-1);
		border: var(--border);
		border-radius: var(--radius-3);
	}

	.column__name {
		margin-block-end: var(--space-3);
		padding-block-end: var(--space-2);
		border-bottom: 2px solid var(--section-edge);
		font-size: var(--step-0);
	}

	.column__name a {
		color: var(--text);
		text-decoration: none;
	}

	.column__name a:hover {
		color: var(--accent);
	}

	.column__list,
	.column__steps {
		display: grid;
		gap: var(--space-3);
		padding-inline-start: var(--space-4);
		color: var(--text-muted);
		font-size: var(--step--1);
		line-height: var(--leading-snug);
	}

	.column__list {
		list-style: none;
		padding-inline-start: 0;
	}

	.column__list li {
		position: relative;
		padding-inline-start: var(--space-5);
	}

	.column__list li::before {
		content: '+';
		position: absolute;
		inset-inline-start: 0;
		color: var(--positive);
		font-weight: 700;
	}

	.column__list--cons li::before {
		content: '−';
		color: var(--caution);
	}

	.column__prose {
		color: var(--text-muted);
		font-size: var(--step--1);
		line-height: var(--leading-snug);
	}

	/* --- Detail ------------------------------------------------------------ */
	.details {
		display: grid;
		gap: var(--space-8);
		margin-block-start: var(--space-8);
	}

	.method {
		scroll-margin-top: calc(var(--header-height) + var(--space-4));
		padding-block-start: var(--space-5);
		border-top: 2px solid var(--section-edge);
	}

	.method__head {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		justify-content: space-between;
		gap: var(--space-4);
	}

	.method__head h2 {
		font-size: var(--step-3);
	}

	.method__aka {
		margin-block-start: var(--space-1);
		color: var(--text-faint);
		font-size: var(--step--1);
	}

	.method__chips {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
	}

	.method__summary {
		max-width: var(--measure);
		margin-block-start: var(--space-4);
		color: var(--text);
		font-size: var(--step-1);
		line-height: var(--leading-snug);
	}

	.method__origin {
		margin-block-start: var(--space-3);
		color: var(--text-faint);
		font-size: var(--step--1);
	}

	.method__body {
		display: grid;
		gap: var(--space-6);
		grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
		align-items: start;
		margin-block-start: var(--space-6);
	}

	.method__body h3 {
		margin-block-end: var(--space-3);
		color: var(--text-faint);
		font-size: var(--step--2);
		letter-spacing: var(--tracking-caps);
		text-transform: uppercase;
	}

	.steps {
		display: grid;
		gap: var(--space-4);
		list-style: none;
		padding: 0;
	}

	.step {
		display: grid;
		grid-template-columns: auto minmax(0, 1fr);
		gap: var(--space-3);
	}

	.step__index {
		display: grid;
		place-items: center;
		width: 1.6rem;
		height: 1.6rem;
		border-radius: var(--radius-pill);
		background: var(--surface-3);
		color: var(--text-muted);
		font-size: var(--step--2);
		font-weight: 650;
		font-variant-numeric: tabular-nums;
	}

	.step__name {
		font-weight: 620;
	}

	.step__detail {
		margin-block-start: var(--space-1);
		color: var(--text-muted);
		font-size: var(--step--1);
		line-height: var(--leading-snug);
	}

	.method__verdict {
		display: grid;
		gap: var(--space-3);
	}

	.method__verdict :global(.ledger ul) {
		display: grid;
		gap: var(--space-2);
		list-style: none;
		padding: 0;
		color: var(--text-muted);
		font-size: var(--step--1);
		line-height: var(--leading-snug);
	}

	.method__verdict :global(.ledger li) {
		position: relative;
		padding-inline-start: var(--space-5);
	}

	.method__verdict :global(.ledger--pros li::before) {
		content: '+';
		position: absolute;
		inset-inline-start: 0;
		color: var(--positive);
		font-weight: 700;
	}

	.method__verdict :global(.ledger--cons li::before) {
		content: '−';
		position: absolute;
		inset-inline-start: 0;
		color: var(--caution);
		font-weight: 700;
	}

	.method__body .suited__heading {
		color: var(--section);
	}

	.suited__text {
		color: var(--text-muted);
		font-size: var(--step--1);
		line-height: var(--leading-snug);
	}

	/* --- Onward ------------------------------------------------------------ */
	.onward {
		margin-block-start: var(--space-8);
	}

	.onward__grid {
		display: grid;
		gap: var(--space-4);
		grid-template-columns: repeat(auto-fit, minmax(17rem, 1fr));
	}

	.onward__grid h3 {
		margin-block-end: var(--space-2);
		font-size: var(--step-1);
	}

	.onward__grid p {
		color: var(--text-muted);
		font-size: var(--step--1);
		line-height: var(--leading-snug);
	}

	@media (max-width: 62rem) {
		.method__body {
			grid-template-columns: minmax(0, 1fr);
		}
	}
</style>
