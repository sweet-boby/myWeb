'use client'

import { navLinks } from '@/config/site'

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm shadow-sm w-full">
      <div className="container mx-auto px-4">
        <div className="flex justify-self-center items-center justify-between h-16">
          <div className="flex space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}
