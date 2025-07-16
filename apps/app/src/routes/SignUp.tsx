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
import { Checkbox } from "@/components/ui/checkbox"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "sonner"

const signUpSchema = z
  .object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    termsAgreed: z.boolean().refine((val) => val === true, {
      message: "The licensing terms need to be accepted",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

type SignUpFormValues = z.infer<typeof signUpSchema>

export default function SignUpPage() {
  const [error, setError] = useState<string | null>(null)
  const [captchaToken, setCaptchaToken] = useState<string>()
  const captcha = useRef<HCaptcha>(null)
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
  })

  const onSubmit = async (data: SignUpFormValues) => {
    if (!captchaToken) {
      setError("Please complete the captcha")
      return
    }

    try {
      try {
        await signUp(data.email, data.password, captchaToken)
        captcha.current?.resetCaptcha()
        toast.success("Account created successfully", {
          // description: "Please confirm your email address in order to login.",
          duration: Infinity,
          dismissible: true,
          action: {
            label: "Dismiss",
            onClick: () => toast.dismiss(),
          },
        })
        setError(null)
        navigate("/")
      } catch (exception) {
        captcha.current?.resetCaptcha()
        toast.error("An error occurred")
        console.error(exception)
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred")
    }
  }

  return (
    <div className="container flex h-[100vh] w-full items-center justify-center">
      <Card className="mx-auto w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">
            Create an account
          </CardTitle>
          <CardDescription>
            Enter your email below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="gavin@entropretty.com"
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
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                {...register("confirmPassword")}
              />
              {errors.confirmPassword?.message && (
                <p className="text-destructive text-sm">
                  {String(errors.confirmPassword.message)}
                </p>
              )}
            </div>
            <div className="flex items-start space-x-4">
              <Checkbox
                id="terms"
                className="mt-1"
                onCheckedChange={(checked) => {
                  register("termsAgreed").onChange({
                    target: { name: "termsAgreed", value: checked },
                  })
                }}
              />
              <Label htmlFor="terms" className="text-sm">
                I agree to license my submitted code under{" "}
                <a
                  href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline"
                >
                  CC BY-NC-SA 4.0
                </a>
                .
              </Label>
            </div>
            {errors.termsAgreed?.message && (
              <p className="text-destructive text-sm">
                {String(errors.termsAgreed.message)}
              </p>
            )}
            <div className="flex justify-center">
              <HCaptcha
                ref={captcha}
                sitekey={"07c0e734-3642-4f8a-a830-89105772bc7e"}
                onVerify={(token) => setCaptchaToken(token)}
              />
            </div>
            {error && <div className="text-destructive text-sm">{error}</div>}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              CREATE ACCOUNT
            </Button>
          </form>
          <div className="mt-4 flex flex-col gap-4 text-center text-sm">
            <div>Already have an account?</div>
            <Button variant="ghost" onClick={() => navigate("/login")}>
              SIGN IN
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
