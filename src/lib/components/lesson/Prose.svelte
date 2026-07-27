<!--
	Inline markup for lesson text.

	A deliberately tiny subset — bold, italic, code and links — parsed here rather
	than pulled in as a markdown dependency, because lesson bodies are typed data
	and the only thing they need is emphasis inside a sentence.
-->
<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Pathname } from '$app/types';

	interface Props {
		text: string;
		as?: 'p' | 'span' | 'li';
		class?: string;
	}

	let { text, as = 'p', class: className = '' }: Props = $props();

	type Token =
		| { kind: 'text'; value: string }
		| { kind: 'strong'; value: string }
		| { kind: 'em'; value: string }
		| { kind: 'code'; value: string }
		| { kind: 'link'; value: string; href: string };

	/**
	 * Split on the four markers in one pass. Order matters: `**` must be tried
	 * before `*`, or bold text is read as two italics wrapped round nothing.
	 */
	const PATTERN = /\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`|\[([^\]]+)\]\(([^)]+)\)/g;

	const tokens = $derived.by((): Token[] => {
		const out: Token[] = [];
		let last = 0;
		for (const match of text.matchAll(PATTERN)) {
			if (match.index > last) out.push({ kind: 'text', value: text.slice(last, match.index) });
			if (match[1] !== undefined) out.push({ kind: 'strong', value: match[1] });
			else if (match[2] !== undefined) out.push({ kind: 'em', value: match[2] });
			else if (match[3] !== undefined) out.push({ kind: 'code', value: match[3] });
			else out.push({ kind: 'link', value: match[4], href: match[5] });
			last = match.index + match[0].length;
		}
		if (last < text.length) out.push({ kind: 'text', value: text.slice(last) });
		return out;
	});

	/**
	 * Internal links are site paths; anything with a scheme or a fragment is left
	 * alone. The assertion is the honest one: lesson authors write real paths, and
	 * a wrong one shows up as a 404 in the prerender rather than silently working.
	 */
	function href(target: string): string {
		return /^[a-z]+:|^#/.test(target) ? target : resolve(target as Pathname);
	}
</script>

<svelte:element this={as} class={className}>
	{#each tokens as token, i (i)}
		{#if token.kind === 'text'}{token.value}
		{:else if token.kind === 'strong'}<strong>{token.value}</strong>
		{:else if token.kind === 'em'}<em>{token.value}</em>
		{:else if token.kind === 'code'}<code>{token.value}</code>
		{:else}<a href={href(token.href)}>{token.value}</a>{/if}
	{/each}
</svelte:element>
