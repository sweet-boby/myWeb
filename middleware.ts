// // middleware.ts
// import { NextResponse } from 'next/server';
// import { auth } from './auth';

// export default auth((req: any) => {
//     const { nextUrl, cookies } = req;
//     const guestId = cookies.get('guest_id')?.value;

//     // 已登录或已有游客标识 → 允许访问
//     if (req.auth?.user || guestId) {
//         return NextResponse.next();
//     }

//     // 未登录且无游客标识 → 重定向到游客登录页
//     // return NextResponse.redirect(`${nextUrl.origin}/guest-login`);
//     return NextResponse.next();
// });

// export const config = { matcher: ['/projects/:path*'] };

export { auth as middleware } from "@/auth"

// export const config = {
//     runtime: 'nodejs' // 切换为 Node.js 环境
// }