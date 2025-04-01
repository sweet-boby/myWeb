import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import * as chatService from '@/lib/chat-ai';

// 获取单个聊天及其消息
export async function GET(
    request: Request,
    { params }: { params: { chatId: string } }
) {
    const session = await auth();

    if (!session?.user) {
        return NextResponse.json({ error: '未授权' }, { status: 401 });
    }

    try {
        const { chatId } = await params;
        const chat = await chatService.getChatWithMessages(chatId);

        if (!chat) {
            return NextResponse.json({ error: '聊天不存在' }, { status: 404 });
        }

        // 检查是否是该用户的聊天
        if (chat.userId !== session.user.userid) {
            return NextResponse.json({ error: '无权访问此聊天' }, { status: 403 });
        }

        return NextResponse.json(chat);
    } catch (error) {
        console.error('获取聊天详情失败:', error);
        return NextResponse.json({ error: '获取聊天详情失败' }, { status: 500 });
    }
}

// 更新聊天标题
export async function PATCH(
    request: Request,
    { params }: { params: { chatId: string } }
) {
    const session = await auth();

    if (!session?.user) {
        return NextResponse.json({ error: '未授权' }, { status: 401 });
    }

    try {
        const { chatId } = await params
        const { title } = await request.json();

        if (!title) {
            return NextResponse.json({ error: '标题不能为空' }, { status: 400 });
        }

        // 先检查是否是该用户的聊天
        const chat = await chatService.getChatWithMessages(chatId);

        if (!chat) {
            return NextResponse.json({ error: '聊天不存在' }, { status: 404 });
        }

        if (chat.userId !== session.user.userid) {
            return NextResponse.json({ error: '无权修改此聊天' }, { status: 403 });
        }

        const updatedChat = await chatService.updateChatTitle(chatId, title);
        return NextResponse.json(updatedChat);
    } catch (error) {
        console.error('更新聊天标题失败:', error);
        return NextResponse.json({ error: '更新聊天标题失败' }, { status: 500 });
    }
}

// 删除聊天
export async function DELETE(
    request: Request,
    { params }: { params: { chatId: string } }
) {
    const session = await auth();

    if (!session?.user) {
        return NextResponse.json({ error: '未授权' }, { status: 401 });
    }

    try {
        const { chatId } = await params;

        // 先检查是否是该用户的聊天
        const chat = await chatService.getChatWithMessages(chatId);

        if (!chat) {
            return NextResponse.json({ error: '聊天不存在' }, { status: 404 });
        }

        if (chat.userId !== session.user.userid) {
            return NextResponse.json({ error: '无权删除此聊天' }, { status: 403 });
        }

        await chatService.deleteChat(chatId);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('删除聊天失败:', error);
        return NextResponse.json({ error: '删除聊天失败' }, { status: 500 });
    }
}