<!--
	A segmented control. Used for the skill-tier switch, view toggles and filters.
	Arrow keys move between options, matching a radio group.
-->
<script lang="ts" generics="T extends string">
	interface Props {
		options: readonly { value: T; label: string; title?: string }[];
		value: T;
		onchange: (value: T) => void;
		label: string;
		size?: 'sm' | 'md';
		/** Stretch to fill the available width. */
		full?: boolean;
		class?: string;
	}

	let {
		options,
		value = $bindable(),
		onchange,
		label,
		size = 'md',
		full = false,
		class: className = ''
	}: Props = $props();

	function onkeydown(event: KeyboardEvent, index: number) {
		const delta = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
		if (!delta) return;
		event.preventDefault();
		const next = options[(index + delta + options.length) % options.length];
		onchange(next.value);
	}
</script>

<div
	class="segmented segmented--{size} {className}"
	class:segmented--full={full}
	role="radiogroup"
	aria-label={label}
>
	{#each options as option, i (option.value)}
		<button
			type="button"
			role="radio"
			aria-checked={value === option.value}
			title={option.title}
			class="segment"
			class:segment--on={value === option.value}
			onclick={() => onchange(option.value)}
			onkeydown={(e) => onkeydown(e, i)}
		>
			{option.label}
		</button>
	{/each}
</div>

<style>
	.segmented {
		display: inline-flex;
		padding: 3px;
		gap: 2px;
		background: var(--surface-2);
		border: var(--border);
		border-radius: var(--radius-2);
	}

	.segmented--full {
		display: flex;
		width: 100%;
	}

	.segmented--full .segment {
		flex: 1;
	}

	.segment {
		padding: 0.42em 0.85em;
		border-radius: calc(var(--radius-2) - 3px);
		color: var(--text-muted);
		font-size: var(--step--1);
		font-weight: 560;
		line-height: 1;
		white-space: nowrap;
		transition:
			background var(--dur-fast) var(--ease-out),
			color var(--dur-fast) var(--ease-out);
	}

	.segmented--sm .segment {
		padding: 0.32em 0.6em;
		font-size: var(--step--2);
	}

	.segment:hover {
		color: var(--text);
	}

	.segment--on {
		background: var(--surface-raised);
		color: var(--text);
		box-shadow: var(--shadow-1);
	}
</style>
