"use client";
import AuthForm from "@/components/Auth/AuthForm";
export default function LoginPage() {
  return (
    <AuthForm
      mode="login"
      onClose={() => {
        /* редирект или router.push('/') */
      }}
    />
  );
}
