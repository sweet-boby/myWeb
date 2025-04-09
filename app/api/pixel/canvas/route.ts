import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // 修改导入方式

// 获取画布数据
export async function GET() {
    try {
        let canvas = await prisma.sharedCanvas.findFirst({
            orderBy: {
                updatedAt: "desc"
            }
        });

        if (!canvas) {
            canvas = await prisma.sharedCanvas.create({
                data: {
                    imageData: '',
                }
            });
        }

        return NextResponse.json(canvas);
    } catch (error) {
        console.error('获取画布失败:', error); // 添加错误日志
        return NextResponse.json({ error: '获取失败' }, { status: 500 });
    }
}

// 保存画布数据
export async function POST(req: Request) {
    try {
        const { imageData } = await req.json();

        // let canvas = await prisma.sharedCanvas.findFirst();

        // if (canvas) {
        //     canvas = await prisma.sharedCanvas.update({
        //         where: { id: canvas.id },
        //         data: { imageData }
        //     });
        // } else {
        let canvas = await prisma.sharedCanvas.create({
            data: { imageData }
        });
        // }

        return NextResponse.json(canvas);
    } catch (error) {
        console.error('保存画布失败:', error); // 添加错误日志
        return NextResponse.json({ error: '保存失败' }, { status: 500 });
    }
}