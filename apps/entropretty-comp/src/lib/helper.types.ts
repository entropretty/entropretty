import { Database } from "./database.types"

export type AlgorithmView = MakeNotNull<
  Database["public"]["Views"]["algorithms_with_user_profile"]["Row"]
>

type MakeNotNull<T> = {
  [K in keyof T]: NonNullable<T[K]>
}

export type Profile = Database["public"]["Tables"]["profiles"]["Row"]

export type Like = Database["public"]["Tables"]["likes"]["Row"]
