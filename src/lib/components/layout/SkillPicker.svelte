<!--
	The skill switch.

	This is the most consequential control on the site: it decides which
	recommendation leads, which algorithm variant is shown first, and how much
	explanation lessons carry. It therefore lives in the header rather than buried
	in settings, and it is phrased as "where you are", not as a difficulty level.
-->
<script lang="ts">
	import { settings } from '$state/settings.svelte';
	import { SKILL_BLURBS, SKILL_LABELS, SKILL_TIERS, type SkillTier } from '$data/types';

	interface Props {
		/** Header form: a compact popover rather than a full list. */
		compact?: boolean;
	}

	let { compact = false }: Props = $props();
	let open = $state(false);
	const current = $derived(settings.current.skill);

	function choose(tier: SkillTier) {
		settings.set('skill', tier);
		open = false;
	}
</script>

<svelte:window
	onkeydown={(e) => {
		if (e.key === 'Escape') open = false;
	}}
/>

{#if compact}
	<div class="picker">
		<button
			type="button"
			class="trigger"
			aria-expanded={open}
			aria-haspopup="true"
			onclick={() => (open = !open)}
		>
			<span class="trigger__dots" aria-hidden="true">
				{#each SKILL_TIERS as tier, i (tier)}
					<span class="dot" class:dot--on={i <= SKILL_TIERS.indexOf(current)}></span>
				{/each}
			</span>
			<span class="trigger__label">{SKILL_LABELS[current]}</span>
		</button>

		{#if open}
			<button type="button" class="scrim" aria-label="Close menu" onclick={() => (open = false)}
			></button>
			<div class="menu" role="menu">
				<p class="menu__title">Show me things for a</p>
				{#each SKILL_TIERS as tier (tier)}
					<button
						type="button"
						role="menuitemradio"
						aria-checked={current === tier}
						class="option"
						class:option--on={current === tier}
						onclick={() => choose(tier)}
					>
						<span class="option__label">{SKILL_LABELS[tier]}</span>
						<span class="option__blurb">{SKILL_BLURBS[tier]}</span>
					</button>
				{/each}
			</div>
		{/if}
	</div>
{:else}
	<div class="cards">
		{#each SKILL_TIERS as tier (tier)}
			<button
				type="button"
				class="card"
				class:card--on={current === tier}
				aria-pressed={current === tier}
				onclick={() => choose(tier)}
			>
				<span class="card__label">{SKILL_LABELS[tier]}</span>
				<span class="card__blurb">{SKILL_BLURBS[tier]}</span>
			</button>
		{/each}
	</div>
{/if}

<style>
	.picker {
		position: relative;
	}

	.trigger {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-2) var(--space-3);
		border: var(--border);
		border-radius: var(--radius-2);
		color: var(--text-muted);
		font-size: var(--step--1);
		font-weight: 560;
	}

	.trigger:hover {
		color: var(--text);
		border-color: var(--hairline-strong);
	}

	.trigger__dots {
		display: inline-flex;
		gap: 2px;
	}

	.dot {
		width: 4px;
		height: 12px;
		border-radius: 2px;
		background: var(--hairline-strong);
		transition: background var(--dur-fast) var(--ease-out);
	}

	.dot--on {
		background: var(--section);
	}

	@media (max-width: 40rem) {
		.trigger__label {
			display: none;
		}
	}

	.scrim {
		position: fixed;
		inset: 0;
		z-index: 45;
	}

	.menu {
		position: absolute;
		inset-inline-end: 0;
		top: calc(100% + var(--space-2));
		z-index: 50;
		width: min(22rem, calc(100vw - 2rem));
		padding: var(--space-2);
		background: var(--surface-raised);
		border: var(--border-strong);
		border-radius: var(--radius-3);
		box-shadow: var(--shadow-4);
	}

	.menu__title {
		padding: var(--space-2) var(--space-3);
		color: var(--text-faint);
		font-size: var(--step--2);
		letter-spacing: var(--tracking-caps);
		text-transform: uppercase;
	}

	.option,
	.card {
		display: grid;
		gap: 2px;
		width: 100%;
		padding: var(--space-3);
		border: 1px solid transparent;
		border-radius: var(--radius-2);
		text-align: start;
	}

	.option:hover,
	.card:hover {
		background: var(--surface-2);
	}

	.option--on,
	.card--on {
		background: var(--section-wash);
		border-color: var(--section-edge);
	}

	.option__label,
	.card__label {
		color: var(--text);
		font-weight: 600;
	}

	.option__blurb,
	.card__blurb {
		color: var(--text-muted);
		font-size: var(--step--1);
		line-height: var(--leading-snug);
	}

	.cards {
		display: grid;
		gap: var(--space-3);
		grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
	}

	.card {
		background: var(--surface-1);
		border-color: var(--hairline);
	}
</style>
