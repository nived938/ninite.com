import { db } from '@/lib/db'
import AppsBrowser from '@/components/AppsBrowser'

export default async function AppsPage({searchParams}:{searchParams:Promise<{category?:string; q?:string}>}){
 const params=await searchParams
 const apps=await db.application.findMany({where:{active:true,...(params.q?{OR:[{name:{contains:params.q,mode:'insensitive'}},{description:{contains:params.q,mode:'insensitive'}},{publisher:{name:{contains:params.q,mode:'insensitive'}}}]}:{})},include:{publisher:true,versions:{where:{current:true},take:1},categories:{include:{category:true}}},orderBy:{name:'asc'}})
 const categories=await db.category.findMany({orderBy:{name:'asc'}})
 const filtered=params.category?apps.filter(a=>a.categories.some(x=>x.category.slug===params.category)):apps
 return <main className="section"><div className="container"><div style={{marginBottom:26}}><div className="pill">Application directory</div><h1 style={{fontSize:42,margin:'10px 0 5px'}}>Choose your software</h1><p className="muted">Select anything you need. Your selection can become a reusable installer bundle.</p></div><AppsBrowser apps={filtered} categories={categories}/></div></main>
}
