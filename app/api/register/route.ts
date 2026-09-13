import {NextResponse} from 'next/server'
import {z} from 'zod'
import bcrypt from 'bcryptjs'
import {db} from '@/lib/db'
const schema=z.object({name:z.string().trim().min(2).max(80),email:z.string().email(),password:z.string().min(10).max(128)})
export async function POST(req:Request){try{const b=schema.parse(await req.json());const email=b.email.toLowerCase();if(await db.user.findUnique({where:{email}}))return NextResponse.json({error:'An account already exists for this email.'},{status:409});const passwordHash=await bcrypt.hash(b.password,12);const user=await db.user.create({data:{name:b.name,email,passwordHash,settings:{create:{}}}});return NextResponse.json({id:user.id,email:user.email})}catch{return NextResponse.json({error:'Invalid registration details.'},{status:400})}}
