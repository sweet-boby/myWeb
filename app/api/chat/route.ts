import { streamText, UIMessage } from 'ai';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';

const openrouter = createOpenRouter({
    apiKey: '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',
});


export async function POST(req: Request) {
    const { messages }: { messages: UIMessage[] } = await req.json();

    const result = streamText({
        model: openrouter('deepseek/deepseek-chat-v3-0324:free'),
        system: 'You are a helpful assistant.',
        messages,
    });

    return result.toDataStreamResponse();
}