// app/guest-login/page.tsx
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function GuestLogin() {
    const router = useRouter();

    useEffect(() => {
        // 调用生成游客标识的 API
        fetch('/api/guest')
            .then(() => router.push('/projects'))
            .catch(console.error);
    }, []);

    return <div>正在创建临时账户...</div>;
}