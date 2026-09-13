import {PrismaClient} from '@prisma/client'
const db=new PrismaClient();const email=process.argv[2]?.toLowerCase();if(!email){console.error('Usage: npx tsx scripts/make-admin.ts you@example.com');process.exit(1)}const user=await db.user.update({where:{email},data:{role:'ADMIN'}});console.log(`Admin enabled for ${user.email}`);await db.$disconnect()
