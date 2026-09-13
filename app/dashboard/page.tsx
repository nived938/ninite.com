import {auth} from '@/lib/auth'
import {redirect} from 'next/navigation'
import {db} from '@/lib/db'

export default async function Dashboard(){
 const session=await auth()
 if(!session?.user?.id)redirect('/login')
 const [favorites,installed,collections,installedRows]=await Promise.all([
  db.favorite.count({where:{userId:session.user.id}}),
  db.installedApp.count({where:{userId:session.user.id}}),
  db.collection.count({where:{userId:session.user.id}}),
  db.installedApp.findMany({where:{userId:session.user.id},include:{application:{include:{versions:{where:{current:true},take:1}}}},take:100})
 ])
 const updates=installedRows.filter(x=>x.application.versions[0]&&x.application.versions[0].version!==x.version).length
 return <main className="section"><div className="container"><div className="pill">Personal library</div><h1 style={{fontSize:42}}>Welcome back{session.user.name?`, ${session.user.name}`:''}.</h1><p className="muted">Keep your software organized across installs, favorites, collections and available updates.</p><div className="stats"><div className="card stat"><strong>{installed}</strong><span>Installed apps</span></div><div className="card stat"><strong>{favorites}</strong><span>Favorites</span></div><div className="card stat"><strong>{updates}</strong><span>Updates available</span></div><div className="card stat"><strong>{collections}</strong><span>Collections</span></div></div><section className="section"><div className="card"><h2>Device inventory</h2><p className="muted">The AppNest Windows client reports installed software and compares it with verified catalog releases.</p>{installedRows.length?<div className="list">{installedRows.map(x=><div className="listrow" key={x.applicationId}><div className="icon">{x.application.name.slice(0,1)}</div><div><strong>{x.application.name}</strong><div className="muted">Installed {x.version} · Current {x.application.versions[0]?.version??'Unknown'}</div></div><span className={x.application.versions[0]&&x.application.versions[0].version!==x.version?'verifiedBadge':'muted'}>{x.application.versions[0]&&x.application.versions[0].version!==x.version?'Update available':'Up to date'}</span></div>)}</div>:<div className="notice">No device inventory yet. Connect the Windows client to report installed applications.</div>}</div></section></div></main>
}
