import Head from "next/head";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <Head>
        <title>Music Taste AI - Find Your Next Favorite Song</title>
        <meta
          name="description"
          content="Discover new music tailored to your taste with our AI-powered chatbot."
        />
      </Head>
      <div className="flex flex-col items-center justify-between min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <div className="text-center h-40 py-12 w-full">
          <h1 className="text-5xl font-bold">Discover Music You Love</h1>
          <p className="mt-4 text-lg">
            Let our AI chatbot recommend songs based on your unique taste.
          </p>
        </div>

        <div>
          <div className="carousel-primary flex animate-scroll -mt-10">
            {[1, 2, 3, 4, 5].map((num) => (
              <Image
                key={num}
                className="object-cover mx-4"
                src={`/images/album-cover${num}.png`}
                alt="album cover"
                width={300}
                height={300}
              />
            ))}
          </div>
          <div className="carousel-primary carousel-secondary flex animate-scroll -mt-10">
            {[1, 2, 3, 4, 5].map((num) => (
              <Image
                key={num}
                className="object-cover mx-4"
                src={`/images/album-cover${num}.png`}
                alt="album cover"
                width={300}
                height={300}
              />
            ))}
          </div>
        </div>

        <div className="w-full text-center mb-12">
          <Link href="/chat">
            <button className="bg-white text-blue-600 font-semibold py-3 px-6 rounded-full shadow-lg hover:bg-gray-100 transition duration-300">
              Start Chatting
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}
