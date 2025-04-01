'use client';

import { useState, useEffect } from 'react';

interface Chat {
    id: number;
    chatId: string;
    title: string;
    createdAt: Date;
}

interface Message {
    id: number;
    chatId: string;
    role: string;
    content: string;
    createdAt: Date;
}

export default function TestAPI() {
    const [chats, setChats] = useState<Chat[]>([]);
    const [selectedChat, setSelectedChat] = useState<string>('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [newChatTitle, setNewChatTitle] = useState('');
    const [newMessage, setNewMessage] = useState('');

    // 获取聊天列表
    const fetchChats = async () => {
        try {
            const response = await fetch('/api/chats');
            const data = await response.json();
            setChats(data);
        } catch (error) {
            console.error('获取聊天列表失败:', error);
        }
    };

    // 创建新聊天
    const createNewChat = async () => {
        try {
            const response = await fetch('/api/chats', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title: newChatTitle }),
            });
            if (response.ok) {
                fetchChats();
                setNewChatTitle('');
            }
        } catch (error) {
            console.error('创建聊天失败:', error);
        }
    };

    // 获取聊天消息
    const fetchMessages = async (chatId: string) => {
        try {
            const response = await fetch(`/api/chats/${chatId}/messages`);
            const data = await response.json();
            setMessages(data);
        } catch (error) {
            console.error('获取消息失败:', error);
        }
    };

    // 发送新消息
    const sendMessage = async () => {
        if (!selectedChat) return;
        try {
            const response = await fetch(`/api/chats/${selectedChat}/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    role: 'user',
                    content: newMessage,
                }),
            });
            if (response.ok) {
                fetchMessages(selectedChat);
                setNewMessage('');
            }
        } catch (error) {
            console.error('发送消息失败:', error);
        }
    };

    // 删除聊天
    const deleteChat = async (chatId: string) => {
        try {
            const response = await fetch(`/api/chats/${chatId}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                fetchChats();
                if (selectedChat === chatId) {
                    setSelectedChat('');
                    setMessages([]);
                }
            }
        } catch (error) {
            console.error('删除聊天失败:', error);
        }
    };

    useEffect(() => {
        fetchChats();
    }, []);

    useEffect(() => {
        if (selectedChat) {
            fetchMessages(selectedChat);
        }
    }, [selectedChat]);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Chat API 测试页面</h1>

            {/* 创建新聊天 */}
            <div className="mb-4">
                <input
                    type="text"
                    value={newChatTitle}
                    onChange={(e) => setNewChatTitle(e.target.value)}
                    placeholder="输入聊天标题"
                    className="border p-2 mr-2"
                />
                <button
                    onClick={createNewChat}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    创建聊天
                </button>
            </div>

            {/* 聊天列表 */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <h2 className="text-xl font-bold mb-2">聊天列表</h2>
                    <div className="border rounded p-2">
                        {chats.map((chat) => (
                            <div
                                key={chat.chatId}
                                className="flex justify-between items-center p-2 hover:bg-gray-100"
                            >
                                <button
                                    onClick={() => setSelectedChat(chat.chatId)}
                                    className={`flex-1 text-left ${selectedChat === chat.chatId ? 'font-bold' : ''
                                        }`}
                                >
                                    {chat.title}
                                </button>
                                <button
                                    onClick={() => deleteChat(chat.chatId)}
                                    className="text-red-500"
                                >
                                    删除
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 消息列表 */}
                <div>
                    <h2 className="text-xl font-bold mb-2">消息列表</h2>
                    <div className="border rounded p-2 min-h-[300px]">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`p-2 mb-2 rounded ${message.role === 'user'
                                        ? 'bg-blue-100'
                                        : 'bg-gray-100'
                                    }`}
                            >
                                <div className="font-bold">
                                    {message.role === 'user' ? '用户' : 'AI'}
                                </div>
                                <div>{message.content}</div>
                            </div>
                        ))}
                    </div>

                    {/* 发送消息 */}
                    {selectedChat && (
                        <div className="mt-4">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="输入消息"
                                className="border p-2 mr-2"
                            />
                            <button
                                onClick={sendMessage}
                                className="bg-green-500 text-white px-4 py-2 rounded"
                            >
                                发送
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}