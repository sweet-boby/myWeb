'use client';

import Sidebar from '@/app/(sidebar)/Sidebar';
import { useChat } from '@ai-sdk/react';
// import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Session } from 'next-auth';
import { Message } from 'ai';
import { MemoizedMarkdown } from '@/components/memoized-markdown';
import { Suspense } from 'react'
import { ChatInterface } from '../../ChatInterface';


export default function PageLayout({ session, chatId }: { session: Session | null, chatId: string }) {
    // 从 localStorage 获取上次使用的模型，如果没有则使用默认值
    const [model, setModel] = useState(() => {
        // 确保代码在客户端执行
        if (typeof window !== 'undefined') {
            return localStorage.getItem('selectedModel') || 'deepseek/deepseek-r1:free';
        }
        return 'deepseek/deepseek-r1:free';
    });

    // 当模型变化时，保存到 localStorage
    useEffect(() => {
        localStorage.setItem('selectedModel', model);
    }, [model]);

    const [chatData, setChatData] = useState<Message[] | undefined>(undefined);
    const [isVisible, setIsVisible] = useState(false);
    const { messages, input, handleInputChange, handleSubmit, status, stop, append } =
        useChat({
            api: `/api/chats/${chatId}/messages`,
            id: chatId,
            initialMessages: chatData,
            sendExtraMessageFields: true,
            body: {
                model: model
            }
        });
    // const { chatId } = useParams();


    useEffect(() => {


        async function firstMessage(title: string) {
            await append({
                id: chatId,
                role: 'user',
                content: title,
            }), {
                model: model
            }
        }

        async function fetchChat() {
            try {
                const res = await fetch(`/api/chats/${chatId}`);
                const data = await res.json();
                console.log('data', data)
                if (data.error) {
                    setIsVisible(false)
                } else {
                    setIsVisible(true)
                }
                const formattedData = Array.isArray(data.ChatWithAIMessage) ? data.ChatWithAIMessage.map((msg: any) => ({
                    id: msg.id, // 确保每条消息都有 id
                    content: msg.content || '',
                    reasoning: msg.reasoning || '',
                    role: msg.role || 'assistant',
                    createdAt: msg.createdAt || new Date().toISOString(),
                })) : [];

                // console.log('chatData', chatData)
                if (formattedData.length === 0) {
                    console.log('firstMessage');
                    await firstMessage(data.title);
                }

                // console.log('not firstMessage');
                setChatData(formattedData);



            } catch (error) {
                console.error('获取聊天数据失败:', error);
            }
        }

        if (chatId) {
            fetchChat();
        }

        return () => {
            // 在这里执行清理操作
            // 例如，取消订阅、清除定时器等
            if (status === 'submitted' || status === 'streaming') {
                stop()
            }
        };
        // console.log('chatId:', chatId);
        // console.log('chatData:', chatData);
    }, [chatId]);


    // useEffect(() => {
    //     if ((chatData as any)?.error) {
    //         setIsVisible(false);
    //     } else {
    //         setIsVisible(true);
    //     }
    // }, [chatData]);


    // useEffect(() => {
    //     console.log('messages:', messages);
    // }, [messages]);


    return (
        <>
            {/* <div className=''> */}
            {/* <Sidebar session={session} titlePointer={chatId as string} /> */}
            <Suspense fallback={<Loading />}>
                {isVisible && (
                    <ChatInterface
                        messages={messages}
                        input={input}
                        handleInputChange={handleInputChange}
                        handleSubmit={handleSubmit}
                        status={status}
                        stop={stop}
                        model={model}
                        setModel={setModel}
                    />
                )}
            </Suspense>
            {/* </div> */}
        </>
    );
}

function Loading() {
    return <div>
        loading ...
    </div>
}