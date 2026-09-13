import {NextResponse} from 'next/server'
import {createHash,createHmac} from 'node:crypto'
import {db} from '@/lib/db'

export async function GET(req:Request,{params}:{params:Promise<{id:string}>}){
 const {id}=await params
 const token=new URL(req.url).searchParams.get('token')
 if(!token)return NextResponse.json({error:'Missing installer token.'},{status:401})
 const installer=await db.installer.findUnique({where:{id},include:{items:{include:{application:true,version:true},orderBy:{position:'asc'}}}})
 if(!installer||installer.token!==token)return NextResponse.json({error:'Installer manifest not found.'},{status:404})
 if(installer.expiresAt.getTime()<Date.now())return NextResponse.json({error:'Installer manifest expired.'},{status:410})
 const items=installer.items.map(item=>({position:item.position,appId:item.applicationId,name:item.application.name,publisher:item.application.publisherId,version:item.version.version,architecture:item.version.architecture,platform:item.version.platform,downloadUrl:item.version.downloadUrl,sha256:item.version.checksum,signature:item.version.signature,verified:item.version.verified}))
 const config={schemaVersion:1,product:'AppNest',installerId:installer.id,expiresAt:installer.expiresAt.toISOString(),items}
 const payload=JSON.stringify(config)
 const configHash=createHash('sha256').update(payload).digest('hex')
 if(configHash!==installer.configHash)return NextResponse.json({error:'Manifest integrity check failed.'},{status:500})
 const manifestSignature=process.env.INSTALLER_SIGNING_SECRET?createHmac('sha256',process.env.INSTALLER_SIGNING_SECRET).update(payload).digest('base64url'):null
 return NextResponse.json({config,configHash,manifestSignature})
}
