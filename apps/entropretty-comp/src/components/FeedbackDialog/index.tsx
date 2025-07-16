import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { Frown, Loader2, Meh, Smile } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"
import useMeasure from "react-use-measure"

const feedbackSchema = z.object({
  feedback: z.string().min(1, "Please provide some feedback"),
  sentiment: z.enum(["negative", "neutral", "positive"], {
    required_error: "Please select a sentiment",
  }),
})

type FeedbackForm = z.infer<typeof feedbackSchema>

const sentimentToNumber = {
  negative: -1,
  neutral: 0,
  positive: 1,
} as const

export function FeedbackDialog({ className }: { className?: string }) {
  const [open, setOpen] = useState(false)
  const { user } = useAuth()
  const form = useForm<FeedbackForm>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      sentiment: "neutral",
    },
  })

  const [elementRef, bounds] = useMeasure()

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        form.setFocus("feedback")
      }, 100)
    }
  }, [open, form])

  const submitFeedback = useMutation({
    mutationFn: async (data: FeedbackForm) => {
      if (!user) throw new Error("You must be logged in to submit feedback")

      const { error } = await supabase.from("feedback").insert({
        content: data.feedback,
        sentiment: sentimentToNumber[data.sentiment],
        user_id: user.id,
      })

      if (error) throw error
    },
    onSuccess: () => {
      toast.success("Thank you for your feedback!")
      form.reset()
      setOpen(false)
    },
    onError: (error: Error) => {
      toast.error(`Failed to submit feedback: ${error.message}`)
    },
  })

  const onSubmit = (data: FeedbackForm) => {
    submitFeedback.mutate(data)
  }

  return (
    <motion.div
      className={cn(
        "bg-secondary flex flex-col items-center justify-center transition-colors",
        className,
      )}
      animate={{ height: bounds.height, width: bounds.width }}
      transition={{
        type: "spring",
        duration: 0.5,
      }}
    >
      <AnimatePresence mode="wait">
        <div ref={elementRef}>
          {open && (
            <motion.div
              layout
              key="feedback_form"
              className="space-y-4 p-4 [box-shadow:4px_4px_0_0_rgba(0,0,0,0.5)]"
              exit={{ opacity: 0, filter: "blur(10px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              transition={{
                type: "spring",
                duration: open ? 0.8 : 0.8,
                bounce: 0.1,
              }}
              initial={{ opacity: 0, filter: "blur(10px)" }}
            >
              <div className="flex flex-col gap-2">
                <h4 className="text-lg font-semibold">Leave Feedback</h4>
                <p className="text-muted-foreground text-sm">
                  We'd love to hear what went well or how we can improve
                  entropretty.
                </p>
              </div>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="feedback"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            placeholder="Your feedback"
                            className="bg-background min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex items-center justify-between">
                    <FormField
                      control={form.control}
                      name="sentiment"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex gap-2">
                            {[
                              { value: "negative", icon: Frown },
                              { value: "neutral", icon: Meh },
                              { value: "positive", icon: Smile },
                            ].map(({ value, icon: Icon }) => (
                              <FormControl key={value}>
                                <Button
                                  type="button"
                                  variant={
                                    field.value === value ? "outline" : "ghost"
                                  }
                                  size="icon"
                                  className={cn(
                                    field.value === value && "border-primary",
                                  )}
                                  onClick={() => field.onChange(value)}
                                >
                                  <Icon className="h-4 w-4" />
                                </Button>
                              </FormControl>
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => setOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={submitFeedback.isPending}>
                        {submitFeedback.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          </>
                        ) : (
                          "Submit"
                        )}
                      </Button>
                    </div>
                  </div>
                </form>
              </Form>
            </motion.div>
          )}
          {!open && (
            <motion.div
              key="open_button"
              className="shadow-none"
              // className="p-4"
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(10px)" }}
              transition={{ type: "spring", duration: 0.1, bounce: 0.1 }}
              initial={{ opacity: 0, filter: "blur(10px)" }}
            >
              <Button
                variant={"secondary"}
                className="[box-shadow:4px_4px_0_0_rgba(0,0,0,0.5)]"
                onClick={() => setOpen(true)}
              >
                Feedback
              </Button>
            </motion.div>
          )}
        </div>
      </AnimatePresence>
    </motion.div>
  )
}
