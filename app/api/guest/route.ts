// app/api/guest/route.ts
import { NextResponse } from 'next/server';
// 错误提示表明 TypeScript 找不到 "uuid" 模块的类型声明文件，你可以通过以下命令安装类型声明文件：
// npm i --save-dev @types/uuid
// 如果你不想安装类型声明文件，也可以添加一个包含 `declare module 'uuid';` 的新声明(.d.ts)文件。
import { v4 as uuidv4 } from 'uuid';



export async function GET() {
    const guestId = uuidv4() // 生成唯一标识
    const response = NextResponse.json({ guestId });

    // 设置 Cookie（有效期 7 天）
    response.cookies.set('guest_id', guestId, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
        httpOnly: true,
    });

    return response;
}