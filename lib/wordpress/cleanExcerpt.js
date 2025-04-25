import { decode } from 'html-entities'

/** Strip HTML tags and decode any entities to plain text */
export function cleanExcerpt(html) {
  // 1. remove tags
  const noTags = html.replace(/<[^>]+>/g, ' ')
  // 2. collapse whitespace
  const squashed = noTags.replace(/\s+/g, ' ').trim()
  // 3. decode &amp;, &quot;, etc
  return decode(squashed)
}
