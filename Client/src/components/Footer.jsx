import { Link } from "react-router-dom"

const Footer = () => {
  return (
    <footer className="border-t border-dev-border bg-dev-surface mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🤝</span>
            <span className="font-semibold text-white">DevConnect</span>
          </div>
          <nav className="flex items-center gap-6 text-sm">
            <Link to="/" className="text-gray-400 hover:text-dev-accent transition-colors">
              Home
            </Link>
            <Link to="/login" className="text-gray-400 hover:text-dev-accent transition-colors">
              Sign in
            </Link>
            <a href="#" className="text-gray-400 hover:text-dev-accent transition-colors">
              Privacy
            </a>
            <a href="#" className="text-gray-400 hover:text-dev-accent transition-colors">
              Terms
            </a>
          </nav>
        </div>
        <div className="mt-4 pt-4 border-t border-dev-border text-center sm:text-left text-gray-500 text-sm">
          © {new Date().getFullYear()} DevConnect. Connect with developers.
        </div>
      </div>
    </footer>
  )
}

export default Footer
