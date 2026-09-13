import { NextResponse } from 'next/server'
import { createHash, randomUUID } from 'node:crypto'
import { db } from '@/lib/db'
import { z } from 'zod'

const input=z.object({applicationIds:z.array(z.string()).min(1).max(100),options:z.object({skip:z.boolean(),shortcuts:z.boolean(),currentUser:z.boolean(),silent:z.boolean()})})
export async function POST(req:Request){
 try{
  const body=input.parse(await req.json())
  const apps=await db.application.findMany({where:{id:{in:body.applicationIds},active:true},include:{publisher:true,versions:{where:{current:true},take:1}}})
  if(apps.length!==body.applicationIds.length)return NextResponse.json({error:'One or more applications are unavailable.'},{status:400})
  const missing=apps.filter(a=>{const v=a.versions[0];return !v||!v.verified||!v.downloadUrl||!v.checksum||!v.signature})
  if(missing.length)return NextResponse.json({error:`Installer generation is blocked until these releases are verified: ${missing.map(a=>a.name).join(', ')}`},{status:409})
  const token=randomUUID(); const expiresAt=new Date(Date.now()+15*60*1000)
  const config={schemaVersion:1,product:'AppNest',createdAt:new Date().toISOString(),expiresAt:expiresAt.toISOString(),options:body.options,items:apps.map((a,i)=>{const v=a.versions[0];return {position:i,appId:a.id,name:a.name,publisher:a.publisher.name,version:v.version,architecture:v.architecture,platform:v.platform,downloadUrl:v.downloadUrl,sha256:v.checksum,signature:v.signature}})}
  const configHash=createHash('sha256').update(JSON.stringify(config)).digest('hex')
  const installer=await db.installer.create({data:{token,configHash,expiresAt,items:{create:apps.map((a,i)=>({applicationId:a.id,versionId:a.versions[0].id,position:i}))}}})
  return NextResponse.json({installerId:installer.id,token,configHash,config,download:'Windows client endpoint is intentionally separate from this web API; it must validate the signed configuration before execution.'})
 }catch(e){return NextResponse.json({error:e instanceof z.ZodError?'Invalid installer request.':'Unable to create installer configuration.'},{status:400})}
}
