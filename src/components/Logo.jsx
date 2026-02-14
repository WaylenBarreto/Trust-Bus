const Logo = ({ className = "w-40 h-12", color = "#22c55e" }) => {
  return (
    <svg
      viewBox="0 0 200 60"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Bus */}
      <rect x="10" y="20" width="50" height="30" rx="3" fill={color} />
      <rect x="15" y="25" width="8" height="8" rx="1" fill="#d1fae5" />
      <rect x="26" y="25" width="8" height="8" rx="1" fill="#d1fae5" />
      <rect x="37" y="25" width="8" height="8" rx="1" fill="#d1fae5" />
      <rect x="48" y="25" width="8" height="8" rx="1" fill="#d1fae5" />
      <circle cx="20" cy="52" r="5" fill="#16a34a" />
      <circle cx="50" cy="52" r="5" fill="#16a34a" />
      <rect x="58" y="25" width="6" height="20" rx="1" fill="#16a34a" />

      {/* Network Waves */}
      <path d="M70 35 Q80 30 90 35 Q100 40 110 35" stroke="#10B981" strokeWidth="2" fill="none"/>
      <path d="M70 35 Q85 25 100 35 Q115 45 130 35" stroke="#10B981" strokeWidth="2" fill="none" opacity="0.7"/>

      {/* Nodes */}
      <circle cx="110" cy="35" r="4" fill="#10B981" />
      <circle cx="130" cy="35" r="4" fill="#10B981" />
      <circle cx="150" cy="35" r="4" fill="#10B981" />

      {/* Text */}
      <text x="10" y="12" fontSize="14" fontWeight="bold" fill={color}>
        TrustBus
      </text>
    </svg>
  )
}

export default Logo
