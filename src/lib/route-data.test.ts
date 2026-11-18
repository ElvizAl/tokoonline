import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  createRootRoute,
  createRoute,
  createRouter,
  createMemoryHistory,
} from '@tanstack/react-router'
import { loadPageData } from './route-data'
test('navigation commits the target page before its slow remote data resolves', async () => {
  let release!: (value: string) => void
  const remote = new Promise<string>((resolve) => {
    release = resolve
  })
  const root = createRootRoute()
  const start = createRoute({ getParentRoute: () => root, path: '/' })
  const target = createRoute({
    getParentRoute: () => root,
    path: '/data',
    loader: () => loadPageData(() => remote),
  })
  const router = createRouter({
    routeTree: root.addChildren([start, target]),
    history: createMemoryHistory({ initialEntries: ['/'] }),
    defaultPendingMinMs: 0,
  })
  await router.load()
  router.history.push('/data')
  const navigation = router.load()
  let committed = false
  void navigation.then(() => {
    committed = true
  })
  await new Promise((resolve) => setTimeout(resolve, 100))
  try {
    assert.equal(
      committed,
      true,
      'Navigation is blocked by the remote data request',
    )
    assert.equal(router.state.location.pathname, '/data')
  } finally {
    release('loaded')
    await navigation
  }
})
