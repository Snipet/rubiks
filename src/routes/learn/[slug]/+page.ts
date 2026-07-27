import { error } from '@sveltejs/kit';
import { LESSONS, lessonBySlug, neighbours } from '$data/lessons';

export function entries() {
	return LESSONS.map((l) => ({ slug: l.slug }));
}

export function load({ params }: { params: { slug: string } }) {
	const lesson = lessonBySlug(params.slug);
	if (!lesson) error(404, `There is no lesson called "${params.slug}"`);
	return { lesson, ...neighbours(params.slug) };
}
