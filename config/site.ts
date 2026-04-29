import type { NavLink, SocialLink } from '@/types'

export const siteConfig = {
  name: 'Blues Lee',
  title: 'Blues Lee Website',
  description: 'Personal website of Blues Lee - Student & Developer',
  copyright: `© ${new Date().getFullYear()} Blues Lee. All rights reserved.`,
}

export const navLinks: NavLink[] = [
  { label: '首页', href: '#home' },
  { label: '技能', href: '#skills' },
  { label: '项目', href: '#projects' },
  { label: '爱好', href: '#favorites' },
]

export const socialLinks: SocialLink[] = [
  {
    name: 'GitHub',
    url: 'https://github.com/sweet-boby',
    icon: 'FaGithub',
  },
  {
    name: 'CSDN',
    url: 'https://blog.csdn.net/2302_80902795',
    icon: 'SiCsdn',
  },
]
