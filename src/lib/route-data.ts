export function loadPageData<T>(fetcher: () => Promise<T>) {
  return { data: fetcher() }
}
