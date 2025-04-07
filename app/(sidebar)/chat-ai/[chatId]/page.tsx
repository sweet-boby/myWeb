import { RetryError } from 'ai';
import PageLayout from './pagelayout';
import { auth } from "@/auth"

// 添加 params 参数来获取动态路由值
export default async function Page({ params }: { params: Promise<{ chatId: string }> }) {
    const session = await auth();
    const { chatId } = await params;

    // const res = await fetch(`/api/chats/${chatId}`);
    // const data = await res.json();
    // if (data.error) return <div>loading</div>

    return (
        <>
            <PageLayout session={session} chatId={chatId} />
        </>
    );
}