import { notFound } from 'next/navigation'
import Link from 'next/link'
import { db } from '@/lib/db'

export default async function AppPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const app = await db.application.findUnique({
    where: { slug },
    include: {
      publisher: true,
      categories: { include: { category: true } },
      versions: { orderBy: { releaseDate: 'desc' } },
    },
  })
  if (!app) return notFound()

  const current = app.versions.find(v => v.current) ?? app.versions[0]
  const canDirectDownload = Boolean(current?.verified && current.downloadUrl && current.checksum && current.signature)

  return <main className="section"><div className="container"><div className="detail"><div>
    <div className="detailHero"><div className="icon">{app.name.slice(0,1)}</div><div><h1>{app.name}</h1><div className="muted">{app.publisher.name} · {app.license.replace('_',' ')} {app.openSource ? '· Open source' : ''}</div></div></div>
    <p style={{fontSize:18,lineHeight:1.6}}>{app.description}</p>
    <div className="card">
      <div className="row"><span>Current version</span><strong>{current?.version ?? 'Not published'}</strong></div>
      <div className="row"><span>Latest release</span><span>{current ? new Date(current.releaseDate).toLocaleDateString() : 'Pending verification'}</span></div>
      <div className="row"><span>Architecture</span><span>{current?.architecture ?? 'Multiple'}</span></div>
      <div className="row"><span>Platform</span><span>{current?.platform?.replace('_',' ') ?? 'Windows'}</span></div>
      <div className="row"><span>Security status</span>{current?.verified ? <span className="verifiedBadge">✓ Verified</span> : <span className="muted">Verification pending</span>}</div>
    </div>
    <section className="section" style={{paddingBottom:0}}>
      <h2>Download</h2>
      <p className="muted">AppNest never invents installer URLs. Direct downloads are enabled only after an official download URL, checksum and signature have been verified.</p>
      <div className="downloadActions">
        {canDirectDownload ? <a className="btn primary" href={current!.downloadUrl!}>Download {app.name} {current!.version}</a> : <a className="btn primary" href={app.sourceUrl ?? app.websiteUrl} target="_blank" rel="noreferrer">Open official download page</a>}
        <Link className="btn secondary" href={'/builder?apps='+app.id}>Add to Installer</Link>
      </div>
      {!canDirectDownload && <div className="notice" style={{marginTop:12}}>Direct installer verification is pending. The official publisher page is available now.</div>}
    </section>
    <section className="section" style={{paddingBottom:0}}><h2>Security</h2><p className="muted">AppNest labels a release verified only after its recorded checksum and publisher signature checks pass.</p></section>
  </div><aside>
    <div className="card"><a className="btn ghost" style={{display:'block',textAlign:'center'}} href={app.websiteUrl} target="_blank" rel="noreferrer">Publisher website</a><Link className="btn secondary" style={{display:'block',textAlign:'center',marginTop:10}} href={'/builder?apps='+app.id}>Add to Installer</Link></div>
    <div className="card" style={{marginTop:14}}><strong>Categories</strong>{app.categories.map(c=><div className="pill" style={{display:'inline-block',margin:'8px 5px 0 0'}} key={c.category.id}>{c.category.name}</div>)}</div>
  </aside></div></div></main>
}
