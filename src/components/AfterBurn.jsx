import './AfterBurn.css'

function AfterBurn({ onWriteAgain }) {
  return (
    <div className="afterburn">
      <button className="afterburn__button" onClick={onWriteAgain} type="button">
        Write again
      </button>
    </div>
  )
}

export default AfterBurn
