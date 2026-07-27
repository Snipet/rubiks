# rubiks[dot]seanfunk

An interactive guide to solving the Rubik's Cube: progressive lessons for every
skill level, a large searchable algorithm library, and a cube you can paint to
match the one in your hands and get advice on what to do next.

Built as a fully static Svelte 5 / SvelteKit site — no backend, no accounts,
nothing to run. Your progress lives in your own browser.

## What's in it

| Section        | What it does                                                                                                               |
| -------------- | -------------------------------------------------------------------------------------------------------------------------- |
| **Learn**      | Four tracks — beginner, intermediate, advanced, expert — from "what is an algorithm" to full CFOP and alternative methods. |
| **Algorithms** | Every case in the sets that matter, with multiple solutions per case, generated diagrams, and filters by difficulty.       |
| **Solve**      | Paint your physical cube's stickers in, or type a scramble, and get step-by-step advice pitched at your level.             |
| **Trainer**    | Drill individual cases with a spaced-repetition scheduler that keeps the ones you fumble coming round.                     |
| **Timer**      | Scrambles, inspection, WCA-style averages and a solve history.                                                             |
| **Reference**  | Notation, glossary, method comparison, finger tricks, hardware notes.                                                      |

## Correctness

Cube logic is not something to eyeball. The move engine is built from nine
hand-derived facelet permutations, and everything else — wide turns, slice turns,
inverses, mirrors, whole-cube rotations — is composed from those. That single
foundation is pinned down by a test suite that checks published group orders,
reproduces the 20-move superflip by two independent algorithms, and compares the
derived `M` slice against a separately hand-written cycle definition.

The algorithm library is verified the same way. Case diagrams are **computed from
the algorithm** rather than stored next to it, so a picture cannot disagree with
its moves. And every algorithm is executed by the engine in CI and checked
against what its set claims to do — a PLL algorithm must permute the last layer
and leave everything else alone, an OLL algorithm must orient it, an F2L
algorithm must fill its slot. A mistyped move fails the build.

## Running it

```sh
npm install
npm run dev
```

| Command           | What it does                            |
| ----------------- | --------------------------------------- |
| `npm run dev`     | Development server with hot reloading   |
| `npm run build`   | Static build into `build/`              |
| `npm run preview` | Serve the built output                  |
| `npm test`        | Cube engine and algorithm library tests |
| `npm run check`   | `svelte-check` type checking            |
| `npm run lint`    | Prettier and ESLint                     |
| `npm run format`  | Rewrite files with Prettier             |

## Branches and deployment

```
feature branch ──PR──▶ dev ──▶ GitHub Pages (preview)
                        │
                        └──merge by hand──▶ main ──▶ Cloudflare Pages (production)
```

- **`dev`** is the integration branch. Open pull requests against it, never
  against `main`. Every push to `dev` republishes the GitHub Pages preview via
  `.github/workflows/deploy-pages.yml`.
- **`main`** is production. Merges into it are done by hand and picked up by
  Cloudflare Pages.

### Cloudflare Pages settings

| Setting                | Value           |
| ---------------------- | --------------- |
| Production branch      | `main`          |
| Build command          | `npm run build` |
| Build output directory | `build`         |
| Node version           | `22`            |

Leave `BASE_PATH` unset on Cloudflare — it serves from the domain root. The
GitHub Pages workflow sets `BASE_PATH=/<repo>` because Pages serves from a
sub-path, and `svelte.config.js` reads it.

## Accessibility

- Every colour choice has a colour-vision alternative (deuteranopia, protanopia,
  tritanopia, high contrast), plus an option to letter the stickers.
- Animation respects `prefers-reduced-motion`, and can be forced either way.
- The interactive cube is fully keyboard operable; nothing depends on dragging.
- Light and dark themes both follow the system by default.

## A note on branding

Nothing here uses Rubik's trademarks, logos, or trade dress. "Rubik's Cube" is a
registered trademark of Spin Master Toys UK Limited; this is an independent,
unaffiliated educational project. The icons and cube illustrations are original
flat SVGs drawn for this site.
