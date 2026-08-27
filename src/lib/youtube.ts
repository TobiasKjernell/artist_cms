const ID_PATTERN = /^[a-zA-Z0-9_-]{11}$/

/** `video` is stored as a bare YouTube embed ID (e.g. "dQw4w9WgXcQ"). */
export function toYoutubeEmbedUrl(value: string): string | null {
  const trimmed = value.trim()
  return ID_PATTERN.test(trimmed) ? `https://www.youtube.com/embed/${trimmed}` : null
}
