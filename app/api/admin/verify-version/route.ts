import {NextResponse} from 'next/server'
import {auth} from '@/lib/auth'
import {db} from '@/lib/db'
import {z} from 'zod'
const schema=z.object({versionId:z.string().min(1),verified:z.boolean()})
export async function POST(request:Request){const s=await auth();if(!s?.user?.id||s.user.role!=='ADMIN')return NextResponse.json({error:'Administrator access required.'},{status:403});const body=schema.safeParse(await request.json().catch(()=>null));if(!body.success)return NextResponse.json({error:'Invalid request.'},{status:400});const v=await db.applicationVersion.findUnique({where:{id:body.data.versionId}});if(!v)return NextResponse.json({error:'Version not found.'},{status:404});if(body.data.verified&&(!v.downloadUrl||!v.checksum||!v.signature))return NextResponse.json({error:'A release needs a download URL, SHA-256 checksum and signature before verification.'},{status:400});const updated=await db.applicationVersion.update({where:{id:v.id},data:{verified:body.data.verified}});return NextResponse.json({id:updated.id,verified:updated.verified})}
