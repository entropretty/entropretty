import { jsx } from 'react/jsx-runtime';
import { Navigate } from '@tanstack/react-router';
import { u as useUserProfile } from './useUserProfile-j6YqCSWd.mjs';
import { Suspense, lazy } from 'react';
import './router-Dgt9epnn.mjs';
import 'react-helmet-async';
import '@tanstack/react-query';
import 'comlink';
import 'p-queue';
import '@supabase/supabase-js';
import 'next-themes';
import 'sonner';

const Create = lazy(() => import('./Create-ZBsP1-ra.mjs').then((n) => n.C));
function CreatePageComponent() {
  const {
    data: profile,
    isLoading
  } = useUserProfile();
  if (isLoading) return null;
  if (!profile?.username) {
    return /* @__PURE__ */ jsx(Navigate, { to: "/profile" });
  }
  return /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsx("div", { className: "p-8", children: "Loading..." }), children: /* @__PURE__ */ jsx(Create, {}) });
}

export { CreatePageComponent as component };
//# sourceMappingURL=create-MIERHRLz.mjs.map
