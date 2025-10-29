import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { useNavigate } from '@tanstack/react-router';
import { u as useAuth, s as supabase } from './router-Dgt9epnn.mjs';
import { u as useUserProfile } from './useUserProfile-j6YqCSWd.mjs';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { B as Button } from './button-CeG_45YZ.mjs';
import { I as Input } from './input-DTVPqQIJ.mjs';
import { L as Label } from './label-DtJL4vlD.mjs';
import 'react-helmet-async';
import 'react';
import 'comlink';
import 'p-queue';
import '@supabase/supabase-js';
import 'next-themes';
import '@radix-ui/react-slot';
import 'class-variance-authority';
import './utils-CZo72ztR.mjs';
import 'clsx';
import 'tailwind-merge';
import '@radix-ui/react-label';

const usernameSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters").max(20, "Username must be at most 20 characters").regex(
    /^[a-zA-Z0-9]+$/,
    "Username can only contain letters and numbers (no spaces or special characters)"
  ).transform((val) => val.toLowerCase())
});
function Username({ profile }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty }
  } = useForm({
    resolver: zodResolver(usernameSchema),
    defaultValues: {
      username: profile?.username || ""
    }
  });
  const updateUsername = useMutation({
    mutationFn: async (data) => {
      if (!user) throw new Error("Not authenticated");
      if (data.username !== profile?.username) {
        const { data: existingUser, error: checkError } = await supabase.from("profiles").select("username").eq("username", data.username.toLowerCase()).single();
        if (checkError && checkError.code !== "PGRST116") {
          throw checkError;
        }
        if (existingUser) {
          throw new Error("This username is already taken");
        }
      }
      const { error } = await supabase.from("profiles").upsert({
        username: data.username,
        updated_at: (/* @__PURE__ */ new Date()).toISOString(),
        user_id: user.id
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", user?.id] });
      toast.success("Username updated successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });
  const onSubmit = (data) => {
    updateUsername.mutate(data);
  };
  return /* @__PURE__ */ jsxs(
    "form",
    {
      onSubmit: handleSubmit(onSubmit),
      className: "flex w-full flex-col gap-4",
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "username", children: "Username" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "username",
              placeholder: "Enter your username",
              ...register("username"),
              className: errors.username ? "border-red-500" : ""
            }
          ),
          errors.username && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-500", children: errors.username.message }),
          !profile?.username ? /* @__PURE__ */ jsx("p", { className: "text-destructive text-xs", children: "A username is required in order to create Entropretty entries." }) : /* @__PURE__ */ jsxs("p", { className: "text-muted-foreground text-xs", children: [
            "Username can only be changed once per month.",
            profile?.updated_at && /* @__PURE__ */ jsxs(Fragment, { children: [
              " ",
              "Last changed on",
              " ",
              new Date(profile.updated_at).toLocaleDateString(),
              "."
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx(
          Button,
          {
            type: "submit",
            disabled: !isDirty || updateUsername.isPending,
            className: "w-fit",
            children: updateUsername.isPending ? "Saving..." : "Save Changes"
          }
        )
      ]
    }
  );
}
function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: profile, isLoading } = useUserProfile();
  if (!user) {
    navigate("/login");
    return null;
  }
  if (isLoading) {
    return /* @__PURE__ */ jsx("div", { className: "flex h-full w-full flex-col items-start gap-4 overflow-y-scroll p-4", children: /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("h3", { className: "text-md font-medium", children: "Loading..." }) }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "flex h-full w-full flex-col items-start gap-4 overflow-y-scroll p-4", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h3", { className: "text-md font-medium", children: "Profile" }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-xs", children: "This is how others will see you on the site." })
    ] }),
    /* @__PURE__ */ jsx(Username, { profile: profile || null })
  ] });
}
function ProfilePage() {
  return /* @__PURE__ */ jsx("div", { className: "flex w-full max-w-4xl flex-col gap-4 p-4", children: /* @__PURE__ */ jsx(Profile, {}) });
}
const SplitComponent = ProfilePage;

export { SplitComponent as component };
//# sourceMappingURL=profile-DOEiRG1U.mjs.map
