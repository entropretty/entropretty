import { jsx } from 'react/jsx-runtime';
import { a as useTheme } from './router-Dgt9epnn.mjs';
import Editor, { useMonaco } from '@monaco-editor/react';
import { useAtom } from 'jotai';
import { useRef, useEffect, useMemo, useState, useCallback } from 'react';
import { e as editorCodeAtom } from './Create-ZBsP1-ra.mjs';
import '@tanstack/react-router';
import 'react-helmet-async';
import '@tanstack/react-query';
import 'comlink';
import 'p-queue';
import '@supabase/supabase-js';
import 'next-themes';
import 'sonner';
import './index-CWNUk7Yv.mjs';

function c(e,u,c,i){var a=this,o=useRef(null),f=useRef(0),l=useRef(0),v=useRef(null),m=useRef([]),d=useRef(),g=useRef(),p=useRef(e),w=useRef(true);p.current=e;var s="undefined"!="undefined",x=!u&&0!==u&&s;if("function"!=typeof e)throw new TypeError("Expected a function");u=+u||0;var h=!!(c=c||{}).leading,y=!("trailing"in c)||!!c.trailing,F="maxWait"in c,A="debounceOnServer"in c&&!!c.debounceOnServer,D=F?Math.max(+c.maxWait||0,u):null;useEffect(function(){return w.current=true,function(){w.current=false;}},[]);var T=useMemo(function(){var r=function(r){var n=m.current,t=d.current;return m.current=d.current=null,f.current=r,l.current=l.current||r,g.current=p.current.apply(t,n)},n=function(r,n){x&&cancelAnimationFrame(v.current),v.current=x?requestAnimationFrame(r):setTimeout(r,n);},t=function(r){if(!w.current)return  false;var n=r-o.current;return !o.current||n>=u||n<0||F&&r-f.current>=D},e=function(n){return v.current=null,y&&m.current?r(n):(m.current=d.current=null,g.current)},c=function r(){var c=Date.now();if(h&&l.current===f.current&&T(),t(c))return e(c);if(w.current){var i=u-(c-o.current),a=F?Math.min(i,D-(c-f.current)):i;n(r,a);}},T=function(){},W=function(){if(A){var e=Date.now(),i=t(e);if(m.current=[].slice.call(arguments),d.current=a,o.current=e,i){if(!v.current&&w.current)return f.current=o.current,n(c,u),h?r(o.current):g.current;if(F)return n(c,u),r(o.current)}return v.current||n(c,u),g.current}};return W.cancel=function(){v.current&&(x?cancelAnimationFrame(v.current):clearTimeout(v.current)),f.current=0,m.current=o.current=d.current=v.current=null;},W.isPending=function(){return !!v.current},W.flush=function(){return v.current?e(Date.now()):g.current},W},[h,F,u,D,y,x,s,A,i]);return T}

const initialCode = `/**
 * This script is a draw function you need to fill.
 * It should draw a design based on the seed.
 * Canvas is 100x100 units.
 *
 * Available variables:
 * ctx: the CanvasRenderingContext2D to draw on
 * seed: array of numbers 0-255
 */
ctx.translate(5, 5)
ctx.textAlign = "center"
ctx.textBaseline = "middle"

const length = seed.length
const grid = Math.ceil(Math.sqrt(length))
const cellSize = Math.floor(90 / grid)
const fontSize = Math.max(8, Math.floor(cellSize * 0.4))
ctx.font = \`\${fontSize}px sans-serif\`

seed.forEach((n, i) => {
  const row = Math.floor(i / grid)
  const col = i % grid
  const x = col * cellSize
  const y = row * cellSize

  // Draw cell border
  ctx.strokeStyle = "#ccc"
  ctx.strokeRect(x, y, cellSize, cellSize)

  // Draw number
  ctx.fillStyle = "#000"
  ctx.fillText(n.toString(), x + cellSize / 2, y + cellSize / 2)
})`;
const MonacoEditor = () => {
  const monaco = useMonaco();
  const [code, setEditorCode] = useAtom(editorCodeAtom);
  const [localCode, setLocalCode] = useState(code);
  const debouncedSetEditorCode = c(
    // function
    (value) => {
      setEditorCode(value);
    },
    // delay in ms
    250
  );
  const { theme } = useTheme();
  useEffect(() => {
    if (monaco) {
      monaco.languages.typescript.javascriptDefaults.addExtraLib(`
        declare const ctx: CanvasRenderingContext2D;
        declare const seed: number[];

        // Function declarations
        declare function getByte(seed: number[], index: number): number;
        declare function split(seed: number[], parts: number): number[];
        declare function bytesToNibbles(bytes: number[]): number[];
        declare function bit(seed: number[], i: number): 0 | 1;
        declare function bits(seed: number[], from?: number, to?: number): number;
        declare function symmetrical(factor: number, fn: (i: number) => void, ctx: CanvasRenderingContext2D): void;
        declare function strokeEach<T>(array: readonly T[], fn: (element: T, index: number) => void, ctx: CanvasRenderingContext2D): void;
        declare function fillEach<T>(array: readonly T[], fn: (element: T, index: number) => void, ctx: CanvasRenderingContext2D): void;
        declare function numeric(seed: number[]): bigint;
        declare function randomGenerator(seed: number[]): () => number;
        declare function sfc32(a: number, b: number, c: number, d: number): () => number;
      `);
    }
  }, [monaco, theme]);
  const onChange = (value) => {
    if (!value) return;
    setLocalCode(value);
    debouncedSetEditorCode(value);
  };
  const onMount = useCallback(() => {
    if (!code) {
      console.log("setting initial code as no code", code);
      setLocalCode(initialCode);
      setEditorCode(initialCode);
    }
  }, [code, setEditorCode]);
  const getEditorTheme = () => {
    return "vs";
  };
  return /* @__PURE__ */ jsx(
    Editor,
    {
      height: "100%",
      defaultLanguage: "javascript",
      theme: getEditorTheme(),
      defaultValue: initialCode,
      onChange,
      onMount,
      value: localCode,
      options: {
        minimap: { enabled: false },
        lineNumbers: "on",
        fontSize: 12
      }
    }
  );
};

export { MonacoEditor as default };
//# sourceMappingURL=MonacoEditor-Nw7Wsojv.mjs.map
