import Link from 'next/link'
import { db } from '@/lib/db'

export default async function Home(){
 const apps=await db.application.findMany({where:{active:true},include:{publisher:true,versions:{where:{current:true},take:1},categories:{include:{category:true}}},orderBy:{updatedAt:'desc'},take:12})
 const categories=await db.category.findMany({orderBy:{name:'asc'},take:18})
 return <main>
  <section className="hero"><div className="container"><div className="pill">Trusted Windows software, organized</div><h1>Install everything you need. In one place.</h1><p>Discover trusted Windows applications, select what you need, and create your own installer. AppNest keeps software discovery, downloads and updates simple.</p><div className="search"><input placeholder="Search thousands of apps..."/><Link className="btn primary" href="/apps">Browse Apps</Link></div><div style={{display:'flex',gap:10,marginTop:14}}><Link className="btn secondary" href="/apps">Browse Apps</Link><Link className="btn ghost" href="/builder">Build an Installer</Link></div></div></section>
  <section className="section"><div className="container"><h2>Popular right now</h2><p className="sub">A curated starting point, backed by publisher information.</p><div className="grid">{apps.slice(0,6).map(a=><Link className="card appcard" key={a.id} href={'/apps/'+a.slug}><div className="icon">{a.name.slice(0,1)}</div><div><h3>{a.name}</h3><p>{a.description}</p><div className="meta">{a.publisher.name} · {a.versions[0]?.version ?? 'Version pending'}</div></div></Link>)}</div></div></section>
  <section className="section"><div className="container"><h2>Browse categories</h2><p className="sub">From browsers and developer tools to media, privacy and AI.</p><div className="grid">{categories.map(c=><Link className="card" href={'/apps?category='+encodeURIComponent(c.slug)} key={c.id}><strong>{c.name}</strong><p className="muted">Explore trusted apps</p></Link>)}</div></div></section>
  <section className="section"><div className="container"><div className="card" style={{padding:30,display:'flex',justifyContent:'space-between',gap:20,alignItems:'center'}}><div><h2 style={{marginTop:0}}>Build your setup once</h2><p className="muted">Select apps, review the manifest and generate a signed installer configuration for the Windows client.</p></div><Link className="btn primary" href="/builder">Build an Installer</Link></div></div></section>
 </main>
}
