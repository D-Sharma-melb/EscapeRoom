import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen font-sans bg-theme-1 text-theme-1-fore">
      {/* Navbar */}
      <header className="w-full py-4 px-6 flex items-center justify-between shadow-sm bg-white/30 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <Image src="/logo.svg" alt="Logo" width={36} height={36} className="object-contain" />
          <h1 className="text-lg font-semibold">Escape Room Builder</h1>
        </div>
        <nav className="flex items-center gap-4">
          <Link href="/builder" className="px-3 py-2 rounded-md hover:bg-white/20">
            Builder
          </Link>
          <Link href="/play" className="px-3 py-2 rounded-md hover:bg-white/20">
            Play
          </Link>
        </nav>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-6 py-20 flex flex-col items-center gap-12">
        <section className="text-center">
          <h2 className="text-4xl font-bold mb-4">Choose a mode</h2>
          <p className="text-lg text-opacity-90 max-w-2xl mx-auto">
            Build your own escape room or play someone else's creation. Select a
            mode to continue.
          </p>
        </section>

        <section className="w-full grid grid-cols-1 sm:grid-cols-2 gap-8">
          <Link
            href="/builder"
            className="group block rounded-2xl p-8 bg-white/10 hover:bg-white/20 transition-shadow shadow-md"
          >
            <div className="flex flex-col items-start gap-4">
              <h3 className="text-2xl font-semibold">Builder Mode</h3>
              <p className="text-base text-opacity-90">
                Create rooms, add objects, and set puzzles for players to solve.
              </p>
              <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium">
                <span className="underline">Open Builder</span>
                <span className="opacity-70">→</span>
              </div>
            </div>
          </Link>

          <Link
            href="/play"
            className="group block rounded-2xl p-8 bg-white/10 hover:bg-white/20 transition-shadow shadow-md"
          >
            <div className="flex flex-col items-start gap-4">
              <h3 className="text-2xl font-semibold">Player Mode</h3>
              <p className="text-base text-opacity-90">
                Join a session, explore rooms, and solve puzzles created by
                builders.
              </p>
              <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium">
                <span className="underline">Start Playing</span>
                <span className="opacity-70">→</span>
              </div>
            </div>
          </Link>
        </section>
      </main>

      <footer className="w-full py-6 text-center text-sm opacity-90">
        Built by Div
      </footer>
    </div>
  );
}
