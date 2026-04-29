import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const BASE_PATH = '/myWeb'

export function publicPath(path: string): string {
  if (path.startsWith('http')) return path
  return `${BASE_PATH}${path}`
}
