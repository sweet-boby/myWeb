import { siteConfig } from '@/config/site'

export function Footer() {
  return (
    <footer className="mt-20 py-6 border-t border-gray-200">
      <div className="container mx-auto px-4 text-center text-gray-600">
        {siteConfig.copyright}
      </div>
    </footer>
  )
}
