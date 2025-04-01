import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import * as chatService from '@/lib/chat-ai';

// 获取聊天的所有消息
export async function GET(
    request: Request,
    { params }: { params: { chatId: string } }
) {
    const session = await auth();

    if (!session?.user) {
        return NextResponse.json({ error: '未授权' }, { status: 401 });
    }

    try {
        const { chatId } = await params

        // 先检查是否是该用户的聊天
        const chat = await chatService.getChatWithMessages(chatId);

        if (!chat) {
            return NextResponse.json({ error: '聊天不存在' }, { status: 404 });
        }

        if (chat.userId !== session.user.userid) {
            return NextResponse.json({ error: '无权访问此聊天' }, { status: 403 });
        }

        const messages = await chatService.getChatMessages(chatId);
        return NextResponse.json(messages);
    } catch (error) {
        console.error('获取消息列表失败:', error);
        return NextResponse.json({ error: '获取消息列表失败' }, { status: 500 });
    }
}

// 创建新消息
export async function POST(
    request: Request,
    { params }: { params: { chatId: string } }
) {
    const session = await auth();

    if (!session?.user) {
        return NextResponse.json({ error: '未授权' }, { status: 401 });
    }

    try {
        const { chatId } = await params
        const { role, content } = await request.json();

        if (!role || !content) {
            return NextResponse.json({ error: '角色和内容不能为空' }, { status: 400 });
        }

        // 先检查是否是该用户的聊天
        const chat = await chatService.getChatWithMessages(chatId);

        if (!chat) {
            return NextResponse.json({ error: '聊天不存在' }, { status: 404 });
        }

        if (chat.userId !== session.user.userid) {
            return NextResponse.json({ error: '无权在此聊天中添加消息' }, { status: 403 });
        }

        const message = await chatService.createMessage(chatId, role, content);
        return NextResponse.json(message);
    } catch (error) {
        console.error('创建消息失败:', error);
        return NextResponse.json({ error: '创建消息失败' }, { status: 500 });
    }
}