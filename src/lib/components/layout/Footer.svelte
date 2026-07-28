<script lang="ts">
	import { resolve } from '$app/paths';
	import { NAV } from '$lib/nav';
	import Wordmark from './Wordmark.svelte';
	import { algorithmCount, ALL_CASES } from '$data/algorithms';

	const cases = ALL_CASES.length;
	const algs = algorithmCount();
</script>

<footer class="footer">
	<div class="page page--wide footer__inner">
		<div class="footer__brand">
			<Wordmark size="sm" />
			<p class="footer__blurb">
				{cases} cases and {algs} algorithms, every one of them executed by the cube engine and checked
				before it reaches this page.
			</p>
		</div>

		<nav class="footer__nav" aria-label="Footer">
			{#each NAV as item (item.id)}
				<a href={resolve(item.href)} data-section={item.id}>{item.label}</a>
			{/each}
			<a href={resolve('/about')}>About</a>
			<a href={resolve('/data/')}>Your data</a>
		</nav>

		<p class="footer__legal">
			An independent project, not affiliated with or endorsed by the owners of the Rubik's
			trademark. All icons and cube illustrations are original. Your progress is stored in this
			browser and nowhere else — <a class="footer__inline" href={resolve('/data/')}>take a copy</a>
			whenever you like.
		</p>
	</div>
</footer>

<style>
	.footer__inline {
		color: var(--text-muted);
		text-decoration: underline;
		text-underline-offset: 2px;
	}

	.footer__inline:hover {
		color: var(--text);
	}

	.footer {
		margin-block-start: var(--space-9);
		padding-block: var(--space-7);
		border-top: var(--border);
		background: color-mix(in oklab, var(--bg-deep) 60%, transparent);
	}

	.footer__inner {
		display: grid;
		gap: var(--space-5);
	}

	.footer__brand {
		display: grid;
		gap: var(--space-2);
	}

	.footer__blurb {
		max-width: 44ch;
		color: var(--text-muted);
		font-size: var(--step--1);
	}

	.footer__nav {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-4);
	}

	.footer__nav a {
		color: var(--text-muted);
		font-size: var(--step--1);
		font-weight: 560;
		text-decoration: none;
		border-bottom: 2px solid transparent;
		padding-bottom: 2px;
	}

	.footer__nav a:hover {
		color: var(--text);
		border-bottom-color: var(--section);
	}

	.footer__legal {
		max-width: 68ch;
		color: var(--text-faint);
		font-size: var(--step--2);
		line-height: var(--leading-snug);
	}
</style>
