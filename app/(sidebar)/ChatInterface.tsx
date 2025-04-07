'use client';

import { Message } from 'ai';
import { MemoizedMarkdown } from '@/components/memoized-markdown';
import { useEffect, useRef } from 'react';

interface ChatInterfaceProps {
    messages: Message[];
    input: string;
    handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    status: string;
    stop?: () => void;
    model: string;
    setModel: (model: string) => void;
}

export function ChatInterface({
    messages,
    input,
    handleInputChange,
    handleSubmit,
    status,
    stop,
    model,
    setModel
}: ChatInterfaceProps) {
    const inviewdiv = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (inviewdiv.current) {
            inviewdiv.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages])

    return (
        <div className='flex flex-col h-screen w-full bg-gray-50'>
            <div className='flex items-center px-6 py-4 border-b bg-white'>
                <h1 className='text-xl font-semibold text-gray-800'>对话</h1>
                <div className='ml-4 text-sm text-gray-500'>{status}</div>
            </div>

            <div className='flex-1 overflow-y-auto min-h-0 px-6 py-4 space-y-6 lg:max-w-4xl w-full no-visible-scrollbar mx-auto'>
                {messages.map((message, index) => (
                    <div key={`${message.id}-${index}`}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`px-4 py-2 ${message.role === 'user'
                            ? 'bg-blue-500 text-white rounded-br-none rounded-lg max-w-[70%]'
                            : ' text-gray-800 '
                            }`}>
                            {message.reasoning && (
                                <div className='text-red-400 text-sm mb-2 opacity-80'>
                                    <MemoizedMarkdown
                                        id={`${message.id}-content-${index}`}
                                        content={message.reasoning}
                                    />
                                </div>
                            )}
                            <div className='text-sm whitespace-pre-wrap'>
                                <MemoizedMarkdown
                                    id={`${message.id}-content-${index}`}
                                    content={message.content}
                                />
                            </div>
                        </div>
                    </div>
                ))}
                <div ref={inviewdiv}></div>
            </div>

            <div className='border-t p-4 bg-white'>
                <div className='max-w-4xl mx-auto flex flex-col gap-4'>
                    {(status === 'submitted' || status === 'streaming') && (
                        <div className='flex justify-end'>
                            <button
                                type="button"
                                onClick={stop}
                                className='px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded transition-colors'
                            >
                                停止生成
                            </button>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className='flex flex-col gap-3'>
                        <textarea
                            value={input}
                            onChange={handleInputChange}
                            disabled={status !== 'ready'}
                            className='w-full rounded-lg border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none'
                            rows={3}
                            placeholder='输入消息... (Enter 发送, Shift + Enter 换行)'
                        />
                        <div className='flex justify-between items-center'>
                            <div className='flex gap-2'>
                                <button
                                    type="button"
                                    onClick={() => setModel("deepseek/deepseek-chat-v3-0324:free")}
                                    className={`px-3 py-1 rounded text-sm ${model.includes('v3')
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'bg-gray-100'
                                        }`}
                                >
                                    v3
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setModel("deepseek/deepseek-r1:free")}
                                    className={`px-3 py-1 rounded text-sm ${model.includes('r1')
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'bg-gray-100'
                                        }`}
                                >
                                    r1
                                </button>
                            </div>
                            <button
                                type="submit"
                                disabled={status !== 'ready'}
                                className='px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center gap-2'
                            >
                                发送
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}