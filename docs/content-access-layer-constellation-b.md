# Release Constellation-B — Content Access Layer

## Scope and result

Constellation-B introduces `src/content` as the content boundary. Public pages and shared UI components no longer import `src/data`, GitHub project functions, or update aggregation directly. Existing data files and integrations remain in place as implementation details of repository adapters, so visual output, routes, localization behavior, SEO, Supabase schema, and admin workflows are preserved.

This repository currently uses JavaScript and has no TypeScript compiler dependency. Contracts are therefore JSDoc plus runtime-safe normalization in `src/content/types` and `src/content/contracts`. The API is intentionally TypeScript-ready; a future repository-wide TypeScript adoption can rename these files and preserve their exported shapes without changing UI imports. Introducing an isolated `index.ts` now would require a TypeScript toolchain change and create a mixed-resolution entry point, so it is deliberately deferred.

## Folder responsibilities

| Folder | Responsibility | Allowed dependencies |
| --- | --- | --- |
| `src/content/projects`, `articles`, `resources`, `learning`, `timeline`, `certificates`, `aiLab`, `settings`, `homepage`, `activity` | Stable, domain-specific query API and safe defaults | Contracts and repositories only |
| `src/content/repositories` | Current-source adapters: static records, GitHub, activity aggregation | `src/data` and `src/lib` integration code only |
| `src/content/contracts` | Runtime guards and shared retrieval helpers | No components, routes, or provider SDKs |
| `src/content/types` | JSDoc domain contracts | No runtime content source |
| `src/content/index.js` | Server/public API barrel for named queries | Domain modules only |

`src/content/homepage` is an internal composition layer. It explicitly resolves featured project, resources, experiments, and articles without exposing selection rules to the homepage component.

## Import rules

1. Components, pages, and contexts import content only from `@/content` or a domain entry such as `@/content/resources`.
2. Only `src/content/repositories` may import `src/data`, `src/lib/github`, or `src/lib/updates` for public content reads.
3. Only Supabase/auth infrastructure and existing admin/auth route code may import Supabase clients. These are authorization and admin mutation concerns, not public content reads; they remain unchanged in this release.
4. UI code must not use an array index to select content. `getFeaturedProject()` resolves a named repository configuration instead.
5. A future CMS SDK belongs in a repository adapter, never in a component, route component, or context.

## Stable API surface

| Query | Current backing repository | Safe fallback |
| --- | --- | --- |
| `getFeaturedProject()` / `getCaseStudies()` | Static project repository | `null` / `[]` |
| `getProjects()` / `getProjectBySlug(slug)` | GitHub adapter, with curated case studies first for detail | `[]` / `null` |
| `getArticles()` / `getLatestArticle(s)` | Placeholder article repository | `[]` / `null` |
| `getResources()` / `getFeaturedResources()` | Static resource repository | `[]` |
| `getLearning()` / `getCurrentLearning()` | Static learning repository | `[]` |
| `getTimeline()` / `getTimelinePreview()` | Static timeline repository | `[]` |
| `getCertificates()` | Static certificate repository | `[]` |
| `getAiLabExperiments()` / `getFeaturedExperiments()` | Static experiment repository | `[]` |
| `getSocialLinks()` / `getNavigation()` / `getUiCopy()` | Static settings repository | `[]` / English fallback |
| `getHomepageContent()` | Homepage composition query | Empty view model collections and `null` record |
| `getActivityFeed()` | Activity adapter around existing GitHub/Medium/manual update flow | `[]` |

## Repository replacement strategy

Today, `staticContentRepository` maps existing repository data into stable domain queries. `githubProjectsRepository` and `activityRepository` safely wrap the existing external integration functions. A future CMS implementation replaces only the relevant repository implementation:

```text
UI → content domain query → repository interface → static adapter (today)
                                           └────→ CMS adapter (future)
```

No React component changes when the source changes. The CMS adapter must return the same normalized shapes, honor publish status/localization, and provide `null`/empty safe defaults on unavailable content.

## Validation and error policy

- `isContentRecord`, `asCollection`, and `findById` prevent malformed static/CMS collections from causing render-time exceptions.
- External repository and activity adapters catch failures and return safe empty values while retaining existing integration behavior.
- Page-level `notFound()` remains responsible for an unavailable project detail route; the content layer returns `null`, never throws for normal absence.
- Contract expansion belongs in `src/content/types` and `src/content/contracts` first, then repository mapping, then a domain query. UI types are derived from the query result rather than raw provider data.

## Performance and revalidation preparation

The access layer centralizes future caching. Existing GitHub/Medium 30-minute caching remains untouched. The next caching release should add tagged caching around domain queries—not in components—with collection tags such as `projects`, `resources`, `homepage`, and per-record tags such as `project:<slug>`. CMS publishing can then invalidate tags without route/component changes.

Avoid duplicate fetching by composing homepage content through `getHomepageContent()` and by sharing a request-scoped query result when server pages need the same entity more than once.

## Extension and migration plan

1. Add complete normalized contracts for each Orion entity, including publication status and localized fields.
2. Convert static repository mappings from pass-through records to validated canonical records.
3. Move remaining component-local editorial copy into settings/homepage queries without changing presentation.
4. Introduce tagged cache wrappers at the domain-query layer.
5. Add a CMS adapter per entity, compare preview output, then cut over one canonical source at a time.
6. Add authoring/publish webhooks that invalidate content tags only after successful publication.

## Post-implementation review

1. **Still tightly coupled:** `PortfolioHub.jsx` still contains section copy/CTA copy, `Hero.jsx` still contains its localized narrative, and legacy presentational components such as `About.jsx`, `CurrentFocus.jsx`, `RecruiterPanel.jsx`, `HomePreview.jsx`, and `UpdatesSection.jsx` still own editorial literals. They no longer bypass static imports for the migrated domains, but should move to settings/homepage view models in Constellation-C/D.
2. **Technical debt:** Static data has not yet been normalized to the Orion contracts; `skills.js` remains a legacy skills representation; articles are an intentionally empty canonical collection; and admin/auth remains Supabase-specific by design. The existing two Next config files also warrant a separate maintenance audit.
3. **Now easier:** CMS adoption, status/featured ordering, homepage curation, replacing GitHub project projection, content validation, localized view models, and tag-based revalidation can all proceed without changing migrated component imports.
4. **Do not reverse:** Keep components provider-agnostic; keep external platforms as evidence/feed sources rather than curated-content owners; keep all source-specific imports inside repositories; keep explicit feature selection rather than array position; and keep a single canonical writer per content type.
