<!-- The one button. Variants cover every use on the site; there is no second button component. -->
<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		variant?: 'primary' | 'secondary' | 'ghost' | 'section' | 'danger';
		size?: 'sm' | 'md' | 'lg';
		href?: string;
		type?: 'button' | 'submit';
		disabled?: boolean;
		/** Renders as a square icon button. */
		icon?: boolean;
		title?: string;
		onclick?: (event: MouseEvent) => void;
		'aria-label'?: string;
		'aria-pressed'?: boolean;
		'aria-expanded'?: boolean;
		'aria-controls'?: string;
		class?: string;
		children: Snippet;
	}

	let {
		variant = 'secondary',
		size = 'md',
		href,
		type = 'button',
		disabled = false,
		icon = false,
		title,
		onclick,
		class: className = '',
		children,
		...rest
	}: Props = $props();
</script>

<svelte:element
	this={href ? 'a' : 'button'}
	{href}
	type={href ? undefined : type}
	disabled={href ? undefined : disabled}
	aria-disabled={href && disabled ? 'true' : undefined}
	{title}
	{onclick}
	role={href ? 'link' : undefined}
	class="btn btn--{variant} btn--{size} {className}"
	class:btn--icon={icon}
	{...rest}
>
	{@render children()}
</svelte:element>

<style>
	.btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-2);
		border: 1px solid transparent;
		border-radius: var(--radius-2);
		font-weight: 560;
		line-height: 1;
		text-decoration: none;
		white-space: nowrap;
		cursor: pointer;
		transition:
			background var(--dur-fast) var(--ease-out),
			border-color var(--dur-fast) var(--ease-out),
			color var(--dur-fast) var(--ease-out),
			transform var(--dur-instant) var(--ease-out);
	}

	.btn:active:not(:disabled) {
		transform: translateY(1px);
	}

	.btn:disabled,
	.btn[aria-disabled='true'] {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.btn--sm {
		padding: 0.42em 0.7em;
		font-size: var(--step--1);
	}
	.btn--md {
		padding: 0.6em 0.95em;
		font-size: var(--step-0);
	}
	.btn--lg {
		padding: 0.75em 1.35em;
		font-size: var(--step-1);
	}

	.btn--icon {
		aspect-ratio: 1;
		padding: 0.5em;
	}

	.btn--primary {
		background: var(--accent);
		color: var(--accent-contrast);
	}
	.btn--primary:hover:not(:disabled) {
		background: var(--accent-strong);
	}

	.btn--section {
		background: var(--section);
		color: var(--text-inverse);
	}
	.btn--section:hover:not(:disabled) {
		filter: brightness(1.08);
	}

	.btn--secondary {
		background: var(--surface-2);
		border-color: var(--hairline-strong);
		color: var(--text);
	}
	.btn--secondary:hover:not(:disabled) {
		background: var(--surface-3);
		border-color: var(--section);
	}

	/*
	 * Danger is the one place the interface borrows a colour close to a sticker
	 * red, and it earns it: an irreversible action should not look like the other
	 * buttons. It is the accent ramp's red rather than the R face's, so a swatch
	 * and a warning still cannot be confused.
	 */
	.btn--danger {
		background: var(--danger);
		color: #fff;
		border-color: transparent;
	}

	.btn--danger:hover:not(:disabled) {
		background: color-mix(in oklab, var(--danger) 85%, black);
	}

	.btn--ghost {
		background: transparent;
		color: var(--text-muted);
	}
	.btn--ghost:hover:not(:disabled) {
		background: var(--surface-2);
		color: var(--text);
	}
</style>
