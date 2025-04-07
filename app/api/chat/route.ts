import { streamText, UIMessage, appendResponseMessages } from 'ai';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';

const openrouter = createOpenRouter({
    apiKey: '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',
});
const creatMessage = async (chatId: string, role: string, content: string) => {
    // 获取当前请求的 host
    const host = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const result = await fetch(`${host}/api/chats/${chatId}/messages`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            role,
            content
        })
    })
    const data = await result.json()
    console.log('data', data);
    return data
    //return result.json()
}


export async function POST(req: Request) {
    const { messages, id }: { messages: UIMessage[], id: string } = await req.json();

    console.log('messages', messages[messages.length - 1]);
    const res = creatMessage(id, messages[messages.length - 1].role, messages[messages.length - 1].content)
    console.log('res', res);

    const result = streamText({
        model: openrouter('deepseek/deepseek-chat-v3-0324:free'),
        system: 'You are a helpful assistant.',
        messages,
        async onFinish({ response }) {
        }
    });

    return result.toDataStreamResponse();
}