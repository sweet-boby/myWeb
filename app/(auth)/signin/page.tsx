'use client';
import { useRouter } from 'next/navigation';
import { loginAction } from './actions';
import { SignOut } from './signout-button'
// import { signOut } from '@/auth'
export default function SignInPage() {
    const router = useRouter();

    const handleSubmit = async (formData: FormData) => {
        try {
            const result = await loginAction(formData);
            console.log(result);
            if (result?.error) {
                // alert(result.error);
                return;  // 不再抛出错误，直接返回
            }

            if (result?.success) {
                router.push('/');
                router.refresh();  // 确保状态更新
            }
            router.push('/signin');
        } catch (error) {
            alert(`登录失败: ${(error as Error).message}`);
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
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                >
                    登录
                </button>
            </form>
            <SignOut />
        </div>
    );
}