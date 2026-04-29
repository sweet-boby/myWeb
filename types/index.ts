export interface Skill {
  title: string
  description: string
  icon: string
}

export interface ExperienceItem {
  title: string
  date: string
  descriptions: string[]
  images: string[]
}

export interface FavoriteItem {
  src: string
  color: string
}

export interface TabContent {
  title: string
  value: string
  category: 'animes' | 'books' | 'games' | 'music'
}

export interface NavLink {
  label: string
  href: string
}

export interface SocialLink {
  name: string
  url: string
  icon: string
}
