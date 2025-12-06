"use client";
import AuthForm from "@/components/Auth/AuthForm";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();
  return <AuthForm onClose={() => router.back()} />;
}
