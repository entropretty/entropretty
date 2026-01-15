"use client";

import { useEffect } from "react";
import { Toaster } from "sonner";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Showcase } from "@/components/Showcase";
import { VideoSection } from "@/components/VideoSection";
import { EventsSection } from "@/components/events";
import { Footer } from "@/components/Footer";

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
      <div className="relative min-h-screen">
        <Header />
        <main>
          <Hero />
          <VideoSection />
          <Showcase />
          <EventsSection />
          <Features />
        </main>
        <Footer />
      </div>
      <Toaster />
    </>
  );
}
