<!-- A small label. Used for tiers, tags, groups and counts. -->
<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		tone?: 'neutral' | 'section' | 'accent' | 'positive' | 'caution' | 'danger';
		size?: 'sm' | 'md';
		/** Draw as an outline rather than a fill. */
		outline?: boolean;
		title?: string;
		class?: string;
		children: Snippet;
	}

	let {
		tone = 'neutral',
		size = 'sm',
		outline = false,
		title,
		class: className = '',
		children
	}: Props = $props();
</script>

<span class="chip chip--{tone} chip--{size} {className}" class:chip--outline={outline} {title}>
	{@render children()}
</span>

<style>
	.chip {
		display: inline-flex;
		align-items: center;
		gap: 0.35em;
		border: 1px solid transparent;
		border-radius: var(--radius-pill);
		font-weight: 560;
		line-height: 1;
		white-space: nowrap;
	}

	.chip--sm {
		padding: 0.3em 0.6em;
		font-size: var(--step--2);
	}
	.chip--md {
		padding: 0.4em 0.75em;
		font-size: var(--step--1);
	}

	.chip--neutral {
		background: var(--surface-3);
		color: var(--text-muted);
	}
	.chip--section {
		background: color-mix(in oklab, var(--section) 18%, transparent);
		color: var(--section);
	}
	.chip--accent {
		background: var(--accent-wash);
		color: var(--accent-strong);
	}
	.chip--positive {
		background: color-mix(in oklab, var(--positive) 16%, transparent);
		color: var(--positive);
	}
	.chip--caution {
		background: color-mix(in oklab, var(--caution) 16%, transparent);
		color: var(--caution);
	}
	.chip--danger {
		background: color-mix(in oklab, var(--danger) 16%, transparent);
		color: var(--danger);
	}

	.chip--outline {
		background: transparent;
		border-color: currentColor;
	}
</style>
