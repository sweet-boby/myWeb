'use server';
import { signIn } from "@/auth";

export async function loginAction(formData: FormData) {
  try{
      const result = await signIn("credentials", {
        redirect: false,
        account: formData.get("account"),
        password: formData.get("password")
      });
      return { success: true ,error:null};
  }catch(error){
    console.log('action err',error.cause.err.message)
    return { 
      error: error instanceof Error ? error.cause : '未知错误',
      success: false 
    };
  }

}