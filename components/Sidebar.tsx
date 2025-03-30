'use client'
import UserAvatar from '@/components/Userinfo';
import { SignOut } from '@/components/signout-button';
import Link from 'next/link';
import { Session } from 'next-auth';

interface SidebarProps {
    session: Session | null;
}

export default function Sidebar({ session }: SidebarProps) {
    return (
        <>
            <div className="hidden lg:block h-screen ">
                <SidebarPc session={session} />
            </div>
        </>

    );
}

function SidebarPc({ session }: SidebarProps) {
    return (
        <div className="w-64 bg-white h-full shadow-lg">
            <div className="p-4">
                <div className="flex flex-col items-center mb-6">
                    <UserAvatar session={session} />
                    <h2 className="mt-2 text-xl font-semibold">
                        {session?.user?.name || '访客'}
                    </h2>
                </div>

                <nav className="space-y-2">
                    <Link href="/" className="flex items-center p-2 text-gray-600 hover:bg-gray-100 rounded">
                        <span>首页</span>
                    </Link>
                    <Link href="/projects" className="flex items-center p-2 text-gray-600 hover:bg-gray-100 rounded">
                        <span>项目</span>
                    </Link>
                    {!session?.user && (
                        <Link href="/signin" className="flex items-center p-2 text-blue-500 hover:bg-gray-100 rounded">
                            <span>立即登录</span>
                        </Link>
                    )}
                </nav>

                <div className="pt-4 mt-4 border-t">
                    <SignOut />
                </div>
            </div>
        </div>
    )
}

function SidebarMobile() {
    return (
        <></>
    )
}