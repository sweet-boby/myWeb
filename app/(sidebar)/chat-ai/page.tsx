
import Sidebar from '@/app/(sidebar)/Sidebar';
import { useChat } from '@ai-sdk/react';
import PageLayout from './pagelayout';
import { auth } from "@/auth"

export default async function Page() {
    const session = await auth();

    return (
        <>
            <PageLayout session={session} />
        </>
    );
}