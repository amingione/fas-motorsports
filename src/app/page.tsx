import Image from "next/image";
import '../app/global.css';
import '../app/theme-fas.css';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white p-8">
      <div className="max-w-sm w-full rounded-lg shadow-xl bg-white/5 p-6 border border-white/10">
        <h1 className="text-center font-captain text-primary text-xl tracking-wide mb-4 uppercase">
          F.A.S. Motorsports
        </h1>
        <div id="clerk-signin" className="mt-4" />
      </div>
    </div>
  );
}
