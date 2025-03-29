'use client';
import { useRouter } from 'next/navigation';
import { registerAction } from './actions';
import Link from 'next/link';

export default function SignUpPage() {
    const router = useRouter();

    const handleSubmit = async (formData: FormData) => {
        if (formData.get("password") !== formData.get("confirmPassword")) {
            alert("两次输入的密码不一致");
            return;
        }

        const result = await registerAction(formData);
        if (result?.success) {
            alert('注册成功，请登录');
            router.push('/signin');
        } else {
            alert(`注册失败: ${result?.message}`);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <form
                action={handleSubmit}
                className="bg-white p-8 rounded shadow-md w-96"
            >
                <h2 className="text-2xl mb-6">用户注册</h2>

                <div className="mb-4">
                    <label className="block mb-2">用户名</label>
                    <input
                        name="name"
                        type="text"
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-2">账号</label>
                    <input
                        name="account"
                        type="text"
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-2">密码</label>
                    <input
                        name="password"
                        type="password"
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <div className="mb-6">
                    <label className="block mb-2">确认密码</label>
                    <input
                        name="confirmPassword"
                        type="password"
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 mb-4"
                >
                    立即注册
                </button>

                <div className="text-center text-sm text-gray-600">
                    已有账号？{' '}
                    <Link href="/signin" className="text-blue-500 hover:underline">
                        去登录
                    </Link>
                </div>
            </form>
        </div>
    );
}