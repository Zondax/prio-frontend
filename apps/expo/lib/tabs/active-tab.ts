// Helper function to check if a tab is active based on the current pathname
export function isTabActive(tabPath: string, segments: string[]): boolean {
  let isActive = false

  const tabPathSegments = tabPath.startsWith('/') ? tabPath.substring(1) : tabPath

  // Handle the special case for explore tab
  if (tabPathSegments === segments.join('/')) {
    isActive = true
  }

  return isActive
}
