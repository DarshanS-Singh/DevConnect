import axios from "axios"
import { BASE_URL } from "../utils/constants"
import { useEffect, useState, useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import { addRequest } from "../utils/requestSlice"

const Requests = () => {
  const dispatch = useDispatch()
  const requests = useSelector((store) => store.request)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchRequests = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await axios.get(BASE_URL + "/user/getRequest/received", {
        withCredentials: true,
      })
      dispatch(addRequest(res.data.data ?? []))
    } catch (err) {
      console.error(err?.message)
      setError("Could not load requests.")
      dispatch(addRequest([]))
    } finally {
      setLoading(false)
    }
  }, [dispatch])

  useEffect(() => {
    fetchRequests()
  }, [fetchRequests])

  const handleAccept = async (requestId) => {
    try {
      await axios.post(
        BASE_URL + "/request/review/accepted/" + requestId,
        {},
        { withCredentials: true }
      )
      fetchRequests()
    } catch (err) {
      console.error("Accept failed", err)
    }
  }

  const handleDecline = async (requestId) => {
    try {
      await axios.post(
        BASE_URL + "/request/review/rejected/" + requestId,
        {},
        { withCredentials: true }
      )
      fetchRequests()
    } catch (err) {
      console.error("Decline failed", err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-180px)] flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-dev-accent/30 border-t-dev-accent animate-spin mb-4" />
        <p className="text-gray-400">Loading requests...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-180px)] flex flex-col items-center justify-center px-4">
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 px-6 py-4 max-w-md text-center">
          {error}
        </div>
        <button className="btn btn-secondary mt-4 rounded-xl" onClick={fetchRequests}>
          Try again
        </button>
      </div>
    )
  }

  if (!requests?.length) {
    return (
      <div className="min-h-[calc(100vh-180px)] flex flex-col items-center justify-center px-4 text-center">
        <div className="text-6xl mb-4">✉️</div>
        <h2 className="text-xl font-semibold text-white mb-2">No pending requests</h2>
        <p className="text-gray-400 max-w-sm">You’re all caught up.</p>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-180px)] py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-2">Connection requests</h1>
        <p className="text-gray-400 text-sm mb-8">
          {requests.length} {requests.length === 1 ? "person" : "people"} want to connect
        </p>
        <div className="space-y-4">
          {requests.map((request) => {
            const sender = request.fromUserId
            const initials = [sender?.firstName?.[0], sender?.lastName?.[0]]
              .filter(Boolean)
              .join("")
              .toUpperCase() || "?"
            return (
              <div
                key={request._id}
                className="rounded-2xl border border-dev-border bg-dev-surface p-4 flex flex-col sm:flex-row sm:items-center gap-4"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-14 h-14 rounded-full bg-dev-surface-elevated border border-dev-border flex items-center justify-center text-lg font-semibold text-gray-400 shrink-0">
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-white">
                      {sender?.firstName} {sender?.lastName}
                    </p>
                    <p className="text-gray-500 text-sm">
                      {request.createdAt
                        ? new Date(request.createdAt).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : ""}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 sm:shrink-0">
                  <button
                    className="btn btn-primary btn-sm rounded-xl flex-1 sm:flex-none"
                    onClick={() => handleAccept(request._id)}
                  >
                    Accept
                  </button>
                  <button
                    className="btn btn-secondary btn-sm rounded-xl flex-1 sm:flex-none"
                    onClick={() => handleDecline(request._id)}
                  >
                    Decline
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Requests
