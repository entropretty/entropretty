/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useState } from "react";

export type BrowserType =
  | "Firefox"
  | "Samsung Internet"
  | "Opera"
  | "IE"
  | "Edge"
  | "Chrome"
  | "Safari"
  | "unknown";

export default function useDetectBrowser(): BrowserType {
  if (typeof window === "undefined") return "unknown";

  const [browserName, setBrowserName] = useState<BrowserType>("unknown");

  useEffect(() => {
    const sUsrAg = navigator.userAgent;
    let detectedBrowser: BrowserType = "unknown";

    if (sUsrAg.indexOf("Firefox") > -1) {
      detectedBrowser = "Firefox";
    } else if (sUsrAg.indexOf("SamsungBrowser") > -1) {
      detectedBrowser = "Samsung Internet";
    } else if (sUsrAg.indexOf("Opera") > -1 || sUsrAg.indexOf("OPR") > -1) {
      detectedBrowser = "Opera";
    } else if (sUsrAg.indexOf("Trident") > -1) {
      detectedBrowser = "IE";
    } else if (sUsrAg.indexOf("Edge") > -1) {
      detectedBrowser = "Edge";
    } else if (sUsrAg.indexOf("Chrome") > -1) {
      detectedBrowser = "Chrome";
    } else if (sUsrAg.indexOf("Safari") > -1) {
      detectedBrowser = "Safari";
    }

    setBrowserName(detectedBrowser);
  }, []);

  return browserName;
}
