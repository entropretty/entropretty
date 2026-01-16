import Image from "next/image"

interface FeaturedEventProps {
  className?: string
}

export default function FeaturedEvent({ className = "" }: FeaturedEventProps) {
  return (
    <section className={`flex min-h-[80vh] w-full items-center ${className}`}>
      <div className="container mx-auto grid grid-cols-1 gap-8 px-4 lg:grid-cols-2">
        <div className="flex flex-col justify-center">
          <h2 className="mb-6 text-4xl font-bold">Entropretty Competition</h2>
          <p className="mb-8 text-lg">
            Join a vibrant community where creativity meets technology. Explore
            unique artworks generated through innovative algorithms.
          </p>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="mb-3 text-xl font-bold">Art Redefined</h3>
              <p className="text-gray-600">
                Experience the fusion of art and mathematics in every piece
                created.
              </p>
            </div>
            <div>
              <h3 className="mb-3 text-xl font-bold">Join Us</h3>
              <p className="text-gray-600">
                Become part of a community that celebrates creativity through
                technology.
              </p>
            </div>
          </div>
        </div>
        <div className="relative aspect-[2/1] w-full">
          <div className="relative h-full w-full overflow-hidden bg-black">
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
              className="left-[10%] m-auto h-[90%] w-[80%] object-contain"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}
