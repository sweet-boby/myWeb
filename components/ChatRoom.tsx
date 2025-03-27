'use client';
import { useState, useEffect, useRef } from 'react';
import { Socket } from 'socket.io-client';

type ChatMessage = {
  sender: string;
  text: string;
  createdAt: Date;
  receiver?: string;
};

const useChatMessages = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

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

  return { messages, setMessages };
};

const useSocketConnection = () => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [socketId, setSocketId] = useState("user");

  useEffect(() => {
    let mounted = true;

    const initializeSocket = async () => {
      const { io } = await import('socket.io-client');
      const socket = io('http://localhost:4000', {
        auth: {
          token: localStorage.getItem('accessToken')
        }
      });

      socket.on('connect', () => {
        if (mounted && socket.id) {
          setSocketId(socket.id);
          setIsConnected(true);
        }
      });

      socket.on('disconnect', () => {
        if (mounted) setIsConnected(false);
      });

      socketRef.current = socket;
      return () => {
        socket.disconnect();
      };
    };

    initializeSocket();
    return () => {
      mounted = false;
    };
  }, []);

  return { socketRef, isConnected, socketId };
};

const MessageItem = ({
  msg,
  isCurrentUser
}: {
  msg: ChatMessage;
  isCurrentUser: boolean
}) => (
  <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
    <div
      className={`max-w-xs md:max-w-md lg:max-w-lg rounded-lg px-4 py-2 shadow-sm ${isCurrentUser
        ? 'bg-blue-500 text-white rounded-br-none'
        : msg.sender === 'system'
          ? 'bg-gray-200 text-gray-700 rounded-tl-none'
          : 'bg-white border border-gray-200 text-gray-700 rounded-tl-none'
        }`}
    >
      {!isCurrentUser && (
        <div className="font-medium mb-1 text-sm">
          {msg.sender === 'system' ? '系统消息' : msg.sender}
        </div>
      )}
      <div className="text-sm md:text-base">{msg.text}</div>
      <div className="text-xs opacity-70 mt-1 text-right">
        {msg.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
    </div>
  </div>
);

const MessageInput = ({
  value,
  onChange,
  onSend
}: {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    } else if (e.key === 'Enter' && e.shiftKey) {
      const cursorPosition = e.currentTarget.selectionStart;
      const newValue =
        value.substring(0, cursorPosition) +
        '\n' +
        value.substring(cursorPosition);
      onChange(newValue);
      e.preventDefault();

      const textarea = e.currentTarget;
      setTimeout(() => {
        if (textarea && document.contains(textarea)) {
          textarea.selectionStart = cursorPosition + 1;
          textarea.selectionEnd = cursorPosition + 1;
        }
      }, 0);
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="有问题，尽管问，shift+enter换行"
        className="w-full min-h-[100px] px-4 pt-4 resize-none outline-none"
      />
      <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {/* 工具栏按钮保持不变 */}
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={onSend}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
          >
            {/* 发送图标 */}
          </button>
        </div>
      </div>
    </div>
  );
};


export default function ChatRoom() {
  const { messages, setMessages } = useChatMessages();
  const { socketRef, isConnected, socketId } = useSocketConnection();
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const newMessage = {
      sender: socketRef.current?.id || 'user',
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
            <MessageItem
              key={`${msg.createdAt.getTime()}-${i}`}
              msg={msg}
              isCurrentUser={msg.sender === socketId}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 输入区域 */}
      <div className="w-full bg-white border-t py-4 px-4">
        <div className="flex flex-col max-w-3xl mx-auto w-full">
          <MessageInput
            value={inputValue}
            onChange={setInputValue}
            onSend={handleSend}
          />
        </div>
      </div>
    </div>
  );
}