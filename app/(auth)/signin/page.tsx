'use client';
import { useRouter } from 'next/navigation';
import { loginAction } from './actions';
// import { signOut } from '@/auth'
import Link from 'next/link';

export default function SignInPage() {
    const router = useRouter();

    const handleSubmit = async (formData: FormData) => {
        try {
            const result = await loginAction(formData);
            console.log('登录结果:', result);
            if (result?.success) {
                alert('登录成功');
                router.push('/');
                router.refresh();  // 确保状态更新
            } else {
                // console.log('登录失败:', result?.error);
                alert('登录失败');
            }
            // router.push('/signin');
        } catch (error) {
            console.log('登录失败:', error);
            alert(`登录失败: ${(error as Error)}`);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <form
                action={handleSubmit}
                className="bg-white p-8 rounded shadow-md w-96"
            >
                <h2 className="text-2xl mb-6">登录</h2>

                <div className="mb-4">
                    <label className="block mb-2">账号</label>
                    <input
                        name="account"
                        type="text"
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <div className="mb-6">
                    <label className="block mb-2">密码</label>
                    <input
                        name="password"
                        type="password"
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 mb-4"
                >
                    登录
                </button>

                <div className="text-center text-sm text-gray-600">
                    没有账号？{' '}
                    <Link href="/signup" className="text-blue-500 hover:underline">
                        立即注册
                    </Link>
                </div>
            </form>
        </div>
    );
}