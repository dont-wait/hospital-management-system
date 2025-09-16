import Link from 'next/link';
const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-tr from-purple-800 via-pink-600 to-red-500 text-white px-6">
      <div className="relative">
        <h1 className="text-[12rem] font-extrabold tracking-widest drop-shadow-lg animate-bounce">
          404
        </h1>
        <span className="absolute top-0 left-1/2 transform -translate-x-1/2 text-sm text-pink-300 animate-pulse">
          Oops!
        </span>
      </div>

      <p className="text-xl md:text-3xl mt-4 font-semibold tracking-wide drop-shadow-md">
        We can&apos;t find that page.
      </p>

      <p className="mt-2 max-w-md text-center text-pink-200 italic">
        It seems you&apos;ve ventured into the void. But don&apos;t worry, we&apos;ll guide you home.
      </p>

    <Link
      href="/"
      className="mt-10 px-8 py-3 bg-white bg-opacity-20 rounded-full border border-white border-opacity-30 backdrop-blur-sm hover:bg-white hover:text-purple-800 transition duration-300 font-bold shadow-lg"
    >
      Take me back home
    </Link>
    </div>
  );
};

export default NotFound;
