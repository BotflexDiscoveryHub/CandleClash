/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as AuthImport } from './routes/_auth'
import { Route as AuthIndexRouteImport } from './routes/_auth/index.route'
import { Route as AuthGameRouteImport } from './routes/_auth/game/route'

// Create Virtual Routes

const AuthStateRouteLazyImport = createFileRoute('/_auth/state')()
const AuthRewardsRouteLazyImport = createFileRoute('/_auth/rewards')()

// Create/Update Routes

const AuthRoute = AuthImport.update({
  id: '/_auth',
  getParentRoute: () => rootRoute,
} as any)

const AuthIndexRouteRoute = AuthIndexRouteImport.update({
  path: '/',
  getParentRoute: () => AuthRoute,
} as any)

const AuthStateRouteLazyRoute = AuthStateRouteLazyImport.update({
  path: '/state',
  getParentRoute: () => AuthRoute,
} as any).lazy(() =>
  import('./routes/_auth/state/route.lazy').then((d) => d.Route),
)

const AuthRewardsRouteLazyRoute = AuthRewardsRouteLazyImport.update({
  path: '/rewards',
  getParentRoute: () => AuthRoute,
} as any).lazy(() =>
  import('./routes/_auth/rewards/route.lazy').then((d) => d.Route),
)

const AuthGameRouteRoute = AuthGameRouteImport.update({
  path: '/game',
  getParentRoute: () => AuthRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/_auth': {
      id: '/_auth'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof AuthImport
      parentRoute: typeof rootRoute
    }
    '/_auth/game': {
      id: '/_auth/game'
      path: '/game'
      fullPath: '/game'
      preLoaderRoute: typeof AuthGameRouteImport
      parentRoute: typeof AuthImport
    }
    '/_auth/rewards': {
      id: '/_auth/rewards'
      path: '/rewards'
      fullPath: '/rewards'
      preLoaderRoute: typeof AuthRewardsRouteLazyImport
      parentRoute: typeof AuthImport
    }
    '/_auth/state': {
      id: '/_auth/state'
      path: '/state'
      fullPath: '/state'
      preLoaderRoute: typeof AuthStateRouteLazyImport
      parentRoute: typeof AuthImport
    }
    '/_auth/': {
      id: '/_auth/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof AuthIndexRouteImport
      parentRoute: typeof AuthImport
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren({
  AuthRoute: AuthRoute.addChildren({
    AuthGameRouteRoute,
    AuthRewardsRouteLazyRoute,
    AuthStateRouteLazyRoute,
    AuthIndexRouteRoute,
  }),
})

/* prettier-ignore-end */

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/_auth"
      ]
    },
    "/_auth": {
      "filePath": "_auth.tsx",
      "children": [
        "/_auth/game",
        "/_auth/rewards",
        "/_auth/state",
        "/_auth/"
      ]
    },
    "/_auth/game": {
      "filePath": "_auth/game/route.ts",
      "parent": "/_auth"
    },
    "/_auth/rewards": {
      "filePath": "_auth/rewards/route.lazy.tsx",
      "parent": "/_auth"
    },
    "/_auth/state": {
      "filePath": "_auth/state/route.lazy.tsx",
      "parent": "/_auth"
    },
    "/_auth/": {
      "filePath": "_auth/index.route.tsx",
      "parent": "/_auth"
    }
  }
}
ROUTE_MANIFEST_END */
