import './global.css';
import './theme-fas.css';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <header className="absolute top-4 right-6 flex space-x-4 z-50">
        <Link
          href="/sign-in"
          className="text-white font-ethno text-sm hover:text-primary transition"
        >
          Sign In
        </Link>
        <Link
          href="/sign-up"
          className="text-white font-ethno text-sm hover:text-primary transition"
        >
          Sign Up
        </Link>
      </header>
      <main
        className="flex flex-col items-center justify-center h-screen px-4 text-center bg-cover bg-center"
        style={{ backgroundImage: "url('/images/about page background FAS.png')" }}
      >
        <h1 className="text-primary font-borg text-2xl sm:text-3xl md:text-4xl tracking-[.3em] mb-8 drop-shadow-md">
          F.a.S.
        </h1>
        <h1 className="text-white font-ethno text-2xl sm:text-3xl md:text-4xl tracking-[.3em] mb-8 drop-shadow-md">
          Motorsports
        </h1>

        <Link
          href="/dashboard"
          className="px-6 py-3 text-white bg-primary hover:bg-white hover:text-primary border-2 border-primary rounded-md font-kwajong tracking-widest transition-all duration-300 shadow-lg"
        >
          GO TO DASHBOARD
        </Link>
      </main>
    </>
  );
}
