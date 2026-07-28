<!--
	A cube embedded in a lesson.

	Wraps the 3D cube with its own state and a small keypad, so a reader can try a
	turn while reading about it. Each instance owns its own state, which is why
	this is a component rather than markup inlined into the lesson renderer.
-->
<script lang="ts">
	import { untrack } from 'svelte';
	import Cube3D from '../cube/Cube3D.svelte';
	import type { PuzzleSize } from '$cube/puzzle';
	import Button from '../ui/Button.svelte';
	import { cloneFacelets } from '$cube/facelets';
	import type { Facelets } from '$cube/types';

	interface Props {
		/** Which puzzle. Defaults to the 3×3. */
		order?: PuzzleSize;
		initial: Facelets;
		label?: string;
		size?: number;
		/** Turns offered on the keypad. */
		keys?: readonly string[];
	}

	let {
		initial,
		order = 3,
		label = 'A cube you can turn',
		size = 220,
		keys = ['U', "U'", 'R', "R'", 'F', "F'", 'L', "L'", 'D', "D'", 'B', "B'"]
	}: Props = $props();

	// Seeded once: the prop sets the starting position rather than driving it.
	let facelets = $state(untrack(() => cloneFacelets(initial)));
	let cube = $state<{ turn: (move: string) => Promise<void> } | null>(null);
	let busy = $state(false);
	let played = $state<string[]>([]);

	async function turn(move: string) {
		if (busy) return;
		busy = true;
		await cube?.turn(move);
		played = [...played, move];
		busy = false;
	}

	function reset() {
		facelets = cloneFacelets(initial);
		played = [];
	}
</script>

<div class="wrap">
	<Cube3D bind:this={cube} bind:facelets {order} {size} {label} />
	<div class="keys">
		{#each keys as move (move)}
			<button type="button" class="key" onclick={() => turn(move)} disabled={busy}>{move}</button>
		{/each}
	</div>
	<div class="foot">
		<span class="trail">{played.length ? played.join(' ') : 'No turns yet'}</span>
		<Button size="sm" variant="ghost" onclick={reset} disabled={played.length === 0}>Reset</Button>
	</div>
</div>

<style>
	.wrap {
		display: grid;
		justify-items: center;
		gap: var(--space-3);
	}

	.keys {
		display: grid;
		grid-template-columns: repeat(6, minmax(0, 1fr));
		gap: var(--space-1);
	}

	.key {
		padding: 0.4em 0.55em;
		background: var(--surface-2);
		border: var(--border);
		border-radius: var(--radius-1);
		color: var(--text);
		font-family: var(--font-mono);
		font-size: var(--step--1);
		font-weight: 560;
	}

	.key:hover:not(:disabled) {
		background: var(--surface-3);
		border-color: var(--section);
	}

	.key:disabled {
		opacity: 0.5;
	}

	.foot {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--space-3);
		justify-content: center;
	}

	.trail {
		color: var(--text-faint);
		font-family: var(--font-mono);
		font-size: var(--step--2);
		max-width: 24rem;
		overflow-wrap: anywhere;
	}
</style>
