import { jsx, Fragment } from 'react/jsx-runtime';
import { a as getSeedFamily, g as getSeed } from './index-CWNUk7Yv.mjs';
import { useAtom, atom, useSetAtom } from 'jotai';
import { s as supabase } from './router-Dgt9epnn.mjs';
import { useQuery } from '@tanstack/react-query';
import { useState, useEffect, Suspense, lazy } from 'react';
import { useSearch } from '@tanstack/react-router';
import 'react-helmet-async';
import 'comlink';
import 'p-queue';
import '@supabase/supabase-js';
import 'next-themes';
import 'sonner';

const editorCodeAtom = atom("");
const editorCodeVersionAtom = atom(0);
const editorSeedTypeAtom = atom("Procedural");
const remixAtom = atom(null);
const scriptErrorAtom = atom(null);
const algorithmNameAtom = atom("");
const initialSeeds = [...getSeedFamily("Procedural").map((s) => [...s])];
const editorSeedFamilyAtom = atom(initialSeeds);
const generateNewSeedAtom = atom(null, (get, set) => {
  set(editorSeedFamilyAtom, [
    ...getSeedFamily(get(editorSeedTypeAtom), 128).map((s) => [...s])
  ]);
});
atom([...getSeed("Procedural")]);
const CreateFeature = lazy(() => import('./index-Byidhy7b.mjs'));
function Create() {
  const searchParams = useSearch({ from: "/_layout/_auth/create" });
  const remixId = searchParams.remix;
  const seedTypeQuery = searchParams.type;
  const [, setRemix] = useAtom(remixAtom);
  const [, setSeedType] = useAtom(editorSeedTypeAtom);
  const [, setEditorCode] = useAtom(editorCodeAtom);
  const [isReady, setIsReady] = useState(false);
  const generateNewSeed = useSetAtom(generateNewSeedAtom);
  const { data, isLoading } = useQuery({
    queryKey: ["algorithm", remixId],
    queryFn: async () => {
      const { data: data2, error } = await supabase.from("algorithms_with_user_profile").select().eq("id", Number(remixId)).single();
      if (error) throw error;
      if (!data2) return;
      return data2;
    },
    enabled: remixId !== null
  });
  useEffect(() => {
    if (!data) {
      setEditorCode("");
      setSeedType(seedTypeQuery || "Procedural");
      generateNewSeed();
      setRemix(null);
    } else {
      setRemix(data);
      setEditorCode(data.content || "");
      setSeedType(data.family_kind || "Procedural");
      generateNewSeed();
    }
    setTimeout(() => setIsReady(true), 500);
  }, [
    data,
    setRemix,
    seedTypeQuery,
    setSeedType,
    generateNewSeed,
    setEditorCode
  ]);
  return /* @__PURE__ */ jsx(Fragment, { children: !isLoading && isReady && /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsx("div", { className: "p-8", children: "Setting up editor..." }), children: /* @__PURE__ */ jsx(CreateFeature, {}) }) });
}
const Create$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Create
}, Symbol.toStringTag, { value: "Module" }));

export { Create$1 as C, algorithmNameAtom as a, editorSeedFamilyAtom as b, editorSeedTypeAtom as c, editorCodeVersionAtom as d, editorCodeAtom as e, generateNewSeedAtom as g, remixAtom as r, scriptErrorAtom as s };
//# sourceMappingURL=Create-ZBsP1-ra.mjs.map
