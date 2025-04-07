'use client'
import { SignOut } from '@/components/signout-button';
import Link from 'next/link';
import { Session } from 'next-auth';
import { useEffect, useState } from 'react';
import { title } from 'process';

interface SidebarProps {
    session: Session | null;
    titlePointer?: string;
}

interface Chat {
    id: number;
    title: string;
    chatId: string;
    createdAt: string;
    userId: number;
}

export default function Sidebar({ session, titlePointer }: SidebarProps) {
    const [chatData, setChatData] = useState<Chat[] | {}>([]);

    async function createChat(title: string) {
        try {
            const res = await fetch(`/api/chats`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: title,
                }),
            });
            const data = await res.json();
            if (data.error) {
                throw new Error(data.error);
            }
            setChatData(data);
        } catch (error) {
            console.error('Error creating chat:', error);
        }
    }

    async function fetchChat() {
        try {
            const res = await fetch(`/api/chats`);
            const data = await res.json();
            if (data.error) {
                // throw new Error(data.error);
                return;
            }
            setChatData(data);
        } catch (error) {
            console.error('Error fetching chat:', error);
            // alert('Error fetching chat: ' + error);
            setChatData([]);
        }
    }
    useEffect(() => {
        fetchChat();
        // console.log(chatData)
    }, [])


    // useEffect(() => {
    //     // fetchChat();
    //     // console.log(chatData)
    //     (chatData as Chat[]).forEach((chat: Chat) => {
    //         console.log(chat.title)
    //         console.log(chat.chatId)
    //     })
    // }, [chatData])

    return (
        <>
            <div className="hidden lg:block h-screen ">
                <SidebarPc session={session} chatData={chatData as Chat[]} titlePointer={titlePointer} />
            </div>
            <div className='lg:hidden block h-screen relative'>
                <SidebarMobile session={session} chatData={chatData as Chat[]} />
            </div>
        </>

    );
}

function SidebarPc({ session, chatData, titlePointer }: { session: Session | null, chatData: Chat[], titlePointer?: string }) {
    return (
        <div className=" w-64 bg-white  shadow-lg">
            <div className="p-4 flex flex-1 flex-col h-screen">
                <div className="flex flex-col items-center mb-6">
                    {/* <UserAvatar session={session} /> */}
                    <h2 className="mt-2 text-xl font-semibold">
                        {session?.user?.name || '访客'}
                    </h2>
                </div>

                <nav className="space-y-2">
                    <Link href="/" className="flex items-center p-2 text-gray-600 hover:bg-gray-100 rounded">
                        <span>首页</span>
                    </Link>
                    <Link href="/projects" className={`${titlePointer == 'projects' ? 'bg-gray-100' : ''} flex items-center p-2 text-gray-600 hover:bg-gray-100 rounded`}>
                        {/* {titlePointer} */}
                        <span>聊天室</span>
                    </Link>
                    {!session?.user && (
                        <Link href="/signin" className="flex items-center p-2 text-blue-500 hover:bg-gray-100 rounded">
                            <span>立即登录</span>
                        </Link>
                    )}
                </nav>

                <div className='flex-1 flex flex-col min-h-0'>
                    <div className="py-4 mt-4 border-t">
                        <Link href="/chat-ai">
                            <div className="flex items-center p-2 text-gray-600 hover:bg-gray-100 rounded" >
                                开启新的聊天
                            </div>
                        </Link>
                    </div>
                    <div className=" flex-1 overflow-hidden overflow-y-auto space-y-1 min-h-0">
                        {chatData?.map((chat: Chat) => {
                            return (
                                <Link href={`/chat-ai/${chat.chatId}`} key={chat.id} className={`${titlePointer == chat.chatId ? 'bg-gray-100' : ''}  flex items-center p-2 space-x-2 text-gray-600 hover:bg-gray-100 rounded`}>
                                    <span>{chat.title}</span>
                                </Link>
                            )
                        })}
                    </div>
                </div>
                <div className="pt-4 mt-4 border-t">
                    <SignOut />
                </div>
            </div>
        </div>
    )
}


function SidebarMobile({ session, chatData }: { session: Session | null, chatData: Chat[] | null }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* 汉堡菜单按钮 */}
            <button
                className="fixed top-3 left-4 z-50 p-2 rounded-md hover:bg-gray-100"
                onClick={() => setIsOpen(!isOpen)}
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>

            {/* 侧边栏遮罩层 */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black opacity-30 bg-opacity-50 z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* 侧边栏内容 */}
            <div className={`fixed top-0 left-0 w-64 h-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-4 h-full flex flex-col">
                    <div className="flex flex-col items-center mb-6">
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

                    <div className="flex-1 flex flex-col min-h-0 mt-4">
                        <div className="py-4 border-t">
                            <Link href="/chat-ai">
                                <div className="flex items-center p-2 text-gray-600 hover:bg-gray-100 rounded">
                                    开启新的聊天
                                </div>
                            </Link>
                        </div>
                        <div className="flex-1 overflow-hidden overflow-y-auto space-y-1 min-h-0">
                            {chatData?.map((chat: Chat) => {
                                return (
                                    <Link href={`/chat-ai/${chat.chatId}`} key={chat.id} className="flex items-center p-2 text-gray-600 hover:bg-gray-100 rounded">
                                        <span>{chat.title}</span>
                                    </Link>
                                )
                            })}
                        </div>
                    </div>

                    <div className="pt-4 mt-4 border-t">
                        <SignOut />
                    </div>
                </div>
            </div>
        </>
    )
}