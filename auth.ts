// auth.ts
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: 'Guest',
      credentials: {},
      async authorize() {
        // 返回一个临时用户对象
        return { id: crypto.randomUUID(), name: 'Guest' };
      },
    }),
  ],
  // 设置会话有效期
  session: {
    maxAge: 7 * 24 * 60 * 60 // 7天
  }
});