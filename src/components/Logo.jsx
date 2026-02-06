const Logo = ({ className = "w-40 h-12" }) => {
  return (
    <svg
      viewBox="0 0 200 60"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Bus Icon */}
      <g id="bus">
        {/* Bus Body */}
        <rect x="10" y="20" width="50" height="30" rx="3" fill="#22c55e" />
        {/* Bus Windows */}
        <rect x="15" y="25" width="8" height="8" rx="1" fill="#d1fae5" />
        <rect x="26" y="25" width="8" height="8" rx="1" fill="#d1fae5" />
        <rect x="37" y="25" width="8" height="8" rx="1" fill="#d1fae5" />
        <rect x="48" y="25" width="8" height="8" rx="1" fill="#d1fae5" />
        {/* Bus Wheels */}
        <circle cx="20" cy="52" r="5" fill="#16a34a" />
        <circle cx="20" cy="52" r="3" fill="#22c55e" />
        <circle cx="50" cy="52" r="5" fill="#16a34a" />
        <circle cx="50" cy="52" r="3" fill="#22c55e" />
        {/* Bus Door */}
        <rect x="58" y="25" width="6" height="20" rx="1" fill="#16a34a" />
        <line x1="61" y1="25" x2="61" y2="45" stroke="#d1fae5" strokeWidth="1" />
      </g>

      {/* Connectivity/Network Elements */}
      <g id="connectivity">
        {/* Signal waves from bus */}
        <path
          d="M 70 35 Q 80 30, 90 35 Q 100 40, 110 35"
          stroke="#10B981"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M 70 35 Q 85 25, 100 35 Q 115 45, 130 35"
          stroke="#10B981"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          opacity="0.7"
        />
        
        {/* Network nodes */}
        <circle cx="110" cy="35" r="4" fill="#10B981" />
        <circle cx="130" cy="35" r="4" fill="#10B981" />
        <circle cx="150" cy="35" r="4" fill="#10B981" />
        
        {/* Connection lines between nodes */}
        <line x1="114" y1="35" x2="126" y2="35" stroke="#10B981" strokeWidth="2" />
        <line x1="134" y1="35" x2="146" y2="35" stroke="#10B981" strokeWidth="2" />
        
        {/* Small connection dots */}
        <circle cx="120" cy="35" r="1.5" fill="#10B981" />
        <circle cx="140" cy="35" r="1.5" fill="#10B981" />
        
        {/* Additional signal lines */}
        <path
          d="M 70 35 Q 75 20, 80 35"
          stroke="#10B981"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          opacity="0.5"
        />
      </g>

      {/* Text "Trust Bus" */}
      <text
        x="10"
        y="12"
        fontSize="14"
        fontWeight="bold"
        fill="#22c55e"
        fontFamily="Arial, sans-serif"
      >
        Trust Bus
      </text>
    </svg>
  )
}

export default Logo

