import { signOut } from "@/auth"

export function SignOut() {
    return (
        <form
            action={async () => {
                "use server"
                await signOut()
            }}
        >
            {/* <div className="text-2xl flex justify-self-center items-center w-full text-wrap h-auto text-start">
                <p>
                    你好，
                    <span className=" px-2 text-blue-600 rounded-md">
                        Blues Lee
                    </span>
                </p>
            </div> */}
            <button type="submit">Sign Out</button>
        </form>
    )
}