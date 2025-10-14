"use client"
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

function Navbar() {
  return (
    <div>
      {/* Navbar */}
      <header className="w-100 py-3 px-4 d-flex align-items-center justify-content-between shadow-sm" 
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.3)', backdropFilter: 'blur(8px)' }}>
        <div className="d-flex align-items-center gap-3">
          <Image src="/logo.svg" alt="Logo" width={36} height={36} className="object-fit-contain" />
          <h1 className="h5 fw-semibold mb-0">Escape Room Builder</h1>
        </div>
        <nav className="d-flex align-items-center gap-3">
          <Link href="/" className="px-3 py-2 rounded text-decoration-none" 
                style={{ color: 'inherit' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
            Home
          </Link>
          <Link href="/builder" className="px-3 py-2 rounded text-decoration-none" 
                style={{ color: 'inherit' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
            Builder
          </Link>
          <Link href="/play" className="px-3 py-2 rounded text-decoration-none" 
                style={{ color: 'inherit' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
            Play
          </Link>
        </nav>
      </header>
    </div>
  )
}

export default Navbar
