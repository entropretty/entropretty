export default function EntroprettyVideo() {
  return (
    <div className="dark:bg-background flex min-h-screen w-full flex-col items-center justify-center bg-white">
      <div className="flex h-full w-full flex-col items-center justify-center py-16 sm:px-4">
        <h1 className="mb-8 text-2xl font-bold text-gray-900 sm:text-4xl dark:text-white">
          Why Entropretty?
        </h1>
        <div className="aspect-video w-full max-w-[1200px]">
          <iframe
            className="h-full w-full"
            src="https://www.youtube.com/embed/xJKjGjiJytA?si=Hfh0QPLBF_44qX_p"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        </div>
        <div className="mt-8 flex w-full max-w-[960px] flex-col items-center justify-center gap-4">
          <h2 className="text-lg font-bold text-gray-900 sm:text-2xl dark:text-white">
            More about Proof of Personhood
          </h2>
          <ul className="w-full list-none space-y-4 pl-6 sm:w-1/2">
            <li className="relative before:absolute before:-left-4 before:top-0 before:text-gray-600 before:content-['×'] dark:before:text-gray-400">
              <a
                href="https://www.youtube.com/watch?v=MrWioikibEI"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 underline hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
              >
                Web3 Citizenship - Gavin Wood @ Web3 Summit 2024 Berlin
              </a>
            </li>
            <li className="relative before:absolute before:-left-4 before:top-0 before:text-gray-600 before:content-['×'] dark:before:text-gray-400">
              <a
                href="https://www.youtube.com/watch?v=YRBgGEfelnk"
                target="_blank"
                className="text-gray-700 underline hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                rel="noopener noreferrer"
              >
                DE Proof of Personhood w/ Dr. Gavin Wood 👁️ Unlocking Web 3
                Individuality & Privacy - Space Monkeys 178
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
