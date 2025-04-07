'use client';

import { Message, useChat } from '@ai-sdk/react';

export default function Chat({
    id,
    initialMessages,
}: { id?: string | undefined; initialMessages?: Message[] } = {}) {
    const { input, handleInputChange, handleSubmit, messages } = useChat({
        id, // use the provided chat ID
        initialMessages, // initial messages if provided
        sendExtraMessageFields: true, // send id and createdAt for each message
    });

    // simplified rendering code, extend as needed:
    return (
        <div>
            {messages.map(m => (
                <div key={m.id}>
                    {m.role === 'user' ? 'User: ' : 'AI: '}
                    {m.content}
                </div>
            ))}

            <form onSubmit={handleSubmit}>
                <input value={input} onChange={handleInputChange} />
            </form>
        </div>
    );
}