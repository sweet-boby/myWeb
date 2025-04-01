'use client';

import { useChat } from '@ai-sdk/react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Page() {
    const { messages, input, handleInputChange, handleSubmit, status, stop } =
        useChat({});
    const { chatId } = useParams();
    const [chatData, setChatData] = useState(null);
    const [isVisible, setIsVisible] = useState(false);


    useEffect(() => {
        async function fetchChat() {
            try {
                const res = await fetch(`/api/chats/${chatId}`);
                const data = await res.json();
                setChatData(data);
            } catch (error) {
                console.error('获取聊天数据失败:', error);
            }
        }

        if (chatId) {
            fetchChat();
        }

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


    return (
        <>
            {isVisible && (
                <div>
                    <h1>{chatId}</h1>
                    <h1>{chatData ? JSON.stringify(chatData) : '加载中...'}</h1>
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

                    <form onSubmit={handleSubmit}>
                        <input
                            name="prompt"
                            value={input}
                            onChange={handleInputChange}
                            disabled={status !== 'ready'}
                        />
                        <button type="submit">Submit</button>
                    </form>
                </div>
            )}
        </>
    );
}