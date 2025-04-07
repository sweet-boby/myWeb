
import { auth } from '@/auth';
import Chat from './Chat';
import Sidebar from '@/app/(sidebar)/Sidebar';

export default async function ProjectsPage() {
  const session = await auth()
  // if (!session?.user) return null

  return (
    // <div className=" flex h-screen bg-gray-100">
    //   <Sidebar session={session} titlePointer={'projects'} />
    <div className='flex-1 h-screen'>
      <Chat username={session?.user?.name} />
    </div>
    // </div>
  );
}