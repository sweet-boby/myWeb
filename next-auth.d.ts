import NextAuth from "next-auth"

declare module "next-auth" {
    interface User {
        id: int
        name?: string | null
        account: string
        role: string
    }

    interface Session {
        user: {
            id: int
            name?: string | null
            account: string
            role: string
        }
    }
}