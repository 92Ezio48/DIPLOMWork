"use client";
import AuthForm from "@/components/Auth/AuthForm";
export default function RegisterPage() {
  return (
    <AuthForm
      mode="register"
      onClose={() => {
        /* редирект или router.push('/') */
      }}
    />
  );
}
