"use server";  
  
import { cookies } from "next/headers";  
  
interface LogoutResponse {  
  success: boolean;  
  error?: string;  
}  
  
export async function logout(): Promise<LogoutResponse> {  
  try {  
    const cookieStore = await cookies();
    // delete the payload-token from the session  
    cookieStore.delete("payload-token");  
  
    return { success: true }; 
  } catch (error) {  
    console.error("Logout error:", error);  
    return { success: false, error: "An error occurred during logout" };  
  }  
}