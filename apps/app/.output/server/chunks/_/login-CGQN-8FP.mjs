import { jsx, jsxs } from 'react/jsx-runtime';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from '@tanstack/react-router';
import { z } from 'zod';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { B as Button } from './button-CeG_45YZ.mjs';
import { C as Card, a as CardHeader, b as CardTitle, c as CardDescription, d as CardContent } from './card-CpiUQOxz.mjs';
import { I as Input } from './input-DTVPqQIJ.mjs';
import { L as Label } from './label-DtJL4vlD.mjs';
import { u as useAuth } from './router-Dgt9epnn.mjs';
import '@radix-ui/react-slot';
import 'class-variance-authority';
import './utils-CZo72ztR.mjs';
import 'clsx';
import 'tailwind-merge';
import '@radix-ui/react-label';
import 'react-helmet-async';
import '@tanstack/react-query';
import 'comlink';
import 'p-queue';
import '@supabase/supabase-js';
import 'next-themes';
import 'sonner';

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters")
});
function LoginPage() {
  const [error, setError] = useState(null);
  const [captchaToken, setCaptchaToken] = useState();
  const captcha = useRef(null);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(loginSchema)
  });
  const onSubmit = async (data) => {
    if (!captchaToken) {
      setError("Please complete the captcha");
      return;
    }
    try {
      await signIn(data.email, data.password, captchaToken);
      captcha.current?.resetCaptcha();
      setError(null);
      navigate("/");
    } catch (error2) {
      captcha.current?.resetCaptcha();
      setError(error2 instanceof Error ? error2.message : "An error occurred");
    }
  };
  return /* @__PURE__ */ jsx("div", { className: "container flex h-[100vh] w-full items-center justify-center", children: /* @__PURE__ */ jsxs(Card, { className: "mx-auto w-full max-w-md", children: [
    /* @__PURE__ */ jsxs(CardHeader, { className: "space-y-1", children: [
      /* @__PURE__ */ jsx(CardTitle, { className: "text-2xl font-bold", children: "Welcome back" }),
      /* @__PURE__ */ jsx(CardDescription, { children: "Enter your email below to login to your account" })
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
              placeholder: "m@example.com",
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
        error && /* @__PURE__ */ jsx("div", { className: "text-destructive text-sm", children: error }),
        /* @__PURE__ */ jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsx(
          HCaptcha,
          {
            ref: captcha,
            sitekey: "07c0e734-3642-4f8a-a830-89105772bc7e",
            onVerify: (token) => setCaptchaToken(token)
          }
        ) }),
        /* @__PURE__ */ jsx(Button, { type: "submit", className: "w-full", disabled: isSubmitting, children: "SIGN IN" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-4 flex flex-col gap-4 text-center text-sm", children: [
        /* @__PURE__ */ jsx("div", { children: "Don't have an account?" }),
        /* @__PURE__ */ jsx(Button, { variant: "ghost", onClick: () => navigate("/signup"), children: "CREATE ACCOUNT" })
      ] })
    ] })
  ] }) });
}
const SplitComponent = LoginPage;

export { SplitComponent as component };
//# sourceMappingURL=login-CGQN-8FP.mjs.map
