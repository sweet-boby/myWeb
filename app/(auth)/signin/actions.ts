'use server';
import { signIn } from "@/auth";

export async function loginAction(formData: FormData) {
    const result = await signIn("credentials", {
      redirect: false,
      account: formData.get("account"),
      password: formData.get("password")
    });
  
    // 直接处理返回对象（无需 try/catch）
    if (result?.error === 'CredentialsSignin') {
      return { success: false, error: '账号或密码错误' };
    }
    if (result?.error) {
      return { success: false, error: `认证失败: ${result.error}` };
    }
    
    return { success: true };
  }