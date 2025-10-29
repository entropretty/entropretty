import { jsx } from 'react/jsx-runtime';
import { Outlet } from '@tanstack/react-router';
import { u as useAuth } from './router-Dgt9epnn.mjs';
import 'react-helmet-async';
import '@tanstack/react-query';
import 'react';
import 'comlink';
import 'p-queue';
import '@supabase/supabase-js';
import 'next-themes';
import 'sonner';

function AuthLayoutComponent() {
  const {
    user
  } = useAuth();
  if (!user) {
    return /* @__PURE__ */ jsx("div", { children: "You need to login first" });
  }
  return /* @__PURE__ */ jsx(Outlet, {});
}

export { AuthLayoutComponent as component };
//# sourceMappingURL=_auth-BBpqRero.mjs.map
