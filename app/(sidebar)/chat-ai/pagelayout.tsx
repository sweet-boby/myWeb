'use client';

import { useChat } from '@ai-sdk/react';
import { Session } from 'next-auth';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ChatInterface } from '../ChatInterface';

export default function PageLayout({ session }: { session: Session | null }) {
    const [model, setModel] = useState('deepseek/deepseek-r1:free');
    const { messages, input, handleInputChange, handleSubmit, status, stop } =
        useChat({
            body: {
                model: model
            }
        });
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
            await router.push(`/chat-ai/${data.chatId}`);
            router.refresh();

            // 发布自定义事件，通知 Sidebar 更新聊天列表
            const chatUpdatedEvent = new CustomEvent('chatListUpdated');
            window.dispatchEvent(chatUpdatedEvent);
        } catch (error) {
            console.error('Error creating chat:', error);
        }
    }

    const handleChatSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        createChat(input);
    };

    return (
        <ChatInterface
            messages={messages}
            input={input}
            handleInputChange={handleInputChange}
            handleSubmit={handleChatSubmit}
            status={status}
            stop={stop}
            model={model}
            setModel={setModel}
        />
    );
}