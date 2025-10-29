import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { B as Button } from './button-CeG_45YZ.mjs';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { useForm, FormProvider, Controller, useFormContext } from 'react-hook-form';
import { c as cn } from './utils-CZo72ztR.mjs';
import { L as Label } from './label-DtJL4vlD.mjs';
import { u as useAuth, s as supabase } from './router-Dgt9epnn.mjs';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Frown, Meh, Smile, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import * as z from 'zod';
import useMeasure from 'react-use-measure';

const Form = FormProvider;
const FormFieldContext = React.createContext(
  {}
);
const FormField = ({
  ...props
}) => {
  return /* @__PURE__ */ jsx(FormFieldContext.Provider, { value: { name: props.name }, children: /* @__PURE__ */ jsx(Controller, { ...props }) });
};
const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();
  const fieldState = getFieldState(fieldContext.name, formState);
  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }
  const { id } = itemContext;
  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState
  };
};
const FormItemContext = React.createContext(
  {}
);
const FormItem = React.forwardRef(({ className, ...props }, ref) => {
  const id = React.useId();
  return /* @__PURE__ */ jsx(FormItemContext.Provider, { value: { id }, children: /* @__PURE__ */ jsx("div", { ref, className: cn("space-y-2", className), ...props }) });
});
FormItem.displayName = "FormItem";
const FormLabel = React.forwardRef(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField();
  return /* @__PURE__ */ jsx(
    Label,
    {
      ref,
      className: cn(error && "text-destructive", className),
      htmlFor: formItemId,
      ...props
    }
  );
});
FormLabel.displayName = "FormLabel";
const FormControl = React.forwardRef(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField();
  return /* @__PURE__ */ jsx(
    Slot,
    {
      ref,
      id: formItemId,
      "aria-describedby": !error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`,
      "aria-invalid": !!error,
      ...props
    }
  );
});
FormControl.displayName = "FormControl";
const FormDescription = React.forwardRef(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField();
  return /* @__PURE__ */ jsx(
    "p",
    {
      ref,
      id: formDescriptionId,
      className: cn("text-[0.8rem] text-muted-foreground", className),
      ...props
    }
  );
});
FormDescription.displayName = "FormDescription";
const FormMessage = React.forwardRef(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error?.message) : children;
  if (!body) {
    return null;
  }
  return /* @__PURE__ */ jsx(
    "p",
    {
      ref,
      id: formMessageId,
      className: cn("text-[0.8rem] font-medium text-destructive", className),
      ...props,
      children: body
    }
  );
});
FormMessage.displayName = "FormMessage";
const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsx(
    "textarea",
    {
      className: cn(
        "border-input placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[60px] w-full border bg-transparent px-3 py-2 text-base shadow-sm focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      ),
      ref,
      ...props
    }
  );
});
Textarea.displayName = "Textarea";
const feedbackSchema = z.object({
  feedback: z.string().min(1, "Please provide some feedback"),
  sentiment: z.enum(["negative", "neutral", "positive"], {
    required_error: "Please select a sentiment"
  })
});
const sentimentToNumber = {
  negative: -1,
  neutral: 0,
  positive: 1
};
function FeedbackDialog({ className }) {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const form = useForm({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      sentiment: "neutral"
    }
  });
  const [elementRef, bounds] = useMeasure();
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        form.setFocus("feedback");
      }, 100);
    }
  }, [open, form]);
  const submitFeedback = useMutation({
    mutationFn: async (data) => {
      if (!user) throw new Error("You must be logged in to submit feedback");
      const { error } = await supabase.from("feedback").insert({
        content: data.feedback,
        sentiment: sentimentToNumber[data.sentiment],
        user_id: user.id
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Thank you for your feedback!");
      form.reset();
      setOpen(false);
    },
    onError: (error) => {
      toast.error(`Failed to submit feedback: ${error.message}`);
    }
  });
  const onSubmit = (data) => {
    submitFeedback.mutate(data);
  };
  return /* @__PURE__ */ jsx(
    motion.div,
    {
      className: cn(
        "bg-secondary flex flex-col items-center justify-center transition-colors",
        className
      ),
      animate: { height: bounds.height, width: bounds.width },
      transition: {
        type: "spring",
        duration: 0.5
      },
      children: /* @__PURE__ */ jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxs("div", { ref: elementRef, children: [
        open && /* @__PURE__ */ jsxs(
          motion.div,
          {
            layout: true,
            className: "space-y-4 p-4 [box-shadow:4px_4px_0_0_rgba(0,0,0,0.5)] dark:[box-shadow:4px_4px_0_0_rgba(255,255,255,0.5)]",
            exit: { opacity: 0, filter: "blur(10px)" },
            animate: { opacity: 1, filter: "blur(0px)" },
            transition: {
              type: "spring",
              duration: open ? 0.8 : 0.8,
              bounce: 0.1
            },
            initial: { opacity: 0, filter: "blur(10px)" },
            children: [
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
                /* @__PURE__ */ jsx("h4", { className: "text-lg font-semibold", children: "Leave Feedback" }),
                /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm", children: "We'd love to hear what went well or how we can improve entropretty." })
              ] }),
              /* @__PURE__ */ jsx(Form, { ...form, children: /* @__PURE__ */ jsxs(
                "form",
                {
                  onSubmit: form.handleSubmit(onSubmit),
                  className: "space-y-4",
                  children: [
                    /* @__PURE__ */ jsx(
                      FormField,
                      {
                        control: form.control,
                        name: "feedback",
                        render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
                          /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
                            Textarea,
                            {
                              placeholder: "Your feedback",
                              className: "bg-background min-h-[100px]",
                              ...field
                            }
                          ) }),
                          /* @__PURE__ */ jsx(FormMessage, {})
                        ] })
                      }
                    ),
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                      /* @__PURE__ */ jsx(
                        FormField,
                        {
                          control: form.control,
                          name: "sentiment",
                          render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
                            /* @__PURE__ */ jsx("div", { className: "flex gap-2", children: [
                              { value: "negative", icon: Frown },
                              { value: "neutral", icon: Meh },
                              { value: "positive", icon: Smile }
                            ].map(({ value, icon: Icon }) => /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
                              Button,
                              {
                                type: "button",
                                variant: field.value === value ? "outline" : "ghost",
                                size: "icon",
                                className: cn(
                                  field.value === value && "border-primary"
                                ),
                                onClick: () => field.onChange(value),
                                children: /* @__PURE__ */ jsx(Icon, { className: "h-4 w-4" })
                              }
                            ) }, value)) }),
                            /* @__PURE__ */ jsx(FormMessage, {})
                          ] })
                        }
                      ),
                      /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
                        /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => setOpen(false), children: "Cancel" }),
                        /* @__PURE__ */ jsx(Button, { type: "submit", disabled: submitFeedback.isPending, children: submitFeedback.isPending ? /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }) }) : "Submit" })
                      ] })
                    ] })
                  ]
                }
              ) })
            ]
          },
          "feedback_form"
        ),
        !open && /* @__PURE__ */ jsx(
          motion.div,
          {
            className: "shadow-none",
            animate: { opacity: 1, filter: "blur(0px)" },
            exit: { opacity: 0, filter: "blur(10px)" },
            transition: { type: "spring", duration: 0.1, bounce: 0.1 },
            initial: { opacity: 0, filter: "blur(10px)" },
            children: /* @__PURE__ */ jsx(
              Button,
              {
                variant: "secondary",
                className: "[box-shadow:4px_4px_0_0_rgba(0,0,0,0.5)] dark:[box-shadow:4px_4px_0_0_rgba(255,255,255,0.5)]",
                onClick: () => setOpen(true),
                children: "Feedback"
              }
            )
          },
          "open_button"
        )
      ] }) })
    }
  );
}

export { FeedbackDialog as F, Form as a, FormField as b, FormItem as c, FormControl as d };
//# sourceMappingURL=index-BUYfvkjm.mjs.map
