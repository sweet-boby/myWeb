
import UserAvatar from '@/components/Userinfo';
import ChatRoom from './ChatRoom';
import { SignOut } from '@/components/signout-button';
import { auth } from '@/auth';
import Link from 'next/link';
import ChatRoomDemo from './ChatRoomDemo';
import Chat from './Chat';
export default async function ProjectsPage() {
  const session = await auth()
  // if (!session?.user) return null

  return (
    <div className="flex justify-center items-center  min-h-screen bg-gray-100">
      <Link href="/signup" className="text-blue-500 hover:underline">
        立即注册
      </Link>
      <UserAvatar />
      {/* <ChatRoom username={session?.user?.name} /> */}
      {/* <ChatRoomDemo username={session?.user?.name} /> */}
      <Chat />
      <SignOut />
    </div>
  );
}