# Hero Experience — v3.3 Audit and Migration Notes

## Audit findings

The previous hero communicated ambition but not the product journey quickly
enough. Its animated logo, rotating rings, and achievement-style statistics
competed with the primary message. The headline did not identify Gizem, the
supporting copy did not foreground the Electrical Engineering-to-AI journey,
and external professional destinations were only available later on the page.

## Information hierarchy

1. Identity: Gizem Gülcü and the platform purpose.
2. Direction: a genuine path from Electrical Engineering to AI Engineering.
3. Evidence: current learning, current building, latest project, and article
   destinations.
4. Action: Projects first, Learning Journey second, then professional profiles.
5. Continuation: a focused link to Featured Projects.

## Implementation decisions

- Replaced decorative animation and generic statistics with four factual
  progress cards.
- Kept all copy bilingual at the component boundary and reused existing primary
  navigation routes.
- Used static markup and CSS-only hover feedback; no client state, images, or
  new dependency was introduced.
- Added the Featured Projects anchor so the hero has a clear continuation path.

## Deferred work

The current-focus cards intentionally use stable, honest destinations rather
than claiming dynamic article or project freshness. A later content-data sprint
can feed verified latest items into this presentation without changing its
layout or interaction model.
