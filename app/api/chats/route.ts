import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import * as chatService from '@/lib/chat-ai';

// 获取用户的所有聊天
export async function GET() {
    const session = await auth();

    if (!session?.user) {
        return NextResponse.json({ error: '未授权' }, { status: 401 });
    }

    try {
        const chats = await chatService.getUserChats(session.user.userid);
        return NextResponse.json(chats);
    } catch (error) {
        console.error('获取聊天列表失败:', error);
        return NextResponse.json({ error: '获取聊天列表失败' }, { status: 500 });
    }
}

// 创建新聊天
export async function POST(request: Request) {
    const session = await auth();

    if (!session?.user) {
        return NextResponse.json({ error: '未授权' }, { status: 401 });
    }
    // console.log("session", session)

    try {
        const { title } = await request.json();

        if (!title) {
            return NextResponse.json({ error: '标题不能为空' }, { status: 400 });
        }

        const chat = await chatService.createChat(session.user.userid, title);
        return NextResponse.json(chat);
    } catch (error) {
        console.error('创建聊天失败:', error);
        return NextResponse.json({ error: '创建聊天失败' }, { status: 500 });
    }
}