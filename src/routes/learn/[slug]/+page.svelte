<script lang="ts">
	import { resolve } from '$app/paths';
	import LessonBody from '$components/lesson/LessonBody.svelte';
	import Button from '$components/ui/Button.svelte';
	import Chip from '$components/ui/Chip.svelte';
	import { pageTitle } from '$lib/brand';
	import { ALG_SETS } from '$data/algorithms';
	import { SKILL_LABELS } from '$data/types';
	import { progress } from '$state/progress.svelte';

	let { data } = $props();

	const done = $derived(progress.lessonDone(data.lesson.slug));
</script>

<svelte:head>
	<title>{pageTitle(data.lesson.title.toLowerCase())}</title>
	<meta name="description" content={data.lesson.summary} />
</svelte:head>

<article class="page">
	<nav class="crumbs" aria-label="Breadcrumb">
		<a href={resolve('/learn/')}>Learn</a>
		<span aria-hidden="true">/</span>
		<span>{SKILL_LABELS[data.lesson.track]}</span>
	</nav>

	<header class="head">
		<div class="head__meta">
			<Chip tone="section">Lesson {data.lesson.order}</Chip>
			<Chip>{data.lesson.minutes} min</Chip>
			<Chip>{SKILL_LABELS[data.lesson.track]}</Chip>
		</div>
		<h1>{data.lesson.title}</h1>
		<p class="lede">{data.lesson.summary}</p>

		<section class="outcomes">
			<h2 class="outcomes__title">By the end you will be able to</h2>
			<ul>
				{#each data.lesson.outcomes as outcome (outcome)}
					<li>{outcome}</li>
				{/each}
			</ul>
		</section>
	</header>

	<LessonBody blocks={data.lesson.body} />

	<footer class="foot">
		<label class="done">
			<input
				type="checkbox"
				checked={done}
				onchange={() => progress.toggleLesson(data.lesson.slug)}
			/>
			I have worked through this
		</label>

		{#if data.lesson.teaches?.length}
			<div class="teaches">
				<h2 class="teaches__title">Algorithms from this lesson</h2>
				<div class="teaches__links">
					{#each data.lesson.teaches as setId (setId)}
						{@const set = ALG_SETS.find((s) => s.id === setId)}
						{#if set}
							<Button
								variant="secondary"
								size="sm"
								href={resolve('/algorithms/[set]', { set: setId })}
							>
								{set.shortName}
							</Button>
						{/if}
					{/each}
				</div>
			</div>
		{/if}

		<nav class="pager" aria-label="Lesson navigation">
			{#if data.previous}
				<a
					class="pager__link pager__link--prev"
					href={resolve('/learn/[slug]', { slug: data.previous.slug })}
				>
					<span class="pager__dir">Previous</span>
					<span class="pager__title">{data.previous.title}</span>
				</a>
			{:else}
				<span></span>
			{/if}
			{#if data.next}
				<a
					class="pager__link pager__link--next"
					href={resolve('/learn/[slug]', { slug: data.next.slug })}
				>
					<span class="pager__dir">Next</span>
					<span class="pager__title">{data.next.title}</span>
				</a>
			{/if}
		</nav>
	</footer>
</article>

<style>
	.crumbs {
		display: flex;
		gap: var(--space-2);
		margin-block-end: var(--space-4);
		color: var(--text-faint);
		font-size: var(--step--1);
	}

	.crumbs a {
		color: var(--text-muted);
		text-decoration: none;
	}

	.crumbs a:hover {
		color: var(--section);
	}

	.head {
		max-width: var(--measure);
		margin-block-end: var(--space-6);
		padding-block-end: var(--space-5);
		border-bottom: var(--border);
	}

	.head__meta {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
		margin-block-end: var(--space-3);
	}

	.head h1 {
		margin-block-end: var(--space-3);
	}

	.lede {
		color: var(--text-muted);
		font-size: var(--step-1);
		line-height: var(--leading-snug);
	}

	.outcomes {
		margin-block-start: var(--space-5);
		padding: var(--space-4);
		background: var(--section-wash);
		border-inline-start: 3px solid var(--section);
		border-radius: var(--radius-2);
	}

	.outcomes__title {
		color: var(--text-faint);
		font-size: var(--step--2);
		font-weight: 700;
		letter-spacing: var(--tracking-caps);
		text-transform: uppercase;
	}

	.outcomes ul {
		display: grid;
		gap: var(--space-1);
		margin-block-start: var(--space-2);
		padding-inline-start: var(--space-5);
		font-size: var(--step--1);
	}

	.foot {
		display: grid;
		gap: var(--space-5);
		max-width: var(--measure);
		margin-block-start: var(--space-7);
		padding-block-start: var(--space-5);
		border-top: var(--border);
	}

	.done {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		color: var(--text-muted);
		cursor: pointer;
	}

	.done input {
		accent-color: var(--section);
	}

	.teaches__title {
		margin-block-end: var(--space-2);
		color: var(--text-faint);
		font-size: var(--step--2);
		font-weight: 700;
		letter-spacing: var(--tracking-caps);
		text-transform: uppercase;
	}

	.teaches__links {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
	}

	.pager {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-3);
	}

	.pager__link {
		display: grid;
		gap: 2px;
		padding: var(--space-4);
		background: var(--surface-1);
		border: var(--border);
		border-radius: var(--radius-3);
		text-decoration: none;
		color: inherit;
	}

	.pager__link:hover {
		border-color: var(--section);
	}

	.pager__link--next {
		text-align: end;
	}

	.pager__dir {
		color: var(--text-faint);
		font-size: var(--step--2);
		letter-spacing: var(--tracking-caps);
		text-transform: uppercase;
	}

	.pager__title {
		font-weight: 600;
	}

	@media (max-width: 40rem) {
		.pager {
			grid-template-columns: minmax(0, 1fr);
		}
		.pager__link--next {
			text-align: start;
		}
	}
</style>
