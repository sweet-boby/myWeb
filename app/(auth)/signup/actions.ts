'use server';
import { NextResponse } from "next/server";

export async function registerAction(formData: FormData) {
    try {
        // 修正URL拼接方式
        const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
        const response = await fetch(`${baseUrl}/api/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: formData.get("name"),
                account: formData.get("account"),
                password: formData.get("password")
            })
        });

        const result = await response.json();

        if (response.ok) {
            return { success: true, message: '注册成功' };
        } else {
            return {
                error: result.error || '注册失败',
                message: result.message || '未知错误',
                success: false
            };
        }
    } catch (error) {
        console.error('注册失败:', error);
        return {
            error: 'ServerError',
            message: '服务器连接失败',
            success: false
        };
    }
}