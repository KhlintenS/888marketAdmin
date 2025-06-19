import { useAuth } from "@/context/AuthContext";
import supabase from "../config/supabase";

export interface LoginCredentials {
  email: string;
  password: string;
}

export const loginUser = async ({ email, password }: LoginCredentials) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    const session = data.session;

    if (session) {
      const accessToken = session.access_token;
      const refreshToken = session.refresh_token;

      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("refresh_token", refreshToken);
      localStorage.setItem("user", JSON.stringify(data?.user));

      return session.user;
    }
  } catch (err: any) {
    console.error("Login error:", err.message);
    throw err;
  }
};

export const forgotPassword = async (email: string): Promise<void> => {
  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "https://yourdomain.com/update-password",
    });

    if (error) throw error;
  } catch (err: any) {
    console.error("Password reset error:", err.message);
    alert("Failed to send reset link: " + err.message);
  }
};
