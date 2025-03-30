
import { auth } from '@/auth';
import Chat from './Chat';
import Sidebar from '@/components/Sidebar';

export default async function ProjectsPage() {
  const session = await auth()
  // if (!session?.user) return null

  return (
    <div className=" flex h-screen bg-gray-100">
      {/* 桌面端侧边栏 - 大屏幕显示，小屏幕隐藏 */}

      <Sidebar session={session} />
      <div className='flex-1 h-screen'>
        <Chat username={session?.user?.name} />
      </div>
    </div>
  );
}