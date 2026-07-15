# ZealCoder Layout System

## Intent

The layout system gives public pages a shared structural vocabulary without
forcing a uniform visual design. It is deliberately CSS-only: no runtime
components, context, dependencies, or client-side overhead are introduced.

## Primitive reference

| Primitive | Purpose |
| --- | --- |
| `.zc-page` | Full-height public-page surface |
| `.zc-page--nav-offset` | Standard top offset below the fixed navigation |
| `.zc-container` / `.zc-container--wide` | 75rem page-width content |
| `.zc-container--content` | 64rem focused content width |
| `.zc-container--reading` | 48rem comfortable reading width |
| `.zc-section` | Standard horizontal gutter and vertical rhythm |
| `.zc-section--compact` / `--spacious` | Deliberate section-density variants |
| `.zc-section__inner` | Standard inner page width |
| `.zc-section__header` / `__description` | Optional section-heading structure |
| `.zc-stack` | Vertical grouping |
| `.zc-cluster` | Wrapping inline actions or metadata |
| `.zc-flow` | Natural vertical document flow |
| `.zc-grid` | Responsive grid base |
| `.zc-grid--2`, `--3`, `--4`, `--auto-fit` | Standard grid compositions |
| `.zc-split` | One-column-to-two-column layout |

## Audit baseline

The public application repeatedly used `mx-auto max-w-7xl` for wide content,
`max-w-5xl` for detailed content, `max-w-3xl` and `max-w-4xl` for reading
blocks, `px-6` for gutters, and `py-24`, `py-28`, or `pt-24` for vertical
spacing. Grid patterns repeat as one-column mobile layouts that become two,
three, or four columns at `md` and `lg` breakpoints.

The admin area intentionally keeps its existing layout classes. It has a
different operational purpose and is out of scope for the public layout
system release.

## Adoption rules

- Use a primitive when it communicates structure more clearly than a repeated
  Tailwind layout string.
- Preserve component-owned visual styling, interaction classes, and unusual
  project-specific grids.
- Prefer `.zc-section` for new public sections and pair it with
  `.zc-section__inner` when content needs the standard page width.
- Use `.zc-container--reading` for dense prose, not card grids.
- Use grid modifiers with `.zc-grid`; do not depend on modifier classes alone.
- Do not apply these public primitives to admin screens without a dedicated
  admin-layout decision.

## Migration strategy

This release migrates exact, repeated wide-container wrappers in public
components. Page-specific widths, hero geometry, content spacing, and complex
responsive grids remain unchanged. Future feature work should adopt the
primitive closest to the structural intent and remove equivalent utility
strings in the component it touches.
