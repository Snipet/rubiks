// The whole site is static: every route is prerendered at build time and shipped
// as flat files, which is what both GitHub Pages and Cloudflare Pages want.
export const prerender = true;
export const trailingSlash = 'always';
