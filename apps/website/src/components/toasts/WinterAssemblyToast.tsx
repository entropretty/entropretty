import { useCallback } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import Image from "next/image";

interface WinterAssemblyToastProps {
  id: string | number;
}

export const TOAST_ID = "winter-assembly-toast-v2";

export function WinterAssemblyToast({ id }: WinterAssemblyToastProps) {
  const onDismiss = useCallback(() => {
    // localStorage.setItem(TOAST_ID, Date.now().toString());
    toast.dismiss(id);
  }, [id]);

  return (
    <div className="overflow-hidden border bg-black font-sans text-md text-white">
      <div className="relative h-48 w-full">
        <Image
          src="/Assembly-Winter-25-640w.webp"
          alt="Assembly Winter 2025 Background"
          className="h-full w-full object-cover"
          width={640}
          height={480}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Image
            src="/assembly-winter-2025-logo-640w.png"
            alt="Assembly Winter 2025 Logo"
            className="max-h-32 w-auto max-w-[90%]"
            width={640}
            height={192}
          />
        </div>
      </div>

      <div className="space-y-4 p-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl">$3000 Prize Money</h1>
          <h2 className="text-xl font-bold text-white">
            Entropretty Competition @ ASSEMBLY
          </h2>
          <p className="text-gray-300">
            We&apos;re are hosting a competition at Assembly Winter 2025. Join
            us at Messukeskus, Helsinki from February 20th to February 23rd,
            2025 for an unforgettable experience.
          </p>
        </div>

        <div className="flex items-center justify-between">
          <Button
            variant="link"
            className="text-white hover:text-gray-300"
            asChild
          >
            <a
              href="https://assembly.org/en/articles/assembly-to-host-global-tattoo-algorithm-competitions-in-2025-in"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn more at assembly.org
            </a>
          </Button>
          <Button
            variant="secondary"
            onClick={onDismiss}
            className="hover:bg-gray-700"
          >
            Dismiss
          </Button>
        </div>
      </div>
    </div>
  );
}
