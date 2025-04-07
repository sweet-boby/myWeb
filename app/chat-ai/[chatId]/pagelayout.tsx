'use client';

import Sidebar from '@/components/Sidebar';
import { useChat } from '@ai-sdk/react';
// import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Session } from 'next-auth';
import { Message } from 'ai';
import { MemoizedMarkdown } from '@/components/memoized-markdown';

export default function PageLayout({ session, chatId }: { session: Session | null, chatId: string }) {
    const [model, setModel] = useState('deepseek/deepseek-chat-v3-0324:free')
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
                } else {
                    console.log('not firstMessage');
                    setChatData(formattedData);
                }


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
        };
        // console.log('chatId:', chatId);
        // console.log('chatData:', chatData);
    }, [chatId]);


    useEffect(() => {
        if ((chatData as any)?.error) {
            setIsVisible(false);
        } else {
            setIsVisible(true);
        }
    }, [chatData]);


    useEffect(() => {
        console.log('messages:', messages);
    }, [messages]);

    return (
        <>
            <div className='flex'>
                <Sidebar session={session} titlePointer={chatId as string} />
                <div>
                    {isVisible && (
                        <div>
                            <h1>{chatId}</h1>
                            {/* <h1>{messages ? JSON.stringify(messages, null, 2) : '加载中...'}</h1> */}
                            {messages.map(message => (
                                <div key={message.id}>
                                    {message.role === 'user' ? 'User: ' : 'AI: '}
                                    <div className=' text-wrap w-full text-red-400'>
                                        {message.reasoning}
                                    </div>
                                    <div>
                                        {/* {message.content} */}
                                        <MemoizedMarkdown id={message.id} content={message.content} />
                                    </div>

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

                            <form onSubmit={handleSubmit}>
                                <input
                                    name="prompt"
                                    value={input}
                                    onChange={handleInputChange}
                                    disabled={status !== 'ready'}
                                />
                                <button type="submit">Submit</button>
                                <span onClick={() => setModel("deepseek/deepseek-chat-v3-0324:free")}>
                                    v3
                                </span>
                                <span onClick={() => setModel("deepseek/deepseek-r1:free")} >r1</span>
                                <span>{model}</span>
                            </form>
                        </div>
                    )}
                </div>

            </div>

        </>
    );
}