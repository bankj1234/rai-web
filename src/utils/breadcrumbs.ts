export interface BreadcrumbItem {
  label: string
  href?: string
}

// Route configuration for breadcrumbs
const BREADCRUMB_LABELS = {
  workspace: 'Workspaces List',
  workspaceDetail: 'Workspace Detail',
  createTestSet: 'Create Test Set',
  environments: 'Environment List',
  environmentDetail: 'Environment Detail',
  createEnvironment: 'Create Environment',
  editEnvironment: 'Edit Environment',
  home: 'Home',
} as const

// Base paths
const PATHS = {
  workspace: '/workspace',
  environments: '/environments',
} as const

/**
 * Extract route segments from pathname
 */
const getPathSegments = (pathname: string): string[] => {
  return pathname.split('/').filter(Boolean)
}

/**
 * Check if pathname matches a pattern
 */
const matchesPattern = (pathname: string, pattern: RegExp): boolean => {
  return pattern.test(pathname)
}

/**
 * Handle workspace-related breadcrumbs
 */
const getWorkspaceBreadcrumbs = (
  pathname: string,
  segments: string[]
): BreadcrumbItem[] => {
  // /workspace/:id/create-test-set
  if (matchesPattern(pathname, /^\/workspace\/[^/]+\/create-test-set$/)) {
    return [
      { label: BREADCRUMB_LABELS.workspace, href: PATHS.workspace },
      { label: BREADCRUMB_LABELS.createTestSet },
    ]
  }

  // /workspace/:id
  if (segments.length === 2 && segments[0] === 'workspace') {
    return [
      { label: BREADCRUMB_LABELS.workspace, href: PATHS.workspace },
      { label: BREADCRUMB_LABELS.workspaceDetail },
    ]
  }

  // /workspace
  if (pathname === PATHS.workspace) {
    return [{ label: BREADCRUMB_LABELS.workspace }]
  }

  return []
}

/**
 * Handle environment-related breadcrumbs
 */
const getEnvironmentBreadcrumbs = (
  pathname: string,
  segments: string[]
): BreadcrumbItem[] => {
  // /environments/edit/:id
  if (matchesPattern(pathname, /^\/environments\/edit\/[^/]+$/)) {
    return [
      { label: BREADCRUMB_LABELS.environments, href: PATHS.environments },
      { label: BREADCRUMB_LABELS.editEnvironment },
    ]
  }

  // /environments/create
  if (pathname === '/environments/create') {
    return [
      { label: BREADCRUMB_LABELS.environments, href: PATHS.environments },
      { label: BREADCRUMB_LABELS.createEnvironment },
    ]
  }

  // /environments/:id (detail view)
  if (
    segments.length === 2 &&
    segments[0] === 'environments' &&
    !segments[1].includes('edit') &&
    !segments[1].includes('create')
  ) {
    return [
      { label: BREADCRUMB_LABELS.environments, href: PATHS.environments },
      { label: BREADCRUMB_LABELS.environmentDetail },
    ]
  }

  // /environments
  if (pathname === PATHS.environments) {
    return [{ label: BREADCRUMB_LABELS.environments }]
  }

  return []
}

/**
 * Generate breadcrumbs based on the current pathname
 * @param pathname - The current pathname from usePathname()
 * @returns Array of breadcrumb items
 */
export const getBreadcrumbs = (pathname: string): BreadcrumbItem[] => {
  const segments = getPathSegments(pathname)

  // Handle workspace routes
  if (pathname.startsWith('/workspace')) {
    const breadcrumbs = getWorkspaceBreadcrumbs(pathname, segments)
    if (breadcrumbs.length > 0) return breadcrumbs
  }

  // Handle environment routes
  if (pathname.startsWith('/environments')) {
    const breadcrumbs = getEnvironmentBreadcrumbs(pathname, segments)
    if (breadcrumbs.length > 0) return breadcrumbs
  }

  // Default fallback
  return [{ label: BREADCRUMB_LABELS.home }]
}
