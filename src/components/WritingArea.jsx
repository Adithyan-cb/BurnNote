import './WritingArea.css'

function WritingArea({ text, onChange }) {
  return (
    <div className="writing-area">
      <textarea
        className="writing-area__textarea"
        value={text}
        onChange={(e) => onChange(e.target.value)}
        placeholder="What do you want to let go of?"
        aria-label="Write what you want to let go of"
        autoFocus
        spellCheck={false}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
      />
    </div>
  )
}

export default WritingArea
