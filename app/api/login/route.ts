import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
    try {
        const { account, password } = await req.json();

        // 1. 查找用户
        const user = await prisma.user.findUnique({
            where: { account }
        });

        if (!user) {
            return NextResponse.json(
                { error: 'UserNotFound', message: '用户不存在' },
                { status: 401 }
            );
        }

        // 2. 验证密码
        const passwordValid = await bcrypt.compare(password, user.password!);
        if (!passwordValid) {
            return NextResponse.json(
                { error: 'InvalidPassword', message: '密码错误' },
                { status: 401 }
            );
        }

        // 3. 返回用户数据 (不含密码)
        // 修改成功返回部分
        return NextResponse.json({
            success: true,
            message: '登录成功',
            user: {
                id: user.id,
                name: user.name,
                account: user.account,
                role: user.role
            }
        });

    } catch (error) {
        return NextResponse.json(
            { error: 'ServerError', message: '服务器错误' },
            { status: 500 }
        );
    }
}