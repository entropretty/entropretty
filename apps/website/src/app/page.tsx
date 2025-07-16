"use client";

import { useEffect } from "react";
import { Toaster } from "sonner";
import EntroprettyVideo from "../components/EntroprettyVideo";
import HeroBlock from "../components/HeroBlock";
import { MarqueeDemo } from "../components/MarqueeDemo";
import { EventsSection } from "../components/events";

export default function Home() {
  useEffect(() => {
    // Set random favicon
    const randomFaviconNumber = Math.floor(Math.random() * 3) + 1;
    const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
    if (!link) {
      const newLink = document.createElement("link");
      newLink.rel = "icon";
      document.head.appendChild(newLink);
    }
    (
      document.querySelector("link[rel~='icon']") as HTMLLinkElement
    ).href = `/favicon/${randomFaviconNumber}.png`;
  }, []);

  return (
    <>
      <div className="relative min-h-screen font-[family-name:var(--font-geist-sans)]">
        <HeroBlock />
        <MarqueeDemo />
        <EntroprettyVideo />
        <EventsSection />
      </div>
      <Toaster />
    </>
  );
}
