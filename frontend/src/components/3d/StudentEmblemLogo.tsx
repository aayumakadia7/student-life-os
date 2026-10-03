import React from 'react'

interface StudentEmblemLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  animated?: boolean
  className?: string
  glowIntensity?: 'normal' | 'high' | 'ultra'
}

export const StudentEmblemLogo: React.FC<StudentEmblemLogoProps> = ({
  size = 'lg',
  animated = true,
  className = '',
  glowIntensity = 'high',
}) => {
  const sizeMap = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-36 h-36',
    xl: 'w-52 h-52',
    '2xl': 'w-64 h-64 sm:w-72 sm:h-72',
  }

  const glowShadowMap = {
    normal: 'drop-shadow-[0_0_20px_rgba(99,102,241,0.5)]',
    high: 'drop-shadow-[0_0_35px_rgba(129,140,248,0.7)] drop-shadow-[0_0_60px_rgba(168,85,247,0.4)]',
    ultra: 'drop-shadow-[0_0_45px_rgba(129,140,248,0.9)] drop-shadow-[0_0_80px_rgba(236,72,153,0.6)] drop-shadow-[0_0_100px_rgba(245,158,11,0.5)]',
  }

  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      {/* Dynamic 3D ambient aura rings */}
      {animated && (
        <>
          <div
            className={`absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-600/30 via-purple-600/25 to-pink-500/20 blur-2xl animate-pulse-glow ${sizeMap[size]}`}
          />
          <div
            className={`absolute rounded-full border border-indigo-500/30 border-dashed animate-spin-slow pointer-events-none ${
              size === '2xl' ? 'w-80 h-80 sm:w-96 sm:h-96' : size === 'xl' ? 'w-64 h-64' : 'w-44 h-44'
            }`}
          />
          <div
            className={`absolute rounded-full border border-cyan-400/20 border-dotted animate-spin-slow-reverse pointer-events-none ${
              size === '2xl' ? 'w-72 h-72 sm:w-88 sm:h-88' : size === 'xl' ? 'w-56 h-56' : 'w-40 h-40'
            }`}
          />
        </>
      )}

      {/* The Master Student SVG Emblem */}
      <svg
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${sizeMap[size]} relative z-10 transition-transform duration-700 ${glowShadowMap[glowIntensity]}`}
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="shieldGrad" x1="50" y1="30" x2="350" y2="370" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#4F46E5" />
            <stop offset="50%" stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>

          <linearGradient id="shieldFill" x1="200" y1="40" x2="200" y2="360" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1E1B4B" stopOpacity="0.85" />
            <stop offset="70%" stopColor="#0F172A" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#020617" stopOpacity="0.98" />
          </linearGradient>

          <linearGradient id="goldGrad" x1="100" y1="80" x2="300" y2="320" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="35%" stopColor="#F59E0B" />
            <stop offset="70%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#B45309" />
          </linearGradient>

          <linearGradient id="studentCenterGrad" x1="160" y1="120" x2="240" y2="280" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="25%" stopColor="#C7D2FE" />
            <stop offset="70%" stopColor="#818CF8" />
            <stop offset="100%" stopColor="#4F46E5" />
          </linearGradient>

          <linearGradient id="studentLeftGrad" x1="100" y1="150" x2="180" y2="280" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#67E8F9" />
            <stop offset="50%" stopColor="#06B6D4" />
            <stop offset="100%" stopColor="#0284C7" />
          </linearGradient>

          <linearGradient id="studentRightGrad" x1="220" y1="150" x2="300" y2="280" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#F472B6" />
            <stop offset="50%" stopColor="#EC4899" />
            <stop offset="100%" stopColor="#A855F7" />
          </linearGradient>

          <linearGradient id="bookGrad" x1="120" y1="270" x2="280" y2="330" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#F8FAFC" />
            <stop offset="50%" stopColor="#E2E8F0" />
            <stop offset="100%" stopColor="#94A3B8" />
          </linearGradient>

          {/* Neon Filters */}
          <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Circular Tech Ring & Dial Marks */}
        <circle
          cx="200"
          cy="200"
          r="185"
          stroke="url(#shieldGrad)"
          strokeWidth="3"
          strokeDasharray="8 6"
          opacity="0.8"
        />
        <circle
          cx="200"
          cy="200"
          r="174"
          stroke="#818CF8"
          strokeWidth="1.5"
          strokeDasharray="2 12"
          opacity="0.5"
        />

        {/* 4 Orbital Satellites / Nodes */}
        <circle cx="200" cy="15" r="4.5" fill="#38BDF8" filter="url(#neonGlow)" />
        <circle cx="385" cy="200" r="4.5" fill="#EC4899" filter="url(#neonGlow)" />
        <circle cx="200" cy="385" r="4.5" fill="#F59E0B" filter="url(#neonGlow)" />
        <circle cx="15" cy="200" r="4.5" fill="#818CF8" filter="url(#neonGlow)" />

        {/* Master Heraldic Academic Shield */}
        <path
          d="M200 45 C275 45 330 65 330 145 C330 250 250 320 200 355 C150 320 70 250 70 145 C70 65 125 45 200 45 Z"
          fill="url(#shieldFill)"
          stroke="url(#shieldGrad)"
          strokeWidth="4"
        />

        {/* Subtle Shield Inset Border */}
        <path
          d="M200 57 C265 57 315 75 315 147 C315 240 242 305 200 338 C158 305 85 240 85 147 C85 75 135 57 200 57 Z"
          fill="none"
          stroke="url(#goldGrad)"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          opacity="0.6"
        />

        {/* Academic Laurel Branches (Left & Right) */}
        {/* Left Laurel */}
        <g stroke="url(#goldGrad)" strokeWidth="2.5" fill="none" opacity="0.9">
          <path d="M105 240 C95 190 100 135 120 95" />
          <ellipse cx="100" cy="215" rx="7" ry="3.5" transform="rotate(-30 100 215)" fill="#F59E0B" fillOpacity="0.4" />
          <ellipse cx="96" cy="180" rx="7" ry="3.5" transform="rotate(-40 96 180)" fill="#F59E0B" fillOpacity="0.4" />
          <ellipse cx="102" cy="145" rx="7" ry="3.5" transform="rotate(-50 102 145)" fill="#F59E0B" fillOpacity="0.4" />
          <ellipse cx="114" cy="115" rx="6.5" ry="3.5" transform="rotate(-60 114 115)" fill="#F59E0B" fillOpacity="0.4" />
        </g>
        {/* Right Laurel */}
        <g stroke="url(#goldGrad)" strokeWidth="2.5" fill="none" opacity="0.9">
          <path d="M295 240 C305 190 300 135 280 95" />
          <ellipse cx="300" cy="215" rx="7" ry="3.5" transform="rotate(30 300 215)" fill="#F59E0B" fillOpacity="0.4" />
          <ellipse cx="304" cy="180" rx="7" ry="3.5" transform="rotate(40 304 180)" fill="#F59E0B" fillOpacity="0.4" />
          <ellipse cx="298" cy="145" rx="7" ry="3.5" transform="rotate(50 298 145)" fill="#F59E0B" fillOpacity="0.4" />
          <ellipse cx="286" cy="115" rx="6.5" ry="3.5" transform="rotate(60 286 115)" fill="#F59E0B" fillOpacity="0.4" />
        </g>

        {/* ============================================================== */}
        {/* THE STUDENT TRIAD (3 Students Standing United in Fellowship) */}
        {/* ============================================================== */}

        {/* 1. LEFT STUDENT (Tech / Science Scholar with holographic cyan glow) */}
        <g opacity="0.88">
          {/* Head */}
          <circle cx="145" cy="165" r="16" fill="url(#studentLeftGrad)" />
          {/* Body / Torso */}
          <path
            d="M120 235 C120 200 135 190 145 190 C155 190 162 196 168 205 L160 235 Z"
            fill="url(#studentLeftGrad)"
            opacity="0.8"
          />
          {/* Shoulder Highlight */}
          <path d="M125 220 Q145 195 160 205" stroke="#A5F3FC" strokeWidth="2" strokeLinecap="round" />
        </g>

        {/* 2. RIGHT STUDENT (Creative / Humanities Scholar with pink-violet aura) */}
        <g opacity="0.88">
          {/* Head */}
          <circle cx="255" cy="165" r="16" fill="url(#studentRightGrad)" />
          {/* Body / Torso */}
          <path
            d="M280 235 C280 200 265 190 255 190 C245 190 238 196 232 205 L240 235 Z"
            fill="url(#studentRightGrad)"
            opacity="0.8"
          />
          {/* Shoulder Highlight */}
          <path d="M275 220 Q255 195 240 205" stroke="#FBCFE8" strokeWidth="2" strokeLinecap="round" />
        </g>

        {/* 3. CENTER STUDENT (Primary Scholar wearing Graduation Cap & Academic Robe) */}
        <g>
          {/* Center Student Head */}
          <circle cx="200" cy="148" r="19" fill="url(#studentCenterGrad)" />
          {/* Center Student Robe */}
          <path
            d="M165 240 C165 190 180 178 200 178 C220 178 235 190 235 240 Z"
            fill="url(#studentCenterGrad)"
          />
          {/* Academic Robe V-Stole / Ribbon */}
          <path
            d="M185 182 L200 220 L215 182"
            stroke="url(#goldGrad)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <circle cx="200" cy="225" r="3.5" fill="#F59E0B" />

          {/* GRADUATION MORTARBOARD CAP (Crown of Academic Triumph) */}
          <g filter="url(#neonGlow)">
            {/* Cap Diamond Top */}
            <polygon
              points="200,96 248,114 200,132 152,114"
              fill="url(#goldGrad)"
              stroke="#FFFBEB"
              strokeWidth="1.5"
            />
            {/* Cap Skull Under-Cap */}
            <path
              d="M174 122 C174 135 185 142 200 142 C215 142 226 135 226 122"
              fill="#D97706"
              opacity="0.9"
            />
            {/* Cap Golden Button / Stud */}
            <circle cx="200" cy="114" r="3.5" fill="#FFFFFF" />
            {/* Golden Floating Tassel */}
            <path
              d="M200 114 Q232 118 238 138 L239 146"
              stroke="#FEF08A"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx="239" cy="147" r="2.5" fill="#F59E0B" />
          </g>
        </g>

        {/* ============================================================== */}
        {/* OPEN BOOK OF KNOWLEDGE & DIGITAL CIPHER LINES                  */}
        {/* ============================================================== */}
        <g transform="translate(0, 10)">
          {/* Open Book Pages */}
          <path
            d="M200 262 C230 252 265 255 285 264 L285 292 C265 283 230 280 200 290 C170 280 135 283 115 292 L115 264 C135 255 170 252 200 262 Z"
            fill="url(#bookGrad)"
            stroke="#6366F1"
            strokeWidth="2"
          />
          {/* Spine Divider */}
          <line x1="200" y1="262" x2="200" y2="290" stroke="#4F46E5" strokeWidth="2.5" />

          {/* Holographic Text/Code Lines on Book */}
          <line x1="130" y1="272" x2="185" y2="267" stroke="#6366F1" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
          <line x1="132" y1="280" x2="175" y2="276" stroke="#6366F1" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
          <line x1="215" y1="267" x2="270" y2="272" stroke="#8B5CF6" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
          <line x1="225" y1="276" x2="268" y2="280" stroke="#8B5CF6" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
        </g>

        {/* Radiant Starburst of Excellence behind Book */}
        <g stroke="url(#goldGrad)" strokeWidth="1.5" strokeLinecap="round" opacity="0.8">
          <line x1="200" y1="244" x2="200" y2="236" />
          <line x1="184" y1="248" x2="177" y2="243" />
          <line x1="216" y1="248" x2="223" y2="243" />
        </g>

        {/* Bottom Banner Ribbon: STUDENT LIFE OS */}
        <g transform="translate(0, 18)">
          <path
            d="M100 324 L130 318 L200 328 L270 318 L300 324 L290 342 L200 350 L110 342 Z"
            fill="#0F172A"
            stroke="url(#shieldGrad)"
            strokeWidth="2"
          />
          <text
            x="200"
            y="338"
            textAnchor="middle"
            fill="#F8FAFC"
            fontSize="10.5"
            fontWeight="900"
            letterSpacing="2.5"
            fontFamily="system-ui, -apple-system, sans-serif"
          >
            STUDENT LIFE OS
          </text>
        </g>
      </svg>
    </div>
  )
}
