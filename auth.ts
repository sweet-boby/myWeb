import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
const prisma = new PrismaClient()

export const { handlers, signIn, signOut, auth } = NextAuth({

  debug: process.env.NODE_ENV === 'development',
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        account: { label: "账号", type: "text" },
        password: { label: "密码", type: "password" }
      },
      async authorize(credentials) {
        try {
          const user = await prisma.user.findUnique({
            where: { account: credentials.account as string }
          })

          if (!user) return null

          const isValid = await bcrypt.compare(
            credentials.password as string,
            user.password!
          )

          if (!isValid) return null

          console.log('认证成功:', JSON.stringify(user, null, 2))  // 使用JSON.stringify确保输出完整对象
          return {
            id: user.id.toString(),
            name: user.name,
            account: user.account,
            role: user.role
          }
        } catch (error) {
          console.error('认证错误:', error)
          return null
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.account = user.account
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role
        session.user.account = token.account
      }
      return session
    }
  },
  pages: {
    signIn: '/signin',
    error: '/signin'
  }
})