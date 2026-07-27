<!-- A raised surface. Becomes a link card when given an href. -->
<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		href?: string;
		/** Tint the border and a corner glow with the section colour. */
		accent?: boolean;
		padding?: 'sm' | 'md' | 'lg' | 'none';
		class?: string;
		children: Snippet;
	}

	let { href, accent = false, padding = 'md', class: className = '', children }: Props = $props();
</script>

<svelte:element
	this={href ? 'a' : 'div'}
	{href}
	class="card card--{padding} {className}"
	class:card--accent={accent}
	class:card--link={href !== undefined}
>
	{@render children()}
</svelte:element>

<style>
	.card {
		position: relative;
		display: block;
		background: var(--surface-1);
		border: var(--border);
		border-radius: var(--radius-3);
		color: inherit;
		text-decoration: none;
		overflow: hidden;
		transition:
			border-color var(--dur-fast) var(--ease-out),
			transform var(--dur-fast) var(--ease-out),
			box-shadow var(--dur-fast) var(--ease-out);
	}

	.card--none {
		padding: 0;
	}
	.card--sm {
		padding: var(--space-3);
	}
	.card--md {
		padding: var(--space-5);
	}
	.card--lg {
		padding: var(--space-6);
	}

	.card--accent {
		border-color: var(--section-edge);
	}

	.card--accent::before {
		content: '';
		position: absolute;
		inset-inline-start: 0;
		inset-block: 0;
		width: 3px;
		background: var(--section);
	}

	.card--link:hover {
		border-color: var(--section);
		transform: translateY(-2px);
		box-shadow: var(--shadow-3);
	}

	.card--link:focus-visible {
		border-color: var(--accent);
	}
</style>
