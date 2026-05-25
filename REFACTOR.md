# Refactoring Guidelines

A prioritized list of refactoring tasks for the Algorithm Visualizer project. Each section explains the problem, why it matters, and how to fix it.

---

## 1. ~~Convert Class Components to Functional Components with Hooks~~ ✅

**Status:** Done  

All visualizer pages and child components converted to functional components with hooks. Uses `useRef` for values read inside async animation loops (speed, isRunning, etc.) to avoid stale closures. The only remaining class component is `src/app/15-puzzle/page.jsx` (skipped intentionally).

Unused files removed during conversion: `convex-hull/cnvas2.jsx`, `convex-hull/timer.jsx`, `recursion-tree/details.jsx`, `recursion-tree/vertexOriginal.jsx`.

---

## 2. ~~Standardize Disabled Prop Naming~~ ✅

**Status:** Done  

All components now use `disabled` (the HTML standard). Removed `disable` and `isDisabled` variants from all pages, menus, and shared components. Added visual disabled state (opacity + pointer-events) to the Slider UI component.

---

## 3. Remove Console Logs

**Priority:** High  
**Effort:** Small  
**Impact:** Clean production output

ESLint `no-console` rule is now configured as a warning. Most console.log statements were removed during the hooks migration. Remaining ones are flagged by the linter.

---

## 4. Remove Commented-Out Code

**Priority:** Medium  
**Effort:** Small  
**Impact:** Cleaner codebase, less noise when reading

### Significant blocks to remove

- `src/app/15-puzzle/page.jsx:69-90` — old FlipMove/SVG experiment (22 lines)
- `src/app/pathfinder/page.jsx:150-158` — old setTimeout animation loop
- `src/app/sorting/page.jsx:144-180, 212-219` — old animation state management
- `src/app/components/footer.jsx:22-41` — old button variants (20 lines)
- `src/app/recursion-tree/Tree.js:87-88, 230-242` — debug/test code
- `src/app/binary-search/custom-dual-slider.jsx:3-10` — TypeScript interface definition

Git history preserves all of this — no reason to keep it in the source.

---

## 5. Fix Hardcoded Image Paths

**Priority:** Medium  
**Effort:** Small  
**Impact:** Makes base path changes safe, prevents broken images

### Problem

Image paths hardcode `/AlgorithmVisualizer/` but `next.config.mjs` already has `basePath: '/AlgorithmVisualizer'`. Next.js `Image` component automatically prepends the basePath, so images should use root-relative paths.

### Files to fix

- `src/app/components/algorithm-cards.jsx` — 10 image paths (lines 12, 18, 24, 30, 36, 42, 48, 54, 60, 65)
- `src/app/components/hero.jsx` — 1 image path (line 17)
- `src/app/n-queen/cell.jsx` — 1 image path (line 7)

### Fix

```jsx
// BEFORE
image: '/AlgorithmVisualizer/images/graph.png'

// AFTER
image: '/images/graph.png'
```

Next.js will prepend the basePath automatically.

---

## 6. Remove Unused Dependencies

**Priority:** Medium  
**Effort:** Small  
**Impact:** Smaller bundle, fewer security vulnerabilities

### Dependencies to remove from `package.json`

- `react-router` (v6.2.1) — Next.js has built-in routing, this is unused
- `react-router-dom` (v5.2.0) — same, also a different major version from `react-router`
- `fontsource-roboto` — installed but never imported
- `query-string` — check if used; Next.js has built-in search params
- `web-vitals` — leftover from Create React App, not configured for Next.js

### Dependency to evaluate

- `react-flip-move` (v3.0.5) — unmaintained, triggers `UNSAFE_componentWillReceiveProps` warning in strict mode. Used in 3 files:
  - `src/app/15-puzzle/page.jsx` — puzzle tile animation
  - `src/app/turing-machine/ribbon.jsx` — tape ribbon animation
  - `src/app/sorting/rects.jsx` — sorting bar animation

  **Alternatives:** Framer Motion, React Spring, or CSS transitions with `key` changes.

---

## 7. Improve Accessibility

**Priority:** Medium  
**Effort:** Medium  
**Impact:** Better usability for screen readers and keyboard navigation

### Issues to fix

- `src/app/n-queen/cell.jsx:7` — `<img>` missing `alt` attribute. Add `alt="Queen"`
- Grid cells in pathfinder, game-of-life, n-queen — add `role="gridcell"` and `aria-label`
- Grid containers — add `role="grid"`
- Interactive nodes (pathfinder walls) — add `role="button"` and keyboard handlers
- Canvas elements (convex hull, recursion tree) — add `aria-label` describing the visualization

---

## 8. CSS Cleanup and Tailwind Migration

**Priority:** Low  
**Effort:** Medium  
**Impact:** Consistency, fewer files, easier maintenance

### CSS files that could migrate to Tailwind

| File | Lines | Notes |
|------|-------|-------|
| `src/app/pathfinder/node.css` | 99 | Animation keyframes must stay in CSS |
| `src/app/pathfinder/grid.css` | 9 | Simple flex layout — easy Tailwind migration |
| `src/app/game-of-life/node.css` | 99 | Similar to pathfinder node.css |
| `src/app/game-of-life/grid.css` | — | Check for duplication with pathfinder |
| `src/app/game-of-life/styles.css` | 99 | Additional game styles |
| `src/app/prime-numbers/cell.css` | 58 | Cell styling with animations |
| `src/app/prime-numbers/cells.css` | — | Container styling |
| `src/app/15-puzzle/style.css` | 22 | Square tile styling |
| `src/app/n-queen/style.css` | 21 | Board styling |
| `src/app/turing-machine/cell.css` | 10 | Simple cell styling |
| `src/app/sorting/style.css` | — | Sorting bar styling |
| `src/app/recursive-sorting/style.css` | — | Same pattern |

### Strategy

- Keep CSS keyframe animations in CSS files (Tailwind can't do custom multi-step keyframes inline)
- Migrate static styles (colors, sizing, spacing, layout) to Tailwind utility classes
- Consolidate duplicate cell/node CSS across pathfinder and game-of-life

### Global CSS issue

`src/app/pathfinder/grid.css` has global `div` styling that can affect other components. Should be scoped with CSS modules or replaced with Tailwind classes.

---

## 9. Add Metadata and SEO

**Priority:** Low  
**Effort:** Small  
**Impact:** Better social sharing, discoverability

### Current state

`src/app/layout.js` has minimal metadata:
```javascript
export const metadata = {
  title: "Algorithm Visualizer",
  description: "Explore and learn algorithms through visualization.",
};
```

### Improvements

```javascript
export const metadata = {
  title: "Algorithm Visualizer",
  description: "Explore 24+ algorithms with step-by-step interactive visualizations — pathfinding, sorting, recursion, and more.",
  openGraph: {
    title: "Algorithm Visualizer",
    description: "Interactive algorithm visualizations for learning",
    url: "https://tamimehsan.github.io/AlgorithmVisualizer",
    type: "website",
    images: ["/images/algorithm.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Algorithm Visualizer",
    description: "Interactive algorithm visualizations for learning",
  },
};
```

Per-page metadata can also be added using Next.js `generateMetadata` or `metadata` exports in each page file.

---

## 10. ~~Add ESLint~~ ✅

**Status:** Done  

ESLint configured in `eslint.config.mjs` using eslint-config-next v16 native flat config. Rules: `no-console` (warn), `no-unused-vars` (warn, `_` prefix ignored), `react/no-unescaped-entities` (off). All lint errors resolved. Stale CRA `eslintConfig` removed from `package.json`. Run with `npm run lint`.

---

## 11. TypeScript Migration

**Priority:** Low  
**Effort:** Large  
**Impact:** Type safety, better IDE support, catch bugs at compile time

### Readiness

- `jsconfig.json` already configured with `@/*` path alias
- All Radix UI and Next.js packages ship with TypeScript definitions
- No blockers

### Migration steps

1. Install TypeScript: `npm install -D typescript @types/react @types/node`
2. Create `tsconfig.json` (Next.js auto-generates on first run)
3. Rename files `.jsx` → `.tsx`, `.js` → `.ts` incrementally
4. Add types to component props, state, and function signatures
5. Start with shared components (`src/components/`), then pages

### Recommended order

Rename and type one visualizer at a time, starting with the simplest (Game of Life — already functional). This can be done alongside the class → hooks conversion.

---

## Quick Wins Checklist

- [x] Install ESLint with `next/core-web-vitals` config
- [x] Remove stale CRA `eslintConfig` from `package.json`
- [x] Remove unused variables and dead code
- [x] Standardize `disabled` prop naming
- [x] Add `alt="Queen"` to queen cell image
- [x] Convert class components to functional components with hooks
- [ ] Remove remaining `console.log` statements (flagged by linter)
- [ ] Remove commented-out code blocks
- [ ] Fix hardcoded `/AlgorithmVisualizer/` image paths
- [ ] Remove unused dependencies (`react-router`, `react-router-dom`, `fontsource-roboto`)
- [ ] Add Open Graph metadata to `layout.js`
