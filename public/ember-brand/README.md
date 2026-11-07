# Ember logo & icons

## Files
| File | Use |
|---|---|
| `ember-mark.svg` | The shards mark (transparent) — use in the sign-in hero, nav, etc. |
| `ember-mark-1024.png` | Same mark as a large PNG (social, docs) |
| `favicon.svg` | Browser tab icon (simplified, no floating shards) |
| `favicon.ico` | Fallback favicon (16/32/48) |
| `favicon-32.png` | PNG favicon |
| `apple-touch-icon.png` | iOS home screen (180×180) |
| `icon-192.png`, `icon-512.png` | PWA / Android icons |
| `icon-maskable-512.png` | Android adaptive icon (mark kept inside the safe zone) |
| `ember-app-icon.svg` | Source for the app icon tile |
| `site.webmanifest` | Web app manifest referencing the icons |

Put everything in your `public/` folder.

## `<head>` tags
```html
<link rel="icon" href="/favicon.ico" sizes="48x48">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<meta name="theme-color" content="#17110f">
```

TanStack Start (`__root.tsx`):
```tsx
head: () => ({
  links: [
    { rel: 'icon', href: '/favicon.ico', sizes: '48x48' },
    { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
    { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
    { rel: 'manifest', href: '/site.webmanifest' },
  ],
  meta: [{ name: 'theme-color', content: '#17110f' }],
}),
```

## Sign-in hero (F3 lockup)
Replace the existing "Ember" heading with:
```tsx
<div className="flex items-center gap-4">
  <img src="/ember-mark.svg" alt="" aria-hidden="true" className="h-32 w-32 shrink-0" />
  <h1 className="font-serif text-[120px] leading-none text-[#f4e9df]">Ember</h1>
</div>
<p className="mt-2 text-[#e6d6ca]">The content manager for artists.</p>
```
Keep your existing serif font on the `h1`. The mark should be roughly the height of the wordmark's capital E plus a little (≈ 1.05× the font size works well); scale both together on smaller screens, e.g. `h-20 w-20` with `text-7xl`.
