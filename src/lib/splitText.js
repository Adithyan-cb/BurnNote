/**
 * Splits a string into per-line span nodes for bottom-to-top burn effect.
 */
export function splitText(text) {
  const container = document.createElement('div')
  container.style.whiteSpace = 'pre-wrap'
  container.style.wordBreak = 'break-word'

  const chars = []
  // Split by lines first
  const lines = text.split('\n')
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const lineSpan = document.createElement('span')
    lineSpan.style.display = 'block'
    for (let j = 0; j < line.length; j++) {
      const char = line[j]
      const span = document.createElement('span')
      span.textContent = char
      lineSpan.appendChild(span)
      chars.push(span)
    }
    if (i < lines.length - 1) {
      const br = document.createElement('br')
      lineSpan.appendChild(br)
    }
    container.appendChild(lineSpan)
  }

  return { chars, container }
}
