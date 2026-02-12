import { useState } from "react"
import axios from "axios"
import { useDispatch } from "react-redux"
import { addUser } from "../utils/userSlice"
import { useNavigate } from "react-router-dom"
import { BASE_URL } from "../utils/constants"

const Login = () => {
  const [emailId, setEmailId] = useState("")
  const [password, setPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [isLogin, setIsLogin] = useState(true)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogin = async () => {
    setError("")
    setLoading(true)
    try {
      const res = await axios.post(
        BASE_URL + "/auth/login",
        { emailId, password },
        { withCredentials: true }
      )
      dispatch(addUser(res.data))
      navigate("/")
    } catch (err) {
      setError(err?.response?.data || "Invalid email or password.")
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async () => {
    setError("")
    setLoading(true)
    try {
      const res = await axios.post(
        BASE_URL + "/auth/signup",
        { firstName, lastName, emailId, password },
        { withCredentials: true }
      )
      dispatch(addUser(res.data.data))
      navigate("/")
    } catch (err) {
      setError(err?.response?.data || "Sign up failed. Try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (isLogin) handleLogin()
    else handleSignUp()
  }

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 bg-dev-bg">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-dev-border bg-dev-surface p-8 shadow-xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white">
              {isLogin ? "Welcome back" : "Create account"}
            </h2>
            <p className="text-gray-400 mt-1 text-sm">
              {isLogin ? "Sign in to continue to DevConnect" : "Join and start connecting with devs"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">First name</label>
                  <input
                    type="text"
                    className="input input-bordered w-full rounded-lg bg-dev-surface-elevated border-dev-border"
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required={!isLogin}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Last name</label>
                  <input
                    type="text"
                    className="input input-bordered w-full rounded-lg bg-dev-surface-elevated border-dev-border"
                    placeholder="Last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
              <input
                type="email"
                className="input input-bordered w-full rounded-lg bg-dev-surface-elevated border-dev-border"
                placeholder="you@example.com"
                value={emailId}
                onChange={(e) => setEmailId(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
              <input
                type="password"
                className="input input-bordered w-full rounded-lg bg-dev-surface-elevated border-dev-border"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {!isLogin && (
                <p className="text-xs text-gray-500 mt-1">Min 8 chars, mix of letters, numbers & symbols</p>
              )}
            </div>

            {error && (
              <div className="rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary w-full rounded-xl py-3 font-semibold"
              disabled={loading}
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm" />
              ) : isLogin ? (
                "Sign in"
              ) : (
                "Create account"
              )}
            </button>
          </form>

          <p
            className="text-center text-gray-400 text-sm mt-6 cursor-pointer hover:text-dev-accent transition-colors"
            onClick={() => { setIsLogin(!isLogin); setError("") }}
          >
            {isLogin ? "New here? Create an account" : "Already have an account? Sign in"}
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
