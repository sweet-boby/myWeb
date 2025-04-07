'use client';

import Sidebar from '@/components/Sidebar';
import { useChat } from '@ai-sdk/react';
import { Session } from 'next-auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function PageLayout({ session }: { session: Session | null }) {
    const { messages, input, handleInputChange, handleSubmit, status, stop } =
        useChat({});
    // const [chatTitle, setchatTitle] = useState<string>('');
    const router = useRouter();
    async function createChat(title: string) {
        try {
            console.log('title:', title);
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
            console.log('data:', data);
            if (data.error) {
                if (data.error === '未授权') {
                    alert('请先登录');
                    router.push('/signin');
                    return;
                }
            }
            router.push(`/chat-ai/${data.chatId}`);
            // setChatData(data);
        } catch (error) {
            console.error('Error creating chat:', error);
        }
    }


    return (
        <>
            <div className='flex'>
                <Sidebar session={session}></Sidebar>
                <div className='flex-1'>
                    {messages.map(message => (
                        <div key={message.id}>
                            {message.role === 'user' ? 'User: ' : 'AI: '}
                            {message.content}
                        </div>
                    ))}

                    {(status === 'submitted' || status === 'streaming') && (
                        <div>
                            {status === 'submitted'}
                            <button type="button" onClick={() => stop()}>
                                Stop
                            </button>
                        </div>
                    )}

                    <form onSubmit={(e) => {
                        e.preventDefault();
                        createChat(input)
                    }}>
                        <input
                            name="prompt"
                            value={input}
                            onChange={handleInputChange}
                            disabled={status !== 'ready'}
                        />
                        <button type="submit">Submit</button>
                    </form>
                </div>

            </div>

        </>
    );
}