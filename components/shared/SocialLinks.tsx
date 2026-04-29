'use client'

import { FaGithub } from 'react-icons/fa'
import { SiCsdn } from 'react-icons/si'

const socialLinks = [
  {
    name: 'GitHub',
    url: 'https://github.com/sweet-boby',
    icon: FaGithub,
  },
  {
    name: 'CSDN',
    url: 'https://blog.csdn.net/2302_80902795',
    icon: SiCsdn,
  },
]

export function SocialLinks() {
  return (
    <div className="text-xl flex items-center py-5">
      {socialLinks.map((link) => (
        <link.icon
          key={link.name}
          className="hover:text-blue-500 cursor-pointer mr-5"
          onClick={() => window.open(link.url)}
          size={30}
        />
      ))}
    </div>
  )
}
