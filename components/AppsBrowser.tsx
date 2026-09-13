'use client'
import {useMemo,useState} from 'react'
import Link from 'next/link'

type App={id:string;slug:string;name:string;description:string;license:string;portable:boolean;websiteUrl:string;sourceUrl?:string|null;publisher:{name:string};versions:{version:string}[];categories:{category:{name:string}}[]}

export default function AppsBrowser({apps,categories}:{apps:App[];categories:{id:string;name:string;slug:string}[]}){
 const [query,setQuery]=useState(''); const [cat,setCat]=useState(''); const [selected,setSelected]=useState<string[]>([])
 const shown=useMemo(()=>apps.filter(a=>(!cat||a.categories.some(c=>c.category.name===cat))&&(!query||`${a.name} ${a.description} ${a.publisher.name}`.toLowerCase().includes(query.toLowerCase()))),[apps,cat,query])
 const toggle=(id:string)=>setSelected(s=>s.includes(id)?s.filter(x=>x!==id):[...s,id])
 return <>
  <div className="directory">
   <aside className="sidebar"><strong>Categories</strong><button onClick={()=>setCat('')}>All apps</button>{categories.map(c=><button key={c.id} onClick={()=>setCat(c.name)}>{c.name}</button>)}</aside>
   <div>
    <div className="search" style={{marginBottom:16,maxWidth:'none'}}><input autoFocus value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search by app, publisher or description..."/></div>
    <div className="list">
     {shown.map(a=><div className="listrow" key={a.id}>
      <input className="checkbox" type="checkbox" checked={selected.includes(a.id)} onChange={()=>toggle(a.id)}/>
      <div><Link href={'/apps/'+a.slug}><strong>{a.name}</strong></Link><div className="muted" style={{fontSize:13}}>{a.description}</div><div className="meta">{a.publisher.name} · {a.versions[0]?.version??'Release pending verification'} · {a.license.replace('_',' ')}</div></div>
      <div style={{display:'flex',gap:8}}><a className="btn ghost" href={a.sourceUrl??a.websiteUrl} target="_blank" rel="noreferrer">Download</a><Link className="btn secondary" href={'/apps/'+a.slug}>Details</Link></div>
     </div>)}
     {!shown.length&&<div className="empty">No applications match your search.</div>}
    </div>
   </div>
  </div>
  {selected.length>0&&<div className="stickySelection"><div className="selected"><strong>{selected.length} applications selected</strong><br/><small>Ready to review and build an installer</small></div><Link className="btn primary" href={'/builder?apps='+selected.join(',')}>Create Installer</Link><button className="btn ghost" onClick={()=>setSelected([])}>Clear</button></div>}
 </>
}
