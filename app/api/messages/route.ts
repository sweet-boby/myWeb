import { prisma } from '../../../lib/prisma';
import { NextResponse } from 'next/server';
// import { PrismaClient } from '@prisma/client';
// const prisma = new PrismaClient();

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
        const { sender, text, createdAt, receiver } = await request.json();

        // 验证必填字段
        if (!sender || !text || !createdAt) {
            return Response.json(
                { error: '缺少必要字段' },
                { status: 400 }
            );
        }

        const message = await prisma.massage.create({
            data: {
                sender,
                text,
                createdAt: new Date(createdAt),
                receiver: receiver || null
            }
        });

        return Response.json({
            ...message,
            createdAt: message.createdAt.toISOString() // 确保日期序列化
        });

    } catch (error) {
        console.error('数据库错误:', error);
        return Response.json(
            { status: 500 }
        );
    }
}