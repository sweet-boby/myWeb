
import UserAvatar from '@/components/Userinfo';
import ChatRoom from './ChatRoom';
import { SignOut } from '@/components/signout-button';
import { auth } from '@/auth';
export default async function ProjectsPage() {
  const session = await auth()
  // if (!session?.user) return null

  return (
    <div className="flex justify-center items-center  min-h-screen bg-gray-100">
      <UserAvatar />
      <ChatRoom username={session?.user?.name} />
      <SignOut />
    </div>
  );
}