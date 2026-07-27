<!--
	Renders a lesson body.

	Lessons are typed blocks rather than markdown, so a step can carry a live cube
	or a library case and still be type-checked. This component is the only place
	that knows how each block looks.
-->
<script lang="ts">
	import { resolve } from '$app/paths';
	import Prose from './Prose.svelte';
	import AlgString from '../ui/AlgString.svelte';
	import Chip from '../ui/Chip.svelte';
	import InteractiveCube from './InteractiveCube.svelte';
	import CubeDiagram from '../cube/CubeDiagram.svelte';
	import { caseFromAlg, solvedFacelets, stateFromAlg } from '$cube/facelets';
	import { caseById } from '$data/algorithms';
	import type { Pathname } from '$app/types';
	import type { LessonBlock } from '$data/types';

	interface Props {
		blocks: readonly LessonBlock[];
	}

	let { blocks }: Props = $props();

	/** Turn a heading's text into a stable anchor. */
	const slugify = (s: string) =>
		s
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/^-|-$/g, '');
</script>

<div class="body">
	{#each blocks as block, i (i)}
		{#if block.kind === 'prose'}
			<Prose text={block.text} class="para" />
		{:else if block.kind === 'heading'}
			<h2 class="heading" id={block.id ?? slugify(block.text)}>{block.text}</h2>
		{:else if block.kind === 'list'}
			{#if block.ordered}
				<ol class="list">
					{#each block.items as item, j (j)}
						<Prose as="li" text={item} />
					{/each}
				</ol>
			{:else}
				<ul class="list">
					{#each block.items as item, j (j)}
						<Prose as="li" text={item} />
					{/each}
				</ul>
			{/if}
		{:else if block.kind === 'note'}
			<aside class="note note--{block.tone}">
				<p class="note__title">
					{block.title ??
						{
							tip: 'Tip',
							warning: 'Watch out',
							insight: 'Why this works',
							history: 'A bit of history'
						}[block.tone]}
				</p>
				<Prose text={block.text} class="note__text" />
			</aside>
		{:else if block.kind === 'alg'}
			{@const state = block.setup ? stateFromAlg(block.setup) : caseFromAlg(block.moves)}
			<figure class="alg-figure">
				<div class="alg-figure__main">
					<CubeDiagram facelets={state} view="last-layer" size={104} />
					<div class="scroll-x"><AlgString alg={block.moves} size="md" count wrap={false} /></div>
				</div>
				{#if block.caption}<figcaption><Prose as="span" text={block.caption} /></figcaption>{/if}
			</figure>
		{:else if block.kind === 'case'}
			{@const entry = caseById(block.id)}
			{#if entry}
				<figure class="case-figure">
					<div class="case-figure__main">
						<CubeDiagram facelets={entry.caseState} view={entry.set_.view} size={112} />
						<div class="case-figure__body">
							<div class="case-figure__head">
								<strong>{entry.name}</strong>
								<Chip tone="section">{entry.set_.shortName}</Chip>
							</div>
							<div class="scroll-x">
								<AlgString alg={entry.algs[0].moves} size="md" count wrap={false} />
							</div>
						</div>
					</div>
					{#if block.caption}
						<figcaption><Prose as="span" text={block.caption} /></figcaption>
					{:else if entry.recognition}
						<figcaption>{entry.recognition}</figcaption>
					{/if}
				</figure>
			{/if}
		{:else if block.kind === 'cube'}
			{@const initial = block.setup ? stateFromAlg(block.setup) : solvedFacelets()}
			<figure class="cube-figure">
				<InteractiveCube {initial} label={block.label} />
				{#if block.caption}<figcaption><Prose as="span" text={block.caption} /></figcaption>{/if}
			</figure>
		{:else if block.kind === 'steps'}
			<ol class="steps">
				{#each block.steps as step, j (j)}
					<li class="step">
						<Prose as="span" text={step.text} class="step__text" />
						{#if step.alg}
							<div class="step__alg scroll-x">
								<AlgString alg={step.alg} size="sm" wrap={false} />
							</div>
						{/if}
					</li>
				{/each}
			</ol>
		{:else if block.kind === 'table'}
			<figure class="table-figure">
				<div class="scroll-x">
					<table>
						<thead>
							<tr>
								{#each block.headers as header (header)}
									<th scope="col">{header}</th>
								{/each}
							</tr>
						</thead>
						<tbody>
							{#each block.rows as row, r (r)}
								<tr>
									{#each row as cell, c (c)}
										<td><Prose as="span" text={cell} /></td>
									{/each}
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
				{#if block.caption}<figcaption>{block.caption}</figcaption>{/if}
			</figure>
		{:else if block.kind === 'jump'}
			<a class="jump" href={resolve(block.href as Pathname)}>
				<span class="jump__label">{block.label}</span>
				{#if block.blurb}<span class="jump__blurb">{block.blurb}</span>{/if}
				<span class="jump__go" aria-hidden="true">→</span>
			</a>
		{/if}
	{/each}
</div>

<style>
	.body {
		display: grid;
		gap: var(--space-4);
		max-width: var(--measure);
	}

	.body :global(.para) {
		line-height: var(--leading-loose);
		color: var(--text);
	}

	.heading {
		margin-block-start: var(--space-5);
		padding-block-end: var(--space-2);
		border-bottom: 2px solid var(--section-edge);
		font-size: var(--step-2);
		scroll-margin-block-start: calc(var(--header-height) + var(--space-4));
	}

	.list {
		display: grid;
		gap: var(--space-2);
		margin: 0;
		padding-inline-start: var(--space-6);
		line-height: var(--leading-normal);
	}

	.note {
		display: grid;
		gap: var(--space-2);
		padding: var(--space-4);
		border-inline-start: 3px solid var(--accent);
		border-radius: var(--radius-2);
		background: var(--surface-2);
	}

	.note--tip {
		border-inline-start-color: var(--positive);
	}
	.note--warning {
		border-inline-start-color: var(--caution);
	}
	.note--insight {
		border-inline-start-color: var(--accent);
	}
	.note--history {
		border-inline-start-color: var(--text-faint);
	}

	.note__title {
		color: var(--text-faint);
		font-size: var(--step--2);
		font-weight: 700;
		letter-spacing: var(--tracking-caps);
		text-transform: uppercase;
	}

	.note :global(.note__text) {
		color: var(--text-muted);
		font-size: var(--step--1);
		line-height: var(--leading-normal);
	}

	.alg-figure,
	.case-figure {
		display: grid;
		gap: var(--space-3);
		margin: 0;
		padding: var(--space-4);
		background: var(--surface-1);
		border: var(--border);
		border-radius: var(--radius-3);
	}

	.alg-figure__main,
	.case-figure__main {
		display: flex;
		align-items: center;
		gap: var(--space-4);
		min-width: 0;
	}

	.alg-figure__body,
	.case-figure__body {
		display: grid;
		gap: var(--space-2);
		min-width: 0;
	}

	.case-figure__head {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--space-2);
	}

	figcaption {
		color: var(--text-muted);
		font-size: var(--step--1);
		line-height: var(--leading-snug);
	}

	.cube-figure {
		display: grid;
		justify-items: center;
		gap: var(--space-3);
		margin: 0;
		padding: var(--space-5);
		background: var(--surface-1);
		border: var(--border);
		border-radius: var(--radius-3);
	}

	.steps {
		display: grid;
		gap: var(--space-3);
		margin: 0;
		padding-inline-start: var(--space-6);
		counter-reset: step;
	}

	.step {
		display: grid;
		gap: var(--space-2);
		line-height: var(--leading-normal);
	}

	.step__alg {
		padding: var(--space-2) var(--space-3);
		background: var(--surface-2);
		border-radius: var(--radius-2);
	}

	.table-figure {
		margin: 0;
		display: grid;
		gap: var(--space-2);
	}

	table {
		width: 100%;
		border-collapse: collapse;
		font-size: var(--step--1);
	}

	th,
	td {
		padding: var(--space-2) var(--space-3);
		border-bottom: var(--border);
		text-align: start;
		vertical-align: top;
	}

	th {
		color: var(--text-faint);
		font-size: var(--step--2);
		letter-spacing: var(--tracking-caps);
		text-transform: uppercase;
	}

	.jump {
		position: relative;
		display: grid;
		gap: 2px;
		padding: var(--space-4);
		background: var(--section-wash);
		border: 1px solid var(--section-edge);
		border-radius: var(--radius-3);
		text-decoration: none;
		color: inherit;
	}

	.jump:hover {
		border-color: var(--section);
	}

	.jump__label {
		font-weight: 620;
	}

	.jump__blurb {
		color: var(--text-muted);
		font-size: var(--step--1);
	}

	.jump__go {
		position: absolute;
		top: var(--space-4);
		inset-inline-end: var(--space-4);
		color: var(--section);
	}
</style>
