

import Sidebar from '@/app/(sidebar)/Sidebar';
import { auth } from '@/auth';

export default async function SidebarLayout({
    children,
}: {
    children: React.ReactNode,
}) {
    const session = await auth();

    return (
        <div>
            <div className="flex">
                <Sidebar session={session} />
                {children}
            </div>
        </div>
    );
}