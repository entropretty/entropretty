import { zodResolver } from "@hookform/resolvers/zod"
import { useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router"
import { z } from "zod"
import HCaptcha from "@hcaptcha/react-hcaptcha"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/auth-context"

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [captchaToken, setCaptchaToken] = useState<string>()
  const captcha = useRef<HCaptcha>(null)
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormValues) => {
    if (!captchaToken) {
      setError("Please complete the captcha")
      return
    }

    try {
      await signIn(data.email, data.password, captchaToken)
      captcha.current?.resetCaptcha()
      setError(null)
      navigate("/")
    } catch (error) {
      captcha.current?.resetCaptcha()
      setError(error instanceof Error ? error.message : "An error occurred")
    }
  }

  return (
    <div className="container flex h-[100vh] w-full items-center justify-center">
      <Card className="mx-auto w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                {...register("email")}
              />
              {errors.email?.message && (
                <p className="text-destructive text-sm">
                  {String(errors.email.message)}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" {...register("password")} />
              {errors.password?.message && (
                <p className="text-destructive text-sm">
                  {String(errors.password.message)}
                </p>
              )}
            </div>
            {error && <div className="text-destructive text-sm">{error}</div>}
            <div className="flex justify-center">
              <HCaptcha
                ref={captcha}
                sitekey={"07c0e734-3642-4f8a-a830-89105772bc7e"}
                onVerify={(token) => setCaptchaToken(token)}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              SIGN IN
            </Button>
          </form>
          <div className="mt-4 flex flex-col gap-4 text-center text-sm">
            <div>Don't have an account?</div>
            <Button variant="ghost" onClick={() => navigate("/signup")}>
              CREATE ACCOUNT
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
