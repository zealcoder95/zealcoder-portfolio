/**
 * Content-layer domain types are intentionally expressed as JSDoc because the
 * application is JavaScript-only. These shapes are the stable boundary that a
 * future TypeScript migration or CMS adapter must preserve.
 *
 * @typedef {{ en?: string, tr?: string }} LocalizedText
 * @typedef {{ id: string, title: LocalizedText, status?: string, featured?: boolean, tags?: string[] }} ContentRecord
 * @typedef {{ id: string, platform: string, url: string, label?: string, handle?: string, visibility?: string, sortOrder?: number }} SocialLink
 */

export {};
