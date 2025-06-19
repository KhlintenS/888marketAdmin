"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import supabase from "@/lib/config/supabase"; // adjust the import to your config

export function useAuthBootstrap() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const { authenticated, setAuthenticated } = useAuth();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) throw error;

        const session = data.session;

        if (!session) {
          // console.log("there is no session");
          setAuthenticated(false);
          router.push("/login");
        } else {
          // Check if access token is expired
          // console.log("there is a session");
          const expiresAt = session.expires_at; // unix timestamp in seconds
          const now = Math.floor(Date.now() / 1000);

          if (expiresAt && expiresAt < now) {
            console.log("access token is expired use refresh token");
            // Access token expired, try to refresh
            const { data: refreshedData, error: refreshError } =
              await supabase.auth.refreshSession();

            if (refreshError || !refreshedData.session) {
              // console.log("refresh token is also expired");
              setAuthenticated(false);
              router.push("/login");
            } else {
              // console.log("user authenticated");
              setAuthenticated(true);
            }
          } else {
            // Access token valid
            // console.log("access token exists and user authenticated");
            setAuthenticated(true);
          }
        }
      } catch (err) {
        setAuthenticated(false);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [router, setAuthenticated]);

  return { loading, authenticated };
}
