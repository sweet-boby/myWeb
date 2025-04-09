import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const canvas = await prisma.sharedCanvas.findFirst({
            select: {
                updatedAt: true
            }
        });

        return NextResponse.json(canvas || { updatedAt: null });
    } catch (error) {
        console.error('获取时间戳失败:', error);
        return NextResponse.json({ error: '获取失败' }, { status: 500 });
    }
}