# Landing Page Polish Specification

## Problem Statement

The landing page was initially implemented with remote Unsplash assets, inline SVG icons (inlined in templates), a text-based logo, and dynamic team data from the booking API. For production readiness, assets must be local (faster loading, no external deps), icons should use a dedicated icon library (maintainable), the logo needs proper SVG branding, and the team section should reflect actual studio members with bios.

## Goals

- [ ] Replace all remote Unsplash URLs with local static images/video
- [ ] Replace inline SVG icons with `nuxt-icon` (lucide + mdi sets)
- [ ] Replace text logo with SVG image logo
- [ ] Update team section with static member data (CEO, CTO, Nail Designer)
- [ ] Simplify CSS reset with `:where()` selectors
- [ ] Add favicon support
- [ ] Expose dev server on network via `--host`

## Out of Scope

| Feature | Reason |
| ------- | ------ |
| Dynamic team from API | Team is static (studio staff, not professionals list) |
| Product/e-commerce section | Not in landing page scope |

---

## Requirement Traceability

| ID | Description | Status |
| -- | ----------- | ------ |
| LP-01 | Install nuxt-icon module and register in nuxt.config | Verified |
| LP-02 | Replace inline SVG icons with Icon component in all landing components | Verified |
| LP-03 | Add favicon links and asset files | Verified |
| LP-04 | Replace remote Unsplash images with local static images | Verified |
| LP-05 | Replace hero background image with local video | Verified |
| LP-06 | Replace text logo with SVG image in navbar and footer | Verified |
| LP-07 | Update team section with static Studio Blessed members | Verified |
| LP-08 | Simplify CSS reset using :where() selectors in landing layout | Verified |
| LP-09 | Enable --host flag for network-accessible dev server | Verified |
