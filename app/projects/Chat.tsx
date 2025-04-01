"use client";

import { useEffect, useRef, useState } from "react";
import { socket } from "./socket";
import Link from 'next/link';

type ChatMessage = {
    sender: string;
    text: string;
    createdAt: Date;
    receiver?: string;
};

export default function Chat({ username = null }: { username?: string | null }) {
    const [isConnected, setIsConnected] = useState(false);
    const [transport, setTransport] = useState("N/A");
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    })

    // 新增获取历史消息
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await fetch('/api/messages', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                    }
                });
                const data = await response.json();
                setMessages(data.map((msg: any) => ({
                    ...msg,
                    createdAt: new Date(msg.createdAt)
                })));
            } catch (error) {
                console.error('消息加载失败:', error);
            }
        };

        fetchMessages();
    }, []);

    // 新增发送消息处理
    const handleSend = async () => {
        if (!inputValue.trim()) return;

        const newMessage = {
            sender: username || 'user',
            text: inputValue.trim(),
            createdAt: new Date(),
        };

        try {
            // 发送到服务器
            const response = await fetch('/api/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...newMessage,
                    createdAt: newMessage.createdAt.toISOString()
                })
            });

            if (!response.ok) throw new Error('发送失败');


            // 新增socket发送
            socket.emit('message', JSON.stringify({
                ...newMessage,
                createdAt: newMessage.createdAt.toISOString()
            }));

            // setMessages(prev => [...prev, newMessage]);
            setInputValue('');
        } catch (error) {
            console.error('发送错误:', error);
            alert('消息发送失败');
        }
    };

    useEffect(() => {
        if (socket.connected) {
            console.log("socket connected");
            onConnect();
        }

        function onConnect() {
            setIsConnected(true);
            setTransport(socket.io.engine.transport.name);

            socket.io.engine.on("upgrade", (transport) => {
                setTransport(transport.name);
            });
        }

        function onDisconnect() {
            setIsConnected(false);
            setTransport("N/A");
        }


        // 新增消息接收处理
        const onMessage = (raw: string) => {
            try {
                const data = JSON.parse(raw);
                setMessages(prev => [...prev, {
                    ...data,
                    createdAt: new Date(data.createdAt)
                }]);
            } catch (e) {
                console.error('消息解析失败:', raw);
            }
        };

        socket.on('message', onMessage);
        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);

        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
            socket.off('message', onMessage); // 增加消息监听器的清理
            socket.disconnect();
        };
    }, []);




    return (
        <div className="flex flex-col h-full bg-gray-50  shadow-lg overflow-hidden">
            {/* 头部状态栏 */}
            <div className="bg-white px-6 py-4 border-b flex items-center justify-between">
                <h1 className="text-xl font-semibold lg:m-0 ml-10 text-gray-800">实时对话</h1>
                <div className={`flex items-center ${isConnected ? 'text-green-500' : 'text-yellow-500'}`}>
                    <span className={`h-2 w-2 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                    <span className="text-sm">{isConnected ? '已连接' : '连接中...'}</span>
                </div>
            </div>

            {/* 消息列表区域 */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.sender === username ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] rounded-lg px-4 py-2 ${msg.sender === username
                            ? 'bg-blue-500 text-white rounded-br-none'
                            : 'bg-white shadow-sm text-gray-800 rounded-bl-none'
                            }`}>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-medium">{msg.sender}</span>
                                <span className="text-xs opacity-75">
                                    {msg.createdAt.toLocaleTimeString()}
                                </span>
                            </div>
                            <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* 输入区域 */}
            {username ? (
                <div className="bg-white border-t p-4">
                    <div className="max-w-4xl mx-auto flex flex-col gap-4">
                        <textarea
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend();
                                }
                            }}
                            placeholder="输入消息... (Enter 发送, Shift + Enter 换行)"
                            className="w-full rounded-lg border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            rows={3}
                        />
                        <div className="flex justify-between items-center">
                            <div className="flex gap-2">
                                <button className="text-gray-500 hover:text-gray-700 p-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                    </svg>
                                </button>
                                <button className="text-gray-500 hover:text-gray-700 p-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-7.536 5.879a1 1 0 001.415 0 3 3 0 014.242 0 1 1 0 001.415-1.415 5 5 0 00-7.072 0 1 1 0 000 1.415z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                            <button
                                onClick={handleSend}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                            >
                                <span>发送</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-white border-t p-8 text-center">
                    <div className="max-w-md mx-auto">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">登录后参与对话</h3>
                        <p className="text-gray-600 mb-4">登录后即可与其他用户进行实时对话交流</p>
                        <Link
                            href="/signin"
                            className="inline-block px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            立即登录
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}