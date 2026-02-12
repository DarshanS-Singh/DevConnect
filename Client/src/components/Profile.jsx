import { useEffect, useState, useCallback } from "react"
import { useSelector, useDispatch } from "react-redux"
import axios from "axios"
import { BASE_URL } from "../utils/constants"
import EditProfile from "./EditProfile"
import { addUser } from "../utils/userSlice"
import { Link } from "react-router-dom"

const Profile = () => {
  const user = useSelector((store) => store.user)
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(!user)
  const [error, setError] = useState(null)

  const loadUser = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await axios.get(BASE_URL + "/profile/getProfile", { withCredentials: true })
      dispatch(addUser(res.data))
    } catch (err) {
      setError(err?.response?.status === 401 ? "unauth" : "error")
    } finally {
      setLoading(false)
    }
  }, [dispatch])

  useEffect(() => {
    if (!user) loadUser()
  }, [user, loadUser])

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-180px)] flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-dev-accent/30 border-t-dev-accent animate-spin mb-4" />
        <p className="text-gray-400">Loading profile...</p>
      </div>
    )
  }

  if (error === "unauth") {
    return (
      <div className="min-h-[calc(100vh-180px)] flex flex-col items-center justify-center px-4 text-center">
        <div className="text-6xl mb-4">🔒</div>
        <h2 className="text-xl font-semibold text-white mb-2">Sign in required</h2>
        <p className="text-gray-400 max-w-sm mb-6">Please sign in to view and edit your profile.</p>
        <Link to="/login" className="btn btn-primary rounded-xl">Sign in</Link>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-[calc(100vh-180px)] flex flex-col items-center justify-center px-4 text-center">
        <div className="text-6xl mb-4">⚠️</div>
        <h2 className="text-xl font-semibold text-white mb-2">Couldn’t load profile</h2>
        <p className="text-gray-400 max-w-sm mb-6">Try again in a moment.</p>
        <button className="btn btn-secondary rounded-xl" onClick={loadUser}>Try again</button>
      </div>
    )
  }

  return <EditProfile user={user} />
}

export default Profile
