import { createRouter, createRootRoute, createFileRoute, lazyRouteComponent, HeadContent, Scripts, useLocation } from '@tanstack/react-router';
import { jsxs, jsx } from 'react/jsx-runtime';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { useState, useEffect, createContext, useRef, useMemo, useContext } from 'react';
import { wrap, proxy } from 'comlink';
import PQueue from 'p-queue';
import { createClient } from '@supabase/supabase-js';
import { useTheme as useTheme$1 } from 'next-themes';
import { Toaster as Toaster$1 } from 'sonner';

const initialState = {
  theme: "light",
  setTheme: () => null
};
const ThemeProviderContext = createContext(initialState);
const THEME_STORAGE_KEY = "entropretty-theme";
function ThemeProvider({ children }) {
  const getStoredTheme = () => {
    return null;
  };
  const validateTheme = (candidateTheme) => {
    if (candidateTheme === "dark") {
      return "light";
    }
    return candidateTheme;
  };
  const getInitialTheme = () => {
    const storedTheme = getStoredTheme();
    if (storedTheme) {
      return validateTheme(storedTheme);
    }
    return "light";
  };
  const [theme, setTheme] = useState(getInitialTheme());
  const handleSetTheme = (newTheme) => {
    const validatedTheme = validateTheme(newTheme);
    setTheme(validatedTheme);
  };
  useEffect(() => {
    const currentStoredTheme = getStoredTheme();
    let newTheme;
    if (currentStoredTheme) {
      newTheme = validateTheme(currentStoredTheme);
    } else {
      newTheme = "light";
    }
    setTheme(newTheme);
    if (currentStoredTheme && currentStoredTheme !== newTheme) {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    }
  }, []);
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);
  const value = {
    theme,
    setTheme: handleSetTheme
  };
  return /* @__PURE__ */ jsx(ThemeProviderContext.Provider, { value, children });
}
const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (context === void 0)
    throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};
function WorkerWrapper$1(options) {
  return new Worker(
    "/assets/compliance-YQvOxEfH.js",
    {
      type: "module",
      name: options?.name
    }
  );
}
function WorkerWrapper(options) {
  return new Worker(
    "/assets/render-B3VoT2CO.js",
    {
      type: "module",
      name: options?.name
    }
  );
}
class AlgorithmService {
  complianceWorker;
  renderWorker;
  inventory;
  queue = new PQueue({ concurrency: 2 });
  constructor() {
    const complianceInstance = new WorkerWrapper$1();
    const renderInstance = new WorkerWrapper();
    this.complianceWorker = wrap(complianceInstance);
    this.renderWorker = wrap(renderInstance);
    this.inventory = /* @__PURE__ */ new Set();
  }
  async updateAlgorithm(algorithmId, algorithm, kind) {
    return await Promise.all([
      this.renderWorker.updateAlgorithm(algorithmId, algorithm, kind),
      this.complianceWorker.updateAlgorithm(algorithmId, algorithm, kind)
    ]);
  }
  async addAlgorithm(algorithmId, algorithm, kind) {
    if (this.inventory.has(algorithmId)) return;
    await Promise.all([
      this.complianceWorker.updateAlgorithm(algorithmId, algorithm, kind),
      this.renderWorker.updateAlgorithm(algorithmId, algorithm, kind)
    ]);
    this.inventory.add(algorithmId);
  }
  async testRender(algorithmId) {
    return this.renderWorker.testRender(algorithmId);
  }
  async renderWithQueue(algorithmId, size, seed, { signal }) {
    return this.queue.add(
      () => {
        return this.renderWorker.renderBitmap(algorithmId, size, [
          ...seed
        ]);
      },
      {
        priority: 100,
        signal
      }
    ).catch((error) => {
      if (error.name === "AbortError") {
        return null;
      }
      throw error;
    });
  }
  async checkCompliance(algorithmId, size, seed, { signal }) {
    return this.queue.add(
      () => {
        return this.complianceWorker.checkCompliance(algorithmId, seed, {
          withOverlay: true,
          overlaySize: size
        });
      },
      {
        priority: 0,
        signal
      }
    ).catch((error) => {
      if (error.name === "AbortError") {
        return null;
      }
      throw error;
    });
  }
  async benchmark(algorithmId, size, amount, onProgress) {
    await this.complianceWorker.onProgress(proxy(onProgress));
    return this.complianceWorker.benchmark(algorithmId, size, amount);
  }
  cancelAllRenderRequests() {
    this.queue.clear();
  }
}
const Context = createContext(null);
const ServiceProvider = ({
  children
}) => {
  const serviceRef = useRef(null);
  if (!serviceRef.current) {
    serviceRef.current = new AlgorithmService();
  }
  const value = useMemo(() => {
    return { algorithmService: serviceRef.current };
  }, [serviceRef]);
  return /* @__PURE__ */ jsx(Context.Provider, { value, children });
};
const useAlgorithmService = () => {
  const context = useContext(Context);
  if (!context)
    throw new Error("useAlgorithmService must be used within a ServiceProvider");
  return context.algorithmService;
};
const supabaseUrl = void 0;
const supabaseAnonKey = void 0;
{
  throw new Error("Missing Supabase environment variables");
}
const supabase = createClient(supabaseUrl, supabaseAnonKey);
const AuthContext = createContext(void 0);
function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);
  const signIn = async (email, password, captchaToken) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
      options: {
        captchaToken
      }
    });
    if (error) throw error;
  };
  const signUp = async (email, password, captchaToken) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: "https://app.entropretty.com/login",
        captchaToken
      }
    });
    if (error) throw error;
  };
  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };
  return /* @__PURE__ */ jsx(AuthContext.Provider, { value: { user, signIn, signUp, signOut }, children });
}
function useAuth() {
  const context = useContext(AuthContext);
  if (context === void 0) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
const Toaster = ({ ...props }) => {
  const { theme = "system" } = useTheme$1();
  return /* @__PURE__ */ jsx(
    Toaster$1,
    {
      theme,
      className: "toaster group",
      toastOptions: {
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
        }
      },
      ...props
    }
  );
};
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1e3,
      // 1 minute
      retry: 1
    }
  }
});
const Route$g = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8"
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1.0"
      },
      {
        title: "Entropretty"
      },
      {
        name: "description",
        content: "Create tattoo designs for your future human individuality."
      },
      {
        property: "og:url",
        content: "https://app.entropretty.com"
      },
      {
        property: "og:type",
        content: "website"
      },
      {
        property: "og:title",
        content: "Entropretty"
      },
      {
        property: "og:description",
        content: "Create tattoo designs for your future individuality."
      },
      {
        property: "og:image",
        content: "/open-graph.png"
      },
      {
        name: "twitter:card",
        content: "summary_large_image"
      },
      {
        property: "twitter:domain",
        content: "app.entropretty.com"
      },
      {
        property: "twitter:url",
        content: "https://app.entropretty.com"
      },
      {
        name: "twitter:title",
        content: "Entropretty"
      },
      {
        name: "twitter:description",
        content: "Create tattoo designs for your future individuality."
      },
      {
        name: "twitter:image",
        content: "/open-graph.png"
      }
    ],
    links: [
      {
        id: "favicon",
        rel: "icon",
        type: "image/png",
        href: "/favicon/1.png"
      }
    ]
  }),
  shellComponent: RootDocument
});
function RootDocument({ children }) {
  return /* @__PURE__ */ jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsx("head", { children: /* @__PURE__ */ jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxs("body", { children: [
      /* @__PURE__ */ jsx(HelmetProvider, { children: /* @__PURE__ */ jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsx(ThemeProvider, { children: /* @__PURE__ */ jsx(ServiceProvider, { children: /* @__PURE__ */ jsxs(AuthProvider, { children: [
        /* @__PURE__ */ jsx(Toaster, {}),
        /* @__PURE__ */ jsx(ScrollToTop, {}),
        children
      ] }) }) }) }) }),
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
const $$splitComponentImporter$f = () => import('./signup-BOCgpWxl.mjs');
const Route$f = createFileRoute("/signup")({
  component: lazyRouteComponent($$splitComponentImporter$f, "component")
});
const $$splitComponentImporter$e = () => import('./login-CGQN-8FP.mjs');
const Route$e = createFileRoute("/login")({
  component: lazyRouteComponent($$splitComponentImporter$e, "component")
});
const $$splitComponentImporter$d = () => import('./_layout-CkicL3Cs.mjs');
const Route$d = createFileRoute("/_layout")({
  component: lazyRouteComponent($$splitComponentImporter$d, "component")
});
const $$splitComponentImporter$c = () => import('./index-CbHs0UsG.mjs');
const Route$c = createFileRoute("/_layout/")({
  component: lazyRouteComponent($$splitComponentImporter$c, "component")
});
const $$splitComponentImporter$b = () => import('./demo._algorithmId-DbegvROl.mjs');
const Route$b = createFileRoute("/demo/$algorithmId")({
  component: lazyRouteComponent($$splitComponentImporter$b, "component")
});
const $$splitComponentImporter$a = () => import('./new-ClVr4VTe.mjs');
const Route$a = createFileRoute("/_layout/new")({
  component: lazyRouteComponent($$splitComponentImporter$a, "component")
});
const $$splitComponentImporter$9 = () => import('./hot-DUfG3i9w.mjs');
const Route$9 = createFileRoute("/_layout/hot")({
  component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
const $$splitComponentImporter$8 = () => import('./explore-BUigAMmz.mjs');
const Route$8 = createFileRoute("/_layout/explore")({
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const $$splitComponentImporter$7 = () => import('./events-CnzaXlH3.mjs');
const Route$7 = createFileRoute("/_layout/events")({
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import('./_auth-BBpqRero.mjs');
const Route$6 = createFileRoute("/_layout/_auth")({
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import('./u._username-BFSeYaYd.mjs');
const Route$5 = createFileRoute("/_layout/u/$username")({
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import('./event._eventId-D04iSDTe.mjs');
const Route$4 = createFileRoute("/_layout/event/$eventId")({
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import('./a._algorithmId-CUTfigs5.mjs');
const Route$3 = createFileRoute("/_layout/a/$algorithmId")({
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import('./profile-DOEiRG1U.mjs');
const Route$2 = createFileRoute("/_layout/_auth/profile")({
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import('./mine-DDtZaVxG.mjs');
const Route$1 = createFileRoute("/_layout/_auth/mine")({
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import('./create-MIERHRLz.mjs');
const Route = createFileRoute("/_layout/_auth/create")({
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const SignupRoute = Route$f.update({
  id: "/signup",
  path: "/signup",
  getParentRoute: () => Route$g
});
const LoginRoute = Route$e.update({
  id: "/login",
  path: "/login",
  getParentRoute: () => Route$g
});
const LayoutRoute = Route$d.update({
  id: "/_layout",
  getParentRoute: () => Route$g
});
const LayoutIndexRoute = Route$c.update({
  id: "/",
  path: "/",
  getParentRoute: () => LayoutRoute
});
const DemoAlgorithmIdRoute = Route$b.update({
  id: "/demo/$algorithmId",
  path: "/demo/$algorithmId",
  getParentRoute: () => Route$g
});
const LayoutNewRoute = Route$a.update({
  id: "/new",
  path: "/new",
  getParentRoute: () => LayoutRoute
});
const LayoutHotRoute = Route$9.update({
  id: "/hot",
  path: "/hot",
  getParentRoute: () => LayoutRoute
});
const LayoutExploreRoute = Route$8.update({
  id: "/explore",
  path: "/explore",
  getParentRoute: () => LayoutRoute
});
const LayoutEventsRoute = Route$7.update({
  id: "/events",
  path: "/events",
  getParentRoute: () => LayoutRoute
});
const LayoutAuthRoute = Route$6.update({
  id: "/_auth",
  getParentRoute: () => LayoutRoute
});
const LayoutUUsernameRoute = Route$5.update({
  id: "/u/$username",
  path: "/u/$username",
  getParentRoute: () => LayoutRoute
});
const LayoutEventEventIdRoute = Route$4.update({
  id: "/event/$eventId",
  path: "/event/$eventId",
  getParentRoute: () => LayoutRoute
});
const LayoutAAlgorithmIdRoute = Route$3.update({
  id: "/a/$algorithmId",
  path: "/a/$algorithmId",
  getParentRoute: () => LayoutRoute
});
const LayoutAuthProfileRoute = Route$2.update({
  id: "/profile",
  path: "/profile",
  getParentRoute: () => LayoutAuthRoute
});
const LayoutAuthMineRoute = Route$1.update({
  id: "/mine",
  path: "/mine",
  getParentRoute: () => LayoutAuthRoute
});
const LayoutAuthCreateRoute = Route.update({
  id: "/create",
  path: "/create",
  getParentRoute: () => LayoutAuthRoute
});
const LayoutAuthRouteChildren = {
  LayoutAuthCreateRoute,
  LayoutAuthMineRoute,
  LayoutAuthProfileRoute
};
const LayoutAuthRouteWithChildren = LayoutAuthRoute._addFileChildren(
  LayoutAuthRouteChildren
);
const LayoutRouteChildren = {
  LayoutAuthRoute: LayoutAuthRouteWithChildren,
  LayoutEventsRoute,
  LayoutExploreRoute,
  LayoutHotRoute,
  LayoutNewRoute,
  LayoutIndexRoute,
  LayoutAAlgorithmIdRoute,
  LayoutEventEventIdRoute,
  LayoutUUsernameRoute
};
const LayoutRouteWithChildren = LayoutRoute._addFileChildren(LayoutRouteChildren);
const rootRouteChildren = {
  LayoutRoute: LayoutRouteWithChildren,
  LoginRoute,
  SignupRoute,
  DemoAlgorithmIdRoute
};
const routeTree = Route$g._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  return createRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));

export { useTheme as a, useAlgorithmService as b, router as r, supabase as s, useAuth as u };
//# sourceMappingURL=router-Dgt9epnn.mjs.map
