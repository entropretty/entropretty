import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase"
import { Profile } from "@/lib/helper.types"

const usernameSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters")
    .regex(
      /^[a-zA-Z0-9]+$/,
      "Username can only contain letters and numbers (no spaces or special characters)",
    )
    .transform((val) => val.toLowerCase()),
})

type UsernameFormValues = z.infer<typeof usernameSchema>

interface UsernameProps {
  profile: Profile | null
}

export function Username({ profile }: UsernameProps) {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<UsernameFormValues>({
    resolver: zodResolver(usernameSchema),
    defaultValues: {
      username: profile?.username || "",
    },
  })

  const updateUsername = useMutation({
    mutationFn: async (data: UsernameFormValues) => {
      if (!user) throw new Error("Not authenticated")

      // Check if username is available (if it's different from current)
      if (data.username !== profile?.username) {
        const { data: existingUser, error: checkError } = await supabase
          .from("profiles")
          .select("username")
          .eq("username", data.username.toLowerCase())
          .single()

        if (checkError && checkError.code !== "PGRST116") {
          throw checkError
        }

        if (existingUser) {
          throw new Error("This username is already taken")
        }
      }

      const { error } = await supabase.from("profiles").upsert({
        username: data.username,
        updated_at: new Date().toISOString(),
        user_id: user.id,
      })

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", user?.id] })
      toast.success("Username updated successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  const onSubmit = (data: UsernameFormValues) => {
    updateUsername.mutate(data)
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full flex-col gap-4"
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          placeholder="Enter your username"
          {...register("username")}
          className={errors.username ? "border-red-500" : ""}
        />
        {errors.username && (
          <p className="text-sm text-red-500">{errors.username.message}</p>
        )}
        {!profile?.username ? (
          <p className="text-destructive text-xs">
            A username is required in order to create Entropretty entries.
          </p>
        ) : (
          <p className="text-muted-foreground text-xs">
            Username can only be changed once per month.
            {profile?.updated_at && (
              <>
                {" "}
                Last changed on{" "}
                {new Date(profile.updated_at).toLocaleDateString()}.
              </>
            )}
          </p>
        )}
      </div>

      <Button
        type="submit"
        disabled={!isDirty || updateUsername.isPending}
        className="w-fit"
      >
        {updateUsername.isPending ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  )
}
