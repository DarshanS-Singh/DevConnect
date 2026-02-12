import { useDispatch, useSelector } from "react-redux"
import { Link, useLocation } from "react-router-dom"
import { useEffect, useState } from "react"
import { removeUser } from "../utils/userSlice"
import axios from "axios"
import { BASE_URL } from "../utils/constants"

const NavBar = () => {
  const dispatch = useDispatch()
  const user = useSelector((store) => store.user)
  const userPhotoUrl = user?.photoUrl || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
  const location = useLocation()
  const [open, setOpen] = useState(false)

  const handleLogout = async () => {
    await axios.post(BASE_URL + "/auth/logout", {}, { withCredentials: true })
    dispatch(removeUser())
  }
  
  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  return (
    <header className="sticky top-0 z-50 border-b border-dev-border bg-dev-bg/95 backdrop-blur supports-[backdrop-filter]:bg-dev-bg/80">
      <div className="navbar max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex-1">
          <Link
            to="/"
            className="flex items-center gap-2 text-xl font-bold text-white hover:text-dev-accent transition-colors"
          >
            <span className="text-2xl">🤝</span>
            <span>DevConnect</span>
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <input
              type="text"
              placeholder="Search..."
              className="input input-bordered input-sm w-36 md:w-48 rounded-lg bg-dev-surface border-dev-border text-gray-300 placeholder-gray-500"
            />
          </div>
          <div className={`dropdown dropdown-end ${open ? "dropdown-open" : ""}`}>
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar rounded-full ring-2 ring-dev-border hover:ring-dev-accent/50 transition-all p-0.5"
              onClick={() => setOpen((v) => !v)}
            >
              <div className="w-9 h-9 rounded-full overflow-hidden">
                <img src={userPhotoUrl} alt="Profile" className="object-cover w-full h-full" />
              </div>
            </div>
            {user ? (
              <ul
                tabIndex={0}
                className="dropdown-content menu p-2 mt-3 w-52 rounded-xl shadow-xl bg-dev-surface border border-dev-border z-50"
              >
                <li>
                  <Link to="/profile" onClick={() => setOpen(false)} className="rounded-lg text-gray-200 hover:bg-dev-surface-elevated hover:text-white">
                    Profile
                  </Link>
                </li>
                <li>
                  <Link to="/connections" onClick={() => setOpen(false)} className="rounded-lg text-gray-200 hover:bg-dev-surface-elevated hover:text-white">
                    Connections
                  </Link>
                </li>
                <li>
                  <Link to="/requests" onClick={() => setOpen(false)} className="rounded-lg text-gray-200 hover:bg-dev-surface-elevated hover:text-white">
                    Requests
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300"
                  >
                    Log out
                  </button>
                </li>
              </ul>
            ) : (
              <ul
                tabIndex={0}
                className="dropdown-content menu p-2 mt-3 w-44 rounded-xl shadow-xl bg-dev-surface border border-dev-border z-50"
              >
                <li>
                  <Link to="/login" onClick={() => setOpen(false)} className="rounded-lg text-gray-200 hover:bg-dev-surface-elevated hover:text-white">
                    Sign in
                  </Link>
                </li>
                <li>
                  <Link to="/login" onClick={() => setOpen(false)} className="rounded-lg text-dev-accent hover:bg-dev-accent/10">
                    Create account
                  </Link>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default NavBar
