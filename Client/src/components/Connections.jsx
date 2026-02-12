import axios from "axios"
import { BASE_URL } from "../utils/constants"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { addConnection } from "../utils/connectionSlice"

const Connections = () => {
  const dispatch = useDispatch()
  const connections = useSelector((store) => store.connection)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchConnections = async () => {
      setLoading(true)
      try {
        const res = await axios.get(BASE_URL + "/user/getConnectedUsers", {
          withCredentials: true,
        })
        dispatch(addConnection(res.data.data ?? []))
      } catch (err) {
        console.error(err?.message)
        dispatch(addConnection([]))
      } finally {
        setLoading(false)
      }
    }
    fetchConnections()
  }, [dispatch])

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-180px)] flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-dev-accent/30 border-t-dev-accent animate-spin mb-4" />
        <p className="text-gray-400">Loading connections...</p>
      </div>
    )
  }

  if (!connections?.length) {
    return (
      <div className="min-h-[calc(100vh-180px)] flex flex-col items-center justify-center px-4 text-center">
        <div className="text-6xl mb-4">🔗</div>
        <h2 className="text-xl font-semibold text-white mb-2">No connections yet</h2>
        <p className="text-gray-400 max-w-sm">
          When you and another developer both tap “Interested”, you’ll show up here.
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-180px)] py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-2">
          Your connections
        </h1>
        <p className="text-gray-400 text-sm mb-8">
          {connections.length} {connections.length === 1 ? "developer" : "developers"} you’re connected with
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {connections.map((c) => (
            <div
              key={c._id}
              className="rounded-2xl border border-dev-border bg-dev-surface overflow-hidden hover:border-dev-accent/30 transition-colors"
            >
              <div className="aspect-[4/3] bg-dev-surface-elevated">
                <img
                  src={c.photoUrl}
                  alt={`${c.firstName} ${c.lastName}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-white">
                  {c.firstName} {c.lastName}
                </h3>
                {(c.age || c.gender) && (
                  <p className="text-gray-500 text-sm mt-0.5">
                    {[c.age, c.gender].filter(Boolean).join(" · ")}
                  </p>
                )}
                {c.about && (
                  <p className="text-gray-400 text-sm mt-2 line-clamp-2">{c.about}</p>
                )}
                {(c.skills?.length ?? 0) > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {(c.skills || []).slice(0, 3).map((skill, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md text-xs bg-dev-accent/15 text-dev-accent"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex gap-2 mt-4">
                  <button className="btn btn-primary btn-sm flex-1 rounded-lg">
                    Message
                  </button>
                  <button className="btn btn-secondary btn-sm rounded-lg">
                    Profile
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Connections
