import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { E as EntroprettyLogo } from './EntroprettyLogo-D9fUuJoe.mjs';
import * as React from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { cva } from 'class-variance-authority';
import { c as cn, f as familyKindColor } from './utils-CZo72ztR.mjs';
import { B as Button } from './button-CeG_45YZ.mjs';
import { useNavigate, useLocation, Link, Outlet } from '@tanstack/react-router';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X, PlusIcon, ArrowUpRight } from 'lucide-react';
import { u as useAuth, a as useTheme } from './router-Dgt9epnn.mjs';
import { u as useUserProfile } from './useUserProfile-j6YqCSWd.mjs';
import { Helmet } from 'react-helmet-async';
import 'clsx';
import 'tailwind-merge';
import '@radix-ui/react-slot';
import '@tanstack/react-query';
import 'comlink';
import 'p-queue';
import '@supabase/supabase-js';
import 'next-themes';
import 'sonner';

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogOverlay = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Overlay,
  {
    ref,
    className: cn(
      "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/80",
      className
    ),
    ...props
  }
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;
const DialogContent = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(DialogPortal, { children: [
  /* @__PURE__ */ jsx(DialogOverlay, {}),
  /* @__PURE__ */ jsxs(
    DialogPrimitive.Content,
    {
      ref,
      className: cn(
        "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border p-6 shadow-lg duration-200",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsxs(DialogPrimitive.Close, { className: "ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute right-4 top-4 opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none", children: [
          /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Close" })
        ] })
      ]
    }
  )
] }));
DialogContent.displayName = DialogPrimitive.Content.displayName;
const DialogHeader = ({
  className,
  ...props
}) => /* @__PURE__ */ jsx(
  "div",
  {
    className: cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    ),
    ...props
  }
);
DialogHeader.displayName = "DialogHeader";
const DialogFooter = ({
  className,
  ...props
}) => /* @__PURE__ */ jsx(
  "div",
  {
    className: cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    ),
    ...props
  }
);
DialogFooter.displayName = "DialogFooter";
const DialogTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Title,
  {
    ref,
    className: cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    ),
    ...props
  }
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;
const DialogDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Description,
  {
    ref,
    className: cn("text-muted-foreground text-sm", className),
    ...props
  }
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

const FEATURES = {
  isCompetition: false
};
const Popover = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;
const popoverContentVariants = cva(
  "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-72 border p-4 outline-none [box-shadow:4px_4px_0_0_rgba(0,0,0,0.5)] dark:[box-shadow:4px_4px_0_0_rgba(255,255,255,0.5)]",
  {
    variants: {
      variant: {
        default: "bg-popover text-popover-foreground",
        destructive: "bg-destructive text-white"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
const PopoverContent = React.forwardRef(({ className, align = "center", sideOffset = 0, variant, ...props }, ref) => /* @__PURE__ */ jsx(PopoverPrimitive.Portal, { children: /* @__PURE__ */ jsx(
  PopoverPrimitive.Content,
  {
    ref,
    align,
    sideOffset,
    className: cn(popoverContentVariants({ variant, className })),
    ...props
  }
) }));
PopoverContent.displayName = PopoverPrimitive.Content.displayName;
const ListItem = ({
  className,
  title,
  description,
  ...props
}) => {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: cn(
        "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block select-none space-y-1 p-3 leading-none no-underline outline-none transition-colors hover:cursor-pointer",
        className
      ),
      ...props,
      children: [
        /* @__PURE__ */ jsx("div", { className: "text-sm font-medium leading-none", children: title }),
        description && /* @__PURE__ */ jsx("p", { className: "text-muted-foreground line-clamp-2 text-xs leading-snug", children: description })
      ]
    }
  );
};
function HelpMenu() {
  return /* @__PURE__ */ jsxs(Popover, { children: [
    /* @__PURE__ */ jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsx(Button, { variant: "ghost", className: "h-9 px-4 py-2 text-sm font-medium", children: "help" }) }),
    /* @__PURE__ */ jsx(PopoverContent, { className: "w-[300px] p-2 md:w-[300px] lg:w-[400px]", children: /* @__PURE__ */ jsxs("div", { className: "grid gap-1", children: [
      /* @__PURE__ */ jsx(Link, { to: "https://entropretty.com/", target: "_blank", children: /* @__PURE__ */ jsx(
        ListItem,
        {
          title: "What is this?",
          description: "https://entropretty.com/"
        }
      ) }),
      /* @__PURE__ */ jsx(Link, { to: "https://github.com/entropretty/entropretty", target: "_blank", children: /* @__PURE__ */ jsx(
        ListItem,
        {
          title: "GitHub Repository",
          description: "View the source code for Entropretty"
        }
      ) }),
      /* @__PURE__ */ jsx(Link, { to: "https://entropretty.com/rules", target: "_blank", children: /* @__PURE__ */ jsx(
        ListItem,
        {
          title: "Competition Rules",
          description: "Learn about the rules of the competition"
        }
      ) }),
      /* @__PURE__ */ jsx(
        Link,
        {
          to: "https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D",
          target: "_blank",
          children: /* @__PURE__ */ jsx(
            ListItem,
            {
              title: "Canvas API Reference",
              description: "Documentation for the CanvasRenderingContext2D API used for drawing"
            }
          )
        }
      )
    ] }) })
  ] });
}
function SeedTypeCard({ kind }) {
  const navigate = useNavigate();
  const isProceduralKind = kind === "Procedural";
  const colorClass = familyKindColor(kind);
  return /* @__PURE__ */ jsxs("div", { className: cn("relative", isProceduralKind && "pb-2"), children: [
    isProceduralKind && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          className: cn(
            "absolute inset-0 -m-2 -mb-3 border",
            colorClass,
            "z-0 bg-transparent"
          )
        }
      ),
      /* @__PURE__ */ jsx(
        "div",
        {
          className: cn(
            "absolute bottom-0 left-1/2 z-10 -translate-x-1/2 translate-y-7 px-4 py-0.5",
            colorClass,
            "font-jersey whitespace-nowrap text-white"
          ),
          children: "START HERE"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: () => navigate(`/create?type=${kind}`),
        className: cn(
          "z-5 relative flex aspect-square w-full flex-col items-center justify-center gap-2 p-4 transition-colors",
          colorClass,
          isProceduralKind ? "text-white" : "text-black"
        ),
        children: [
          /* @__PURE__ */ jsxs("div", { className: "font-jersey text-xl", children: [
            kind === "Procedural" && "Entropy",
            kind === "ProceduralPersonal" && "Personal Id",
            kind === "ProceduralAccount" && "Account Id"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-sm", children: [
            kind === "Procedural" && "4 random bytes for creative designs",
            kind === "ProceduralPersonal" && "8 bytes for personal identifiers",
            kind === "ProceduralAccount" && "32 bytes for account-based designs"
          ] })
        ]
      }
    )
  ] });
}
function NewDialog() {
  return /* @__PURE__ */ jsxs(Dialog, { children: [
    /* @__PURE__ */ jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsx(Button, { className: "hidden md:flex", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
      /* @__PURE__ */ jsx(PlusIcon, { className: "h-4 w-4" }),
      "NEW"
    ] }) }) }),
    /* @__PURE__ */ jsxs(DialogContent, { className: "max-w-xl", children: [
      /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { className: "text-2xl", children: "Choose your Seed Category" }) }),
      /* @__PURE__ */ jsxs("div", { className: "grid gap-4 sm:grid-cols-3", children: [
        /* @__PURE__ */ jsx("div", { className: "space-y-2", children: /* @__PURE__ */ jsx(SeedTypeCard, { kind: "Procedural" }) }),
        /* @__PURE__ */ jsx("div", { className: "space-y-2", children: /* @__PURE__ */ jsx(SeedTypeCard, { kind: "ProceduralPersonal" }) }),
        /* @__PURE__ */ jsx("div", { className: "space-y-2", children: /* @__PURE__ */ jsx(SeedTypeCard, { kind: "ProceduralAccount" }) })
      ] }),
      /* @__PURE__ */ jsx(DialogFooter, { children: /* @__PURE__ */ jsx(Button, { variant: "link", asChild: true, children: /* @__PURE__ */ jsxs(
        Link,
        {
          to: "https://entropretty.com/rules#seed-details",
          target: "_blank",
          className: "text-primary hover:underline",
          children: [
            "Learn about seed types & meaning",
            /* @__PURE__ */ jsx(ArrowUpRight, { className: "h-4 w-4" })
          ]
        }
      ) }) })
    ] })
  ] });
}
function XIcon({ className }) {
  return /* @__PURE__ */ jsx(
    "svg",
    {
      viewBox: "0 0 24 24",
      "aria-hidden": "true",
      className: cn("h-5 w-5 fill-current", className),
      children: /* @__PURE__ */ jsx("path", { d: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" })
    }
  );
}
function HeaderLayout() {
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { data: profile, isLoading: isLoadingProfile } = useUserProfile();
  const randomFaviconNumber = Math.floor(Math.random() * 13) + 1;
  return /* @__PURE__ */ jsxs("div", { className: "flex h-screen w-screen flex-col", children: [
    /* @__PURE__ */ jsx(Helmet, { children: /* @__PURE__ */ jsx(
      "link",
      {
        id: "favicon",
        rel: "icon",
        href: `/favicon/${randomFaviconNumber}.png`
      }
    ) }),
    /* @__PURE__ */ jsxs("nav", { className: "border-background-200 relative flex flex-row items-center justify-between gap-2 border-b px-6 py-2", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-1 flex-row items-center justify-start gap-2", children: [
        /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(Button, { asChild: true, variant: "link", children: /* @__PURE__ */ jsx(Link, { to: "/explore", children: "explore" }) }),
          /* @__PURE__ */ jsx(
            Button,
            {
              asChild: true,
              variant: "link",
              className: cn(
                (location.pathname === "/new" || location.pathname === "/") && "underline"
              ),
              children: /* @__PURE__ */ jsx(Link, { to: "/new", children: "new" })
            }
          ),
          /* @__PURE__ */ jsx(
            Button,
            {
              asChild: true,
              variant: "link",
              className: cn(location.pathname === "/hot" && "underline"),
              children: /* @__PURE__ */ jsx(Link, { to: "/hot", children: "hot" })
            }
          )
        ] }),
        user && /* @__PURE__ */ jsx(
          Button,
          {
            asChild: true,
            variant: "link",
            className: cn(location.pathname === "/mine" && "underline"),
            children: /* @__PURE__ */ jsx(Link, { to: "/mine", children: "mine" })
          }
        ),
        /* @__PURE__ */ jsx(HelpMenu, {}),
        /* @__PURE__ */ jsx(Button, { asChild: true, variant: "link", className: "h-5 w-5", children: /* @__PURE__ */ jsx(Link, { to: "https://x.com/entropretty", target: "_blank", children: /* @__PURE__ */ jsx(XIcon, { className: "h-5 w-5 fill-current" }) }) }),
        FEATURES.isCompetition
      ] }),
      location.pathname !== "/" && FEATURES.isCompetition,
      /* @__PURE__ */ jsx(Link, { to: "/", children: /* @__PURE__ */ jsx(EntroprettyLogo, { className: "hidden lg:flex" }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-1 flex-row items-center justify-end gap-2", children: [
        FEATURES.isCompetition,
        !user && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(Button, { className: "hidden md:block", asChild: true, children: /* @__PURE__ */ jsx(Link, { to: "/login", children: "LOGIN" }) }),
          /* @__PURE__ */ jsx(Button, { variant: "ghost", className: "hidden md:block", asChild: true, children: /* @__PURE__ */ jsx(Link, { to: "/signup", children: "SIGN UP" }) })
        ] }),
        user && /* @__PURE__ */ jsxs(Fragment, { children: [
          !isLoadingProfile && /* @__PURE__ */ jsx(Button, { variant: "ghost", asChild: true, children: /* @__PURE__ */ jsx(Link, { to: "/profile", children: profile?.username || user.email }) }),
          location.pathname !== "/create" && /* @__PURE__ */ jsx(NewDialog, {}),
          /* @__PURE__ */ jsx(
            Button,
            {
              variant: "ghost",
              onMouseDown: () => {
                signOut().then(() => {
                  navigate("/");
                }).catch((e) => {
                  console.error(e);
                });
              },
              children: "LOGOUT"
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("main", { className: "relative flex h-full w-full flex-col items-center", children: /* @__PURE__ */ jsx(Outlet, {}) })
  ] });
}
function LayoutComponent() {
  return /* @__PURE__ */ jsx(HeaderLayout, {});
}

export { LayoutComponent as component };
//# sourceMappingURL=_layout-CkicL3Cs.mjs.map
