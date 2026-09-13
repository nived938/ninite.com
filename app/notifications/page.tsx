import {redirect} from 'next/navigation'
import {auth} from '@/lib/auth'
import {db} from '@/lib/db'

export default async function NotificationsPage(){const session=await auth();if(!session?.user?.id)redirect('/login?callbackUrl=/notifications');const items=await db.notification.findMany({where:{userId:session.user.id},orderBy:{createdAt:'desc'},take:50});await db.notification.updateMany({where:{userId:session.user.id,read:false},data:{read:true}});return <main className="section"><div className="container narrow"><div className="pill">Notifications</div><h1>Your notifications</h1><div className="list">{items.map(n=><div className="card" key={n.id}><strong>{n.title}</strong><p className="muted">{n.body}</p><small className="muted">{new Date(n.createdAt).toLocaleString()}</small></div>)}{!items.length&&<div className="empty">You're all caught up. Updates and security events will appear here.</div>}</div></div></main>}
