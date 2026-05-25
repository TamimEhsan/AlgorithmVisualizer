# Refactoring Guidelines

A prioritized list of refactoring tasks for the Algorithm Visualizer project. Each section explains the problem, why it matters, and how to fix it.

---

## 1. Convert Class Components to Functional Components with Hooks

**Priority:** High  
**Effort:** Large (9 page components + ~30 child components)  
**Impact:** Eliminates stale state bugs, simplifies code, enables better React patterns

### Problem

All visualizer pages except Game of Life use class components. This causes subtle bugs — for example, calling `this.setState({ number })` and immediately reading `this.state.number` gives the old value because `setState` is async in class components.

### Files to convert (pages first, then children)

**Page components (10):**
- `src/app/pathfinder/page.jsx` — `Pathfinder`
- `src/app/sorting/page.jsx` — `Sort`
- `src/app/recursive-sorting/page.jsx` — `RecursiveSort`
- `src/app/n-queen/page.jsx` — `Queen`
- `src/app/convex-hull/page.jsx` — `ConvexHull`
- `src/app/prime-numbers/page.jsx` — `Seive`
- `src/app/recursion-tree/page.jsx` — `Graph`
- `src/app/turing-machine/page.jsx` — `TuringMachine`
- `src/app/15-puzzle/page.jsx` — `Puzzle`
- `src/app/binary-search/page.jsx` — `BinarySearch`

**Menu components (8):**
- `src/app/convex-hull/menu.jsx`
- `src/app/n-queen/menu.jsx`
- `src/app/prime-numbers/menu.jsx`
- `src/app/recursion-tree/menu.jsx`
- `src/app/recursive-sorting/menu.jsx`
- `src/app/sorting/menu.jsx`
- `src/app/turing-machine/menu.jsx`
- `src/app/pathfinder/menu.jsx`

**Child components (~20):**
- `src/app/pathfinder/node.jsx`, `grid.jsx`
- `src/app/n-queen/cell.jsx`, `cells.jsx`
- `src/app/prime-numbers/cell.jsx`, `cells.jsx`, `spiral.jsx`
- `src/app/convex-hull/canvas.jsx`, `timer.jsx`
- `src/app/turing-machine/table.jsx`
- `src/app/recursion-tree/canvasSVG.jsx`, `vertex.jsx`, `vertexOriginal.jsx`, `edge.jsx`, `details.jsx`
- `src/app/recursive-sorting/rect.jsx`
- `src/app/binary-search/entryPoint.jsx`, `guess.jsx`, `result.jsx`, `search.jsx`
- `src/app/sorting/rects.jsx`

### How to convert

```jsx
// BEFORE — class component
class Queen extends Component {
    state = { board: [], number: 4, speed: 490, isRunning: false }

    handleQueenChange = (number) => {
        this.setState({ number });
        const board = getBoard(this.state.number); // BUG: reads stale state
        this.setState({ board });
    }

    startAlgo = async () => {
        this.setState({ isRunning: true });
        // animation loop reads this.state.speed
        await sleep(this.state.speed);
    }
}

// AFTER — functional component
function Queen() {
    const [board, setBoard] = useState([]);
    const [number, setNumber] = useState(4);
    const [speed, setSpeed] = useState(490);
    const [isRunning, setIsRunning] = useState(false);
    const speedRef = useRef(speed); // for reading inside async loops

    useEffect(() => { speedRef.current = speed; }, [speed]);

    const handleQueenChange = (num) => {
        setNumber(num);
        setBoard(getBoard(num)); // no stale state — uses the param directly
    }

    const startAlgo = async () => {
        setIsRunning(true);
        // use ref inside async loops so speed changes take effect mid-animation
        await sleep(speedRef.current);
    }
}
```

### Key patterns for async animations

- Use `useRef` for values read inside `async` loops (`speed`, `isRunning`) — state closures will be stale
- Game of Life (`src/app/game-of-life/page.jsx`) is already converted and serves as a reference
- Convert `componentDidMount` to `useEffect(() => { ... }, [])`
- Convert `componentDidUpdate` to `useEffect` with dependency arrays

### Recommended order

Convert menu components first (they're simpler — mostly render-only), then child components, then page components last since they have the most logic.

---

## 2. Standardize Disabled Prop Naming

**Priority:** High  
**Effort:** Small  
**Impact:** Removes confusion, prevents bugs from mismatched prop names

### Problem

Three different prop names are used for the same concept:
- `disable` — used in pathfinder, sorting, recursive-sorting, n-queen, recursion-tree, turing-machine
- `isDisabled` — used in convex-hull, prime-numbers
- `disabled` — standard HTML attribute name

The `CustomSlider` component even accepts **both** `disable` and `isDisabled` and reconciles them.

### Fix

Standardize everything to `disabled` (the HTML standard). Update:

**Shared components:**
- `src/components/custom-slider.jsx` — change `{ ..., disable, isDisabled }` to `{ ..., disabled }`

**Page → Menu prop passing (change `disable=` and `isDisabled=` to `disabled=`):**
- `src/app/pathfinder/page.jsx`
- `src/app/sorting/page.jsx`
- `src/app/recursive-sorting/page.jsx`
- `src/app/n-queen/page.jsx`
- `src/app/convex-hull/page.jsx`
- `src/app/prime-numbers/page.jsx`
- `src/app/recursion-tree/page.jsx`
- `src/app/turing-machine/page.jsx`

**Menu components (change `this.props.disable` / `this.props.isDisabled` to `this.props.disabled`):**
- All 8 menu files listed above

---

## 3. Remove Console Logs

**Priority:** High  
**Effort:** Small  
**Impact:** Clean production output

### 18 active `console.log` statements to remove

- `src/app/convex-hull/page.jsx:27`
- `src/app/convex-hull/cnvas2.jsx:16, 58, 60, 75`
- `src/app/prime-numbers/page.jsx:106`
- `src/app/sorting/page.jsx:112`
- `src/app/recursion-tree/canvasSVG.jsx:24`
- `src/app/game-of-life/page.jsx:55`
- `src/app/recursive-sorting/page.jsx:27`
- `src/app/recursion-tree/Tree.js:226, 241`
- `src/app/binary-search/entryPoint.jsx:42`
- `src/app/binary-search/custom-dual-slider.jsx:13`
- `src/lib/algorithms/15puzzle.js:92`

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

## 10. Add ESLint

**Priority:** High  
**Effort:** Small  
**Impact:** Catches bugs automatically, enforces consistency, runs during `next build`

### Current state

The `package.json` has a stale `eslintConfig` block from Create React App, but ESLint is not installed. The `next build` output even warns: *"ESLint must be installed in order to run during builds"*.

### Setup

```bash
npm install -D eslint eslint-config-next
```

Then replace the CRA `eslintConfig` block in `package.json` with an `.eslintrc.json`:

```json
{
  "extends": "next/core-web-vitals",
  "rules": {
    "no-console": "warn",
    "no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
    "react/no-unescaped-entities": "off"
  }
}
```

Also add a lint script to `package.json`:

```json
"scripts": {
  "lint": "next lint"
}
```

### What this catches

- `no-console` — flags the 18 console.log statements as warnings
- `no-unused-vars` — catches dead variables (several exist, e.g. destructured `row, col` in pathfinder node.jsx)
- `next/core-web-vitals` includes:
  - `react-hooks/rules-of-hooks` — prevents hook misuse
  - `react-hooks/exhaustive-deps` — catches missing useEffect dependencies
  - `@next/next/no-img-element` — flags `<img>` tags that should use `next/image`
  - `@next/next/no-html-link-for-pages` — flags `<a>` tags that should use `next/link`

### Clean up the stale CRA config

Remove this block from `package.json`:

```json
"eslintConfig": {
  "extends": [
    "react-app",
    "react-app/jest"
  ]
}
```

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

- [ ] Install ESLint with `next/core-web-vitals` config
- [ ] Remove stale CRA `eslintConfig` from `package.json`
- [ ] Remove 18 `console.log` statements
- [ ] Standardize `disabled` prop naming
- [ ] Remove commented-out code blocks
- [ ] Fix hardcoded `/AlgorithmVisualizer/` image paths
- [ ] Remove unused dependencies (`react-router`, `react-router-dom`, `fontsource-roboto`)
- [ ] Add `alt="Queen"` to queen cell image
- [ ] Add Open Graph metadata to `layout.js`
