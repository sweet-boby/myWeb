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
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) {
        token.guestId = user.id; // 将游客ID存入JWT
      }
      return token;
    },
    async session({ session, token }) {
      if (token.guestId) {
        session.user.id = token.guestId;
      }
      return session;
    }
  },
  // 设置会话有效期
  session: {
    maxAge: 7 * 24 * 60 * 60 // 7天
  }
});