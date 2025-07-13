import Link from 'next/link'

export function LogoItem() {
  return (
    <Link href="/" className="flex items-center space-x-2">
      <span className="text-xl font-bold text-gray-900 dark:text-white">Prio</span>
    </Link>
  )
}
