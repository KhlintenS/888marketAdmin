"use client";
import { useAuth } from "@/context/AuthContext";
import { loginUser } from "@/lib/api/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { set } from "react-hook-form";
import { toast } from "sonner";

export function useLogin() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { setAuthenticated, setCurrentUser, currentUser } = useAuth();

  const {
    mutate: login,
    isPending: isLogggingIn,
    isSuccess,
    isError,
    data,
    error,
  } = useMutation({
    mutationFn: loginUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["login"] });
      setAuthenticated(true);
      router.replace("/dashboard");
      toast.success("Logged in successfully");
    },
    onError: (err: any) => {
      toast.error("Incorrect credentials. Please try again.");
      // router.push("/login");
    },
  });

  return {
    login,
    isLogggingIn,
    isSuccess,
    isError,
    error,
    data,
    currentUser,
    setCurrentUser,
  };
}
