<script lang="ts">
	import { resolve } from '$app/paths';
	import Chip from '$components/ui/Chip.svelte';
	import Button from '$components/ui/Button.svelte';
	import { pageTitle } from '$lib/brand';
	import { lessonsOfTrack, TRACKS, trackMinutes } from '$data/lessons';
	import { SKILL_LABELS } from '$data/types';
	import { settings } from '$state/settings.svelte';
	import { progress } from '$state/progress.svelte';

	const mine = $derived(settings.current.skill);
</script>

<svelte:head>
	<title>{pageTitle('learn')}</title>
	<meta
		name="description"
		content="Four tracks for learning the Rubik's Cube, from your first solve to full CFOP and beyond."
	/>
</svelte:head>

<div class="page page--wide">
	<header class="head">
		<p class="eyebrow">Learn</p>
		<h1>Four tracks. Start wherever you actually are.</h1>
		<p class="lede">
			Nothing here is locked. A track is a reading order, not a gate — if you have solved a cube
			before, skip straight past "this is a corner piece". Your level is set to
			<strong>{SKILL_LABELS[mine]}</strong>, which is why that track is highlighted.
		</p>
	</header>

	<div class="tracks">
		{#each TRACKS as t (t.id)}
			{@const lessons = lessonsOfTrack(t.id)}
			{@const done = lessons.filter((l) => progress.lessonDone(l.slug)).length}
			<section class="track" class:track--mine={t.id === mine}>
				<header class="track__head">
					<div>
						<div class="track__chips">
							<Chip tone={t.id === mine ? 'section' : 'neutral'} size="md">
								{SKILL_LABELS[t.id]}
							</Chip>
							{#if lessons.length > 0}
								<Chip>{lessons.length} lessons</Chip>
								<Chip>{trackMinutes(t.id)} min</Chip>
							{/if}
							{#if done > 0}
								<Chip tone="positive">{done} done</Chip>
							{/if}
						</div>
						<h2 class="track__title">{t.title}</h2>
						<p class="track__tagline">{t.tagline}</p>
					</div>
				</header>

				<p class="track__desc">{t.description}</p>

				{#if lessons.length === 0}
					<p class="track__empty">
						These lessons are still being written. In the meantime, the
						<a href={resolve('/algorithms/')}>algorithm library</a> covers this ground in reference form.
					</p>
				{:else}
					<ol class="lessons">
						{#each lessons as lesson (lesson.slug)}
							{@const complete = progress.lessonDone(lesson.slug)}
							<li>
								<a
									class="lesson"
									class:lesson--done={complete}
									href={resolve('/learn/[slug]', { slug: lesson.slug })}
								>
									<span class="lesson__num" aria-hidden="true">
										{complete ? '✓' : lesson.order}
									</span>
									<span class="lesson__body">
										<span class="lesson__title">{lesson.title}</span>
										<span class="lesson__summary">{lesson.summary}</span>
									</span>
									<span class="lesson__time">{lesson.minutes} min</span>
								</a>
							</li>
						{/each}
					</ol>

					<Button
						variant={t.id === mine ? 'section' : 'secondary'}
						href={resolve('/learn/[slug]', { slug: lessons[0].slug })}
					>
						{done > 0 ? 'Carry on' : 'Start this track'}
					</Button>
				{/if}
			</section>
		{/each}
	</div>
</div>

<style>
	.head {
		max-width: var(--measure);
		margin-block-end: var(--space-6);
	}

	.head h1 {
		margin-block: var(--space-2) var(--space-4);
	}

	.lede {
		color: var(--text-muted);
		font-size: var(--step-1);
		line-height: var(--leading-snug);
	}

	.tracks {
		display: grid;
		gap: var(--space-5);
	}

	.track {
		display: grid;
		gap: var(--space-4);
		justify-items: start;
		padding: var(--space-6);
		background: var(--surface-1);
		border: var(--border);
		border-radius: var(--radius-4);
	}

	.track--mine {
		border-color: var(--section-edge);
		box-shadow: var(--shadow-glow);
	}

	.track__chips {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
		margin-block-end: var(--space-3);
	}

	.track__title {
		font-size: var(--step-2);
	}

	.track__tagline {
		margin-block-start: var(--space-2);
		color: var(--section);
		font-size: var(--step-0);
		font-weight: 560;
	}

	.track__desc {
		max-width: var(--measure);
		color: var(--text-muted);
		line-height: var(--leading-normal);
	}

	.track__empty {
		color: var(--text-faint);
		font-size: var(--step--1);
	}

	.lessons {
		display: grid;
		gap: var(--space-2);
		width: 100%;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.lesson {
		display: grid;
		grid-template-columns: auto minmax(0, 1fr) auto;
		gap: var(--space-4);
		align-items: center;
		padding: var(--space-3) var(--space-4);
		background: var(--surface-2);
		border: 1px solid transparent;
		border-radius: var(--radius-2);
		text-decoration: none;
		color: inherit;
		transition:
			border-color var(--dur-fast) var(--ease-out),
			background var(--dur-fast) var(--ease-out);
	}

	.lesson:hover {
		border-color: var(--section);
		background: var(--surface-3);
	}

	.lesson__num {
		display: grid;
		place-items: center;
		width: 1.9rem;
		height: 1.9rem;
		border-radius: var(--radius-pill);
		background: var(--surface-raised);
		color: var(--text-faint);
		font-size: var(--step--1);
		font-weight: 620;
		font-variant-numeric: tabular-nums;
	}

	.lesson--done .lesson__num {
		background: color-mix(in oklab, var(--positive) 22%, transparent);
		color: var(--positive);
	}

	.lesson__body {
		display: grid;
		gap: 2px;
		min-width: 0;
	}

	.lesson__title {
		font-weight: 600;
	}

	.lesson__summary {
		color: var(--text-muted);
		font-size: var(--step--1);
		line-height: var(--leading-snug);
	}

	.lesson__time {
		color: var(--text-faint);
		font-size: var(--step--2);
		white-space: nowrap;
	}

	@media (max-width: 44rem) {
		.track {
			padding: var(--space-4);
		}
		.lesson {
			grid-template-columns: auto minmax(0, 1fr);
		}
		.lesson__time {
			display: none;
		}
	}
</style>
