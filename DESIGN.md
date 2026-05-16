# HackMe Lab — Design System

> **Live preview:** Run `npm run dev` and visit `http://localhost:5173/style-guide`

---

## Table of Contents

1. [Design Tokens](#design-tokens)
2. [Typography](#typography)
3. [Spacing](#spacing)
4. [Colors](#colors)
5. [Border Radius](#border-radius)
6. [Shadows & Glows](#shadows--glows)
7. [Transitions](#transitions)
8. [Components](#components)
   - [Button](#button)
   - [Card](#card)
   - [Badge](#badge)
   - [Modal](#modal)
   - [Flag](#flag)
   - [ProgressBar](#progressbar)
   - [Terminal](#terminal)
9. [Layout](#layout)
10. [Conventions](#conventions)
11. [Future Additions](#future-additions)

---

## Design Tokens

All tokens are CSS custom properties defined in `src/index.css` under `:root`.
Change a value there and it propagates everywhere automatically.

---

## Typography

| Token | Value | Usage |
|---|---|---|
| `--font-primary` | Inter, system-ui, sans-serif | All body and UI text |
| `--font-mono` | JetBrains Mono, Fira Code, Consolas | Code, flags, terminal output |

### Font Sizes

| Token | Value | Usage |
|---|---|---|
| `--text-xs` | 0.75rem | Labels, fine print |
| `--text-sm` | 0.875rem | Secondary text, badges |
| `--text-base` | 1rem | Body text |
| `--text-lg` | 1.125rem | Subtitles, emphasis |
| `--text-xl` | 1.25rem | Section headings |
| `--text-2xl` | 1.5rem | H3 |
| `--text-3xl` | 2rem | H2 |
| `--text-4xl` | 2.5rem | H1 / hero headings |

---

## Spacing

Scale follows a consistent step system. Prefer these tokens over raw pixel values.

| Token | Value |
|---|---|
| `--space-1` | 0.25rem (4px) |
| `--space-2` | 0.5rem (8px) |
| `--space-3` | 0.75rem (12px) |
| `--space-4` | 1rem (16px) |
| `--space-5` | 1.25rem (20px) |
| `--space-6` | 1.5rem (24px) |
| `--space-8` | 2rem (32px) |
| `--space-10` | 2.5rem (40px) |
| `--space-12` | 3rem (48px) |
| `--space-16` | 4rem (64px) |

---

## Colors

### Backgrounds

| Token | Value | Usage |
|---|---|---|
| `--color-bg-primary` | `#0a0e17` | Page/app background |
| `--color-bg-secondary` | `#131a2b` | Panels, sidebars, modals |
| `--color-bg-card` | `#1a2235` | Cards, input fields |
| `--color-bg-elevated` | `#222d42` | Dropdowns, tooltips, badges |

### Accents

| Token | Value | Usage |
|---|---|---|
| `--color-accent-primary` | `#00ff88` | Primary CTAs, success, flags |
| `--color-accent-secondary` | `#00d4ff` | Secondary CTAs, links, info |
| `--color-accent-warning` | `#ff9f43` | Warnings, medium difficulty |
| `--color-accent-danger` | `#ff3366` | Errors, danger, hard difficulty |
| `--color-accent-purple` | `#a855f7` | Special / unlocked items |

### Text

| Token | Value | Usage |
|---|---|---|
| `--color-text-primary` | `#e4e8f1` | Main content |
| `--color-text-secondary` | `#8892a8` | Captions, descriptions |
| `--color-text-muted` | `#5a6478` | Placeholder, disabled |
| `--color-text-code` | `#00ff88` | Inline code |

### Borders

| Token | Value | Usage |
|---|---|---|
| `--color-border` | `#2a3548` | Default borders |
| `--color-border-light` | `#3a4558` | Hover borders |

---

## Border Radius

| Token | Value | Usage |
|---|---|---|
| `--radius-sm` | 4px | Tiny chips, tags |
| `--radius-md` | 8px | Buttons, inputs, code |
| `--radius-lg` | 12px | Cards, panels |
| `--radius-xl` | 16px | Large panels |
| `--radius-full` | 9999px | Badges, pills, avatar |

---

## Shadows & Glows

| Token | Usage |
|---|---|
| `--shadow-sm` | Subtle lift |
| `--shadow-md` | Cards at rest |
| `--shadow-lg` | Cards on hover |
| `--shadow-glow` | Green accent glow (primary) |
| `--shadow-glow-blue` | Blue accent glow (secondary) |

---

## Transitions

| Token | Value | Usage |
|---|---|---|
| `--transition-fast` | 150ms ease | Hover color changes |
| `--transition-normal` | 250ms ease | Card lifts, slides |
| `--transition-slow` | 350ms ease | Page-level animations |

---

## Components

All components live in `src/components/ui/`. Import them by name.

---

### Button

**File:** `src/components/ui/Button.jsx`

```jsx
import Button from '../components/ui/Button'

<Button variant="primary" size="md" onClick={handleClick}>
  Submit
</Button>
```

| Prop | Type | Default | Options |
|---|---|---|---|
| `variant` | string | `'primary'` | `primary` · `secondary` · `ghost` · `danger` · `warning` |
| `size` | string | `'md'` | `sm` · `md` · `lg` |
| `disabled` | boolean | `false` | — |
| `type` | string | `'button'` | `button` · `submit` · `reset` |
| `onClick` | function | — | — |
| `className` | string | `''` | Extra CSS classes |

**Variants:**
- `primary` — Green gradient, used for the main action on a page
- `secondary` — Blue outline, used for secondary actions
- `ghost` — Transparent, used for tertiary/nav actions
- `danger` — Red gradient, used for destructive actions
- `warning` — Orange gradient, used for cautionary actions

---

### Card

**File:** `src/components/ui/Card.jsx`

```jsx
import Card, { CardHeader, CardBody, CardFooter } from '../components/ui/Card'

<Card variant="default">
  <CardHeader>Title</CardHeader>
  <CardBody>Content</CardBody>
  <CardFooter>Footer</CardFooter>
</Card>
```

| Prop | Type | Default | Options |
|---|---|---|---|
| `variant` | string | `'default'` | `default` · `interactive` · `success` · `danger` |
| `className` | string | `''` | — |
| `onClick` | function | — | — |

---

### Badge

**File:** `src/components/ui/Badge.jsx`

```jsx
import Badge from '../components/ui/Badge'

<Badge variant="success" size="md">Completed</Badge>
```

| Prop | Type | Default | Options |
|---|---|---|---|
| `variant` | string | `'default'` | `default` · `primary` · `secondary` · `warning` · `danger` · `success` · `beginner` · `intermediate` · `advanced` · `hard` |
| `size` | string | `'md'` | `sm` · `md` · `lg` |

---

### Modal

**File:** `src/components/ui/Modal.jsx`

```jsx
import Modal from '../components/ui/Modal'

<Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="My Modal">
  <p>Modal content here.</p>
</Modal>
```

| Prop | Type | Required | Description |
|---|---|---|---|
| `isOpen` | boolean | ✅ | Controls visibility |
| `onClose` | function | ✅ | Called on overlay click or Escape key |
| `title` | string | ✅ | Header title text |
| `children` | ReactNode | ✅ | Body content |

---

### Flag

**File:** `src/components/ui/Flag.jsx`

```jsx
import Flag from '../components/ui/Flag'

<Flag flag="FLAG{example_flag_here}" title="Challenge Complete!" />
```

| Prop | Type | Default | Description |
|---|---|---|---|
| `flag` | string | — | The flag string to display |
| `title` | string | `'Challenge Complete!'` | Header text |

---

### ProgressBar

**File:** `src/components/ui/ProgressBar.jsx`

```jsx
import ProgressBar from '../components/ui/ProgressBar'

<ProgressBar completed={5} total={20} />
```

| Prop | Type | Description |
|---|---|---|
| `completed` | number | Number of completed items |
| `total` | number | Total number of items |

---

### Terminal

**File:** `src/components/ui/Terminal.jsx`

```jsx
import Terminal from '../components/ui/Terminal'

<Terminal title="bash">
  $ echo "Hello, world!"
</Terminal>
```

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | string | `'Terminal'` | Window title bar text |
| `className` | string | `''` | Extra CSS classes |
| `children` | ReactNode | — | Terminal output content |

---

## Layout

| Token | Value | Usage |
|---|---|---|
| `--max-width` | 1200px | `.container` max width |
| `--header-height` | 70px | Fixed header height |

Use the `.container` class to center content with padding:

```jsx
<div className="container">
  {/* content */}
</div>
```

---

## Conventions

- **Always use tokens** — never hardcode colors, spacing, or font sizes
- **Variants via props** — style differences go in CSS, not inline styles or conditional JSX
- **CSS classes follow BEM-lite** — `.component`, `.component-part`, `.component-variant`
- **Imports** — each component imports its own CSS file (e.g. `import './Button.css'`)
- **`className` prop** — all components accept a `className` prop for one-off overrides

---

## Future Additions

- [ ] `Input` component — text input with consistent focus styles and validation states
- [ ] `Select` component — styled dropdown
- [ ] `Tooltip` component — hover hint
- [ ] `Toast` / `Notification` component — transient feedback messages
- [ ] `Skeleton` component — loading placeholder
- [ ] `Tabs` component — tabbed navigation panel
- [ ] `Divider` component — horizontal/vertical separator
- [ ] `Avatar` component — user avatar with fallback initials
- [ ] Dark/light theme toggle (extend `:root` variables per theme)
- [ ] Responsive breakpoint tokens (`--breakpoint-sm`, `--breakpoint-md`, etc.)
