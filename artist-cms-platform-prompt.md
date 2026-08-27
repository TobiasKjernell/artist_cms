# Project: Artist CMS Platform (dark-themed)

Build a dark-themed, stylized CMS web app for artists, integrating with the existing backend at `weis_backend` (parent folder → `backend/`).

API reference docs: https://artistplatformdocs.polarbearsandboxproduction.com/docs

## Tech Stack

- React + TypeScript
- TanStack Query (data fetching/caching)
- Zod (schema validation, especially for API responses/forms)
- Zustand (client state management)

## Core Features

### 1. Dark theme / styling
- Cohesive dark UI design system (color palette, typography, spacing) — go for something visually distinctive, not a generic dark-mode toggle.

### 2. Artist settings
- Artists can view and edit their own settings.
- Settings are driven by the backend schema — fetch available fields/options from the API rather than hardcoding them, so the form adapts to whatever the backend exposes.
- Validate all input with Zod before submission.

### 3. Admin view
- Accessible only to authenticated admin users.
- List all artists (searchable/sortable if the API supports it).
- Add new artist (form → API call).
- Consider basic states: loading, empty, error.

### 4. Intro animation
- Full-screen intro/splash animation shown when a user first enters the site.
- Pick an appropriate animation library (e.g., Framer Motion, GSAP, or Lottie) — use your judgment based on complexity vs. bundle size.
- Should feel premium/on-brand with the dark aesthetic, not gratuitous.

## Integration Requirements

- Before building forms/UI, inspect the actual backend code in `backend/` to confirm real endpoints, auth flow, and data shapes — don't rely solely on the hosted docs, since they may drift from the actual implementation.
- Use TanStack Query for all server state (artists list, settings, admin actions), with proper cache invalidation on mutations (e.g., after adding an artist or updating settings).
- Use Zustand only for client-only state (UI state, auth session if not handled by query cache, animation/intro-seen flag, etc.) — don't duplicate server state into Zustand.
- Use Zod schemas to validate/parse API responses at the boundary, and infer TypeScript types from those schemas where possible.


