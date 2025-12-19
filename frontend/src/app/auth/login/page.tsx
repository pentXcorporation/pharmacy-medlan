import { LoginForm } from "@/components/auth/login-form"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900">
      <div className="w-full px-4">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight">Pharmacy POS</h1>
          <p className="mt-2 text-muted-foreground">Management System</p>
        </div>
        <div className="flex justify-center">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
