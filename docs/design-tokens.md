# ZealCoder Design Tokens

## Purpose

`src/styles/tokens.css` is the platform's semantic visual contract. It exists
to keep future components consistent without coupling them to a particular
page, feature, or Tailwind colour utility.

## Token categories

| Category | Prefix | Use |
| --- | --- | --- |
| Colour | `--zc-color-*` | Semantic backgrounds, surfaces, text, feedback, borders, focus |
| Typography | `--zc-font-*`, `--zc-line-height-*` | Shared type families, scale, and rhythm |
| Spacing | `--zc-space-*` | Layout and component spacing on a four-pixel rhythm |
| Shape | `--zc-radius-*` | Predictable component geometry |
| Elevation | `--zc-shadow-*`, `--zc-blur-*` | Subtle separation only |
| Layout | `--zc-container-*` | Page, content, reading widths, and gutters |
| Motion | `--zc-duration-*`, `--zc-ease-*` | Consistent feedback without decorative motion |
| Layering | `--zc-z-*` | Navigation, overlays, assistant, and loading layers |
| Breakpoints | `--zc-breakpoint-*` | Documented Tailwind breakpoint reference values |

## Audit baseline

The v3.2A audit found styling across `src/app/globals.css`,
`src/styles/overrides.css`, and Tailwind class strings in public and admin
components. The existing implementation uses Slate, Cyan, Purple, Emerald,
Amber, Red, Blue, Orange, Pink, Yellow, Green, and Black utility families;
the semantic token system establishes the approved platform-level palette
without changing current component output.

Recurring layout values are Tailwind's spacing scale, with arbitrary card
radii of 28px, 30px, 32px, 34px, and 36px. Existing responsive variants use
`sm`, `md`, `lg`, `xl`, and `2xl`. Existing layers include navigation (50),
the assistant (999), and loading state (9999). Existing animation and
transition durations range from 200ms to 700ms, plus named keyframe effects.

## Adoption rules

- Use semantic `--zc-color-*` values in new CSS; do not introduce
  component-specific colour variables.
- Use the documented container and spacing tokens for new CSS layouts.
- Keep Tailwind responsive variants for components; the breakpoint tokens are
  a shared reference, not a runtime breakpoint system.
- Prefer `--zc-duration-fast`, `--zc-duration-normal`, and
  `--zc-duration-slow` for new custom transitions.
- Preserve `prefers-reduced-motion` behaviour for all new motion.
- Migrate Tailwind class strings incrementally only when the replacement is
  clearer and has no visual or behavioural regression.

## Deliberately deferred migration

The many existing Tailwind colour, spacing, radius, shadow, and breakpoint
utilities remain in place for this foundation release. Replacing them all at
once would create a high-risk visual rewrite with little immediate user
benefit. Each future feature sprint should migrate the component it touches,
then remove superseded patterns once coverage is complete.
