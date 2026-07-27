<!--
	Appearance and accessibility settings.

	Grouped in one place because they are all the same kind of decision: how the
	site should look and move for this particular person. The colour-vision
	options change the sticker palette everywhere at once, including in every
	generated diagram, because they are CSS custom properties rather than baked
	into the drawings.
-->
<script lang="ts">
	import { settings, SETTING_LABELS, type Palette, type Theme } from '$state/settings.svelte';
	import Segmented from '../ui/Segmented.svelte';

	let open = $state(false);
	const s = $derived(settings.current);
</script>

<svelte:window
	onkeydown={(e) => {
		if (e.key === 'Escape') open = false;
	}}
/>

<div class="menu-root">
	<button
		type="button"
		class="trigger"
		aria-expanded={open}
		aria-haspopup="true"
		aria-label="Appearance and accessibility"
		onclick={() => (open = !open)}
	>
		<svg
			viewBox="0 0 24 24"
			width="18"
			height="18"
			aria-hidden="true"
			fill="none"
			stroke="currentColor"
			stroke-width="1.8"
		>
			<circle cx="12" cy="12" r="8.5" />
			<path d="M12 3.5v17" />
			<path d="M12 3.5a8.5 8.5 0 0 1 0 17" fill="currentColor" stroke="none" />
		</svg>
	</button>

	{#if open}
		<button type="button" class="scrim" aria-label="Close menu" onclick={() => (open = false)}
		></button>
		<div class="panel">
			<div class="group">
				<span class="group__label" id="theme-label">Theme</span>
				<Segmented
					label="Theme"
					value={s.theme}
					onchange={(v) => settings.set('theme', v as Theme)}
					size="sm"
					full
					options={[
						{ value: 'system', label: 'Auto' },
						{ value: 'light', label: 'Light' },
						{ value: 'dark', label: 'Dark' }
					]}
				/>
			</div>

			<div class="group">
				<span class="group__label">Sticker colours</span>
				<div class="options">
					{#each Object.entries(SETTING_LABELS.palette) as [value, label] (value)}
						<button
							type="button"
							class="option"
							class:option--on={s.palette === value}
							aria-pressed={s.palette === value}
							onclick={() => settings.set('palette', value as Palette)}
						>
							<span class="swatches" data-palette={value} aria-hidden="true">
								<i style="background: var(--sticker-u)"></i>
								<i style="background: var(--sticker-r)"></i>
								<i style="background: var(--sticker-f)"></i>
								<i style="background: var(--sticker-d)"></i>
								<i style="background: var(--sticker-l)"></i>
								<i style="background: var(--sticker-b)"></i>
							</span>
							<span class="option__label">{label}</span>
						</button>
					{/each}
				</div>
			</div>

			<label class="toggle">
				<input
					type="checkbox"
					checked={s.stickerLetters}
					onchange={(e) => settings.set('stickerLetters', e.currentTarget.checked)}
				/>
				<span>
					<span class="toggle__label">Letter every sticker</span>
					<span class="toggle__hint">Prints the face letter on top of the colour.</span>
				</span>
			</label>

			<div class="group">
				<span class="group__label">Motion</span>
				<Segmented
					label="Motion"
					value={s.motion}
					onchange={(v) => settings.set('motion', v as 'system' | 'full' | 'reduced')}
					size="sm"
					full
					options={[
						{ value: 'system', label: 'Auto' },
						{ value: 'full', label: 'Full' },
						{ value: 'reduced', label: 'Reduced' }
					]}
				/>
			</div>

			<div class="group">
				<label class="group__label" for="turn-speed">
					Turn speed
					<span class="value">{s.turnSpeed}ms</span>
				</label>
				<input
					id="turn-speed"
					type="range"
					min="60"
					max="600"
					step="20"
					value={s.turnSpeed}
					oninput={(e) => settings.set('turnSpeed', Number(e.currentTarget.value))}
				/>
			</div>

			<div class="group">
				<span class="group__label">Density</span>
				<Segmented
					label="Density"
					value={s.density}
					onchange={(v) => settings.set('density', v as 'comfortable' | 'compact')}
					size="sm"
					full
					options={[
						{ value: 'comfortable', label: 'Comfortable' },
						{ value: 'compact', label: 'Compact' }
					]}
				/>
			</div>

			<div class="group">
				<span class="group__label">Wide turns written as</span>
				<Segmented
					label="Wide turn notation"
					value={s.wideNotation}
					onchange={(v) => settings.set('wideNotation', v as 'Rw' | 'r')}
					size="sm"
					full
					options={[
						{ value: 'Rw', label: 'Rw' },
						{ value: 'r', label: 'r' }
					]}
				/>
			</div>
		</div>
	{/if}
</div>

<style>
	.menu-root {
		position: relative;
	}

	.trigger {
		display: grid;
		place-items: center;
		padding: var(--space-2);
		border: var(--border);
		border-radius: var(--radius-2);
		color: var(--text-muted);
	}

	.trigger:hover {
		color: var(--text);
		border-color: var(--hairline-strong);
	}

	.scrim {
		position: fixed;
		inset: 0;
		z-index: 45;
	}

	.panel {
		position: absolute;
		inset-inline-end: 0;
		top: calc(100% + var(--space-2));
		z-index: 50;
		display: grid;
		gap: var(--space-4);
		width: min(21rem, calc(100vw - 2rem));
		padding: var(--space-4);
		background: var(--surface-raised);
		border: var(--border-strong);
		border-radius: var(--radius-3);
		box-shadow: var(--shadow-4);
		max-height: min(38rem, calc(100vh - 6rem));
		overflow-y: auto;
	}

	.group {
		display: grid;
		gap: var(--space-2);
	}

	.group__label {
		display: flex;
		justify-content: space-between;
		color: var(--text-faint);
		font-size: var(--step--2);
		font-weight: 600;
		letter-spacing: var(--tracking-caps);
		text-transform: uppercase;
	}

	.value {
		color: var(--text-muted);
		text-transform: none;
		letter-spacing: 0;
		font-variant-numeric: tabular-nums;
	}

	.options {
		display: grid;
		gap: 2px;
	}

	.option {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-2);
		border: 1px solid transparent;
		border-radius: var(--radius-2);
		font-size: var(--step--1);
		text-align: start;
	}

	.option:hover {
		background: var(--surface-2);
	}

	.option--on {
		background: var(--accent-wash);
		border-color: var(--accent-dim);
	}

	.option__label {
		color: var(--text);
	}

	.swatches {
		display: inline-flex;
		gap: 2px;
		flex-shrink: 0;
	}

	.swatches i {
		width: 8px;
		height: 16px;
		border-radius: 2px;
	}

	.toggle {
		display: flex;
		align-items: start;
		gap: var(--space-3);
		cursor: pointer;
	}

	.toggle input {
		margin-top: 3px;
		accent-color: var(--accent);
	}

	.toggle__label {
		display: block;
		color: var(--text);
		font-size: var(--step--1);
		font-weight: 560;
	}

	.toggle__hint {
		display: block;
		color: var(--text-muted);
		font-size: var(--step--2);
	}

	input[type='range'] {
		width: 100%;
		accent-color: var(--accent);
	}
</style>
