import { jsx, jsxs } from 'react/jsx-runtime';
import { zodResolver } from '@hookform/resolvers/zod';
import * as React from 'react';
import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from '@tanstack/react-router';
import { z } from 'zod';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { B as Button } from './button-CeG_45YZ.mjs';
import { C as Card, a as CardHeader, b as CardTitle, c as CardDescription, d as CardContent } from './card-CpiUQOxz.mjs';
import { I as Input } from './input-DTVPqQIJ.mjs';
import { L as Label } from './label-DtJL4vlD.mjs';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';
import { c as cn } from './utils-CZo72ztR.mjs';
import { u as useAuth } from './router-Dgt9epnn.mjs';
import { toast } from 'sonner';
import '@radix-ui/react-slot';
import 'class-variance-authority';
import '@radix-ui/react-label';
import 'clsx';
import 'tailwind-merge';
import 'react-helmet-async';
import '@tanstack/react-query';
import 'comlink';
import 'p-queue';
import '@supabase/supabase-js';
import 'next-themes';

const Checkbox = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  CheckboxPrimitive.Root,
  {
    ref,
    className: cn(
      "border-primary focus-visible:ring-ring data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground peer h-4 w-4 shrink-0 border shadow focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsx(
      CheckboxPrimitive.Indicator,
      {
        className: cn("flex items-center justify-center text-current"),
        children: /* @__PURE__ */ jsx(Check, { className: "h-4 w-4" })
      }
    )
  }
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;
const signUpSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
  termsAgreed: z.boolean().refine((val) => val === true, {
    message: "The licensing terms need to be accepted"
  })
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});
function SignUpPage() {
  const [error, setError] = useState(null);
  const [captchaToken, setCaptchaToken] = useState();
  const captcha = useRef(null);
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(signUpSchema)
  });
  const onSubmit = async (data) => {
    if (!captchaToken) {
      setError("Please complete the captcha");
      return;
    }
    try {
      await signUp(data.email, data.password, captchaToken);
      captcha.current?.resetCaptcha();
      toast.success("Account created successfully", {
        // description: "Please confirm your email address in order to login.",
        duration: Infinity,
        dismissible: true,
        action: {
          label: "Dismiss",
          onClick: () => toast.dismiss()
        }
      });
      setError(null);
      navigate("/");
    } catch (error2) {
      captcha.current?.resetCaptcha();
      let errorMessage = "An error occurred while creating your account";
      let toastDescription = "Please try again or contact support if the problem persists.";
      if (error2 instanceof Error) {
        const message = error2.message.toLowerCase();
        if (message.includes("user already registered") || message.includes("already registered")) {
          errorMessage = "Account already exists";
          toastDescription = "An account with this email already exists. Try signing in instead.";
        } else if (message.includes("invalid email")) {
          errorMessage = "Invalid email address";
          toastDescription = "Please enter a valid email address.";
        } else if (message.includes("password")) {
          errorMessage = "Password requirements not met";
          toastDescription = "Password must be at least 6 characters long.";
        } else if (message.includes("captcha")) {
          errorMessage = "Captcha verification failed";
          toastDescription = "Please complete the captcha verification again.";
        } else if (message.includes("rate limit")) {
          errorMessage = "Too many attempts";
          toastDescription = "Please wait a moment before trying again.";
        } else {
          errorMessage = error2.message;
        }
      }
      toast.error(errorMessage, {
        description: toastDescription,
        duration: 8e3,
        dismissible: true,
        action: errorMessage === "Account already exists" ? {
          label: "Sign In",
          onClick: () => navigate("/login")
        } : void 0
      });
      console.error("Sign up error:", error2);
    }
  };
  return /* @__PURE__ */ jsx("div", { className: "container flex h-[100vh] w-full items-center justify-center", children: /* @__PURE__ */ jsxs(Card, { className: "mx-auto w-full max-w-md", children: [
    /* @__PURE__ */ jsxs(CardHeader, { className: "space-y-1", children: [
      /* @__PURE__ */ jsx(CardTitle, { className: "text-2xl font-bold", children: "Create an account" }),
      /* @__PURE__ */ jsx(CardDescription, { children: "Enter your email below to create your account" })
    ] }),
    /* @__PURE__ */ jsxs(CardContent, { children: [
      /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "email", children: "Email" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "email",
              type: "email",
              placeholder: "gavin@entropretty.com",
              ...register("email")
            }
          ),
          errors.email?.message && /* @__PURE__ */ jsx("p", { className: "text-destructive text-sm", children: String(errors.email.message) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "password", children: "Password" }),
          /* @__PURE__ */ jsx(Input, { id: "password", type: "password", ...register("password") }),
          errors.password?.message && /* @__PURE__ */ jsx("p", { className: "text-destructive text-sm", children: String(errors.password.message) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "confirmPassword", children: "Confirm Password" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "confirmPassword",
              type: "password",
              ...register("confirmPassword")
            }
          ),
          errors.confirmPassword?.message && /* @__PURE__ */ jsx("p", { className: "text-destructive text-sm", children: String(errors.confirmPassword.message) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-start space-x-4", children: [
          /* @__PURE__ */ jsx(
            Checkbox,
            {
              id: "terms",
              className: "mt-1",
              onCheckedChange: (checked) => {
                register("termsAgreed").onChange({
                  target: { name: "termsAgreed", value: checked }
                });
              }
            }
          ),
          /* @__PURE__ */ jsxs(Label, { htmlFor: "terms", className: "text-sm", children: [
            "I agree to license my submitted code under",
            " ",
            /* @__PURE__ */ jsx(
              "a",
              {
                href: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
                target: "_blank",
                rel: "noopener noreferrer",
                className: "text-primary underline",
                children: "CC BY-NC-SA 4.0"
              }
            ),
            "."
          ] })
        ] }),
        errors.termsAgreed?.message && /* @__PURE__ */ jsx("p", { className: "text-destructive text-sm", children: String(errors.termsAgreed.message) }),
        /* @__PURE__ */ jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsx(
          HCaptcha,
          {
            ref: captcha,
            sitekey: "07c0e734-3642-4f8a-a830-89105772bc7e",
            onVerify: (token) => setCaptchaToken(token)
          }
        ) }),
        error && /* @__PURE__ */ jsx("div", { className: "text-destructive text-sm", children: error }),
        /* @__PURE__ */ jsx(Button, { type: "submit", className: "w-full", disabled: isSubmitting, children: "CREATE ACCOUNT" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-4 flex flex-col gap-4 text-center text-sm", children: [
        /* @__PURE__ */ jsx("div", { children: "Already have an account?" }),
        /* @__PURE__ */ jsx(Button, { variant: "ghost", onClick: () => navigate("/login"), children: "SIGN IN" })
      ] })
    ] })
  ] }) });
}
const SplitComponent = SignUpPage;

export { SplitComponent as component };
//# sourceMappingURL=signup-BOCgpWxl.mjs.map
