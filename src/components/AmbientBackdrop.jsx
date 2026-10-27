import './AmbientBackdrop.css'

/* Ambient living smoke + delicate ascending cinders (decorative only). */
function AmbientBackdrop() {
  return (
    <div className="backdrop" aria-hidden="true">
      <div className="backdrop__blob backdrop__blob--a" />
      <div className="backdrop__blob backdrop__blob--b" />
      <div className="backdrop__floor" />

      <svg className="backdrop__cinders" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="emberGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffb95f" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#f97316" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#151312" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="20%" cy="80%" r="2" fill="url(#emberGlow)">
          <animate
            attributeName="cy"
            dur="9s"
            repeatCount="indefinite"
            values="85%;15%"
          />
          <animate
            attributeName="opacity"
            dur="9s"
            repeatCount="indefinite"
            values="0;0.9;0"
          />
          <animate
            attributeName="cx"
            dur="9s"
            repeatCount="indefinite"
            values="20%;22%;19%;20%"
          />
        </circle>
        <circle cx="82%" cy="75%" r="2.5" fill="url(#emberGlow)">
          <animate
            attributeName="cy"
            dur="11s"
            repeatCount="indefinite"
            values="80%;10%"
          />
          <animate
            attributeName="opacity"
            dur="11s"
            repeatCount="indefinite"
            values="0;0.8;0"
          />
          <animate
            attributeName="cx"
            dur="11s"
            repeatCount="indefinite"
            values="82%;79%;83%;81%"
          />
        </circle>
        <circle cx="53%" cy="92%" r="1.8" fill="url(#emberGlow)">
          <animate
            attributeName="cy"
            dur="7.5s"
            repeatCount="indefinite"
            values="95%;20%"
          />
          <animate
            attributeName="opacity"
            dur="7.5s"
            repeatCount="indefinite"
            values="0;1;0"
          />
          <animate
            attributeName="cx"
            dur="7.5s"
            repeatCount="indefinite"
            values="53%;55%;51%;53%"
          />
        </circle>
      </svg>
    </div>
  )
}

export default AmbientBackdrop
