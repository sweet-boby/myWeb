"use client"
import { signOut } from "next-auth/react"

export function SignOut() {
    return <button className="hover:bg-gray-100 text-red-500 p-2 w-full rounded " onClick={() => signOut()}>退出登录</button>
}