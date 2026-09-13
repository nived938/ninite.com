import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { z } from 'zod'

const bodySchema=z.object({applicationId:z.string().min(1)})

export async function POST(request:Request){
 const session=await auth(); if(!session?.user?.id) return NextResponse.json({error:'Sign in required.'},{status:401})
 const body=bodySchema.safeParse(await request.json().catch(()=>null)); if(!body.success) return NextResponse.json({error:'Invalid application.'},{status:400})
 const app=await db.application.findUnique({where:{id:body.data.applicationId},select:{id:true}}); if(!app) return NextResponse.json({error:'Application not found.'},{status:404})
 await db.favorite.upsert({where:{userId_applicationId:{userId:session.user.id,applicationId:app.id}},create:{userId:session.user.id,applicationId:app.id},update:{}})
 return NextResponse.json({favorite:true})
}

export async function DELETE(request:Request){
 const session=await auth(); if(!session?.user?.id) return NextResponse.json({error:'Sign in required.'},{status:401})
 const body=bodySchema.safeParse(await request.json().catch(()=>null)); if(!body.success) return NextResponse.json({error:'Invalid application.'},{status:400})
 await db.favorite.deleteMany({where:{userId:session.user.id,applicationId:body.data.applicationId}})
 return NextResponse.json({favorite:false})
}
