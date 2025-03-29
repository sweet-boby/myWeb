'use client';
import { useState, useEffect, useRef } from 'react';
import { Socket } from 'socket.io-client';
import { socket } from "./socket";


type ChatMessage = {
    sender: string;
    text: string;
    createdAt: Date;
    receiver?: string;
};

export default function ChatRoom({ username = null }: { username?: string | null }) {
    const socketRef = useRef<Socket>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            sender: 'system',
            text: 'Welcome to the chat!',
            createdAt: new Date()
        },
        {
            sender: 'system',
            text: 'Type a message and press enter to send.',
            createdAt: new Date()
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);


    useEffect(() => {
        let mounted = true;
        const abortController = new AbortController();

        const fetchMessages = async () => {
            try {
                const response = await fetch('/api/messages', {
                    signal: abortController.signal,
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                    }
                });
                const data = await response.json();
                if (mounted) {
                    setMessages(data.map((msg: any) => ({
                        ...msg,
                        createdAt: new Date(msg.createdAt)
                    })));
                }
            } catch (error) {
                if (!abortController.signal.aborted) {
                    console.error('消息加载失败:', error);
                }
            }
        };

        fetchMessages();
        return () => {
            mounted = false;
            abortController.abort();
        };
    }, []);

    // 滚动到底部
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        let mounted = true;

        const initializeSocket = async () => {
            // const { io } = await import('socket.io-client');
            // const socket = io('http://localhost:4000');

            socket.on('connect', () => {
                if (mounted) setIsConnected(true);
            });

            socket.on('disconnect', () => {
                if (mounted) setIsConnected(false);
            });

            // 在文件顶部添加类型校验函数
            function isValidChatMessage(data: any): data is Omit<ChatMessage, 'createdAt'> & { createdAt: string | Date } {
                return typeof data === 'object' &&
                    'sender' in data &&
                    'text' in data &&
                    'createdAt' in data &&
                    (typeof data.createdAt === 'string' || data.createdAt instanceof Date);
            }

            // 修改socket消息处理部分
            socket.on('message', (raw: string) => {
                try {
                    const parsed = JSON.parse(raw);
                    if (!isValidChatMessage(parsed)) {
                        console.warn('Invalid message structure:', parsed);
                        return;
                    }

                    const message: ChatMessage = {
                        ...parsed,
                        createdAt: parsed.createdAt instanceof Date ?
                            parsed.createdAt :
                            new Date(parsed.createdAt)
                    };

                    setMessages(prev => [...prev, message]);
                } catch (e) {
                    console.error('Invalid message:', raw);
                }
            });

            socketRef.current = socket;
            return () => {
                socket.off("connect", () => setIsConnected(true));
                socket.off("disconnect");
                socket.off('message'); // 增加消息监听器的清理
                socket.disconnect();
            };
        };

        initializeSocket();
        return () => {
            mounted = false;
        };
    }, []);

    const handleSend = async () => {
        if (!inputValue.trim()) return;

        const newMessage = {
            sender: username || socketRef.current?.id || 'user',
            text: inputValue.trim(),
            createdAt: new Date(),
            receiver: undefined
        };

        try {
            socketRef.current?.emit('message', JSON.stringify(newMessage));

            const response = await fetch('/api/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    ...newMessage,
                    createdAt: newMessage.createdAt.toISOString()
                })
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.message ||
                    `请求失败: ${response.status} ${response.statusText}`);
            }

            setInputValue('');
            setMessages(prev => [...prev, {
                ...responseData,
                createdAt: new Date(responseData.createdAt)
            }]);

        } catch (error) {
            console.error('消息处理错误:', {
                error,
                time: new Date().toISOString()
            });
            alert(`发送失败: ${error instanceof Error ? error.message : String(error)}`);
        }
    };

    return (
        <div className="w-full flex flex-col h-screen bg-gray-50">
            {/* 标题栏 */}
            <div className="bg-white shadow-sm border-b px-6 py-3 flex items-center justify-between">
                <h1 className="text-xl font-semibold text-gray-800">聊天室</h1>
                <div className={`flex items-center ${isConnected ? 'text-green-500' : 'text-yellow-500'}`}>
                    <span className={`inline-block w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                    <span className="text-sm font-medium">{isConnected ? '已连接' : '连接中...'}</span>
                </div>
            </div>

            {/* 消息区域 */}
            <div className="flex-1 p-4 overflow-y-auto">
                <div className="max-w-3xl mx-auto space-y-4">
                    {messages.map((msg, i) => (
                        <div
                            key={`${msg.createdAt}-${i}`}
                            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-xs md:max-w-md lg:max-w-lg rounded-lg px-4 py-2 shadow-sm ${msg.sender === 'user'
                                    ? 'bg-blue-500 text-white rounded-br-none'
                                    : msg.sender === 'system'
                                        ? 'bg-gray-200 text-gray-700 rounded-tl-none'
                                        : 'bg-white border border-gray-200 text-gray-700 rounded-tl-none'
                                    }`}
                            >
                                {msg.sender !== 'user' && (
                                    <div className="font-medium mb-1 text-sm">
                                        {msg.sender === 'system' ? '系统消息' : msg.sender}
                                    </div>
                                )}
                                <div className="text-sm md:text-base">
                                    {msg.text}
                                </div>
                                <div className="text-xs opacity-70 mt-1 text-right">
                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* 输入区域 */}
            <div className="w-full bg-white border-t py-4 px-4">
                <div className="flex flex-col max-w-3xl mx-auto w-full">
                    <div className="border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                        <textarea
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend();
                                } else if (e.key === 'Enter' && e.shiftKey) {
                                    // 在光标位置插入换行符
                                    const cursorPosition = e.currentTarget.selectionStart;
                                    const newValue =
                                        inputValue.substring(0, cursorPosition) +
                                        '\n' +
                                        inputValue.substring(cursorPosition);
                                    setInputValue(newValue);

                                    // 防止默认的Enter行为
                                    e.preventDefault();

                                    // 保存当前元素的引用
                                    const textarea = e.currentTarget;

                                    // 在下一个事件循环中设置光标位置到换行符之后
                                    setTimeout(() => {
                                        if (textarea && document.contains(textarea)) {
                                            textarea.selectionStart = cursorPosition + 1;
                                            textarea.selectionEnd = cursorPosition + 1;
                                        }
                                    }, 0);
                                }
                            }}
                            placeholder="有问题，尽管问，shift+enter换行"
                            className="w-full min-h-[100px] px-4 pt-4 resize-none outline-none"
                        />

                        {/* 底部工具栏 */}
                        <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <div className="flex items-center space-x-1 rounded-md border border-gray-200 px-2 py-1">
                                    <span className="font-medium">DeepSeek</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                                        <polyline points="6 9 12 15 18 9"></polyline>
                                    </svg>
                                </div>

                                <div className="flex items-center space-x-1 rounded-md border border-green-200 text-green-600 px-2 py-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <path d="M12 16v-4"></path>
                                        <path d="M12 8h.01"></path>
                                    </svg>
                                    <span>深度思考(R1)</span>
                                </div>

                                <div className="flex items-center space-x-1 rounded-md border border-gray-200 px-2 py-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="11" cy="11" r="8"></circle>
                                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                    </svg>
                                    <span>联网搜索</span>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <button className="p-2 text-gray-500 hover:text-gray-700">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                        <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                        <polyline points="21 15 16 10 5 21"></polyline>
                                    </svg>
                                </button>

                                <button
                                    onClick={handleSend}
                                    className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700">
                                        <line x1="22" y1="2" x2="11" y2="13"></line>
                                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}