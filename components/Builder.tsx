'use client'

import { useState } from 'react'
import Link from 'next/link'

type App = {
  id: string
  name: string
  description: string
  publisher: { name: string }
  websiteUrl?: string
  sourceUrl?: string | null
  versions: { id: string; version: string; verified: boolean }[]
}

type MissingApp = { id: string; name: string; publisher: string; officialUrl: string }

export default function Builder({ apps }: { apps: App[] }) {
  const [busy, setBusy] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [options, setOptions] = useState({ skip: true, shortcuts: false, currentUser: true, silent: true })

  async function generate() {
    setBusy(true)
    setResult(null)
    try {
      const response = await fetch('/api/installer', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ applicationIds: apps.map(app => app.id), options }),
      })
      const data = await response.json()
      setResult(data)
    } catch {
      setResult({ error: 'Could not reach the installer service. Check that the AppNest server is running.' })
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="detail">
      <div>
        <div className="card">
          <h2>1. Review selection</h2>
          {apps.length ? (
            <div className="list">
              {apps.map(app => (
                <div className="listrow" key={app.id}>
                  <div className="icon">{app.name.slice(0, 1)}</div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <strong>{app.name}</strong>
                    <div className="muted">{app.publisher.name} · {app.versions[0]?.version ?? 'Release verification pending'}</div>
                  </div>
                  {!app.versions[0]?.verified && <span className="pill">Verification pending</span>}
                </div>
              ))}
            </div>
          ) : (
            <div className="empty">No apps selected. <Link href="/apps" style={{ color: 'var(--brand)' }}>Browse apps</Link> and select some first.</div>
          )}
        </div>

        <div className="card" style={{ marginTop: 14 }}>
          <h2>2. Installer preferences</h2>
          {Object.entries({
            skip: 'Skip already installed or up-to-date apps',
            shortcuts: 'Create desktop shortcuts when supported',
            currentUser: 'Install for current user when supported',
            silent: 'Use silent installation when safely supported',
          }).map(([key, label]) => (
            <label key={key} style={{ display: 'block', padding: '10px 0' }}>
              <input
                type="checkbox"
                checked={Boolean(options[key as keyof typeof options])}
                onChange={event => setOptions(current => ({ ...current, [key]: event.target.checked }))}
              />{' '}{label}
            </label>
          ))}
          <button className="btn primary" disabled={!apps.length || busy} onClick={generate}>
            {busy ? 'Checking releases...' : 'Create installer'}
          </button>
        </div>

        {result?.code === 'RELEASE_VERIFICATION_REQUIRED' && (
          <div className="card" style={{ marginTop: 14, borderColor: '#ffd8a8' }}>
            <div className="notice" style={{ background: '#fff8e8', borderColor: '#ffe0ad', color: '#8a5700' }}>
              <strong>Installer paused for security verification</strong>
              <p style={{ margin: '7px 0 0' }}>{result.message}</p>
            </div>
            <div style={{ marginTop: 14 }}>
              {(result.missing as MissingApp[]).map(app => (
                <div key={app.id} className="listrow" style={{ marginTop: 8 }}>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <strong>{app.name}</strong>
                    <div className="muted">{app.publisher} · Official release verification pending</div>
                  </div>
                  <a className="btn ghost" href={app.officialUrl} target="_blank" rel="noreferrer">Official download</a>
                </div>
              ))}
            </div>
            <p className="muted" style={{ fontSize: 13, marginBottom: 0 }}>
              This is intentional: AppNest will never invent an executable URL, checksum, or signature just to make the installer appear to work.
            </p>
          </div>
        )}

        {result && result.code !== 'RELEASE_VERIFICATION_REQUIRED' && result.error && (
          <div className="error" style={{ marginTop: 14 }}>{result.error}</div>
        )}

        {result && !result.error && result.config && (
          <pre className="card" style={{ marginTop: 14, overflow: 'auto', whiteSpace: 'pre-wrap' }}>{JSON.stringify(result, null, 2)}</pre>
        )}
      </div>

      <aside>
        <div className="card">
          <strong>How AppNest keeps installers safe</strong>
          <p className="muted">A release must have an official download URL, SHA-256 checksum, signature metadata, architecture/platform information, and a verified status before it can enter an AppNest installer.</p>
          <Link href="/security" className="textLink">Read the security model →</Link>
        </div>
      </aside>
    </div>
  )
}
