"use client";

import { useEffect, useRef, useState } from "react";
import { socket } from "./socket";

type ChatMessage = {
    sender: string;
    text: string;
    createdAt: Date;
    receiver?: string;
};



export default function Chat() {
    const [isConnected, setIsConnected] = useState(false);
    const [transport, setTransport] = useState("N/A");
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);


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
            sender: 'user',
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
        <div className="chat-container">
            {/* 新增消息展示区域 */}
            <div className="messages-area">
                {messages.map((msg, i) => (
                    <div key={i} className="message-bubble">
                        <div className="message-header">
                            <span>{msg.sender}</span>
                            <time>{msg.createdAt.toLocaleTimeString()}</time>
                        </div>
                        <p>{msg.text}</p>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* 新增输入区域 */}
            <div className="input-area">
                <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                        }
                    }}
                    placeholder="输入消息..."
                />
                <button onClick={handleSend}>发送</button>
            </div>

            {/* 原有状态显示 */}
            <p>Status: {isConnected ? "connected" : "disconnected"}</p>
            <p>Transport: {transport}</p>
        </div>
    );
}