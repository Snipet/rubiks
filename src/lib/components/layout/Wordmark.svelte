<!--
	The wordmark.

	Always lowercase, and the `[dot]` stays literal — it is part of the name. The
	brackets are set in the mono face and dimmed so the eye reads three parts
	rather than one long string, without the name ever being altered.
-->
<script lang="ts">
	import { BRAND } from '$lib/brand';

	interface Props {
		/** `md` for the header, `lg` for the landing hero, `sm` for the footer. */
		size?: 'sm' | 'md' | 'lg';
		/** Tint the bracketed part with the current section colour. */
		sectioned?: boolean;
		class?: string;
	}

	let { size = 'md', sectioned = false, class: className = '' }: Props = $props();
</script>

<span class="wordmark wordmark--{size} {className}" aria-label={BRAND}>
	<span class="part">rubiks</span><span class="dot" class:dot--sectioned={sectioned}>[dot]</span
	><span class="part">seanfunk</span>
</span>

<style>
	.wordmark {
		display: inline-flex;
		align-items: baseline;
		font-weight: 620;
		letter-spacing: -0.015em;
		line-height: 1;
		text-transform: lowercase;
		white-space: nowrap;
		color: var(--text);
	}

	.wordmark--sm {
		font-size: var(--step--1);
	}
	.wordmark--md {
		font-size: var(--step-1);
	}
	.wordmark--lg {
		font-size: var(--step-4);
	}

	.dot {
		font-family: var(--font-mono);
		font-weight: 500;
		font-size: 0.82em;
		letter-spacing: -0.04em;
		color: var(--text-faint);
		padding-inline: 0.06em;
		transition: color var(--dur-fast) var(--ease-out);
	}

	.dot--sectioned {
		color: var(--section);
	}

	/* On hover anywhere in a link containing the wordmark, light the brackets. */
	:global(a:hover) .dot {
		color: var(--section);
	}
</style>
