import { useCallback } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import Image from "next/image";

interface Revision2025ToastProps {
  id: string | number;
}

export const TOAST_ID = "revision-2025-toast-v1";

export function Revision2025Toast({ id }: Revision2025ToastProps) {
  const onDismiss = useCallback(() => {
    toast.dismiss(id);
  }, [id]);

  return (
    <div className="overflow-hidden border w-full bg-black font-sans text-md text-white">
      <div className="relative h-48 w-full">
        <Image
          src="/assets/revision-2025-bg.jpg"
          alt="Revision 2025 Background"
          className="h-full w-full object-cover"
          width={320}
          height={240}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Image
            src="/assets/revision-2025-logo.png"
            alt="Revision 2025 Logo"
            className="max-h-32 w-auto max-w-[90%]"
            width={640}
            height={192}
          />
        </div>
      </div>

      <div className="space-y-4 p-4">
        <div className="flex flex-col gap-1">
          {/* <h1 className="text-2xl">$1000 Prize Pool</h1> */}
          <h2 className="text-xl font-bold text-white">
            Entropretty @ REVISION 2025
          </h2>

          <p className="text-gray-300 break-words">
            Create and submit your Entropretty design NOW and be featured live
            at REVISION.
          </p>
          <p className="text-gray-300 break-words">
            Submit your design till 8PM CEST on April 19th, 2025.
          </p>
        </div>

        <div className="flex items-center flex-col sm:flex-col gap-2 justify-between">
          <Button
            variant="link"
            className="text-white hover:text-gray-300"
            asChild
          >
            <a
              href="https://2025.revision-party.net/blog/09-entropretty-compo/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn more at revision-party.net
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
