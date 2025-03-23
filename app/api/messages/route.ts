import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const messages = await prisma.massage.findMany({
            orderBy: { createdAt: 'asc' },
            select: {
                sender: true,
                text: true,
                createdAt: true,
                receiver: true
            }
        });

        // 转换DateTime为ISO字符串
        const formatted = messages.map(msg => ({
            ...msg,
            createdAt: msg.createdAt.toISOString()
        }));

        return NextResponse.json(formatted);
    } catch (error) {
        return NextResponse.json(
            { error: '消息获取失败' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const { sender, text, receiver, createdAt } = await request.json();

        const message = await prisma.massage.create({
            data: {
                sender,
                text,
                receiver,
                createdAt: new Date(createdAt)
            }
        });

        return NextResponse.json(message);
    } catch (error) {
        return NextResponse.json(
            { error: '消息保存失败' },
            { status: 500 }
        );
    }
}