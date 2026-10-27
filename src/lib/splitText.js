/**
 * Splits a string into per-character span nodes.
 *
 * Returns `{ chars, container }` where `chars` is an ordered array of span
 * elements (reading order: left→right, top→bottom) and `container` is the
 * wrapper div. M1 does not call this; M2 invokes it at burn-time only so
 * typing stays fast during writing.
 */
export function splitText(text) {
  const container = document.createElement('div')
  container.style.whiteSpace = 'pre-wrap'
  container.style.wordBreak = 'break-word'

  const chars = []
  for (const char of text) {
    const span = document.createElement('span')
    span.textContent = char
    container.appendChild(span)
    chars.push(span)
  }

  return { chars, container }
}
