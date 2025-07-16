export default function EntroprettyVideo() {
  return (
    <div className="w-full min-h-screen bg-white flex flex-col items-center justify-center">
      <div className="w-full h-full flex flex-col items-center justify-center py-16 px-4">
        <h1 className="text-4xl font-bold mb-8">Why Entropretty?</h1>
        <div className="w-full max-w-[1200px] aspect-video">
          <iframe
            className="w-full h-full"
            src="https://www.youtube.com/embed/xJKjGjiJytA?si=Hfh0QPLBF_44qX_p"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        </div>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 w-full max-w-[1000px]">
          <h2 className="text-2xl font-bold">
            Extended Content about Proof of Personhood
          </h2>
          <ul className="w-1/2 list-none pl-6 space-y-4">
            <li className="relative before:content-['×'] before:absolute before:-left-4 before:top-0">
              <a
                href="https://www.youtube.com/watch?v=MrWioikibEI"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-800 hover:underline"
              >
                Web3 Citizenship - Gavin Wood - Web3 Summit 2024 Berlin
              </a>
            </li>
            <li className="relative before:content-['×'] before:absolute before:-left-4 before:top-0">
              <a
                href="https://www.youtube.com/watch?v=YRBgGEfelnk"
                target="_blank"
                className="hover:text-blue-800 hover:underline"
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
  );
}
