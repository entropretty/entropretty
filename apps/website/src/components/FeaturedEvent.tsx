import Image from "next/image";

interface FeaturedEventProps {
  className?: string;
}

export default function FeaturedEvent({ className = "" }: FeaturedEventProps) {
  return (
    <section className={`min-h-[80vh] w-full flex items-center ${className}`}>
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 px-4">
        <div className="flex flex-col justify-center">
          <h2 className="text-4xl font-bold mb-6">Entropretty Competition</h2>
          <p className="text-lg mb-8">
            Join a vibrant community where creativity meets technology. Explore
            unique artworks generated through innovative algorithms.
          </p>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-3">Art Redefined</h3>
              <p className="text-gray-600">
                Experience the fusion of art and mathematics in every piece
                created.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-3">Join Us</h3>
              <p className="text-gray-600">
                Become part of a community that celebrates creativity through
                technology.
              </p>
            </div>
          </div>
        </div>
        <div className="relative aspect-[2/1] w-full">
          <div className="relative w-full h-full bg-black overflow-hidden">
            <Image
              src="/Assembly-Winter-25-1920x1080-bg.webp"
              alt="Assembly Winter 2025 Background"
              fill
              className="object-cover"
              priority
            />
            <Image
              src="/assembly-winter-2025-logo.png"
              alt="Assembly Winter 2025"
              fill
              className="object-contain w-[80%] h-[90%] m-auto left-[10%]"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
