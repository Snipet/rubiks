/// <reference types="@sveltejs/kit" />
/// <reference lib="webworker" />

/**
 * Offline support.
 *
 * The site is prerendered to static files and has no server to talk to, so
 * "works offline" is a matter of putting those files in a cache rather than any
 * cleverness about synchronising state. That is worth doing for a specific
 * reason: the place you most want to look up a PLL algorithm is a competition
 * venue, and the wifi at a competition venue is uniformly terrible.
 *
 * Every build gets its own cache, named after the build. On activation the old
 * ones are deleted outright, which means a deploy can never leave a reader with
 * half the pages from one version and half from another.
 */

import { build, files, prerendered, version } from '$service-worker';

const worker = self as unknown as ServiceWorkerGlobalScope;

const CACHE = `rubiks-seanfunk-${version}`;

/** The built assets, the static files, and every prerendered page. */
const ASSETS = [...build, ...files, ...prerendered];

worker.addEventListener('install', (event) => {
	event.waitUntil(
		caches
			.open(CACHE)
			.then((cache) => cache.addAll(ASSETS))
			// A fresh build should be usable immediately rather than after the tab is
			// closed and reopened, which for a reference site is the difference
			// between a fix landing and a fix being seen.
			.then(() => worker.skipWaiting())
	);
});

worker.addEventListener('activate', (event) => {
	event.waitUntil(
		caches
			.keys()
			.then((keys) =>
				Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))
			)
			.then(() => worker.clients.claim())
	);
});

worker.addEventListener('fetch', (event) => {
	const request = event.request;
	if (request.method !== 'GET') return;

	const url = new URL(request.url);
	if (url.origin !== location.origin) return;

	event.respondWith(
		(async () => {
			const cache = await caches.open(CACHE);

			// Anything shipped with the build is immutable and versioned, so the
			// cache is the truth and the network is not worth waiting for.
			const cached = await cache.match(request);
			if (cached && ASSETS.includes(url.pathname)) return cached;

			try {
				const response = await fetch(request);
				// Opaque and error responses are not worth keeping; a 404 cached for
				// the life of a build is a page that stays broken until the next deploy.
				if (response.status === 200 && response.type === 'basic') {
					cache.put(request, response.clone());
				}
				return response;
			} catch {
				// Offline. A cached copy, however stale, beats the browser's error page.
				if (cached) return cached;
				// A navigation with nothing cached still deserves the shell rather than
				// a dinosaur, so fall back to the site's front page if it is there.
				if (request.mode === 'navigate') {
					const shell = await cache.match('/');
					if (shell) return shell;
				}
				throw new Error('offline, and this page was never cached');
			}
		})()
	);
});
