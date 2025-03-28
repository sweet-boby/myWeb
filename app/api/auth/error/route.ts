import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams, href } = new URL(request.url);
    const error = searchParams.get('error');

    console.log('完整请求URL:', href);
    console.log('所有查询参数:', Object.fromEntries(searchParams.entries()));

    // 扩展错误消息映射
    const errorMessages: Record<string, string> = {
        'CredentialsSignin': '账号或密码错误',
        'UserNotFound': '用户不存在',
        'PasswordNotSet': '账户未设置密码',
        'InvalidPassword': '密码错误',
        'SessionCreationFailed': '会话创建失败',
        'authentication_failed': '认证失败',
        'Default': '系统错误，请稍后再试'
    };

    console.log(error)

    // 解析错误类型
    let errorType = error || 'Default';
    if (errorType.startsWith('Error:')) {
        errorType = errorType.replace('Error:', '');
    }

    return NextResponse.json({
        status: 'error',
        error: errorType,
        message: errorMessages[errorType] || errorMessages['Default'],
        timestamp: new Date().toISOString(),
        debug: process.env.NODE_ENV === 'development' ? error : undefined
    }, {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
    });
}