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
    const errorMessage = error instanceof Error 
        ? error.message 
        : '未知错误';
    console.log('action err', errorMessage);
    return { 
        error: errorMessage,
        success: false 
    };
  }

}