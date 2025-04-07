import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import * as chatService from '@/lib/chat-ai';
import { streamText, UIMessage, appendResponseMessages } from 'ai';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { promises } from 'dns';

const openrouter = createOpenRouter({
    apiKey: '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',
});


// 获取聊天的所有消息
export async function GET(
    request: Request,
    { params }: { params: Promise<{ chatId: string }> }
): Promise<NextResponse> {
    const session = await auth();

    if (!session?.user) {
        return NextResponse.json({ error: '未授权' }, { status: 401 });
    }

    try {
        const { chatId } = await params

        // 先检查是否是该用户的聊天
        const chat = await chatService.getChatWithMessages(chatId);

        if (!chat) {
            return NextResponse.json({ error: '聊天不存在' }, { status: 404 });
        }

        if (chat.userId !== session.user.userid) {
            return NextResponse.json({ error: '无权访问此聊天' }, { status: 403 });
        }

        const messages = await chatService.getChatMessages(chatId);
        return NextResponse.json(messages);
    } catch (error) {
        console.error('获取消息列表失败:', error);
        return NextResponse.json({ error: '获取消息列表失败' }, { status: 500 });
    }
}

// 创建新消息
export async function POST(
    request: Request,
    { params }: { params: Promise<{ chatId: string }> }
) {
    const session = await auth();

    if (!session?.user) {
        return NextResponse.json({ error: '未授权' }, { status: 401 });
    }

    try {
        // const { chatId } = await params
        // const { role, content } = await request.json();
        const { messages, id, model }: { messages: UIMessage[], id: string, model: any } = await request.json();
        const { role, content } = messages[messages.length - 1];
        const { chatId } = await params;
        console.log(messages)
        // const { res } = await request.json()
        // console.log("res", res)
        if (!role || !content) {
            return NextResponse.json({ error: '角色和内容不能为空' }, { status: 400 });
        }

        // 先检查是否是该用户的聊天
        const chat = await chatService.getChatWithMessages(chatId);

        if (!chat) {
            return NextResponse.json({ error: '聊天不存在' }, { status: 404 });
        }

        if (chat.userId !== session.user.userid) {
            return NextResponse.json({ error: '无权在此聊天中添加消息' }, { status: 403 });
        }


        // console.log('messages', messages[messages.length - 1]);
        // const res = creatMessage(id, messages[messages.length - 1].role, messages[messages.length - 1].content)
        // console.log('res', res);

        const result = streamText({
            model: openrouter(model),
            system: 'You are a helpful assistant.需要些代码的时候用markdown代码块包裹',
            messages,
            async onFinish({ response }) {
                const message = await chatService.createMessage(chatId, role, content);
                // console.log('response', response.messages);
                let reasoning = '';
                let rescontent = '';

                // 检查 content 是否是数组
                if (Array.isArray(response.messages[0].content)) {
                    response.messages[0].content.forEach((item) => {
                        if (item.type == 'reasoning' && 'text' in item) {
                            reasoning = item.text;
                        } else if ('text' in item) {
                            rescontent = item.text;
                            // console.log(rescontent)
                        } else if ('file' in item) {
                            // 处理 FilePart 类型
                            // 例如：rescontent = `[File: ${item.file.name}]`;
                        }
                        // 可能需要处理其他类型
                    });
                } else {
                    // 如果 content 不是数组，直接使用它作为内容
                    rescontent = response.messages[0].content.toString();
                }

                const message2 = await chatService.createMessage(chatId, response.messages[0].role, rescontent, reasoning);
                //console.log('message', message2);
                // await appendResponseMessages(messages, response);
            }
        });

        return result.toDataStreamResponse({
            sendReasoning: true,
        });

        // const message = await chatService.createMessage(chatId, role, content);
        // return NextResponse.json(message);
    } catch (error) {
        console.error('创建消息失败:', error);
        return NextResponse.json({ error: '创建消息失败' }, { status: 500 });
    }
}