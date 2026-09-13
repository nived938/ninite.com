import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import GitHub from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'
import { PrismaAdapter } from '@auth/prisma-adapter'
import bcrypt from 'bcryptjs'
import { db } from './db'

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: 'jwt' },
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(credentials) {
        const email = String(credentials?.email ?? '').toLowerCase().trim()
        const password = String(credentials?.password ?? '')
        if (!email || !password) return null
        const user = await db.user.findUnique({ where: { email } })
        if (!user?.passwordHash || !(await bcrypt.compare(password, user.passwordHash))) return null
        return { id: user.id, email: user.email, name: user.name, image: user.image, role: user.role }
      }
    }),
    ...(process.env.GITHUB_ID && process.env.GITHUB_SECRET ? [GitHub({ clientId: process.env.GITHUB_ID, clientSecret: process.env.GITHUB_SECRET })] : []),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? [Google({ clientId: process.env.GOOGLE_CLIENT_ID, clientSecret: process.env.GOOGLE_CLIENT_SECRET })] : [])
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = (user as { role?: string }).role
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string
        ;(session.user as { role?: string }).role = token.role as string
      }
      return session
    }
  }
})
