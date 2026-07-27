<!--
	The site header.

	Sticky, with the section colour bleeding into the underline so the current
	place is legible at a glance. The navigation collapses to a drawer below the
	medium breakpoint rather than a hamburger over a horizontal scroll, because
	six items do not fit and pretending they do is worse than a menu.
-->
<script lang="ts">
	import { page } from '$app/state';
	import { base, resolve } from '$app/paths';
	import { NAV, sectionFor } from '$lib/nav';
	import Wordmark from './Wordmark.svelte';
	import SkillPicker from './SkillPicker.svelte';
	import PuzzlePicker from './PuzzlePicker.svelte';
	import AppearanceMenu from './AppearanceMenu.svelte';

	let open = $state(false);
	const current = $derived(sectionFor(page.url.pathname.replace(base, '') || '/'));

	// Close the drawer whenever navigation happens.
	$effect(() => {
		void page.url.pathname;
		open = false;
	});
</script>

<svelte:window
	onkeydown={(e) => {
		if (e.key === 'Escape') open = false;
	}}
/>

<a class="skip" href="#main">Skip to content</a>

<header class="header">
	<div class="header__inner page page--wide">
		<a class="brand" href={resolve('/')} aria-label="Home">
			<span class="brand__mark" aria-hidden="true">
				<svg viewBox="0 0 64 64" width="26" height="26">
					<path d="M32 4 60 18 32 32 4 18Z" fill="var(--sticker-u)" />
					<path d="M4 18 32 32 32 60 4 46Z" fill="var(--sticker-f)" />
					<path d="M60 18 60 46 32 60 32 32Z" fill="var(--sticker-r)" />
					<path
						d="M32 4 60 18 60 46 32 60 4 46 4 18Z M4 18 32 32 60 18 M32 32 32 60"
						fill="none"
						stroke="var(--bg)"
						stroke-width="2.5"
						stroke-linejoin="round"
					/>
				</svg>
			</span>
			<Wordmark size="md" sectioned />
		</a>

		<nav class="nav nav--wide" aria-label="Sections">
			{#each NAV as item (item.id)}
				<a
					class="nav__link"
					class:nav__link--on={current === item.id}
					data-section={item.id}
					href={resolve(item.href)}
					aria-current={current === item.id ? 'page' : undefined}
				>
					{item.label}
				</a>
			{/each}
		</nav>

		<div class="header__tools">
			<PuzzlePicker compact />
			<SkillPicker compact />
			<AppearanceMenu />
			<button
				class="drawer-toggle"
				type="button"
				aria-expanded={open}
				aria-controls="site-drawer"
				onclick={() => (open = !open)}
			>
				<span class="visually-hidden">{open ? 'Close menu' : 'Open menu'}</span>
				<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
					{#if open}
						<path
							d="M6 6 18 18M18 6 6 18"
							stroke="currentColor"
							stroke-width="2"
							fill="none"
							stroke-linecap="round"
						/>
					{:else}
						<path
							d="M4 7h16M4 12h16M4 17h16"
							stroke="currentColor"
							stroke-width="2"
							fill="none"
							stroke-linecap="round"
						/>
					{/if}
				</svg>
			</button>
		</div>
	</div>

	{#if open}
		<nav id="site-drawer" class="drawer" aria-label="Sections">
			{#each NAV as item (item.id)}
				<a
					class="drawer__link"
					class:drawer__link--on={current === item.id}
					data-section={item.id}
					href={resolve(item.href)}
				>
					<span class="drawer__label">{item.label}</span>
					<span class="drawer__blurb">{item.blurb}</span>
				</a>
			{/each}
		</nav>
	{/if}
</header>

<style>
	.skip {
		position: absolute;
		inset-inline-start: var(--space-4);
		inset-block-start: calc(var(--space-4) * -6);
		z-index: 100;
		padding: var(--space-3) var(--space-4);
		background: var(--accent);
		color: var(--accent-contrast);
		border-radius: var(--radius-2);
		font-weight: 600;
		transition: inset-block-start var(--dur-fast) var(--ease-out);
	}

	.skip:focus {
		inset-block-start: var(--space-4);
	}

	.header {
		position: sticky;
		top: 0;
		z-index: 40;
		background: color-mix(in oklab, var(--bg) 88%, transparent);
		backdrop-filter: blur(14px) saturate(1.4);
		border-bottom: var(--border);
	}

	.header__inner {
		display: flex;
		align-items: center;
		gap: var(--space-5);
		min-height: var(--header-height);
	}

	.brand {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		text-decoration: none;
		flex-shrink: 0;
	}

	.brand__mark {
		display: grid;
		place-items: center;
	}

	.nav {
		display: flex;
		align-items: center;
		gap: var(--space-1);
		margin-inline-end: auto;
	}

	.nav__link {
		position: relative;
		padding: var(--space-2) var(--space-3);
		border-radius: var(--radius-2);
		color: var(--text-muted);
		font-size: var(--step--1);
		font-weight: 560;
		text-decoration: none;
		white-space: nowrap;
		transition:
			color var(--dur-fast) var(--ease-out),
			background var(--dur-fast) var(--ease-out);
	}

	.nav__link::after {
		content: '';
		position: absolute;
		inset-inline: var(--space-3);
		bottom: 2px;
		height: 2px;
		border-radius: 2px;
		background: var(--section);
		transform: scaleX(0);
		transition: transform var(--dur-fast) var(--ease-out);
	}

	.nav__link:hover {
		color: var(--text);
		background: var(--surface-2);
	}

	.nav__link--on {
		color: var(--text);
	}

	.nav__link--on::after {
		transform: scaleX(1);
	}

	.header__tools {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		margin-inline-start: auto;
	}

	.drawer-toggle {
		display: none;
		padding: var(--space-2);
		border: var(--border);
		border-radius: var(--radius-2);
		color: var(--text-muted);
	}

	.drawer-toggle:hover {
		color: var(--text);
		background: var(--surface-2);
	}

	.drawer {
		display: grid;
		gap: var(--space-1);
		padding: var(--space-3) var(--gutter) var(--space-5);
		border-top: var(--border);
		background: var(--surface-1);
	}

	.drawer__link {
		display: grid;
		gap: 2px;
		padding: var(--space-3);
		border-radius: var(--radius-2);
		border-inline-start: 3px solid var(--section);
		background: var(--surface-2);
		text-decoration: none;
	}

	.drawer__link--on {
		background: var(--section-wash);
	}

	.drawer__label {
		color: var(--text);
		font-weight: 600;
	}

	.drawer__blurb {
		color: var(--text-muted);
		font-size: var(--step--1);
	}

	@media (max-width: 62rem) {
		.nav--wide {
			display: none;
		}
		.drawer-toggle {
			display: inline-flex;
		}
	}

	@media (min-width: 62.01rem) {
		.drawer {
			display: none;
		}
	}
</style>
