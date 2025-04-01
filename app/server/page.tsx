import { auth } from "@/auth"
import { generateId } from 'ai'
import { nanoid } from 'nanoid';
export default async function Page() {
    const session = await auth()
    if (!session) return <div>Not authenticated</div>
    const id = generateId()
    const nid = nanoid()
    return (
        <div>
            <div>
                {id}
            </div>

            {nid}
            <pre>{JSON.stringify(session, null, 2)}</pre>
        </div>
    )
}