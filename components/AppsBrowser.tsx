'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'

type App = {
  id: string
  slug: string
  name: string
  description: string
  license: string
  portable: boolean
  websiteUrl: string
  sourceUrl?: string | null
  iconUrl?: string | null
  publisher: { name: string }
  versions: { version: string }[]
  categories: { category: { name: string } }[]
}

type Category = { id: string; name: string; slug: string }

function iconFor(app: App) {
  if (app.iconUrl) return app.iconUrl
  try {
    return new URL('/favicon.ico', app.websiteUrl).toString()
  } catch {
    return ''
  }
}

export default function AppsBrowser({ apps, categories }: { apps: App[]; categories: Category[] }) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [selected, setSelected] = useState<string[]>([])

  const categoryCounts = useMemo(() => {
    const counts = new Map<string, number>()
    for (const app of apps) {
      for (const item of app.categories) {
        counts.set(item.category.name, (counts.get(item.category.name) ?? 0) + 1)
      }
    }
    return counts
  }, [apps])

  const visibleCategories = useMemo(
    () => categories.filter(item => (categoryCounts.get(item.name) ?? 0) > 0),
    [categories, categoryCounts]
  )

  const shown = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return apps.filter(app => {
      const matchesCategory = !category || app.categories.some(item => item.category.name === category)
      const haystack = `${app.name} ${app.description} ${app.publisher.name}`.toLowerCase()
      return matchesCategory && (!normalized || haystack.includes(normalized))
    })
  }, [apps, category, query])

  const toggle = (id: string) => {
    setSelected(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id])
  }

  const clearFilters = () => {
    setQuery('')
    setCategory('')
  }

  return (
    <>
      <div className="catalogToolbar">
        <div className="catalogSearch search">
          <span aria-hidden="true">⌕</span>
          <input
            value={query}
            onChange={event => setQuery(event.target.value)}
            placeholder="Search apps, publishers, or what you need..."
            aria-label="Search applications"
          />
          {query && <button className="searchClear" onClick={() => setQuery('')} aria-label="Clear search">×</button>}
        </div>
        <div className="catalogSummary">
          <strong>{shown.length}</strong> apps
          {category && <><span>·</span><button className="filterReset" onClick={() => setCategory('')}>{category} ×</button></>}
        </div>
      </div>

      <div className="categoryStrip" aria-label="Software categories">
        <button className={category === '' ? 'categoryChip active' : 'categoryChip'} onClick={() => setCategory('')}>
          <span>All apps</span><b>{apps.length}</b>
        </button>
        {visibleCategories.map(item => (
          <button
            key={item.id}
            className={category === item.name ? 'categoryChip active' : 'categoryChip'}
            onClick={() => setCategory(category === item.name ? '' : item.name)}
          >
            <span>{item.name}</span><b>{categoryCounts.get(item.name)}</b>
          </button>
        ))}
      </div>

      {selected.length > 0 && (
        <div className="selectionBar">
          <div>
            <strong>{selected.length} selected</strong>
            <span>Build one installer for your selection</span>
          </div>
          <div className="selectionActions">
            <button className="btn ghost" onClick={() => setSelected([])}>Clear</button>
            <Link className="btn primary" href={`/builder?apps=${selected.join(',')}`}>Continue to builder</Link>
          </div>
        </div>
      )}

      {shown.length > 0 ? (
        <div className="appGrid">
          {shown.map(app => {
            const icon = iconFor(app)
            const selectedApp = selected.includes(app.id)
            return (
              <article className={selectedApp ? 'appTile selected' : 'appTile'} key={app.id}>
                <div className="appTileTop">
                  <label className="selectApp" title={selectedApp ? 'Remove from installer' : 'Add to installer'}>
                    <input type="checkbox" checked={selectedApp} onChange={() => toggle(app.id)} />
                    <span>{selectedApp ? '✓' : '+'}</span>
                  </label>
                  <div className="appIconLarge">
                    {icon ? <img src={icon} alt="" width={52} height={52} /> : app.name.slice(0, 1)}
                  </div>
                  <span className="licensePill">{app.license.replace('_', ' ')}</span>
                </div>

                <Link href={`/apps/${app.slug}`} className="appTileBody">
                  <h3>{app.name}</h3>
                  <p>{app.description}</p>
                  <div className="appMeta"><span>{app.publisher.name}</span><span>{app.versions[0]?.version ?? 'Release info pending'}</span></div>
                </Link>

                <div className="appTileFooter">
                  <Link href={`/apps/${app.slug}`} className="textLink">View details →</Link>
                  <a className="officialLink" href={app.sourceUrl ?? app.websiteUrl} target="_blank" rel="noreferrer">Official site ↗</a>
                </div>
              </article>
            )
          })}
        </div>
      ) : (
        <div className="empty catalogEmpty">
          <div className="emptyIcon">⌕</div>
          <h3>No applications match your filters</h3>
          <p>Try a different search or browse all AppNest software.</p>
          <button className="btn secondary" onClick={clearFilters}>Show all apps</button>
        </div>
      )}
    </>
  )
}
