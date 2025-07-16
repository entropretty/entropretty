import { Marquee } from "@/components/magicui/marquee";
import { useEffect, useState } from "react";

const useWebMTransparencySupport = () => {
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    // Check if browser is Safari
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    // Set support to false for Safari browsers
    if (isSafari) {
      setIsSupported(false);
    }
  }, []);

  return isSupported;
};

const videos = [
  "inkflow.webm",
  "star.webm",
  "EntropySymbolizer.webm",
  "hex.webm",
  "squidlink.webm",
  "dial.webm",
  "circles.webm",
  "sprite.webm",
  "maze.webm",
  "sonarcompass.webm",
  "truthy.webm",
  "gummiring.webm",
  "planet.webm",
  "circlebara.webm",
  "clock.webm",
  "roman.webm",
  "lines.webm",
  "bloom.webm",
  "squares.webm",
  "lemonjelly.webm",
  "wave2.webm",
  "80tiesSpriteGenerator.webm",
  "confusedeyeball.webm",
  "tilesoflisbon.webm",
  "musicalnotes.webm",
];

const firstRow = videos.slice(0, Math.ceil(videos.length / 2));
const secondRow = videos.slice(Math.ceil(videos.length / 2));

const VideoCard = ({ filename }: { filename: string }) => {
  return (
    <div className="relative h-32 w-32 cursor-pointer overflow-hidden mx-2">
      <video
        className="h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src={`/design-videos/${filename}`} type="video/webm" />
      </video>
    </div>
  );
};

export function MarqueeDemo() {
  const webMTransparencySupported = useWebMTransparencySupport();

  if (!webMTransparencySupported) {
    return null;
  }

  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden gap-4 py-8 bg-white ">
      <Marquee pauseOnHover className="[--duration:40s]">
        {firstRow.map((filename) => (
          <VideoCard key={filename} filename={filename} />
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover className="[--duration:40s]">
        {secondRow.map((filename) => (
          <VideoCard key={filename} filename={filename} />
        ))}
      </Marquee>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background"></div>
    </div>
  );
}
