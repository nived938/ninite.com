import {db} from '@/lib/db'
import Builder from '@/components/Builder'
export default async function BuilderPage({searchParams}:{searchParams:Promise<{apps?:string}>}){
 const p=await searchParams
 const ids=(p.apps??'').split(',').filter(Boolean)
 const apps=await db.application.findMany({where:{id:{in:ids},active:true},include:{publisher:true,versions:{where:{current:true},take:1}}})
 return <main className="section"><div className="container"><div className="pill">Installer builder</div><h1 style={{fontSize:42,margin:'10px 0'}}>Build your installer</h1><p className="muted">Create a signed, server-generated configuration. The Windows client downloads only publisher-approved, verified releases.</p><Builder apps={apps}/></div></main>
}
