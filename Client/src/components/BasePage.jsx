import { Link } from "react-router-dom"

const BasePage = () => {
  return (
    <div className="min-h-[calc(100vh-80px)] relative overflow-hidden flex items-center justify-center">
      {/* Background gradient mesh */}
      <div className="absolute inset-0 bg-gradient-to-br from-dev-bg via-[#0f172a] to-[#0a0e17]" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-dev-accent/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#0a0e17_70%)]" />

      <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
        <span className="inline-block px-4 py-1.5 rounded-full text-dev-accent text-sm font-medium bg-dev-accent/10 border border-dev-accent/20 mb-6">
          Build faster with the right collaborators
        </span>
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-6">
          Find your next
          <span className="block bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
            dev partner
          </span>
        </h1>
        <p className="text-lg sm:text-xl text-gray-400 mb-10 max-w-lg mx-auto">
          DevConnect helps you swipe, match, and collaborate with developers who fit your stack and goals.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/login"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-dev-bg bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 transition-all shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02]"
          >
            Get started
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <a
            href="#how"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold border border-dev-border text-gray-300 hover:bg-dev-surface-elevated hover:border-gray-500 transition-all"
          >
            How it works
          </a>
        </div>
        <div className="mt-16 flex items-center justify-center gap-8 text-gray-500 text-sm">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-dev-success" /> Connect
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-dev-accent" /> Collaborate
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500" /> Build
          </span>
        </div>
      </div>
    </div>
  )
}

export default BasePage
