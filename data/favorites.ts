export interface FavoriteImage {
  src: string
  color: string
}

export interface FavoriteCategory {
  title: string
  value: string
  images: FavoriteImage[]
}

export const animeImages: FavoriteImage[] = [
  { src: '/img/animes/1.jpg', color: 'bg-green-500' },
  { src: '/img/animes/2.jpg', color: 'bg-blue-500' },
  { src: '/img/animes/7.jpg', color: 'bg-amber-500' },
  { src: '/img/animes/4.jpg', color: 'bg-red-500' },
  { src: '/img/animes/5.jpg', color: 'bg-yellow-500' },
  { src: '/img/animes/6.jpg', color: 'bg-teal-500' },
]

export const bookImages: FavoriteImage[] = [
  { src: '/img/books/1.jpg', color: 'bg-green-500' },
  { src: '/img/books/2.jpg', color: 'bg-blue-500' },
  { src: '/img/books/3.jpg', color: 'bg-amber-500' },
  { src: '/img/books/4.jpg', color: 'bg-red-500' },
  { src: '/img/books/5.jpg', color: 'bg-yellow-500' },
  { src: '/img/books/6.jpg', color: 'bg-teal-500' },
]

export const gameImages: FavoriteImage[] = [
  { src: '/img/games/1.jpg', color: 'bg-green-500' },
  { src: '/img/games/2.jpg', color: 'bg-blue-500' },
  { src: '/img/games/3.jpg', color: 'bg-amber-500' },
  { src: '/img/games/6.jpg', color: 'bg-red-500' },
  { src: '/img/games/5.png', color: 'bg-yellow-500' },
  { src: '/img/games/7.jpg', color: 'bg-teal-500' },
]
