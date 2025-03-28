// app/users/route.ts
import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from 'bcryptjs';

export async function GET() {
    try {
        const users = await prisma.user.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json(users);
    } catch (error) {
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    try {
        const { name, role, account, password } = await req.json();
        
        // 新增：验证账号是否已存在
        const existingUser = await prisma.user.findUnique({
            where: { account }
        });
        if (existingUser) {
            return NextResponse.json(
                { error: 'AccountExists', message: '账号已存在' },
                { status: 400 }
            );
        }

        // 密码加密
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const user = await prisma.user.create({
            data: {
                name,
                role: role || 'user', // 默认角色
                account,
                password: hashedPassword
            }
        });
        
        return NextResponse.json({ 
            id: user.id,
            name: user.name,
            account: user.account
        });
        
    } catch (error) {
        return NextResponse.json(
            { error: 'CreateFailed', message: '用户创建失败' },
            { status: 500 }
        );
    }
}

