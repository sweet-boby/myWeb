
import UserAvatar from '@/components/UserAvatar';
import ChatRoom from '../../components/ChatRoom';
import { SignOut } from '@/components/signout-button';

export default function ProjectsPage() {
  return (
    <div className="flex justify-center items-center  min-h-screen bg-gray-100">
      <UserAvatar />
      <ChatRoom />
      <SignOut />
    </div>
  );
}