'use client'
import { Session } from 'next-auth';

interface UserAvatarProps {
    session: Session | null;
}

export default function UserAvatar({ session }: UserAvatarProps) {
    if (!session?.user) return null;

    return (
        <div>
            <div>
                {session.user.name}
            </div>
        </div>
    );
}