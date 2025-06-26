// Mock implementation of next/navigation for Storybook
export const usePathname = () => '/'

export const useRouter = () => ({
  push: (url) => console.log('Navigate to:', url),
  replace: (url) => console.log('Replace with:', url),
  back: () => console.log('Go back'),
  forward: () => console.log('Go forward'),
  refresh: () => console.log('Refresh'),
  prefetch: (url) => console.log('Prefetch:', url),
})

export const useSearchParams = () => new URLSearchParams()

export const useParams = () => ({})

// Mock Link component
export const Link = ({ children, href, ...props }) => {
  return React.createElement(
    'a',
    {
      href,
      onClick: (e) => {
        e.preventDefault()
        console.log('Navigate to:', href)
      },
      ...props,
    },
    children
  )
}

// Default export for compatibility
export default {
  usePathname,
  useRouter,
  useSearchParams,
  useParams,
  Link,
}
